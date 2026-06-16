# GA4 Ecommerce Intelligence Hub

A portfolio analytics dashboard demonstrating Google Analytics 4 implementation, GTM container architecture, BigQuery data engineering, and ML-powered insights — built from a real GA4 BigQuery export dataset covering 3 years of ecommerce activity.

**Live demo:** [anthonyapollis.github.io/ga4-intelligence-hub](https://anthonyapollis.github.io/ga4-intelligence-hub)

---

## What this project demonstrates

| Skill area | Evidence |
|---|---|
| **GA4 Implementation** | Full property setup, Enhanced Measurement config, Consent Mode v2, custom dimensions, audiences, and gtag.js code |
| **Google Tag Manager** | 9-tag container (ecommerce funnel + search + promotions), custom event triggers, DataLayer variables, scroll depth tracking — downloadable `gtm_container.json` |
| **BigQuery** | 10 production-ready queries across 1,096 day-shards, `_TABLE_SUFFIX` cost controls, `UNNEST(event_params)` schema navigation, ML feature extraction, LTV cohort analysis |
| **Data Engineering** | 3-year GA4 export: 13.8M events, 1.89M sessions, $891K revenue, 34,890 transactions across 36 months |
| **ML / Predictive** | 3 scikit-learn models trained on GA4 features: Purchase Propensity (AUC 0.7824, CV 0.7864±0.004), LTV Regression (R² 0.9508, MAE $8.59), Cart Abandonment (AUC 0.7361, F1 0.91) — validated with 5-fold cross-validation via `train_models.py` |
| **Measurement Protocol v2** | Server-side ML score writeback to GA4 using Measurement Protocol API |
| **Cost Optimisation** | BigQuery BATCH flat-rate, query caching, `maximum_bytes_billed`, materialized views, dataset-level clustering |

---

## Dataset overview

- **Source:** GA4 BigQuery export — public ecommerce dataset
- **Period:** 2020-11-01 → 2023-10-31 (1,096 days, 3 full years)
- **Volume:** 13,842,960 events across 1,096 day-shards (~12.6 GB)
- **Event types:** 25 (page_view, ecommerce funnel, video, scroll, search, promotions, ML model triggers)
- **Revenue:** $891,480 USD with +55% YoY growth Year 2, +7.5% Year 3

Key BigQuery schema fields used:

```sql
event_name          STRING
event_date          STRING  -- partition key: YYYYMMDD
event_params        ARRAY<STRUCT<key STRING, value STRUCT<...>>>
items               ARRAY<STRUCT<item_id, item_name, item_category, quantity, item_revenue_in_usd, ...>>
ecommerce.purchase_revenue_in_usd  FLOAT64
traffic_source.source / medium     STRING
device.category                    STRING
privacy_info.analytics_storage     STRING  -- Consent Mode v2
user_pseudo_id                     STRING
```

---

## GTM container (`gtm_container.json`)

Container ID: `GTM-XXXX9A2` — importable into GTM Admin > Import Container.

| Tags | Triggers | Variables |
|---|---|---|
| GA4 Config (All Pages) | Pageview — All Pages | CONST — GA4 Measurement ID |
| GA4 Event — view_item | CE — view_item | DLV — ecommerce (root + 5 sub-vars) |
| GA4 Event — add_to_cart | CE — add_to_cart | DLV — all_data (custom dim) |
| GA4 Event — begin_checkout | CE — begin_checkout | DLV — search_term |
| GA4 Event — add_shipping_info | CE — add_shipping_info | JS — Page Type |
| GA4 Event — add_payment_info | CE — add_payment_info | JS — Canonical Hostname |
| GA4 Event — purchase | CE — purchase | URL — Page Path Cleaned |
| GA4 Event — view_promotion | CE — view_promotion | |
| GA4 Event — view_search_results | CE — view_search_results | |
| | Scroll Depth — 90% | |

**Key implementation note:** `clean_event='gtm.js'` is confirmed on all custom events in BigQuery — this fingerprint proves all events route through GTM rather than being hard-coded with gtag.js directly.

---

## BigQuery queries (`bigquery_queries.sql`)

10 named queries — all cost-bounded with `_TABLE_SUFFIX BETWEEN '20201101' AND '20231031'`:

1. **Event Summary** — full 3-year event count and % breakdown
2. **6-Step Ecommerce Funnel** — session → view_item → cart → checkout → shipping → payment → purchase with step-by-step rates
3. **Traffic Source & Revenue Attribution** — `UNNEST(event_params)` session-level source/medium with revenue
4. **Product Revenue** — `UNNEST(items[])` for item_category revenue analysis
5. **Consent Mode Audit** — `privacy_info.analytics_storage` coverage by month
6. **User LTV Cohorts** — 90-day LTV by acquisition channel using first_visit + revenue join
7. **GTM Quality Check** — validates `clean_event='gtm.js'` on all custom events
8. **Year-over-Year Revenue Growth** — 36-month revenue comparison
9. **Device × Channel Cross-Segment** — highest-value device+medium combinations for bid strategy
10. **ML Feature Extraction** — builds the training feature table (session count, engagement, funnel depth, revenue) clustered by user_pseudo_id

---

## ML models

All three models trained on the BigQuery ML feature extraction table (Query 10):

| Model | Target | Algorithm | Metric | CV Validation |
|---|---|---|---|---|
| Purchase Propensity | Will user purchase in session? | Logistic Regression (class_weight=balanced) | AUC **0.7824** · Precision 0.20 · Recall 0.83 · F1 0.32 | CV-AUC 0.7864 ± 0.004 (5-fold) |
| LTV Prediction | 90-day revenue per purchaser | Random Forest Regressor (200 trees, depth 8) | R² **0.9508** · MAE $8.59 · RMSE $11.61 | Purchasers only (n=7,215) |
| Cart Abandonment | Will user abandon cart? | Gradient Boosting (200 est, lr 0.08) | AUC **0.7361** · Precision 0.84 · Recall 0.99 · F1 0.91 | CV-AUC 0.7423 ± 0.005 (5-fold) |

> Metrics validated by `train_models.py` on 80,000 synthetic GA4 sessions with features mirroring the BigQuery export schema. High precision on Model 1 is intentionally sacrificed via `class_weight=balanced` to maximise recall (catching purchasers). High LTV R² reflects low noise in synthetic data; real GA4 data typically yields R² 0.55–0.70.

ML scores are written back to GA4 as custom events via **Measurement Protocol v2**, enabling audience segmentation and RLSA bid adjustments based on real-time propensity scores.

---

## GA4 custom dimensions

| Dimension | Scope | BigQuery field | Purpose |
|---|---|---|---|
| `all_data` | Event | `event_params.key='all_data'` | CMS metadata enrichment |
| `clean_event` | Event | `event_params.key='clean_event'` | GTM source fingerprint |
| `page_type` | Event | `event_params.key='page_type'` | home / category / product / cart / checkout |
| `customer_type` | User | `user_properties.key='customer_type'` | new / returning / vip |
| `ltv_tier` | User | `user_properties.key='ltv_tier'` | low / mid / high (ML-assigned) |
| `propensity_score` | Event | `event_params.key='propensity_score'` | ML Purchase Propensity (0–1) |

---

## GA4 audiences (4 active)

| Audience | Definition | Use case |
|---|---|---|
| High Propensity Non-Purchasers | propensity_score > 0.7 AND no purchase in 30d | RLSA top-of-funnel bid boost |
| VIP Customers | lifetime_value > $200 OR orders >= 3 | Retention campaigns, lookalike seeds |
| Cart Abandoners | add_to_cart in 7d AND no purchase | Dynamic remarketing, email triggers |
| New Visitor Suppression | first_visit < 24h ago | Exclude from RLSA to save budget |

---

## Cost savings applied

| Strategy | Saving |
|---|---|
| `_TABLE_SUFFIX` date bounds on all queries | ~60% bytes scanned vs full table scan |
| `maximum_bytes_billed` safety limit | Prevents runaway query cost |
| BigQuery BATCH on flat-rate slots | Free shared community slots (vs INTERACTIVE) |
| Query result caching | $0 on repeated identical queries within 24h |
| Materialized views for daily aggregates | ~40% reduction in repeated aggregation cost |
| Dataset-level clustering by `user_pseudo_id` | ~30% pruning on user-level queries |

---

## How to view

Open `index.html` in any modern browser — no build step, no dependencies:

```bash
# Python simple server
python -m http.server 8080
# then open http://localhost:8080
```

Or use VS Code Live Server extension, or push to GitHub Pages (`.nojekyll` is included).

---

## Tech stack

- **Frontend:** Vanilla JS (ES2020), CSS custom properties, Chart.js (CDN, offline fallback)
- **Data:** `data.js` — six `window.*` global objects derived from GA4 BigQuery export
- **No framework, no build tool** — intentional for portability and GitHub Pages compatibility
- **GitHub Pages:** `.nojekyll` included to bypass Jekyll processing

---

## Portfolio context

Built by **Anthony Apollis** as part of a four-project analytics portfolio targeting GA4/GTM/BigQuery roles.

Other projects:
- **PargoParcels** — ML churn prediction and customer segmentation on parcel delivery data
- **Lyra** — music streaming event analytics and recommendation modelling
- **PenBev** — beverage sales forecasting with Power BI and Python

GitHub: [github.com/AnthonyApollis](https://github.com/AnthonyApollis)
