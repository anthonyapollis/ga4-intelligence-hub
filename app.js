/* ─────────────────────────────────────────────────────────────────────────────
   GA4 Ecommerce Intelligence Hub — app.js
   Renders all dashboard sections from window.GA4_DASHBOARD_DATA et al.
──────────────────────────────────────────────────────────────────────────── */

const data    = window.GA4_DASHBOARD_DATA;
const txData  = window.GA4_TRANSACTION_DATA;
const gtm     = window.GA4_GTM_DATA;
const bq      = window.GA4_BIGQUERY_DATA;
const ml      = window.GA4_ML_DATA;
const ga4s    = window.GA4_SETUP_DATA;
const bp      = window.GA4_BEST_PRACTICES;

const fmt  = new Intl.NumberFormat("en-US");
const fmtM = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const fmtP = (v, d=1) => v.toFixed(d) + "%";

function n(v)     { return fmt.format(v || 0); }
function m(v)     { return fmtM.format(v || 0); }
function pct(v,t) { return t ? Math.round((v/t)*100) + "%" : "0%"; }
function maxOf(pairs) { return Math.max(...pairs.map(p => p[1]), 1); }
function el(id)   { return document.getElementById(id); }

/* ── HERO ──────────────────────────────────────────────────────────────── */
function renderHero() {
  el("heroRows").textContent = n(data.kpis.rows);
  el("heroTitle").innerHTML  = `GA4 Ecommerce<br>Intelligence Hub`;
  el("sourceLine").textContent =
    `${n(data.kpis.rows)} events · ${n(data.kpis.uniqueUsers)} users · ` +
    `${n(data.periodDays)} days (3 years) · ${data.sourceFiles.length} BigQuery BATCH jobs · ` +
    `${data.monthlyRevenue.length} monthly revenue data points · ${data.yoyGrowth.length} YoY growth periods.`;
}

/* ── KPI GRID ───────────────────────────────────────────────────────────── */
function renderKpis() {
  const k = data.kpis;
  const metrics = [
    ["Total Events",      n(k.rows),                   "847,932 across 92 days"],
    ["Unique Users",      n(k.uniqueUsers),             "COUNT(DISTINCT user_pseudo_id)"],
    ["Sessions",          n(k.sessions),                "CONCAT(user_pseudo_id, ga_session_id)"],
    ["Purchase Revenue",  m(k.revenue),                 "SUM(purchase_revenue_in_usd)"],
    ["Transactions",      n(k.transactions),            "Distinct transaction_id count"],
    ["Conversion Rate",   fmtP(k.conversionRate),       "purchases ÷ sessions"],
    ["Avg Order Value",   m(k.aov),                     "revenue ÷ transactions"],
    ["Engaged Sessions",  fmtP(k.engagedSessionRate),   "session_engaged = 1"],
  ];
  el("kpiGrid").innerHTML = metrics.map(([label, val, note]) => `
    <article class="metric">
      <span>${label}</span>
      <strong>${val}</strong>
      <small>${note}</small>
    </article>`).join("");
}

/* ── JOURNEY MAP ────────────────────────────────────────────────────────── */
function renderJourney() {
  const funnel = data.funnel;
  const top    = funnel[0].count;

  el("journeyMap").innerHTML = funnel.map((step, i) => {
    const prev = i > 0 ? funnel[i-1].count : null;
    const drop = prev ? Math.round((1 - step.count/prev)*100) : null;
    return `
      <article class="journey-step">
        <span>${step.label}</span>
        <strong>${n(step.count)}</strong>
        <p>${step.name}</p>
        ${drop !== null ? `<div class="cr">↓ ${drop}% drop</div>` : ""}
      </article>`;
  }).join("");
}

/* ── DAY GRID ───────────────────────────────────────────────────────────── */
function renderDayGrid() {
  el("dayGrid").innerHTML = data.fileSummaries.map(day => {
    const topEvts = day.events.slice(0,5).map(([n,v]) => `<span>${n}: ${fmt.format(v)}</span>`).join("");
    return `
      <article class="day-card">
        <header>
          <div>
            <p class="eyebrow">${day.date}</p>
            <h3>${n(day.rows)} events</h3>
          </div>
          <code>${day.file}</code>
        </header>
        <div class="day-metrics">
          <span><strong>${n(day.uniqueUsers)}</strong> Users</span>
          <span><strong>${n(day.sessions)}</strong> Sessions</span>
          <span><strong>${day.pages.length}</strong> Top pages</span>
        </div>
        <div class="mini-events">${topEvts}</div>
      </article>`;
  }).join("");
}

/* ── FUNNEL ─────────────────────────────────────────────────────────────── */
function renderFunnel() {
  const max = data.funnel[0].count;
  el("funnelChart").innerHTML = data.funnel.map(step => `
    <div class="funnel-step">
      <span class="funnel-label">${step.label}</span>
      <div class="track"><div class="fill" style="--w:${pct(step.count,max)}"></div></div>
      <span class="funnel-value">${n(step.count)}</span>
    </div>`).join("");
  const start    = data.funnel[0].count;
  const purchase = data.funnel[data.funnel.length-1].count;
  el("funnelNote").textContent = `Overall CR: ${fmtP(purchase/start*100)} (session → purchase)`;
}

/* ── BAR CHARTS ─────────────────────────────────────────────────────────── */
function renderBars(selector, pairs, limit=10) {
  const rows = pairs.slice(0, limit);
  const max  = maxOf(rows);
  el(selector).innerHTML = rows.map(([label, value]) => `
    <div class="bar-row">
      <span class="bar-label" title="${label}">${label}</span>
      <div class="track"><div class="fill" style="--w:${pct(value,max)}"></div></div>
      <span class="bar-value">${n(value)}</span>
    </div>`).join("");
}

function renderRankList(selector, pairs, limit=7) {
  el(selector).innerHTML = pairs.slice(0,limit).map(([label,value]) => `
    <div class="rank-item">
      <span title="${label}">${label}</span>
      <span>${n(value)}</span>
    </div>`).join("");
}

/* ── GTM CONSOLE ────────────────────────────────────────────────────────── */
function renderGTM() {
  // header info
  el("gtmContainerId").textContent = gtm.containerId;
  el("gtmPublished").textContent   = gtm.lastPublished;

  // summary KPI cards
  el("gtmSummary").innerHTML = [
    ["Tags",      gtm.summary.tags,      "GA4 Config + 8 event tags"],
    ["Triggers",  gtm.summary.triggers,  "Pageview + 9 custom events"],
    ["Variables", gtm.summary.variables, "11 DLV, JS, URL, Constant"],
  ].map(([lbl,val,note]) => `
    <article class="metric">
      <span>${lbl}</span>
      <strong>${val}</strong>
      <small>${note}</small>
    </article>`).join("");

  // data flow
  const flowSteps = [
    "Browser<br><small>dataLayer.push()</small>",
    "GTM Trigger<br><small>CE / Pageview</small>",
    "GTM Variable<br><small>DLV ecommerce.items</small>",
    "GA4 Event Tag<br><small>gaawe type</small>",
    "GA4 Property<br><small>G-XXXXXXXXXX</small>",
    "BigQuery<br><small>events_YYYYMMDD</small>",
  ];
  el("gtmFlow").innerHTML = flowSteps.map((s,i) =>
    `<div class="gtm-flow-step">${s}</div>` + (i < flowSteps.length-1 ? '<span class="gtm-flow-arrow">→</span>' : "")
  ).join("");

  // tabs
  renderGTMTab("tags");
  document.querySelectorAll(".gtm-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gtm-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGTMTab(btn.dataset.tab);
    });
  });
}

function renderGTMTab(tab) {
  const c = el("gtmTabContent");
  if (tab === "tags") {
    c.innerHTML = `<div class="gtm-grid">${gtm.tags.map(t => `
      <div class="gtm-item">
        <div class="gtm-item-type tag">TAG · ${t.type.toUpperCase()}</div>
        <div class="gtm-item-name">${t.name}</div>
        <div class="gtm-item-detail">Trigger: ${t.trigger}</div>
        <div class="gtm-item-detail" style="font-size:11px;color:var(--subtle);margin-top:4px">${t.notes}</div>
      </div>`).join("")}</div>`;
  } else if (tab === "triggers") {
    c.innerHTML = `<div class="gtm-grid">${gtm.triggers.map(t => `
      <div class="gtm-item">
        <div class="gtm-item-type trigger">TRIGGER · ${t.type}</div>
        <div class="gtm-item-name">${t.name}</div>
        <div class="gtm-item-detail" style="font-size:11px;color:var(--subtle)">${t.notes}</div>
      </div>`).join("")}</div>`;
  } else if (tab === "variables") {
    c.innerHTML = `<div class="gtm-grid">${gtm.variables.map(v => `
      <div class="gtm-item">
        <div class="gtm-item-type variable">VARIABLE · ${v.type.toUpperCase()}</div>
        <div class="gtm-item-name">${v.name}</div>
        <div class="gtm-item-detail" style="font-size:11px;color:var(--subtle)">${v.notes}</div>
      </div>`).join("")}</div>`;
  } else if (tab === "datalayer") {
    c.innerHTML = `
      <p style="font-size:13px;color:var(--muted);margin:0 0 10px">Reverse-engineered from BigQuery event_params. Ecommerce object clearing pattern confirmed by event sequencing in export.</p>
      <div class="code-block">${escHtml(gtm.dataLayerSnippet)}</div>`;
  } else if (tab === "snippet") {
    c.innerHTML = `
      <p style="font-size:13px;color:var(--muted);margin:0 0 10px">Paste ① in &lt;head&gt;, ② immediately after &lt;body&gt;, ③ Consent Mode defaults BEFORE ①.</p>
      <div class="code-block">${escHtml(gtm.gtmSnippet)}</div>`;
  }
}

function escHtml(str) {
  return str
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/(\/\/[^\n]*)/g, '<span class="cmt">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*')/g, '<span class="str">$1</span>');
}

/* ── BIGQUERY PIPELINE ──────────────────────────────────────────────────── */
function renderBigQuery() {
  // pipeline flow
  el("pipelineFlow").innerHTML = bq.pipelineSteps.map((s,i) =>
    `<div class="pipe-box"><span class="pb-icon">${s.icon}</span><div class="pb-name">${s.name}</div><div class="pb-sub">${s.sub}</div></div>` +
    (i < bq.pipelineSteps.length-1 ? '<span class="pipe-arrow">→</span>' : "")
  ).join("");

  // cost table
  el("costTable").innerHTML = bq.costComparison.map(row => {
    const bar = `<div style="display:inline-block;width:${row.relCost}%;max-width:100%;height:8px;background:var(--green);border-radius:999px;vertical-align:middle"></div>`;
    return `<tr>
      <td><strong>${row.mode}</strong></td>
      <td>${bar} ${row.relCost}%</td>
      <td><strong>${row.slaCost}</strong></td>
      <td>${row.billableBytes}</td>
      <td>${row.sla}</td>
      <td>${row.useCase}</td>
    </tr>`;
  }).join("");

  // queries
  el("bqQueries").innerHTML = bq.queries.map(q => `
    <div class="gtm-item">
      <div class="gtm-item-type variable">QUERY</div>
      <div class="gtm-item-name">${q.name}</div>
      <div class="gtm-item-detail">${q.description}</div>
    </div>`).join("");

  // code
  el("bqCodeBlock").innerHTML = escHtml(bq.batchQueryExample);
}

/* ── ML INTELLIGENCE ────────────────────────────────────────────────────── */
function renderML() {
  el("mlDisclaimer").textContent = ml.disclaimer;

  const propensity = ml.purchasePropensity;
  const ltv        = ml.ltvPrediction;
  const aband      = ml.cartAbandonment;

  el("mlModelsGrid").innerHTML = `
    <!-- Model 1: Purchase Propensity -->
    <div class="ml-model-card">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--violet);margin-bottom:4px">Model 1 · ${propensity.modelType}</div>
      <h4>Purchase Propensity Scoring</h4>
      <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Predicts probability of purchase for each session.</div>
      <div class="ml-accuracy">
        <span style="font-size:11px;font-weight:700;color:var(--muted);white-space:nowrap">AUC</span>
        <div class="ml-acc-bar"><div class="ml-acc-fill" style="width:${propensity.auc*100}%"></div></div>
        <span class="ml-acc-val">${propensity.auc}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:var(--bg);border-radius:6px;padding:8px;font-size:11px;color:var(--muted)">Precision<br><strong style="color:var(--ink);font-size:16px">${propensity.precision}</strong></div>
        <div style="background:var(--bg);border-radius:6px;padding:8px;font-size:11px;color:var(--muted)">Recall<br><strong style="color:var(--ink);font-size:16px">${propensity.recall}</strong></div>
      </div>
      <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:8px">SEGMENT SCORES</div>
      <div class="ml-segments">
        ${propensity.segments.map(s => `
          <div class="ml-segment-row">
            <span class="ml-seg-label" title="${s.label}">${s.label}</span>
            <div class="ml-seg-bar-wrap"><div class="ml-seg-bar" style="width:${s.score*100}%;background:${s.color}"></div></div>
            <span class="ml-seg-score" style="color:${s.color}">${s.score}</span>
          </div>`).join("")}
      </div>
    </div>

    <!-- Model 2: LTV Prediction -->
    <div class="ml-model-card">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--violet);margin-bottom:4px">Model 2 · ${ltv.modelType}</div>
      <h4>Customer LTV Prediction</h4>
      <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Segments purchasers into 4 lifetime value tiers.</div>
      <div class="ml-accuracy">
        <span style="font-size:11px;font-weight:700;color:var(--muted);white-space:nowrap">R²</span>
        <div class="ml-acc-bar"><div class="ml-acc-fill" style="width:${ltv.r2*100}%;background:var(--blue)"></div></div>
        <span class="ml-acc-val" style="color:var(--blue)">${ltv.r2}</span>
      </div>
      <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:8px">LTV TIERS</div>
      <div class="ml-segments">
        ${ltv.tiers.map((t,i) => {
          const colors = ["#7C3AED","#2563EB","#059669","#D97706"];
          return `
            <div class="ml-segment-row">
              <span class="ml-seg-label"><strong>${t.tier}</strong> — ${t.criteria}</span>
              <span class="ml-seg-score" style="color:${colors[i]}">${m(t.avgLtv)}</span>
            </div>
            <div style="font-size:11px;color:var(--subtle);padding:0 0 4px 8px">${n(t.users)} customers</div>`;
        }).join("")}
      </div>
    </div>

    <!-- Model 3: Cart Abandonment -->
    <div class="ml-model-card">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--violet);margin-bottom:4px">Model 3 · ${aband.modelType}</div>
      <h4>Cart Abandonment Risk</h4>
      <div style="font-size:12px;color:var(--muted);margin-bottom:10px">Identifies high-risk sessions before checkout completion.</div>
      <div class="ml-accuracy">
        <span style="font-size:11px;font-weight:700;color:var(--muted);white-space:nowrap">AUC</span>
        <div class="ml-acc-bar"><div class="ml-acc-fill" style="width:${aband.auc*100}%;background:var(--red)"></div></div>
        <span class="ml-acc-val" style="color:var(--red)">${aband.auc}</span>
      </div>
      <div style="background:var(--violet-lt);border-radius:8px;padding:14px;margin-top:8px">
        <div style="font-size:11px;font-weight:700;color:var(--violet);margin-bottom:8px">HOW TO USE THIS MODEL</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.5">
          Score each session in real-time. For score > 0.7, trigger: (1) exit-intent popup with discount, (2) abandon email sequence via CRM, (3) Google Ads RLSA audience inclusion.
        </div>
      </div>
    </div>`;

  // abandonment risk factor bars
  const factors = aband.topRiskFactors;
  el("abandonmentBars").innerHTML = factors.map(f => `
    <div class="bar-row">
      <span class="bar-label">${f.factor}</span>
      <div class="track"><div class="fill" style="--w:${Math.round(f.importance*100)}%;background:var(--red)"></div></div>
      <span class="bar-value">${(f.importance*100).toFixed(0)}%</span>
    </div>`).join("");
}

/* ── DEVICE CONVERSION TABLE ────────────────────────────────────────────── */
function renderDeviceConversion() {
  if (!data.deviceConversion) return;
  const total = data.deviceConversion.reduce((s,d) => s + d.revenue, 0);
  el("deviceTable").innerHTML = data.deviceConversion.map(d => `
    <tr>
      <td><strong>${d.device}</strong></td>
      <td>${n(d.sessions)}</td>
      <td>${n(d.purchases)}</td>
      <td><strong>${fmtP(d.cr)}</strong></td>
      <td>${m(d.revenue)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:8px;background:var(--bg2);border-radius:999px;overflow:hidden">
            <div style="width:${Math.round(d.revenue/total*100)}%;height:100%;background:var(--teal);border-radius:999px"></div>
          </div>
          <span style="font-size:12px;color:var(--muted);white-space:nowrap">${Math.round(d.revenue/total*100)}%</span>
        </div>
      </td>
    </tr>`).join("");
}

/* ── TRACKING PLAN ──────────────────────────────────────────────────────── */
function renderTrackingPlan() {
  const events = [
    ["view_item_list",   "Product list viewed",   "Category, search, or recommendation grid rendered.", ["items","item_list_id","item_list_name"], "Enhanced Ecommerce"],
    ["select_item",      "Product selected",       "Shopper clicks a product card from a list.", ["items","index","item_list_name"], "Enhanced Ecommerce"],
    ["view_item",        "Product detail viewed",  "Product detail page — measures browse intent before cart.", ["currency","value","items"], "Enhanced Ecommerce"],
    ["view_promotion",   "Promotion viewed",       "Banner/hero impression in viewport. campaign param confirmed in dataset.", ["promotion_id","promotion_name","items"], "Enhanced Ecommerce"],
    ["select_promotion", "Promotion clicked",      "Connects banner clicks to downstream product and revenue outcomes.", ["creative_name","promotion_name","items"], "Enhanced Ecommerce"],
    ["add_to_cart",      "Add to cart",            "Core cart-intent. view_item(36K)→add_to_cart(8.7K) = 24% add-rate.", ["currency","value","items"], "Enhanced Ecommerce"],
    ["view_cart",        "Cart viewed",            "Separates cart review from checkout start.", ["currency","value","items"], "Enhanced Ecommerce"],
    ["begin_checkout",   "Checkout started",       "Fires on /basket.html Proceed to Checkout. Confirmed in dataset.", ["currency","value","coupon","items"], "Enhanced Ecommerce"],
    ["add_shipping_info","Shipping added",         "Fires on /payment.html shipping form submit.", ["shipping_tier","currency","value"], "Enhanced Ecommerce"],
    ["add_payment_info", "Payment added",          "Payment method selection. Anomaly: 8 > 5 shipping in sample.", ["payment_type","currency","value"], "Enhanced Ecommerce"],
    ["purchase",         "Purchase complete",      "Order confirmation. transaction_id required for GA4 deduplication.", ["transaction_id","currency","value","items"], "Enhanced Ecommerce"],
    ["refund",           "Refund processed",       "Closes revenue loop. tax+shipping also accepted.", ["transaction_id","currency","value","items"], "Enhanced Ecommerce"],
    ["remove_from_cart", "Removed from cart",      "Closes the cart loop. Feeds cart abandonment ML model as negative signal.", ["currency","value","items"], "Enhanced Ecommerce"],
    ["video_start",      "Video started",          "Auto-collected via Enhanced Measurement. YouTube embeds on product pages.", ["video_title","video_provider","video_url"], "Enhanced Measurement"],
    ["video_progress",   "Video milestone",        "Fires at 10%, 25%, 50%, 75% — measures engagement depth with video content.", ["video_current_time","video_percent","video_title"], "Enhanced Measurement"],
    ["video_complete",   "Video completed",        "100% video watched. High-intent signal — correlates with add_to_cart.", ["video_title","video_duration","video_provider"], "Enhanced Measurement"],
    ["file_download",    "File downloaded",        "PDF/image downloads. file_name + file_extension params auto-captured.", ["file_name","file_extension","link_url"], "Enhanced Measurement"],
    ["view_search_results","Site search",          "Fires on /asearch.html. search_term confirmed (obfuscated in dataset).", ["search_term","unique_search_term"], "Custom"],
    ["select_content",   "Content selected",       "Measures non-product clicks (blog, guide, sale category). content_type param.", ["content_type","content_id"], "Custom"],
    ["share",            "Content shared",         "Social share clicks on product pages. method param = twitter/facebook/copy.", ["method","content_type","item_id"], "Custom"],
    ["login",            "User login",             "Compares guest vs authenticated behaviour. signin.html confirmed in data.", ["method","customer_type"], "Custom"],
    ["sign_up",          "Account created",        "Measures new account or newsletter capture.", ["method","lead_source"], "Custom"],
    ["scroll",           "90% scroll depth",       "Fires at 90% page depth — exact value confirmed across all scroll events.", ["percent_scrolled"], "Enhanced Measurement"],
    ["page_view",        "Page view",              "Auto-fires via GTM GA4 Config tag. clean_event='gtm.js' in BigQuery.", ["page_location","page_referrer","page_title"], "Auto-collected"],
    ["first_visit",      "First visit",            "GA4 SDK fires on first session for user_pseudo_id.", ["ga_session_id","ga_session_number"], "Auto-collected"],
  ];

  el("eventPlan").innerHTML = events.map(([evt,name,why,params,cat]) => `
    <article class="event-card">
      <code>${evt}</code>
      <h3>${name}</h3>
      <p>${why}</p>
      <div class="event-meta">
        <span style="background:var(--violet-lt);color:var(--violet);border-color:var(--violet-lt)">${cat}</span>
        ${params.map(p => `<span>${p}</span>`).join("")}
      </div>
    </article>`).join("");
}

/* ── TRANSACTIONS ───────────────────────────────────────────────────────── */
function renderTransactions() {
  const rows = txData.modeledTransactions;
  const totalRev = rows.reduce((s,r) => s+r.revenue, 0);
  const totalTax = rows.reduce((s,r) => s+r.tax, 0);
  const totalShip= rows.reduce((s,r) => s+r.shipping, 0);
  const totalItm = rows.reduce((s,r) => s+r.items, 0);
  const aov      = totalRev / rows.length;

  el("transactionSummary").innerHTML = [
    ["Sample Transactions", rows.length],
    ["Total Revenue",       m(totalRev)],
    ["Avg Order Value",     m(aov)],
    ["Items Sold",          n(totalItm)],
  ].map(([lbl,val]) => `
    <div class="transaction-metric">
      <span>${lbl}</span>
      <strong>${typeof val==="number" ? n(val) : val}</strong>
    </div>`).join("");

  // bar chart
  renderBars("transactionBars", rows.map(r => [r.transaction_id.replace("GMS-",""), r.revenue]), rows.length);

  // observed funnel signals
  renderRankList("observedTransactions", [
    ["begin_checkout",    txData.observed.begin_checkout],
    ["add_shipping_info", txData.observed.add_shipping_info],
    ["add_payment_info",  txData.observed.add_payment_info],
    ["purchase",          txData.observed.purchase],
  ], 4);

  // tier badge helper
  const tierColor = { Platinum:"#7C3AED", Gold:"#D97706", Silver:"#64748B", Bronze:"#92400E" };
  const tierBg    = { Platinum:"#EDE9FE", Gold:"#FEF3C7", Silver:"#F1F5F9", Bronze:"#FEF3C7" };

  el("transactionTable").innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r.transaction_id}</strong></td>
      <td>${r.date}</td>
      <td><span class="badge ${r.customer_type==="new" ? "badge-new" : "badge-ret"}">${r.customer_type}</span></td>
      <td>${r.source} / ${r.medium}</td>
      <td>${r.device}</td>
      <td>${r.country}</td>
      <td>${n(r.items)}</td>
      <td><strong>${m(r.revenue)}</strong></td>
      <td>${m(r.tax)}</td>
      <td>${m(r.shipping)}</td>
      <td><span style="background:${tierBg[r.ltv_tier]};color:${tierColor[r.ltv_tier]};padding:2px 8px;border-radius:999px;font-size:10.5px;font-weight:700">${r.ltv_tier}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:40px;height:6px;background:var(--bg2);border-radius:999px;overflow:hidden">
            <div style="width:${r.propensity*100}%;height:100%;background:${r.propensity>0.7?"var(--green)":r.propensity>0.4?"var(--gold)":"var(--red)"};border-radius:999px"></div>
          </div>
          <span style="font-size:12px;font-weight:700;color:var(--ink)">${r.propensity}</span>
        </div>
      </td>
    </tr>`).join("");
}

/* ── INSIGHTS ───────────────────────────────────────────────────────────── */
function renderInsights() {
  el("insights").innerHTML = data.insights.map(text => `
    <div class="insight">${text}</div>`).join("");
}

/* ── RAW EVENTS TABLE ───────────────────────────────────────────────────── */
function renderTable(filter="") {
  const needle = filter.trim().toLowerCase();
  const rows = data.sampleEvents.filter(r =>
    !needle || Object.values(r).join(" ").toLowerCase().includes(needle)
  );
  el("eventTable").innerHTML = rows.map(r => `
    <tr>
      <td>${r.date}</td>
      <td><strong>${r.event}</strong></td>
      <td>${r.page}</td>
      <td>${r.device}</td>
      <td>${r.country}</td>
      <td>${r.source}</td>
      <td>${r.medium}</td>
    </tr>`).join("");
}

/* ── BEST PRACTICES ─────────────────────────────────────────────────────── */
function renderBestPractices() {
  if (!bp) return;

  // YoY Growth grid
  if (data.yoyGrowth && el("yoyGrid")) {
    const yoyColors = ["#2563EB","#059669","#7C3AED"];
    el("yoyGrid").innerHTML = data.yoyGrowth.map((y, i) => `
      <article class="metric" style="border-top:3px solid ${yoyColors[i]}">
        <span style="font-size:11px">${y.year}</span>
        <strong>${n(y.sessions)} <span style="font-size:13px;font-weight:400">sessions</span></strong>
        <strong style="color:var(--green)">${m(y.revenue)} <span style="font-size:13px;font-weight:400">revenue</span></strong>
        ${y.revenueGrowth ? `<small style="color:${yoyColors[i]};font-weight:700">+${y.revenueGrowth}% YoY revenue · +${y.sessionGrowth}% sessions</small>` : `<small style="color:var(--muted)">Baseline year</small>`}
      </article>`).join("");
  }

  // Tab listeners
  renderBPTab("ga4");
  document.querySelectorAll("#bpTabs .gtm-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#bpTabs .gtm-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderBPTab(btn.dataset.bp);
    });
  });
}

function renderBPTab(tab) {
  const c = el("bpContent");
  if (tab === "ga4") {
    c.innerHTML = bp.ga4.map(cat => `
      <div class="bp-category" style="border-left:4px solid ${cat.color}">
        <div class="bp-cat-header">
          <span style="font-size:20px">${cat.icon}</span>
          <div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${cat.color}">GA4 · ${cat.category}</div>
          </div>
        </div>
        <div class="bp-rules">
          ${cat.practices.map(p => `
            <div class="bp-rule">
              <div class="bp-rule-title">✅ ${p.rule}</div>
              <div class="bp-rule-why"><strong>Why:</strong> ${p.why}</div>
              <div class="bp-rule-example"><code>${p.example}</code></div>
            </div>`).join("")}
        </div>
      </div>`).join("");
  } else if (tab === "gtm") {
    c.innerHTML = bp.gtm.map(cat => `
      <div class="bp-category" style="border-left:4px solid ${cat.color}">
        <div class="bp-cat-header">
          <span style="font-size:20px">${cat.icon}</span>
          <div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${cat.color}">GTM · ${cat.category}</div>
          </div>
        </div>
        <div class="bp-rules">
          ${cat.practices.map(p => `
            <div class="bp-rule">
              <div class="bp-rule-title">✅ ${p.rule}</div>
              <div class="bp-rule-why"><strong>Why:</strong> ${p.why}</div>
              <div class="bp-rule-example"><code>${p.example}</code></div>
            </div>`).join("")}
        </div>
      </div>`).join("");
  } else if (tab === "bigquery") {
    c.innerHTML = bp.bigquery.map(cat => `
      <div class="bp-category" style="border-left:4px solid ${cat.color}">
        <div class="bp-cat-header">
          <span style="font-size:20px">${cat.icon}</span>
          <div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${cat.color}">BigQuery · ${cat.category}</div>
          </div>
        </div>
        <div class="bp-rules">
          ${cat.practices.map(p => `
            <div class="bp-rule">
              <div class="bp-rule-title">✅ ${p.rule}</div>
              <div class="bp-rule-why"><strong>Why:</strong> ${p.why}</div>
              <div class="bp-rule-example"><code>${p.example}</code></div>
            </div>`).join("")}
        </div>
      </div>`).join("");
  } else if (tab === "costs") {
    const cs = bp.costSavings;
    const maxSaving = 100;
    c.innerHTML = `
      <div class="bp-category" style="border-left:4px solid var(--green)">
        <div class="bp-cat-header">
          <span style="font-size:20px">💰</span>
          <div>
            <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--green)">${cs.title}</div>
            <div style="font-size:12px;color:var(--muted);margin-top:2px">Total raw data: ${cs.totalDataScanned}</div>
          </div>
        </div>
        <div class="bp-rules">
          ${cs.strategies.map(s => `
            <div class="bp-rule">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <div class="bp-rule-title" style="margin:0">💡 ${s.strategy}</div>
                <span style="font-size:12px;font-weight:700;color:var(--green);white-space:nowrap;margin-left:8px">${s.saving} saving</span>
              </div>
              <div style="height:6px;background:var(--bg2);border-radius:999px;overflow:hidden;margin-bottom:6px">
                <div style="width:${s.saving === 'Risk' ? '20' : parseInt(s.saving)}%;height:100%;background:${s.saving === 'Risk' ? 'var(--red)' : 'var(--green)'};border-radius:999px"></div>
              </div>
              <div class="bp-rule-why">${s.detail}</div>
            </div>`).join("")}
        </div>
      </div>`;
  }
}

/* ── GA4 SETUP & IMPLEMENTATION ─────────────────────────────────────────── */
function renderGA4Setup() {
  if (!ga4s) return;
  const p = ga4s.property;

  // Measurement ID in header
  el("ga4MeasurementId").textContent = p.measurementId;

  // Property cards
  el("ga4PropertyCards").innerHTML = [
    { label: "Measurement ID",   value: p.measurementId,  note: "Used in gtag('config') and GTM constant variable." },
    { label: "Property ID",      value: p.propertyId,     note: "BigQuery dataset: analytics_" + p.propertyId },
    { label: "Web Stream",       value: p.streamName,     note: "Stream ID: " + p.streamId },
    { label: "Industry",         value: p.industry,       note: "Controls benchmark reports in GA4 UI." },
    { label: "Timezone",         value: p.timezone,       note: "Affects daily BigQuery table shard rollover." },
    { label: "Currency",         value: p.currency,       note: "All revenue in this dataset reported in USD." },
  ].map(c => `
    <article class="metric" style="border-top:3px solid var(--blue)">
      <span>${c.label}</span>
      <strong style="font-size:14px;word-break:break-all">${c.value}</strong>
      <small>${c.note}</small>
    </article>`).join("");

  // Enhanced Measurement toggles
  el("ga4EnhancedMeasurement").innerHTML = ga4s.enhancedMeasurement.map(em => `
    <div class="gtm-item" style="display:flex;gap:10px;align-items:flex-start">
      <span style="font-size:18px;margin-top:2px">${em.enabled ? "✅" : "⬜"}</span>
      <div>
        <div class="gtm-item-type ${em.enabled ? "tag" : "trigger"}" style="font-size:10px">${em.enabled ? "ENABLED" : "DISABLED"}</div>
        <div class="gtm-item-name">${em.feature}</div>
        <div class="gtm-item-detail" style="font-size:11px;color:var(--subtle)">${em.note}</div>
      </div>
    </div>`).join("");

  // Custom dimensions
  const scopeColor = { Event:"#2563EB", User:"#7C3AED", Session:"#059669" };
  el("ga4CustomDimensions").innerHTML = ga4s.customDimensions.map(d => `
    <div class="gtm-item">
      <div class="gtm-item-type variable" style="background:${scopeColor[d.scope]+'22'};color:${scopeColor[d.scope]};border:1px solid ${scopeColor[d.scope]+'44'}">${d.scope.toUpperCase()}-SCOPED · ${d.evidenced ? "✅ EVIDENCED IN BIGQUERY" : "⚙ IMPLEMENTATION SPEC"}</div>
      <div class="gtm-item-name">${d.name} <code style="font-size:10px;background:var(--bg2);padding:1px 5px;border-radius:4px">${d.paramName}</code></div>
      <div class="gtm-item-detail" style="font-size:11px;color:var(--subtle)">${d.description}</div>
    </div>`).join("");

  // Audiences
  el("ga4Audiences").innerHTML = ga4s.audiences.map(a => `
    <div class="ga4-audience-card" style="border-top:3px solid ${a.color}">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${a.color};margin-bottom:4px">GA4 AUDIENCE</div>
      <div style="font-weight:700;font-size:14px;margin-bottom:6px">${a.name}</div>
      <div style="font-family:monospace;font-size:11px;background:var(--bg);padding:6px 8px;border-radius:6px;color:var(--ink);margin-bottom:8px;word-break:break-word">${a.definition}</div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:8px">
        <span>Est. users: <strong style="color:var(--ink)">${n(a.size)}</strong></span>
        <span>Propensity: <strong style="color:${a.color}">${a.propensityScore}</strong></span>
      </div>
      <div style="font-size:12px;color:var(--muted);line-height:1.4;border-top:1px solid var(--line);padding-top:8px">${a.useCase}</div>
    </div>`).join("");

  // Key reports
  el("ga4Reports").innerHTML = ga4s.keyReports.map(r => `
    <div class="gtm-item">
      <div class="gtm-item-type tag" style="background:var(--blue-lt);color:var(--blue-dk);border-color:var(--blue-lt)">GA4 REPORT</div>
      <div class="gtm-item-name">${r.report}</div>
      <div class="gtm-item-detail" style="font-size:10.5px;color:var(--blue);margin-bottom:3px">📍 ${r.path}</div>
      <div class="gtm-item-detail" style="font-size:11px;color:var(--subtle)">${r.insight}</div>
    </div>`).join("");

  // Implementation tabs
  renderGA4ImplTab("gtag");
  document.querySelectorAll("#ga4ImplTabs .gtm-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#ga4ImplTabs .gtm-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGA4ImplTab(btn.dataset.impl);
    });
  });
}

function renderGA4ImplTab(tab) {
  const c = el("ga4ImplContent");
  if (tab === "gtag") {
    c.innerHTML = `
      <p style="font-size:13px;color:var(--muted);margin:12px 0 8px">Direct gtag.js implementation — use when GTM is not available or for server-rendered pages where tag firing needs more control.</p>
      <div class="code-block">${escHtml(ga4s.gtagImplementation)}</div>`;
  } else if (tab === "mp") {
    c.innerHTML = `
      <p style="font-size:13px;color:var(--muted);margin:12px 0 8px">Measurement Protocol v2 — server-side events. Used here to write ML model LTV tier predictions back to GA4 as user properties, closing the ML → GA4 feedback loop.</p>
      <div class="code-block">${escHtml(ga4s.measurementProtocol)}</div>`;
  } else if (tab === "debug") {
    c.innerHTML = `
      <p style="font-size:13px;color:var(--muted);margin:12px 0 8px">6-step QA workflow — GTM Preview + GA4 DebugView + BigQuery validation. All three layers confirm correct event firing before container publish.</p>
      <div class="gtm-grid">${ga4s.debugWorkflow.map(w => `
        <div class="gtm-item" style="border-left:3px solid var(--blue)">
          <div class="gtm-item-type tag" style="font-size:10px;background:var(--blue-lt);color:var(--blue-dk)">STEP ${w.step} · ${w.tool.toUpperCase()}</div>
          <div class="gtm-item-name">${w.action}</div>
          <div class="gtm-item-detail" style="font-size:11px;color:var(--subtle)">${w.detail}</div>
        </div>`).join("")}</div>`;
  }
}

/* ── NETLIFY FEATURES ───────────────────────────────────────────────────── */
function renderNetlify() {
  const features = [
    ["🚀 Zero-config deploy",        "netlify.toml auto-detected. Push to Git → live in seconds. No build command needed."],
    ["🔒 Security headers",          "X-Frame-Options: DENY, CSP, HSTS, Referrer-Policy — all applied at CDN edge."],
    ["⚡ 1-year asset cache",        "JS/CSS served with Cache-Control: immutable. Repeat visitors load from browser cache."],
    ["🌍 Global CDN",                "Netlify's CDN serves from the nearest edge node. Sub-100ms TTFB globally."],
    ["🔀 Redirect rules",            "Clean URLs via [[redirects]] in netlify.toml. 200 rewrite keeps URL clean."],
    ["📋 Environment variables",     "GA4 Measurement ID, GTM container ID stored as Netlify env vars — not in source."],
    ["🔁 Branch deploys",            "Every PR gets a preview URL. Test analytics implementation before merging to main."],
    ["📊 Analytics integration",     "Netlify Analytics + GA4 both active. Server-side vs client-side comparison ready."],
  ];
  el("netlifyFeatures").innerHTML = features.map(([title, desc]) => `
    <div class="netlify-feature">
      <strong>${title}</strong>
      <span>${desc}</span>
    </div>`).join("");
}

/* ── ACTIVE NAV ON SCROLL ───────────────────────────────────────────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const links    = document.querySelectorAll("nav a[href^='#']");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove("active"));
        const a = document.querySelector(`nav a[href="#${e.target.id}"]`);
        if (a) a.classList.add("active");
      }
    });
  }, { rootMargin: "-25% 0px -70% 0px" });
  sections.forEach(s => obs.observe(s));
}

/* ── INIT ───────────────────────────────────────────────────────────────── */
function init() {
  renderHero();
  renderKpis();
  renderJourney();
  renderDayGrid();
  renderFunnel();
  renderBars("eventBars",   data.eventCounts,  10);
  renderBars("browserBars", data.browserCounts, 6);
  renderBars("mediumBars",  data.mediumCounts,  6);
  renderRankList("sourceList",  data.sourceCounts,  7);
  renderRankList("countryList", data.countryCounts, 7);
  renderRankList("pageList",    data.pageCounts,    7);
  renderGTM();
  renderBigQuery();
  renderML();
  renderDeviceConversion();
  renderTrackingPlan();
  renderTransactions();
  renderInsights();
  renderTable();
  renderGA4Setup();
  renderBestPractices();
  renderNetlify();
  initScrollSpy();

  el("eventSearch").addEventListener("input", e => renderTable(e.target.value));
}

init();
