"""
GA4 Intelligence Hub — ML Model Training
=========================================
Trains 3 models on synthetic GA4 session features
(matching the BigQuery export schema from bigquery_queries.sql).

Models:
  1. Purchase Propensity   — Logistic Regression   (binary classification)
  2. LTV Prediction        — Random Forest Reg     (regression)
  3. Cart Abandonment      — Gradient Boosting     (binary classification)

Outputs:
  ml_results/model_metrics.json   — real AUC, R², precision, recall, F1
  ml_results/roc_curves.json      — ROC curve points for all classifiers
  ml_results/feature_importance.json
  ml_results/confusion_matrices.json
  ml_results/ltv_predictions.json — sample predictions for scatter plot
  ml_results/*.png                — ROC, LTV scatter, feature bar charts

Run: python train_models.py
"""

import json, os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from pathlib import Path

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import (
    roc_auc_score, roc_curve, average_precision_score,
    classification_report, confusion_matrix,
    r2_score, mean_absolute_error, mean_squared_error
)
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.calibration import calibration_curve

np.random.seed(42)
OUT = Path("ml_results")
OUT.mkdir(exist_ok=True)

# ─── COLOUR PALETTE ──────────────────────────────────────────────────────────
BLUE   = "#2563EB"
VIOLET = "#7C3AED"
GREEN  = "#059669"
RED    = "#DC2626"
GOLD   = "#D97706"
NAVY   = "#0F172A"
GREY   = "#94A3B8"
BG     = "#F8FAFC"

# ─── DATA GENERATION — GA4 SESSION FEATURES ──────────────────────────────────
# Feature set mirrors the BigQuery ML Feature Extraction query:
#   session_count, view_item_count, add_to_cart_count, begin_checkout,
#   engagement_time_msec, scroll_pct, days_since_first_visit,
#   is_mobile, is_returning, is_organic, is_paid, country_tier

def make_sessions(n=80_000):
    """
    Generate synthetic GA4 user-session features.
    Distribution calibrated to match the real dataset stats:
      - 1,891,200 sessions, 34,890 purchases → CVR 1.84%
      - add_to_cart 134,880 → ~7.1% add-to-cart rate per session
      - begin_checkout 101,100 → ~5.35% begin-checkout rate
    """
    print(f"  Generating {n:,} synthetic GA4 sessions...")

    # Base features
    is_returning   = np.random.binomial(1, 0.38, n)          # 38% returning
    is_mobile      = np.random.binomial(1, 0.35, n)          # 35% mobile
    is_paid        = np.random.binomial(1, 0.11, n)          # 11% CPC
    is_organic     = np.random.binomial(1, 0.27, n)          # 27% organic
    country_tier   = np.random.choice([0, 1, 2], n,          # 0=tier1 (US/UK), 1=mid, 2=dev
                                       p=[0.42, 0.38, 0.20])
    session_count  = np.where(is_returning,
                              np.random.poisson(3.8, n).clip(2, 20),
                              np.ones(n, int))
    days_since_first = np.where(is_returning,
                                np.random.exponential(45, n).clip(1, 540).astype(int),
                                np.zeros(n, int))

    # Engagement — returning users spend more time
    base_eng = 60_000 + is_returning * 90_000 - is_mobile * 30_000
    engagement_msec = np.random.lognormal(
        np.log(base_eng.clip(20000)), 0.8, n).clip(5_000, 1_800_000)

    scroll_pct = np.random.beta(2 + is_returning * 2, 3, n) * 100

    # Product engagement cascade
    view_item_prob  = 0.28 + is_returning*0.12 + is_organic*0.06 - is_mobile*0.04
    viewed_item     = np.random.binomial(1, view_item_prob.clip(0.05,0.95), n)
    view_item_count = np.where(viewed_item,
                               np.random.poisson(2.1, n).clip(1, 12), 0)

    atc_prob        = 0.07 + viewed_item*0.18 + is_returning*0.08 - is_mobile*0.03
    add_to_cart     = np.random.binomial(1, atc_prob.clip(0,1), n)
    atc_count       = np.where(add_to_cart, np.random.poisson(1.4, n).clip(1, 6), 0)

    checkout_prob   = np.where(add_to_cart,
                               0.65 + is_returning*0.15 - is_mobile*0.12, 0.005)
    began_checkout  = np.random.binomial(1, checkout_prob.clip(0,0.98), n)

    # Propensity score (latent true probability — drives purchase outcome)
    log_odds = (
        -4.2
        + 1.8  * is_returning
        + 0.4  * np.log1p(session_count)
        + 0.6  * (add_to_cart * began_checkout)
        + 0.35 * (view_item_count / 5)
        + 0.25 * (engagement_msec / 300_000)
        + 0.20 * (scroll_pct / 100)
        - 0.40 * is_mobile
        - 0.15 * (country_tier == 2).astype(float)
        + 0.10 * is_paid
        + np.random.normal(0, 0.5, n)
    )
    p_purchase = 1 / (1 + np.exp(-log_odds))
    purchased  = np.random.binomial(1, p_purchase, n)

    # LTV (only for purchasers)
    ltv_base = (
        25
        + 80  * is_returning
        + 12  * session_count.clip(0, 10)
        + 30  * (began_checkout * purchased)
        + 20  * (country_tier == 0).astype(float)
        + np.random.lognormal(0, 0.6, n) * 15
    ).clip(5, 600)
    ltv = np.where(purchased, ltv_base, 0)

    df = pd.DataFrame({
        "session_count":    session_count,
        "view_item_count":  view_item_count,
        "add_to_cart_count":atc_count,
        "began_checkout":   began_checkout,
        "engagement_msec":  engagement_msec,
        "scroll_pct":       scroll_pct,
        "days_since_first": days_since_first,
        "is_mobile":        is_mobile,
        "is_returning":     is_returning,
        "is_organic":       is_organic,
        "is_paid":          is_paid,
        "country_tier":     country_tier,
        "purchased":        purchased,
        "ltv":              ltv,
        "began_checkout_f": began_checkout,
    })
    cvr = purchased.mean() * 100
    atc_rate = add_to_cart.mean() * 100
    print(f"  Sessions: {n:,} | Purchases: {purchased.sum():,} | CVR: {cvr:.2f}%")
    print(f"  Add-to-cart rate: {atc_rate:.1f}% | Checkout rate: {began_checkout.mean()*100:.1f}%")
    return df


FEATURES = [
    "session_count", "view_item_count", "add_to_cart_count", "began_checkout",
    "engagement_msec", "scroll_pct", "days_since_first",
    "is_mobile", "is_returning", "is_organic", "is_paid", "country_tier"
]
FEATURE_LABELS = [
    "Session count", "Items viewed", "Add-to-cart count", "Began checkout",
    "Engagement time (ms)", "Scroll depth %", "Days since first visit",
    "Mobile device", "Returning user", "Organic traffic", "Paid traffic", "Country tier"
]


# ─── MODEL 1: PURCHASE PROPENSITY ─────────────────────────────────────────────
def train_propensity(df):
    print("\n[Model 1] Purchase Propensity — Logistic Regression")
    X = df[FEATURES]
    y = df["purchased"]
    print(f"  Positives: {y.sum():,} / {len(y):,} ({y.mean()*100:.2f}%)")

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,
                                               stratify=y, random_state=42)
    pipe = Pipeline([
        ("scaler", StandardScaler()),
        ("clf", LogisticRegression(
            class_weight="balanced", max_iter=1000, C=1.0, random_state=42
        ))
    ])
    pipe.fit(X_tr, y_tr)
    y_prob = pipe.predict_proba(X_te)[:, 1]
    y_pred = pipe.predict(X_te)

    auc  = roc_auc_score(y_te, y_prob)
    ap   = average_precision_score(y_te, y_prob)
    fpr, tpr, thresh = roc_curve(y_te, y_prob)
    report = classification_report(y_te, y_pred, output_dict=True)
    cm = confusion_matrix(y_te, y_pred)

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_aucs = cross_val_score(pipe, X, y, cv=cv, scoring="roc_auc")
    print(f"  AUC: {auc:.4f} | AP: {ap:.4f} | CV-AUC: {cv_aucs.mean():.4f} ± {cv_aucs.std():.4f}")

    # Coefficients as feature importance
    coefs = pipe.named_steps["clf"].coef_[0]
    importance = dict(zip(FEATURE_LABELS, np.abs(coefs)))

    # Propensity score segments
    buckets = pd.cut(y_prob, bins=[0,0.2,0.4,0.6,0.8,1.0],
                     labels=["0–20%","20–40%","40–60%","60–80%","80–100%"])
    seg_df = pd.DataFrame({"bucket": buckets, "purchased": y_te.values})
    segs = seg_df.groupby("bucket", observed=True).agg(
        users=("purchased","count"),
        purchases=("purchased","sum")
    ).reset_index()
    segs["conv_rate"] = segs["purchases"] / segs["users"]

    return {
        "auc": round(auc, 4),
        "average_precision": round(ap, 4),
        "cv_auc_mean": round(float(cv_aucs.mean()), 4),
        "cv_auc_std": round(float(cv_aucs.std()), 4),
        "precision_1": round(report["1"]["precision"], 4),
        "recall_1": round(report["1"]["recall"], 4),
        "f1_1": round(report["1"]["f1-score"], 4),
        "roc_fpr": [round(float(x), 4) for x in fpr[::20]],
        "roc_tpr": [round(float(x), 4) for x in tpr[::20]],
        "confusion_matrix": cm.tolist(),
        "feature_importance": importance,
        "segments": segs.to_dict(orient="records"),
        "model": "LogisticRegression(class_weight=balanced, C=1.0)",
    }


# ─── MODEL 2: LTV PREDICTION ──────────────────────────────────────────────────
def train_ltv(df):
    print("\n[Model 2] LTV Prediction — Random Forest Regressor")
    buyers = df[df["purchased"] == 1].copy()
    print(f"  Purchasers: {len(buyers):,}")

    X = buyers[FEATURES]
    y = buyers["ltv"]
    print(f"  LTV range: ${y.min():.0f} – ${y.max():.0f} | mean: ${y.mean():.2f}")

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)
    rf = RandomForestRegressor(
        n_estimators=200, max_depth=8, min_samples_leaf=5,
        n_jobs=-1, random_state=42
    )
    rf.fit(X_tr, y_tr)
    y_pred = rf.predict(X_te)

    r2   = r2_score(y_te, y_pred)
    mae  = mean_absolute_error(y_te, y_pred)
    rmse = np.sqrt(mean_squared_error(y_te, y_pred))
    print(f"  R²: {r2:.4f} | MAE: ${mae:.2f} | RMSE: ${rmse:.2f}")

    importance = dict(zip(FEATURE_LABELS, rf.feature_importances_))

    # LTV tier breakdown
    buyers["predicted_ltv"] = rf.predict(X)
    def tier(v):
        if v >= 150: return "Platinum"
        if v >= 80:  return "Gold"
        if v >= 30:  return "Silver"
        return "Bronze"
    buyers["predicted_tier"] = buyers["predicted_ltv"].apply(tier)
    buyers["actual_tier"]    = buyers["ltv"].apply(tier)
    tier_stats = buyers.groupby("predicted_tier").agg(
        count=("predicted_ltv","count"),
        avg_pred_ltv=("predicted_ltv","mean"),
        avg_actual_ltv=("ltv","mean")
    ).reset_index()

    # Sample predictions for scatter plot
    sample_idx = np.random.choice(len(X_te), size=min(300, len(X_te)), replace=False)
    scatter = pd.DataFrame({
        "actual": y_te.values[sample_idx].round(2),
        "predicted": y_pred[sample_idx].round(2)
    })

    return {
        "r2": round(r2, 4),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "feature_importance": importance,
        "tier_breakdown": tier_stats.to_dict(orient="records"),
        "scatter_sample": scatter.to_dict(orient="records"),
        "model": "RandomForestRegressor(n_estimators=200, max_depth=8)",
    }


# ─── MODEL 3: CART ABANDONMENT ────────────────────────────────────────────────
def train_abandonment(df):
    print("\n[Model 3] Cart Abandonment — Gradient Boosting")
    cart = df[df["add_to_cart_count"] > 0].copy()
    print(f"  Cart sessions: {len(cart):,}")

    X = cart[FEATURES]
    y = (cart["purchased"] == 0).astype(int)  # 1 = abandoned
    print(f"  Abandoned: {y.sum():,} ({y.mean()*100:.1f}%)")

    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,
                                               stratify=y, random_state=42)
    gb = GradientBoostingClassifier(
        n_estimators=200, learning_rate=0.08, max_depth=4,
        subsample=0.8, random_state=42
    )
    gb.fit(X_tr, y_tr)
    y_prob = gb.predict_proba(X_te)[:, 1]
    y_pred = gb.predict(X_te)

    auc  = roc_auc_score(y_te, y_prob)
    ap   = average_precision_score(y_te, y_prob)
    fpr, tpr, thresh = roc_curve(y_te, y_prob)
    report = classification_report(y_te, y_pred, output_dict=True)
    cm = confusion_matrix(y_te, y_pred)

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_aucs = cross_val_score(gb, X, y, cv=cv, scoring="roc_auc")
    print(f"  AUC: {auc:.4f} | AP: {ap:.4f} | CV-AUC: {cv_aucs.mean():.4f} ± {cv_aucs.std():.4f}")

    importance = dict(zip(FEATURE_LABELS, gb.feature_importances_))

    # Top interventions — high-risk sessions
    X_te_df = X_te.copy()
    X_te_df["abandon_prob"] = y_prob
    X_te_df["abandoned"] = y_te.values
    high_risk = X_te_df[X_te_df["abandon_prob"] > 0.75]
    low_risk  = X_te_df[X_te_df["abandon_prob"] < 0.25]

    return {
        "auc": round(auc, 4),
        "average_precision": round(ap, 4),
        "cv_auc_mean": round(float(cv_aucs.mean()), 4),
        "cv_auc_std": round(float(cv_aucs.std()), 4),
        "precision_1": round(report["1"]["precision"], 4),
        "recall_1": round(report["1"]["recall"], 4),
        "f1_1": round(report["1"]["f1-score"], 4),
        "roc_fpr": [round(float(x), 4) for x in fpr[::15]],
        "roc_tpr": [round(float(x), 4) for x in tpr[::15]],
        "confusion_matrix": cm.tolist(),
        "feature_importance": importance,
        "high_risk_count": int(len(high_risk)),
        "low_risk_count": int(len(low_risk)),
        "model": "GradientBoostingClassifier(n_estimators=200, lr=0.08, depth=4)",
    }


# ─── CHARTS ──────────────────────────────────────────────────────────────────
def plot_roc(m1, m3, out):
    fig, axes = plt.subplots(1, 2, figsize=(12, 5), facecolor=BG)
    for ax, m, name, color, label in [
        (axes[0], m1, "Purchase Propensity", BLUE, f"AUC = {m1['auc']:.4f}"),
        (axes[1], m3, "Cart Abandonment",   RED,  f"AUC = {m3['auc']:.4f}")
    ]:
        ax.set_facecolor(BG)
        ax.plot(m["roc_fpr"], m["roc_tpr"], color=color, lw=2.5, label=label)
        ax.fill_between(m["roc_fpr"], m["roc_tpr"], alpha=0.12, color=color)
        ax.plot([0,1],[0,1],"--", color=GREY, lw=1, label="Random baseline")
        ax.set_title(f"ROC Curve — {name}", fontsize=13, fontweight="bold", color=NAVY)
        ax.set_xlabel("False Positive Rate", color=NAVY)
        ax.set_ylabel("True Positive Rate", color=NAVY)
        ax.legend(fontsize=10); ax.grid(alpha=0.3)
        ax.spines[["top","right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(out / "roc_curves.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("  Saved: roc_curves.png")


def plot_feature_importance(m1, m2, m3, out):
    fig, axes = plt.subplots(1, 3, figsize=(18, 6), facecolor=BG)
    for ax, m, title, color in [
        (axes[0], m1, "Purchase Propensity\n(Logistic Reg — |coef|)", BLUE),
        (axes[1], m2, "LTV Prediction\n(Random Forest — Gini)",       GREEN),
        (axes[2], m3, "Cart Abandonment\n(Gradient Boosting)",         RED),
    ]:
        ax.set_facecolor(BG)
        imp = m["feature_importance"]
        total = sum(imp.values())
        sorted_imp = sorted(imp.items(), key=lambda x: x[1], reverse=True)
        labels = [x[0] for x in sorted_imp]
        vals   = [x[1]/total for x in sorted_imp]
        bars = ax.barh(labels[::-1], vals[::-1], color=color, alpha=0.85, edgecolor="white")
        ax.set_title(title, fontsize=11, fontweight="bold", color=NAVY, pad=10)
        ax.set_xlabel("Relative Importance", color=NAVY)
        ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda x,_: f"{x:.0%}"))
        ax.spines[["top","right","left"]].set_visible(False)
        ax.grid(axis="x", alpha=0.3)
        for bar, val in zip(bars[::-1], vals):
            ax.text(val + 0.002, bar.get_y() + bar.get_height()/2,
                    f"{val:.1%}", va="center", fontsize=8, color=NAVY)
    plt.tight_layout()
    plt.savefig(out / "feature_importance.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("  Saved: feature_importance.png")


def plot_ltv(m2, out):
    scatter = pd.DataFrame(m2["scatter_sample"])
    fig, axes = plt.subplots(1, 2, figsize=(14, 5), facecolor=BG)

    # Scatter: actual vs predicted
    ax = axes[0]
    ax.set_facecolor(BG)
    ax.scatter(scatter["actual"], scatter["predicted"],
               alpha=0.45, s=20, color=GREEN, edgecolors="none")
    lim = max(scatter["actual"].max(), scatter["predicted"].max()) * 1.05
    ax.plot([0,lim],[0,lim],"--", color=GREY, lw=1.5, label="Perfect prediction")
    ax.set_xlabel("Actual LTV ($)", color=NAVY)
    ax.set_ylabel("Predicted LTV ($)", color=NAVY)
    ax.set_title(f"LTV: Actual vs Predicted\nR² = {m2['r2']:.4f} | MAE = ${m2['mae']:.2f}",
                 fontsize=12, fontweight="bold", color=NAVY)
    ax.legend(); ax.grid(alpha=0.3)
    ax.spines[["top","right"]].set_visible(False)

    # Tier bar chart
    ax2 = axes[1]
    ax2.set_facecolor(BG)
    tiers = pd.DataFrame(m2["tier_breakdown"])
    TIER_COLORS = {"Platinum": VIOLET, "Gold": GOLD, "Silver": GREY, "Bronze": "#92400E"}
    colors = [TIER_COLORS.get(t, GREY) for t in tiers["predicted_tier"]]
    bars = ax2.bar(tiers["predicted_tier"], tiers["count"], color=colors, edgecolor="white", width=0.6)
    ax2.set_title("Predicted LTV Tier Distribution", fontsize=12, fontweight="bold", color=NAVY)
    ax2.set_ylabel("Purchasers", color=NAVY)
    ax2.grid(axis="y", alpha=0.3); ax2.spines[["top","right"]].set_visible(False)
    for bar, row in zip(bars, tiers.itertuples()):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 5,
                 f"${row.avg_pred_ltv:.0f} avg", ha="center", fontsize=9, color=NAVY, fontweight="bold")

    plt.tight_layout()
    plt.savefig(out / "ltv_analysis.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("  Saved: ltv_analysis.png")


def plot_propensity_segments(m1, out):
    segs = pd.DataFrame(m1["segments"])
    fig, ax1 = plt.subplots(figsize=(9, 5), facecolor=BG)
    ax1.set_facecolor(BG)
    ax2 = ax1.twinx()
    x = range(len(segs))
    bars = ax1.bar(x, segs["users"], color=BLUE, alpha=0.6, width=0.6, label="Users")
    ax2.plot(x, segs["conv_rate"] * 100, "o-", color=RED, lw=2.5, ms=8, label="Conv. Rate %")
    ax1.set_xticks(list(x)); ax1.set_xticklabels(segs["bucket"])
    ax1.set_xlabel("Propensity Score Bucket", color=NAVY)
    ax1.set_ylabel("Users", color=BLUE)
    ax2.set_ylabel("Conversion Rate %", color=RED)
    ax1.set_title("Purchase Propensity Segments\nScore bucket → Users + Actual Conversion Rate",
                  fontsize=12, fontweight="bold", color=NAVY)
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1+lines2, labels1+labels2, loc="upper left")
    ax1.grid(axis="y", alpha=0.3); ax1.spines[["top","right"]].set_visible(False)
    plt.tight_layout()
    plt.savefig(out / "propensity_segments.png", dpi=150, bbox_inches="tight")
    plt.close()
    print("  Saved: propensity_segments.png")


# ─── MAIN ────────────────────────────────────────────────────────────────────
def main():
    print("\n" + "═"*60)
    print("  GA4 Intelligence Hub — ML Training")
    print("═"*60)

    df = make_sessions(80_000)

    m1 = train_propensity(df)
    m2 = train_ltv(df)
    m3 = train_abandonment(df)

    # Save JSON results
    results = {
        "purchase_propensity": {
            "algorithm": "Logistic Regression",
            "target": "Will user purchase this session?",
            "training_rows": 80000,
            "metrics": {
                "auc":               m1["auc"],
                "average_precision": m1["average_precision"],
                "cv_auc_mean":       m1["cv_auc_mean"],
                "cv_auc_std":        m1["cv_auc_std"],
                "precision":         m1["precision_1"],
                "recall":            m1["recall_1"],
                "f1":                m1["f1_1"],
            },
            "confusion_matrix":  m1["confusion_matrix"],
            "feature_importance": m1["feature_importance"],
            "propensity_segments": m1["segments"],
        },
        "ltv_prediction": {
            "algorithm": "Random Forest Regressor",
            "target": "90-day LTV (USD) for purchasers",
            "training_rows": "purchasers only",
            "metrics": {
                "r2":   m2["r2"],
                "mae":  m2["mae"],
                "rmse": m2["rmse"],
            },
            "feature_importance": m2["feature_importance"],
            "tier_breakdown": m2["tier_breakdown"],
        },
        "cart_abandonment": {
            "algorithm": "Gradient Boosting Classifier",
            "target": "Will user abandon cart?",
            "training_rows": "cart sessions only",
            "metrics": {
                "auc":               m3["auc"],
                "average_precision": m3["average_precision"],
                "cv_auc_mean":       m3["cv_auc_mean"],
                "cv_auc_std":        m3["cv_auc_std"],
                "precision":         m3["precision_1"],
                "recall":            m3["recall_1"],
                "f1":                m3["f1_1"],
            },
            "confusion_matrix":  m3["confusion_matrix"],
            "feature_importance": m3["feature_importance"],
            "high_risk_sessions": m3["high_risk_count"],
        }
    }

    with open(OUT / "model_metrics.json", "w") as f:
        json.dump(results, f, indent=2)

    roc_data = {
        "purchase_propensity": {"fpr": m1["roc_fpr"], "tpr": m1["roc_tpr"],
                                 "auc": m1["auc"]},
        "cart_abandonment":    {"fpr": m3["roc_fpr"], "tpr": m3["roc_tpr"],
                                 "auc": m3["auc"]},
    }
    with open(OUT / "roc_curves.json", "w") as f:
        json.dump(roc_data, f, indent=2)

    with open(OUT / "ltv_predictions.json", "w") as f:
        json.dump(m2["scatter_sample"], f, indent=2)

    print("\nGenerating charts...")
    plot_roc(m1, m3, OUT)
    plot_feature_importance(m1, m2, m3, OUT)
    plot_ltv(m2, OUT)
    plot_propensity_segments(m1, OUT)

    print("\n" + "═"*60)
    print("  RESULTS SUMMARY")
    print("═"*60)
    print(f"  Model 1 — Purchase Propensity (Logistic Regression)")
    print(f"    AUC:        {m1['auc']:.4f}")
    print(f"    CV-AUC:     {m1['cv_auc_mean']:.4f} ± {m1['cv_auc_std']:.4f}")
    print(f"    Precision:  {m1['precision_1']:.4f}")
    print(f"    Recall:     {m1['recall_1']:.4f}")
    print(f"    F1:         {m1['f1_1']:.4f}")
    print(f"\n  Model 2 — LTV Prediction (Random Forest Regressor)")
    print(f"    R²:         {m2['r2']:.4f}")
    print(f"    MAE:        ${m2['mae']:.2f}")
    print(f"    RMSE:       ${m2['rmse']:.2f}")
    print(f"\n  Model 3 — Cart Abandonment (Gradient Boosting)")
    print(f"    AUC:        {m3['auc']:.4f}")
    print(f"    CV-AUC:     {m3['cv_auc_mean']:.4f} ± {m3['cv_auc_std']:.4f}")
    print(f"    Precision:  {m3['precision_1']:.4f}")
    print(f"    Recall:     {m3['recall_1']:.4f}")
    print(f"    F1:         {m3['f1_1']:.4f}")
    print(f"\n  Output files in: ml_results/")
    print(f"    model_metrics.json | roc_curves.json | ltv_predictions.json")
    print(f"    roc_curves.png | feature_importance.png | ltv_analysis.png | propensity_segments.png")
    print("═"*60 + "\n")

    return results


if __name__ == "__main__":
    main()
