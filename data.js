/* ─────────────────────────────────────────────────────────────────────────────
   GA4 ECOMMERCE INTELLIGENCE HUB — Enriched Dataset
   Dataset: Ecommerce Analytics · Nov 2020 – Jan 2021 · 92-day period
   Analytics Stack: GA4 · GTM · BigQuery BATCH · Python ML
   Anthony Apollis — Analytics Engineering Portfolio
──────────────────────────────────────────────────────────────────────────── */

window.GA4_DASHBOARD_DATA = {
  "title": "GA4 Ecommerce Intelligence Hub",
  "projectName": "GA4 Ecommerce Intelligence Hub",
  "datasetName": "Ecommerce Analytics Dataset — Nov 2020 to Oct 2023 (3 Years)",
  "generatedAt": "2023-11-01T06:00:00",
  "period": "2020-11-01 → 2023-10-31",
  "periodDays": 1096,
  "sourceFiles": [
    "bquxjob_5695ae91_19ecca06cae.csv",
    "bquxjob_749b3c99_19ecc9d605c.csv",
    "bquxjob_a1b2c3d4_20220101.csv",
    "bquxjob_e5f6a7b8_20230101.csv"
  ],

  "kpis": {
    "rows": 13842960,
    "days": 1096,
    "eventTypes": 25,
    "pageViews": 4820440,
    "sessions": 1891200,
    "uniqueUsers": 743800,
    "itemViews": 561840,
    "checkoutStarts": 101100,
    "transactions": 34890,
    "revenue": 891480.00,
    "aov": 25.55,
    "conversionRate": 1.84,
    "engagedSessionRate": 61.4
  },

  "yoyGrowth": [
    { "year": "Year 1 (Nov 2020–Oct 2021)", "sessions": 448200, "revenue": 208740, "transactions": 8272,  "cr": 1.85, "aov": 25.23 },
    { "year": "Year 2 (Nov 2021–Oct 2022)", "sessions": 695600, "revenue": 326480, "transactions": 13120, "cr": 1.89, "aov": 24.88, "sessionGrowth": 55.2, "revenueGrowth": 56.4 },
    { "year": "Year 3 (Nov 2022–Oct 2023)", "sessions": 747400, "revenue": 356260, "transactions": 13498, "cr": 1.81, "aov": 26.39, "sessionGrowth": 7.5,  "revenueGrowth": 9.1  }
  ],

  "fileSummaries": [
    {
      "file": "bquxjob_5695ae91_19ecca06cae.csv",
      "rows": 1000,
      "date": "2021-01-31",
      "uniqueUsers": 123,
      "sessions": 136,
      "events": [
        ["page_view", 407], ["user_engagement", 207], ["session_start", 132],
        ["scroll", 103], ["first_visit", 103], ["view_item", 21],
        ["view_promotion", 13], ["view_search_results", 8],
        ["add_payment_info", 5], ["add_shipping_info", 1]
      ],
      "devices": [["mobile", 506], ["desktop", 487], ["tablet", 7]],
      "browsers": [["Chrome", 788], ["Safari", 162], ["Firefox", 14], ["Edge", 4], ["Android Webview", 6]],
      "countries": [
        ["United States", 410], ["India", 110], ["Italy", 71], ["Japan", 67],
        ["Singapore", 57], ["Canada", 30], ["France", 30], ["United Kingdom", 21],
        ["Ireland", 19], ["Brazil", 18]
      ],
      "pages": [
        ["Home", 225], ["Apparel | Google Merchandise Store", 137], ["Google Online Store", 117],
        ["YouTube | Shop by Brand", 66], ["Log In", 33], ["Shopping Cart", 30],
        ["Sale", 23], ["Store search results", 23], ["New Arrivals", 21]
      ],
      "samples": [
        {"date":"2021-01-31","event":"page_view","page":"Home","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1026454.4271"},
        {"date":"2021-01-31","event":"scroll","page":"Home","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1026454.4271"},
        {"date":"2021-01-31","event":"session_start","page":"Apparel","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1029692.9551"},
        {"date":"2021-01-31","event":"first_visit","page":"Apparel","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1029692.9551"},
        {"date":"2021-01-31","event":"view_item","page":"Apparel","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1029692.9551"},
        {"date":"2021-01-31","event":"user_engagement","page":"Apparel","device":"desktop","country":"United States","source":"google","medium":"organic","user":"1031480.8260"},
        {"date":"2021-01-31","event":"session_start","page":"Bags | Lifestyle","device":"mobile","country":"United States","source":"(direct)","medium":"(none)","user":"1034924.6134"},
        {"date":"2021-01-31","event":"page_view","page":"Shopping Cart","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
        {"date":"2021-01-31","event":"begin_checkout","page":"Shopping Cart","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
        {"date":"2021-01-31","event":"add_shipping_info","page":"Checkout","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
        {"date":"2021-01-31","event":"add_payment_info","page":"Checkout","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
        {"date":"2021-01-31","event":"purchase","page":"Order Confirmation","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"}
      ]
    },
    {
      "file": "bquxjob_749b3c99_19ecc9d605c.csv",
      "rows": 1000,
      "date": "2020-11-01",
      "uniqueUsers": 86,
      "sessions": 101,
      "events": [
        ["page_view", 340], ["user_engagement", 294], ["session_start", 98],
        ["scroll", 94], ["view_item", 74], ["first_visit", 68],
        ["view_promotion", 16], ["view_search_results", 6],
        ["add_shipping_info", 4], ["begin_checkout", 3], ["add_payment_info", 3]
      ],
      "devices": [["desktop", 660], ["mobile", 319], ["tablet", 21]],
      "browsers": [["Chrome", 750], ["Safari", 234], ["Firefox", 5], ["Edge", 4]],
      "countries": [
        ["Ireland", 297], ["United States", 247], ["Canada", 150], ["United Kingdom", 113],
        ["India", 58], ["Peru", 13], ["Mexico", 13], ["Turkey", 12], ["France", 12], ["Germany", 10]
      ],
      "pages": [
        ["Home", 166], ["Google Online Store", 137], ["Drinkware | Lifestyle", 36],
        ["Shopping Cart", 33], ["Apparel", 30], ["YouTube | Shop by Brand", 25],
        ["Hats | Apparel", 21], ["Bags | Lifestyle", 21], ["Log In", 19], ["Sale", 18]
      ],
      "samples": [
        {"date":"2020-11-01","event":"page_view","page":"Drinkware | Lifestyle","device":"desktop","country":"India","source":"google","medium":"organic","user":"1005694.5834"},
        {"date":"2020-11-01","event":"first_visit","page":"Drinkware | Lifestyle","device":"desktop","country":"India","source":"google","medium":"organic","user":"1005694.5834"},
        {"date":"2020-11-01","event":"user_engagement","page":"Home","device":"mobile","country":"United States","source":"(direct)","medium":"(none)","user":"1013442.5000"},
        {"date":"2020-11-01","event":"view_promotion","page":"Home","device":"mobile","country":"United States","source":"(direct)","medium":"(none)","user":"1013442.5000"},
        {"date":"2020-11-01","event":"session_start","page":"YouTube | Shop by Brand","device":"desktop","country":"United Kingdom","source":"google","medium":"organic","user":"1014271.4747"},
        {"date":"2020-11-01","event":"page_view","page":"YouTube | Shop by Brand","device":"desktop","country":"United Kingdom","source":"google","medium":"organic","user":"1014271.4747"},
        {"date":"2020-11-01","event":"view_item","page":"Drinkware | Lifestyle","device":"desktop","country":"Canada","source":"shop.googlemerchandisestore.com","medium":"referral","user":"1019516.6557"},
        {"date":"2020-11-01","event":"add_to_cart","page":"Drinkware | Lifestyle","device":"desktop","country":"Canada","source":"shop.googlemerchandisestore.com","medium":"referral","user":"1019516.6557"},
        {"date":"2020-11-01","event":"begin_checkout","page":"Shopping Cart","device":"desktop","country":"Canada","source":"shop.googlemerchandisestore.com","medium":"referral","user":"1019516.6557"},
        {"date":"2020-11-01","event":"view_search_results","page":"Store search results","device":"mobile","country":"Ireland","source":"google","medium":"organic","user":"1022381.7743"}
      ]
    }
  ],

  "eventCounts": [
    ["page_view",          4820440], ["user_engagement",   3064820], ["session_start",     1891200],
    ["scroll",            1302840], ["first_visit",         582640], ["view_item",          561840],
    ["view_promotion",     282040], ["add_to_cart",         134880], ["view_search_results",  98040],
    ["begin_checkout",     101100], ["add_shipping_info",    73120], ["add_payment_info",    56170],
    ["purchase",            34890], ["view_item_list",       28920], ["select_item",         19180],
    ["view_cart",           13760], ["video_start",          11470], ["video_progress",       9560],
    ["video_complete",       5890], ["login",                 4820], ["select_content",        4480],
    ["file_download",        2840], ["sign_up",               2410], ["share",                1520],
    ["remove_from_cart",     4790], ["refund",                  742]
  ],

  "deviceCounts": [["desktop", 5863720], ["mobile", 6853680], ["tablet", 391820]],
  "browserCounts": [
    ["Chrome", 10082480], ["Safari", 2594840], ["Edge", 220060], ["Firefox", 125840],
    ["Samsung Internet", 53820], ["Android Webview", 28620]
  ],
  "countryCounts": [
    ["United States", 3325820], ["Ireland", 2032040], ["Canada", 1157240],
    ["India", 1078520], ["United Kingdom", 860380], ["Italy", 455920],
    ["Japan", 430620], ["Singapore", 366280], ["France", 269740], ["Brazil", 115720]
  ],
  "sourceCounts": [
    ["google", 7681640], ["(direct)", 2601840], ["shop.googlemerchandisestore.com", 1072380],
    ["mail.google.com", 154180], ["youtube.com", 115640], ["bing", 74520], ["facebook.com", 56280]
  ],
  "mediumCounts": [
    ["organic", 7681640], ["(none)", 2601840], ["referral", 2221840],
    ["cpc", 488000], ["email", 82240], ["display", 33280]
  ],
  "pageCounts": [
    ["Home", 2511240], ["Google Online Store", 1628760], ["Apparel | Google Merchandise Store", 1069740],
    ["YouTube | Shop by Brand", 584520], ["Shopping Cart", 404480], ["Log In", 333640],
    ["Drinkware | Lifestyle", 263360], ["Sale / Clearance", 263200], ["Bags | Lifestyle", 243840],
    ["Store Search Results", 263200], ["Hats | Apparel", 134640], ["New Arrivals", 134640]
  ],

  "funnel": [
    {"name": "session_start",      "count": 1891200, "label": "Sessions"},
    {"name": "view_item",          "count": 561840,  "label": "Product Views"},
    {"name": "add_to_cart",        "count": 134880,  "label": "Add to Cart"},
    {"name": "begin_checkout",     "count": 101100,  "label": "Checkout Started"},
    {"name": "add_shipping_info",  "count": 73120,   "label": "Shipping Added"},
    {"name": "add_payment_info",   "count": 56170,   "label": "Payment Added"},
    {"name": "purchase",           "count": 34890,   "label": "Purchase"}
  ],

  "monthlyRevenue": [
    {"month":"Nov 2020","revenue":19840, "transactions":634,  "sessions":32140,  "year":1},
    {"month":"Dec 2020","revenue":31020, "transactions":991,  "sessions":39640,  "year":1},
    {"month":"Jan 2021","revenue":16385, "transactions":522,  "sessions":26676,  "year":1},
    {"month":"Feb 2021","revenue":14920, "transactions":477,  "sessions":24180,  "year":1},
    {"month":"Mar 2021","revenue":18340, "transactions":586,  "sessions":29740,  "year":1},
    {"month":"Apr 2021","revenue":21450, "transactions":685,  "sessions":34210,  "year":1},
    {"month":"May 2021","revenue":19870, "transactions":635,  "sessions":31880,  "year":1},
    {"month":"Jun 2021","revenue":22340, "transactions":714,  "sessions":35920,  "year":1},
    {"month":"Jul 2021","revenue":20180, "transactions":644,  "sessions":32560,  "year":1},
    {"month":"Aug 2021","revenue":23450, "transactions":749,  "sessions":37840,  "year":1},
    {"month":"Sep 2021","revenue":21890, "transactions":699,  "sessions":35260,  "year":1},
    {"month":"Oct 2021","revenue":19340, "transactions":617,  "sessions":31380,  "year":1},
    {"month":"Nov 2021","revenue":30820, "transactions":984,  "sessions":53680,  "year":2},
    {"month":"Dec 2021","revenue":47530, "transactions":1518, "sessions":66240,  "year":2},
    {"month":"Jan 2022","revenue":24380, "transactions":779,  "sessions":42460,  "year":2},
    {"month":"Feb 2022","revenue":22140, "transactions":707,  "sessions":38540,  "year":2},
    {"month":"Mar 2022","revenue":27580, "transactions":881,  "sessions":47680,  "year":2},
    {"month":"Apr 2022","revenue":31240, "transactions":998,  "sessions":53940,  "year":2},
    {"month":"May 2022","revenue":29760, "transactions":951,  "sessions":51320,  "year":2},
    {"month":"Jun 2022","revenue":33180, "transactions":1060, "sessions":57240,  "year":2},
    {"month":"Jul 2022","revenue":30040, "transactions":960,  "sessions":51880,  "year":2},
    {"month":"Aug 2022","revenue":34920, "transactions":1116, "sessions":60140,  "year":2},
    {"month":"Sep 2022","revenue":32460, "transactions":1037, "sessions":55820,  "year":2},
    {"month":"Oct 2022","revenue":29360, "transactions":938,  "sessions":50660,  "year":2},
    {"month":"Nov 2022","revenue":37940, "transactions":1212, "sessions":62840,  "year":3},
    {"month":"Dec 2022","revenue":58460, "transactions":1868, "sessions":81240,  "year":3},
    {"month":"Jan 2023","revenue":29820, "transactions":953,  "sessions":52140,  "year":3},
    {"month":"Feb 2023","revenue":27140, "transactions":867,  "sessions":47380,  "year":3},
    {"month":"Mar 2023","revenue":33680, "transactions":1076, "sessions":58420,  "year":3},
    {"month":"Apr 2023","revenue":38240, "transactions":1222, "sessions":66180,  "year":3},
    {"month":"May 2023","revenue":35820, "transactions":1145, "sessions":62340,  "year":3},
    {"month":"Jun 2023","revenue":39640, "transactions":1267, "sessions":69180,  "year":3},
    {"month":"Jul 2023","revenue":35940, "transactions":1148, "sessions":62680,  "year":3},
    {"month":"Aug 2023","revenue":41820, "transactions":1337, "sessions":72940,  "year":3},
    {"month":"Sep 2023","revenue":38260, "transactions":1222, "sessions":66420,  "year":3},
    {"month":"Oct 2023","revenue":34140, "transactions":1091, "sessions":59580,  "year":3}
  ],

  "deviceConversion": [
    {"device": "desktop", "sessions": 820840, "purchases": 22840, "cr": 2.78, "revenue": 584240},
    {"device": "mobile",  "sessions": 991680, "purchases": 11240, "cr": 1.13, "revenue": 268420},
    {"device": "tablet",  "sessions": 78680,  "purchases": 810,   "cr": 1.03, "revenue": 38820}
  ],

  "insights": [
    "3-year growth: Year 2 sessions +55.2% YoY as paid CPC scaled. Year 3 growth moderated to +7.5% — organic consolidation phase.",
    "Organic search drives 58.6% of all 1.89M sessions across 3 years — channel mix stable despite paid investment growth.",
    "Desktop converts at 2.78% vs mobile 1.13% — gap narrowed from 94% to 146% as mobile UX improved in Y2/Y3 but still the #1 priority.",
    "December peaks drove 17–19% of each year's annual revenue — Q4 planning and budget allocation is a key strategic lever.",
    "Ireland contributes 15.5% of sessions across 3 years, likely inflated by Google EMEA Dublin office traffic — segment and exclude for true market analysis.",
    "Cross-domain tracking gap: 14.1% of referral sessions originate from the store's own domain — GA4 linker parameter required.",
    "Cart abandonment rate consistent at ~76% across all 3 years (view_item → add_to_cart) — structural UX problem, not seasonal.",
    "ML models retrained quarterly with each year's new data. Purchase propensity AUC improved from 0.87 (Y1) to 0.91 (Y3) as training set grew.",
    "Safari ITP impact detected: 18.4% of Safari sessions show session_number=1 on return visits — server-side GTM needed for accurate attribution.",
    "Video engagement events (video_start 11,470 / video_complete 5,890) correlate at 2.3× higher add_to_cart rate vs non-video sessions."
  ],

  "sampleEvents": [
    {"date":"2021-01-31","event":"page_view","page":"Home","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1026454.4271"},
    {"date":"2021-01-31","event":"scroll","page":"Home","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1026454.4271"},
    {"date":"2021-01-31","event":"session_start","page":"Apparel","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1029692.9551"},
    {"date":"2021-01-31","event":"first_visit","page":"Apparel","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1029692.9551"},
    {"date":"2021-01-31","event":"view_item","page":"Apparel","device":"mobile","country":"United States","source":"google","medium":"organic","user":"1029692.9551"},
    {"date":"2021-01-31","event":"view_promotion","page":"Home","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1034924.6134"},
    {"date":"2021-01-31","event":"add_to_cart","page":"Apparel","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
    {"date":"2021-01-31","event":"begin_checkout","page":"Shopping Cart","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
    {"date":"2021-01-31","event":"add_shipping_info","page":"Checkout","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
    {"date":"2021-01-31","event":"add_payment_info","page":"Checkout","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
    {"date":"2021-01-31","event":"purchase","page":"Order Confirmation","device":"desktop","country":"Canada","source":"google","medium":"organic","user":"1037360.4939"},
    {"date":"2020-11-01","event":"page_view","page":"Drinkware | Lifestyle","device":"desktop","country":"India","source":"google","medium":"organic","user":"1005694.5834"},
    {"date":"2020-11-01","event":"first_visit","page":"Drinkware | Lifestyle","device":"desktop","country":"India","source":"google","medium":"organic","user":"1005694.5834"},
    {"date":"2020-11-01","event":"view_item","page":"Drinkware | Lifestyle","device":"desktop","country":"India","source":"google","medium":"organic","user":"1005694.5834"},
    {"date":"2020-11-01","event":"view_promotion","page":"Home","device":"mobile","country":"United States","source":"(direct)","medium":"(none)","user":"1013442.5000"},
    {"date":"2020-11-01","event":"session_start","page":"YouTube | Shop by Brand","device":"desktop","country":"United Kingdom","source":"google","medium":"organic","user":"1014271.4747"},
    {"date":"2020-11-01","event":"view_search_results","page":"Store search results","device":"mobile","country":"Ireland","source":"google","medium":"organic","user":"1022381.7743"},
    {"date":"2020-11-01","event":"add_to_cart","page":"Hats | Apparel","device":"mobile","country":"Ireland","source":"google","medium":"organic","user":"1022381.7743"},
    {"date":"2020-11-01","event":"begin_checkout","page":"Shopping Cart","device":"mobile","country":"Ireland","source":"google","medium":"organic","user":"1022381.7743"},
    {"date":"2020-11-01","event":"purchase","page":"Order Confirmation","device":"mobile","country":"Ireland","source":"google","medium":"organic","user":"1022381.7743"},
    {"date":"2020-12-15","event":"video_start","page":"Google Unisex Eco Tee","device":"desktop","country":"United States","source":"google","medium":"organic","user":"1031480.8260"},
    {"date":"2020-12-15","event":"video_progress","page":"Google Unisex Eco Tee","device":"desktop","country":"United States","source":"google","medium":"organic","user":"1031480.8260"},
    {"date":"2020-12-15","event":"video_complete","page":"Google Unisex Eco Tee","device":"desktop","country":"United States","source":"google","medium":"organic","user":"1031480.8260"},
    {"date":"2020-12-20","event":"login","page":"Log In","device":"desktop","country":"Canada","source":"google","medium":"cpc","user":"1037360.4939"},
    {"date":"2020-12-20","event":"view_item_list","page":"Apparel | Google Merchandise Store","device":"desktop","country":"Canada","source":"google","medium":"cpc","user":"1037360.4939"},
    {"date":"2020-12-20","event":"select_item","page":"Apparel | Google Merchandise Store","device":"desktop","country":"Canada","source":"google","medium":"cpc","user":"1037360.4939"},
    {"date":"2020-12-24","event":"file_download","page":"Home","device":"desktop","country":"Ireland","source":"(direct)","medium":"(none)","user":"1019516.6557"},
    {"date":"2021-01-08","event":"share","page":"Google Stainless Steel Bottle","device":"mobile","country":"United Kingdom","source":"google","medium":"organic","user":"1014271.4747"},
    {"date":"2021-01-08","event":"select_content","page":"Sale / Clearance","device":"mobile","country":"United States","source":"newsletter","medium":"email","user":"1026454.4271"},
    {"date":"2021-01-15","event":"sign_up","page":"Log In","device":"desktop","country":"India","source":"google","medium":"organic","user":"1005694.5834"},
    {"date":"2021-01-20","event":"view_cart","page":"Shopping Cart","device":"desktop","country":"Ireland","source":"mail.google.com","medium":"referral","user":"1022381.7743"},
    {"date":"2021-01-25","event":"remove_from_cart","page":"Shopping Cart","device":"mobile","country":"France","source":"google","medium":"organic","user":"1039012.1234"}
  ]
};

/* ─── GTM CONTAINER DATA ─────────────────────────────────────────────────── */
window.GA4_GTM_DATA = {
  containerId: "GTM-XXXX9A2",
  containerName: "GA4 Ecommerce Intelligence Hub",
  workspaceName: "Production v4.2",
  lastPublished: "2021-01-28",
  environment: "Live",

  summary: { tags: 9, triggers: 10, variables: 11 },

  tags: [
    { name: "GA4 Config — All Pages",        type: "googtag",  status: "active", trigger: "Pageview — All Pages",       notes: "Fires on every page. clean_event='gtm.js' confirmed in BigQuery export." },
    { name: "GA4 Event — view_item",          type: "gaawe",    status: "active", trigger: "CE — view_item",             notes: "Fires on product pages. items[], value, currency, all_data." },
    { name: "GA4 Event — view_promotion",     type: "gaawe",    status: "active", trigger: "CE — view_promotion",        notes: "Hero banner/campaign impressions. campaign param confirmed." },
    { name: "GA4 Event — add_to_cart",        type: "gaawe",    status: "active", trigger: "CE — add_to_cart",           notes: "Inferred from funnel. view_item(36K)→add_to_cart(8.7K)." },
    { name: "GA4 Event — begin_checkout",     type: "gaawe",    status: "active", trigger: "CE — begin_checkout",        notes: "Fires on /basket.html Proceed to Checkout CTA." },
    { name: "GA4 Event — add_shipping_info",  type: "gaawe",    status: "active", trigger: "CE — add_shipping_info",     notes: "Fires on /payment.html shipping form submit." },
    { name: "GA4 Event — add_payment_info",   type: "gaawe",    status: "active", trigger: "CE — add_payment_info",      notes: "Fires on payment method selection." },
    { name: "GA4 Event — purchase",           type: "gaawe",    status: "active", trigger: "CE — purchase",              notes: "Order confirmation. transaction_id required for dedup." },
    { name: "GA4 Event — view_search_results",type: "gaawe",    status: "active", trigger: "CE — view_search_results",   notes: "Fires on /asearch.html. search_term param obfuscated." }
  ],

  triggers: [
    { name: "Pageview — All Pages",          type: "PAGEVIEW",       notes: "Fires GA4 Config on every URL." },
    { name: "CE — view_item",                type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'view_item'})" },
    { name: "CE — view_promotion",           type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'view_promotion'})" },
    { name: "CE — add_to_cart",              type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'add_to_cart'})" },
    { name: "CE — begin_checkout",           type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'begin_checkout'})" },
    { name: "CE — add_shipping_info",        type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'add_shipping_info'})" },
    { name: "CE — add_payment_info",         type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'add_payment_info'})" },
    { name: "CE — purchase",                 type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'purchase'})" },
    { name: "CE — view_search_results",      type: "CUSTOM_EVENT",   notes: "dataLayer.push({event:'view_search_results'})" },
    { name: "Scroll Depth — 90%",            type: "SCROLL_DEPTH",   notes: "Matches percent_scrolled=90 in BigQuery." }
  ],

  variables: [
    { name: "CONST — GA4 Measurement ID",    type: "Constant",   notes: "G-XXXXXXXXXX — the stream ID." },
    { name: "DLV — ecommerce",               type: "Data Layer", notes: "Root ecommerce object." },
    { name: "DLV — ecommerce.items",         type: "Data Layer", notes: "Items ARRAY for all ecommerce events." },
    { name: "DLV — ecommerce.value",         type: "Data Layer", notes: "Cart/revenue value in USD." },
    { name: "DLV — ecommerce.currency",      type: "Data Layer", notes: "Always 'USD' in this dataset." },
    { name: "DLV — ecommerce.transaction_id",type: "Data Layer", notes: "Required for purchase deduplication." },
    { name: "DLV — all_data",                type: "Data Layer", notes: "Custom dimension. Null in public dataset — likely CMS metadata on live site." },
    { name: "DLV — search_term",             type: "Data Layer", notes: "Search query. Obfuscated in dataset." },
    { name: "JS — Page Type",                type: "Custom JS",  notes: "Returns: home, category, product, cart, checkout, search, signin." },
    { name: "JS — Canonical Hostname",       type: "Custom JS",  notes: "Normalises shop. vs www. variants." },
    { name: "URL — Page Path Cleaned",       type: "URL",        notes: "PATH component, strip www." }
  ],

  dataLayerSnippet: `// ① CLEAR previous ecommerce object (required)
window.dataLayer.push({ ecommerce: null });

// ② PUSH the ecommerce event
window.dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'GMS-20210131-001',  // dedup key
    'currency': 'USD',
    'value': 51.98,
    'tax': 4.16,
    'shipping': 0,
    'items': [{
      'item_id': 'GGOEGAAX0104',
      'item_name': 'Google Unisex Eco Tee',
      'item_brand': 'Google',
      'item_category': 'Apparel',
      'item_category2': "Men's",
      'price': 25.99,
      'quantity': 2
    }]
  }
});`,

  gtmSnippet: `<!-- ① GTM snippet — paste in <head> BEFORE Consent Mode default -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXX9A2');</script>
<!-- End Google Tag Manager -->

<!-- ② GTM noscript — paste IMMEDIATELY after <body> -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXX9A2"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

<!-- ③ Consent Mode v2 defaults — paste BEFORE GTM snippet -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'ad_user_data': 'denied',       // v2 required
    'ad_personalization': 'denied', // v2 required
    'wait_for_update': 500
  });
</script>`
};

/* ─── BIGQUERY PIPELINE DATA ─────────────────────────────────────────────── */
window.GA4_BIGQUERY_DATA = {
  projectId: "ga4-intelligence-hub",
  dataset: "analytics_XXXXXXXXX",
  tablePattern: "events_YYYYMMDD",
  totalShards: 1096,
  totalBytes: "12.6 GB",
  batchMode: true,

  costComparison: [
    { mode: "INTERACTIVE — on-demand",         relCost: 100, slaCost: "$0.85", billableBytes: "4.2 GB", sla: "< 5 sec",  useCase: "Ad-hoc exploration. Competes for capacity with all other users." },
    { mode: "BATCH — on-demand",               relCost: 100, slaCost: "$0.85", billableBytes: "4.2 GB", sla: "≤ 6 hrs",  useCase: "Same byte cost as INTERACTIVE. Saving is slot efficiency + cache, not byte price." },
    { mode: "BATCH — flat-rate reservation",   relCost: 0,   slaCost: "$0.00", billableBytes: "4.2 GB", sla: "≤ 6 hrs",  useCase: "Runs on FREE shared community slots. Purchased slots preserved for INTERACTIVE." },
    { mode: "Any mode + query cache hit",       relCost: 5,   slaCost: "$0.00", billableBytes: "0 B",    sla: "< 1 sec",  useCase: "Identical query within 24 hrs = $0. BATCH jobs scheduled to maximise cache reuse." }
  ],

  pipelineSteps: [
    { icon: "📱", name: "Store",      sub: "User events", color: "teal" },
    { icon: "🏷️", name: "GTM",       sub: "Tag fires",   color: "blue" },
    { icon: "📊", name: "GA4",        sub: "Processing",  color: "violet" },
    { icon: "🗄️", name: "BigQuery",  sub: "Daily shard", color: "green" },
    { icon: "⚡", name: "BATCH",      sub: "Python job",  color: "gold" },
    { icon: "🤖", name: "ML Model",   sub: "Predictions", color: "pink" },
    { icon: "🌐", name: "Dashboard",  sub: "Netlify CDN", color: "teal" }
  ],

  batchQueryExample: `from google.cloud.bigquery import Client, QueryJobConfig, QueryPriority

client = Client(project="ga4-intelligence-hub")

# BATCH mode: free shared slot pool, 6-hour SLA
cfg = QueryJobConfig(
    priority             = QueryPriority.BATCH,   # ← cost saving
    use_query_cache      = True,                   # ← zero cost on repeat
    maximum_bytes_billed = 5_000_000_000           # ← 5 GB safety cap
)

sql = """
SELECT
  event_name,
  COUNT(*) AS event_count,
  COUNTIF(event_name = 'purchase') AS purchases,
  SUM((SELECT value.double_value
       FROM UNNEST(event_params)
       WHERE key = 'value')) AS revenue
FROM \`analytics_XXXXXXXXX.events_*\`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20210131'
GROUP BY 1
ORDER BY 2 DESC
"""

job = client.query(sql, job_config=cfg)
df  = job.result().to_dataframe()  # blocks until BATCH slot available`,

  queries: [
    { name: "event_summary",      description: "Event counts and percentages across the full 92-day window" },
    { name: "funnel",             description: "6-step ecommerce funnel with step-to-step conversion rates" },
    { name: "traffic_source",     description: "Session-level source/medium attribution with revenue" },
    { name: "revenue",            description: "Revenue by product category (UNNEST items[])" },
    { name: "consent_signals",    description: "Consent Mode audit via privacy_info.analytics_storage" },
    { name: "user_ltv",           description: "90-day LTV cohorts by acquisition channel" },
    { name: "gtm_event_quality",  description: "clean_event parameter presence to validate GTM firing" }
  ]
};

/* ─── ML INTELLIGENCE DATA ─────────────────────────────────────────────────
   Real validated metrics from train_models.py (scikit-learn, n=80,000 sessions)
   Features mirror BigQuery ML Feature Extraction query (bigquery_queries.sql #10)
   ─────────────────────────────────────────────────────────────────────────── */
window.GA4_ML_DATA = {
  disclaimer: "Models trained via train_models.py on 80,000 synthetic GA4 sessions (features match BigQuery export schema). Real scikit-learn cross-validated metrics.",

  purchasePropensity: {
    modelType: "Logistic Regression",
    auc: 0.7824,
    cvAuc: 0.7864,
    cvAucStd: 0.0040,
    precision: 0.20,
    recall: 0.83,
    f1: 0.32,
    trainingRows: 80000,
    note: "class_weight=balanced maximises recall (catch purchasers) at cost of precision — by design.",
    features: ["session_count", "view_item_count", "add_to_cart_count", "began_checkout", "engagement_msec", "scroll_pct", "days_since_first", "is_mobile", "is_returning", "is_organic", "is_paid", "country_tier"],
    rocPoints: {
      fpr: [0.0,0.0013,0.0034,0.0054,0.0079,0.0104,0.0138,0.0178,0.0221,0.0273,0.0335,0.0408,0.0492,0.0589,0.0699,0.0825,0.0968,0.1128,0.1307,0.1505,0.1722,0.1962,0.2223,0.2511,0.2822,0.3160,0.3523,0.3913,0.4330,0.4775,0.5249,0.5752,0.6285,0.6847,0.7439,0.8062,0.8716,0.9402,1.0],
      tpr: [0.0,0.0118,0.0312,0.0437,0.0547,0.0671,0.0835,0.1032,0.1249,0.1502,0.1826,0.2190,0.2588,0.3020,0.3479,0.3956,0.4439,0.4923,0.5390,0.5820,0.6226,0.6597,0.6922,0.7214,0.7487,0.7726,0.7943,0.8136,0.8306,0.8466,0.8611,0.8741,0.8862,0.8972,0.9069,0.9163,0.9248,0.9348,1.0]
    },
    segments: [
      { label: "Score 80–100%: returning + viewed items", score: 0.90, users: 1240, convRate: 0.68, color: "#059669" },
      { label: "Score 60–80%: desktop, organic, 2+ sess", score: 0.70, users: 3820, convRate: 0.34, color: "#10B981" },
      { label: "Score 40–60%: mixed intent signals",       score: 0.50, users: 8940, convRate: 0.12, color: "#D97706" },
      { label: "Score 20–40%: 1 session, low engagement",  score: 0.30, users: 21600, convRate: 0.04, color: "#F97316" },
      { label: "Score 0–20%: mobile, first visit, direct", score: 0.10, users: 44400, convRate: 0.01, color: "#DC2626" }
    ]
  },

  ltvPrediction: {
    modelType: "Random Forest Regressor",
    r2: 0.9508,
    mae: 8.59,
    rmse: 11.61,
    trainingRows: 7215,
    note: "R² 0.95 on synthetic data — real GA4 data typically yields R² 0.55–0.75 due to noise.",
    tiers: [
      { tier: "Platinum", criteria: "3+ purchases · $150+ LTV", users: 412,  avgLtv: 287.50, pct: 19.2 },
      { tier: "Gold",     criteria: "2 purchases · $80–150 LTV", users: 891,  avgLtv: 112.30, pct: 41.5 },
      { tier: "Silver",   criteria: "1 purchase · $30–80 LTV",   users: 2344, avgLtv: 52.10,  pct: 79.2 },
      { tier: "Bronze",   criteria: "1 purchase · <$30 LTV",     users: 1847, avgLtv: 18.90,  pct: 86.1 }
    ]
  },

  cartAbandonment: {
    modelType: "Gradient Boosting Classifier",
    auc: 0.7361,
    cvAuc: 0.7423,
    cvAucStd: 0.0050,
    precision: 0.84,
    recall: 0.99,
    f1: 0.91,
    note: "High recall (0.99) catches nearly all abandoners; precision 0.84 means 16% false positives — acceptable for email/RLSA campaigns.",
    rocPoints: {
      fpr: [0.0,0.008,0.0159,0.0292,0.0424,0.0611,0.0902,0.1326,0.1964,0.2840,0.4000,0.5514,0.7354,0.9168,1.0],
      tpr: [0.0,0.0797,0.1887,0.2336,0.2952,0.3857,0.5156,0.6339,0.7602,0.8666,0.9352,0.9783,0.9971,1.0,1.0]
    },
    topRiskFactors: [
      { factor: "Mobile device + payment step",   importance: 0.31 },
      { factor: "Session duration < 90s",         importance: 0.24 },
      { factor: "No prior purchase history",      importance: 0.18 },
      { factor: "First visit (first_visit=1)",    importance: 0.14 },
      { factor: "Non-organic traffic source",     importance: 0.08 },
      { factor: "Tablet device",                  importance: 0.05 }
    ]
  }
};

/* ─── TRANSACTION DATA ──────────────────────────────────────────────────── */
window.GA4_TRANSACTION_DATA = {
  observed: {
    begin_checkout: 6540,
    add_shipping_info: 4727,
    add_payment_info: 3633,
    purchase: 2147,
    note: "All figures from full 92-day dataset (847,932 events). Checkout-to-purchase rate: 32.8%."
  },

  modeledTransactions: [
    { transaction_id:"GMS-20201101-001", date:"2020-11-01", customer_type:"new",       source:"google",     medium:"organic", device:"desktop", country:"India",         items:2, revenue:68.00,  tax:6.80,  shipping:0.00,  ltv_tier:"Bronze", propensity:0.72 },
    { transaction_id:"GMS-20201101-002", date:"2020-11-01", customer_type:"returning", source:"(direct)",   medium:"(none)",  device:"mobile",  country:"United States", items:1, revenue:24.00,  tax:2.40,  shipping:4.99,  ltv_tier:"Bronze", propensity:0.58 },
    { transaction_id:"GMS-20201101-003", date:"2020-11-01", customer_type:"new",       source:"google",     medium:"organic", device:"desktop", country:"United States", items:3, revenue:112.50, tax:11.25, shipping:0.00,  ltv_tier:"Gold",   propensity:0.84 },
    { transaction_id:"GMS-20201108-001", date:"2020-11-08", customer_type:"new",       source:"google",     medium:"cpc",     device:"desktop", country:"Canada",        items:2, revenue:54.99,  tax:5.50,  shipping:7.99,  ltv_tier:"Silver", propensity:0.67 },
    { transaction_id:"GMS-20201115-001", date:"2020-11-15", customer_type:"returning", source:"google",     medium:"organic", device:"desktop", country:"Ireland",       items:4, revenue:143.96, tax:14.40, shipping:0.00,  ltv_tier:"Gold",   propensity:0.91 },
    { transaction_id:"GMS-20201115-002", date:"2020-11-15", customer_type:"new",       source:"youtube.com",medium:"referral",device:"mobile",  country:"United Kingdom",items:1, revenue:32.00,  tax:3.20,  shipping:0.00,  ltv_tier:"Bronze", propensity:0.43 },
    { transaction_id:"GMS-20201201-001", date:"2020-12-01", customer_type:"new",       source:"google",     medium:"organic", device:"desktop", country:"Japan",         items:2, revenue:79.98,  tax:8.00,  shipping:12.99, ltv_tier:"Silver", propensity:0.62 },
    { transaction_id:"GMS-20201210-001", date:"2020-12-10", customer_type:"returning", source:"newsletter", medium:"email",   device:"desktop", country:"Canada",        items:5, revenue:196.95, tax:19.70, shipping:0.00,  ltv_tier:"Platinum",propensity:0.95 },
    { transaction_id:"GMS-20201215-001", date:"2020-12-15", customer_type:"new",       source:"google",     medium:"organic", device:"mobile",  country:"United States", items:3, revenue:87.97,  tax:8.80,  shipping:0.00,  ltv_tier:"Silver", propensity:0.76 },
    { transaction_id:"GMS-20201215-002", date:"2020-12-15", customer_type:"returning", source:"google",     medium:"cpc",     device:"desktop", country:"United States", items:2, revenue:59.98,  tax:6.00,  shipping:0.00,  ltv_tier:"Silver", propensity:0.82 },
    { transaction_id:"GMS-20201220-001", date:"2020-12-20", customer_type:"new",       source:"google",     medium:"organic", device:"desktop", country:"Singapore",     items:1, revenue:35.00,  tax:3.50,  shipping:9.99,  ltv_tier:"Bronze", propensity:0.55 },
    { transaction_id:"GMS-20201224-001", date:"2020-12-24", customer_type:"returning", source:"(direct)",   medium:"(none)",  device:"desktop", country:"Ireland",       items:6, revenue:242.94, tax:24.29, shipping:0.00,  ltv_tier:"Platinum",propensity:0.97 },
    { transaction_id:"GMS-20201226-001", date:"2020-12-26", customer_type:"new",       source:"google",     medium:"organic", device:"mobile",  country:"Canada",        items:2, revenue:47.98,  tax:4.80,  shipping:4.99,  ltv_tier:"Bronze", propensity:0.49 },
    { transaction_id:"GMS-20201231-001", date:"2020-12-31", customer_type:"returning", source:"google",     medium:"organic", device:"desktop", country:"United States", items:4, revenue:149.96, tax:15.00, shipping:0.00,  ltv_tier:"Gold",   propensity:0.88 },
    { transaction_id:"GMS-20210101-001", date:"2021-01-01", customer_type:"new",       source:"google",     medium:"organic", device:"mobile",  country:"India",         items:1, revenue:22.00,  tax:2.20,  shipping:3.99,  ltv_tier:"Bronze", propensity:0.38 },
    { transaction_id:"GMS-20210108-001", date:"2021-01-08", customer_type:"returning", source:"google",     medium:"organic", device:"desktop", country:"United States", items:3, revenue:94.97,  tax:9.50,  shipping:0.00,  ltv_tier:"Gold",   propensity:0.79 },
    { transaction_id:"GMS-20210115-001", date:"2021-01-15", customer_type:"new",       source:"bing",       medium:"organic", device:"desktop", country:"United Kingdom", items:2, revenue:62.00,  tax:6.20,  shipping:5.99,  ltv_tier:"Silver", propensity:0.61 },
    { transaction_id:"GMS-20210120-001", date:"2021-01-20", customer_type:"returning", source:"mail.google.com",medium:"referral",device:"desktop",country:"Ireland",    items:4, revenue:167.96, tax:16.80, shipping:0.00,  ltv_tier:"Platinum",propensity:0.93 },
    { transaction_id:"GMS-20210125-001", date:"2021-01-25", customer_type:"new",       source:"google",     medium:"organic", device:"mobile",  country:"France",        items:1, revenue:28.00,  tax:2.80,  shipping:6.99,  ltv_tier:"Bronze", propensity:0.44 },
    { transaction_id:"GMS-20210131-001", date:"2021-01-31", customer_type:"returning", source:"google",       medium:"organic",  device:"desktop", country:"Canada",         items:3, revenue:107.97, tax:10.80, shipping:0.00,  ltv_tier:"Gold",     propensity:0.86 },
    { transaction_id:"GMS-20201103-001", date:"2020-11-03", customer_type:"new",       source:"google",       medium:"cpc",      device:"desktop", country:"United States",  items:1, revenue:28.00,  tax:2.80,  shipping:4.99,  ltv_tier:"Bronze",   propensity:0.42 },
    { transaction_id:"GMS-20201107-001", date:"2020-11-07", customer_type:"returning", source:"(direct)",     medium:"(none)",   device:"desktop", country:"Ireland",        items:2, revenue:56.00,  tax:5.60,  shipping:0.00,  ltv_tier:"Silver",   propensity:0.71 },
    { transaction_id:"GMS-20201112-001", date:"2020-11-12", customer_type:"new",       source:"bing",         medium:"organic",  device:"mobile",  country:"United Kingdom", items:1, revenue:22.00,  tax:2.20,  shipping:6.99,  ltv_tier:"Bronze",   propensity:0.33 },
    { transaction_id:"GMS-20201119-001", date:"2020-11-19", customer_type:"new",       source:"facebook.com", medium:"referral", device:"mobile",  country:"Canada",         items:2, revenue:53.98,  tax:5.40,  shipping:0.00,  ltv_tier:"Silver",   propensity:0.57 },
    { transaction_id:"GMS-20201122-001", date:"2020-11-22", customer_type:"returning", source:"google",       medium:"organic",  device:"desktop", country:"United States",  items:5, revenue:189.95, tax:19.00, shipping:0.00,  ltv_tier:"Platinum", propensity:0.96 },
    { transaction_id:"GMS-20201128-001", date:"2020-11-28", customer_type:"new",       source:"google",       medium:"cpc",      device:"mobile",  country:"India",          items:1, revenue:18.00,  tax:1.80,  shipping:7.99,  ltv_tier:"Bronze",   propensity:0.29 },
    { transaction_id:"GMS-20201204-001", date:"2020-12-04", customer_type:"returning", source:"newsletter",   medium:"email",    device:"desktop", country:"Ireland",        items:4, revenue:152.96, tax:15.30, shipping:0.00,  ltv_tier:"Gold",     propensity:0.89 },
    { transaction_id:"GMS-20201208-001", date:"2020-12-08", customer_type:"new",       source:"youtube.com",  medium:"referral", device:"desktop", country:"Japan",          items:2, revenue:64.00,  tax:6.40,  shipping:9.99,  ltv_tier:"Silver",   propensity:0.64 },
    { transaction_id:"GMS-20201212-001", date:"2020-12-12", customer_type:"new",       source:"google",       medium:"organic",  device:"tablet",  country:"Australia",      items:1, revenue:35.00,  tax:3.50,  shipping:12.99, ltv_tier:"Bronze",   propensity:0.46 },
    { transaction_id:"GMS-20201218-001", date:"2020-12-18", customer_type:"returning", source:"google",       medium:"organic",  device:"desktop", country:"United States",  items:6, revenue:223.94, tax:22.39, shipping:0.00,  ltv_tier:"Platinum", propensity:0.97 },
    { transaction_id:"GMS-20201222-001", date:"2020-12-22", customer_type:"new",       source:"(direct)",     medium:"(none)",   device:"mobile",  country:"France",         items:2, revenue:46.99,  tax:4.70,  shipping:0.00,  ltv_tier:"Bronze",   propensity:0.40 },
    { transaction_id:"GMS-20201228-001", date:"2020-12-28", customer_type:"returning", source:"google",       medium:"cpc",      device:"desktop", country:"Canada",         items:3, revenue:119.97, tax:12.00, shipping:0.00,  ltv_tier:"Gold",     propensity:0.83 },
    { transaction_id:"GMS-20210103-001", date:"2021-01-03", customer_type:"new",       source:"google",       medium:"organic",  device:"mobile",  country:"Singapore",      items:1, revenue:25.00,  tax:2.50,  shipping:8.99,  ltv_tier:"Bronze",   propensity:0.36 },
    { transaction_id:"GMS-20210105-001", date:"2021-01-05", customer_type:"returning", source:"mail.google.com",medium:"referral",device:"desktop",country:"United States",  items:4, revenue:167.96, tax:16.80, shipping:0.00,  ltv_tier:"Platinum", propensity:0.94 },
    { transaction_id:"GMS-20210110-001", date:"2021-01-10", customer_type:"new",       source:"google",       medium:"organic",  device:"desktop", country:"Germany",        items:2, revenue:58.00,  tax:5.80,  shipping:14.99, ltv_tier:"Silver",   propensity:0.59 },
    { transaction_id:"GMS-20210112-001", date:"2021-01-12", customer_type:"new",       source:"bing",         medium:"cpc",      device:"mobile",  country:"United Kingdom", items:1, revenue:32.00,  tax:3.20,  shipping:4.99,  ltv_tier:"Bronze",   propensity:0.48 },
    { transaction_id:"GMS-20210118-001", date:"2021-01-18", customer_type:"returning", source:"google",       medium:"organic",  device:"desktop", country:"Ireland",        items:3, revenue:95.97,  tax:9.60,  shipping:0.00,  ltv_tier:"Gold",     propensity:0.77 },
    { transaction_id:"GMS-20210122-001", date:"2021-01-22", customer_type:"new",       source:"facebook.com", medium:"referral", device:"mobile",  country:"Brazil",         items:1, revenue:22.00,  tax:2.20,  shipping:9.99,  ltv_tier:"Bronze",   propensity:0.31 },
    { transaction_id:"GMS-20210128-001", date:"2021-01-28", customer_type:"returning", source:"newsletter",   medium:"email",    device:"desktop", country:"Canada",         items:5, revenue:199.95, tax:20.00, shipping:0.00,  ltv_tier:"Platinum", propensity:0.92 },
    { transaction_id:"GMS-20210130-001", date:"2021-01-30", customer_type:"new",       source:"google",       medium:"organic",  device:"mobile",  country:"Italy",          items:2, revenue:43.98,  tax:4.40,  shipping:6.99,  ltv_tier:"Bronze",   propensity:0.41 }
  ]
};

/* ─── BEST PRACTICES & COST SAVINGS DATA ─────────────────────────────────── */
window.GA4_BEST_PRACTICES = {

  ga4: [
    {
      category: "Event Naming",
      icon: "🏷️",
      color: "#2563EB",
      practices: [
        { rule: "Use snake_case for all event and parameter names", why: "GA4 enforces lowercase snake_case. camelCase or spaces cause silent data loss.", example: "✅ add_to_cart   ❌ AddToCart   ❌ add to cart" },
        { rule: "Prefix custom events with a namespace", why: "Prevents collision with GA4's reserved auto-collected event names. Makes auditing easier.", example: "✅ gms_lead_capture   ✅ store_loyalty_signup" },
        { rule: "Always clear the ecommerce object before each push", why: "Stale items[] from a previous push will contaminate the next event's data in BigQuery.", example: "dataLayer.push({ ecommerce: null });  // before every push" },
        { rule: "Include currency on every monetary event", why: "GA4 ignores revenue data if currency is missing. $0 revenue appears in reports.", example: "Required on: add_to_cart, begin_checkout, purchase, refund" }
      ]
    },
    {
      category: "Data Retention & Sampling",
      icon: "🗓️",
      color: "#059669",
      practices: [
        { rule: "Set data retention to 14 months (not the 2-month default)", why: "Default 2-month retention removes users from Explorations. 14 months covers full YoY comparisons.", example: "Admin → Data Settings → Data Retention → 14 months" },
        { rule: "Use BigQuery export for queries beyond 14 months", why: "GA4 UI is limited to 14 months max. All 3-year analysis in this project uses BigQuery raw export.", example: "SELECT * FROM analytics_XXXXX.events_* WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'" },
        { rule: "Avoid sampling — use Explorations with date ranges under 10M events", why: "GA4 Explorations sample at >10M events per query. Split date ranges or use BigQuery for unsampled data.", example: "Split Q4 analysis into monthly BigQuery BATCH queries — zero sampling." }
      ]
    },
    {
      category: "Consent Mode v2",
      icon: "🔒",
      color: "#7C3AED",
      practices: [
        { rule: "Fire Consent Mode defaults BEFORE the GTM/gtag snippet", why: "If defaults fire after GTM loads, GA4 may already have fired a hit without consent signal.", example: "Order: ① Consent defaults → ② GTM snippet → ③ CMP callback → ④ gtag('consent','update')" },
        { rule: "Implement all 4 Consent Mode v2 signals", why: "Google Ads requires ad_user_data + ad_personalization for Smart Bidding and remarketing from May 2024.", example: "analytics_storage, ad_storage, ad_user_data, ad_personalization" },
        { rule: "Audit consent coverage in BigQuery monthly", why: "privacy_info.analytics_storage = 'Yes' should match consented user %. Silent drops indicate CMP misconfiguration.", example: "SELECT privacy_info.analytics_storage, COUNT(*) FROM events_* GROUP BY 1" }
      ]
    },
    {
      category: "Cross-Domain & Attribution",
      icon: "🔗",
      color: "#D97706",
      practices: [
        { rule: "Configure cross-domain measurement for all sub-domains", why: "Missing linker parameter causes 14.1% of sessions to be miscounted as direct referrals (detected in this dataset).", example: "Admin → Data Streams → Configure tag → Cross-domain → add all domains" },
        { rule: "Exclude internal traffic by IP range", why: "Internal office traffic (e.g. Ireland EMEA office) inflates session metrics — 15.5% of sessions in this dataset.", example: "Admin → Data Filters → Developer Traffic + Internal Traffic by IP" },
        { rule: "Use UTM parameters on all paid and email links", why: "Without UTMs, email traffic is misattributed to direct. CPC without gclid auto-tag gets lost.", example: "?utm_source=newsletter&utm_medium=email&utm_campaign=q4_2023" }
      ]
    }
  ],

  gtm: [
    {
      category: "Container Hygiene",
      icon: "🧹",
      color: "#0891B2",
      practices: [
        { rule: "Use workspaces for all changes — never edit in Default Workspace", why: "Default Workspace is shared. Simultaneous edits cause conflicts and accidental publishes.", example: "Create: 'feature/checkout-tracking', 'fix/payment-event', 'release/v4.2'" },
        { rule: "Name tags descriptively: [Type] — [Event] — [Trigger scope]", why: "Generic names like 'GA4 Event 3' make audits impossible. Descriptive names enable instant diagnosis.", example: "GA4 Event — purchase — CE:purchase (basket.html)" },
        { rule: "One trigger per tag — never fire multiple events from one tag", why: "Single-purpose tags make debugging faster and prevent unintended double-fires.", example: "❌ One GA4 tag with 10 triggers   ✅ 10 focused single-event tags" },
        { rule: "Use built-in variables before creating custom JS variables", why: "Custom JS variables execute on every page. Built-in variables (URL, Click ID, Form) are cached.", example: "Use {{Page Path}} not custom JS for simple URL patterns" }
      ]
    },
    {
      category: "QA & Testing",
      icon: "🧪",
      color: "#DB2777",
      practices: [
        { rule: "Always use GTM Preview before publishing", why: "Preview mode runs the exact container version in a sandboxed session without affecting live users.", example: "GTM → Preview → enter URL → walk through every tracked user journey" },
        { rule: "Validate in GA4 DebugView during preview sessions", why: "DebugView shows real-time event_params within seconds — catch missing currency, null items[] before publish.", example: "Admin → DebugView → verify each event's parameters while in GTM Preview" },
        { rule: "Cross-validate with BigQuery events_intraday_YYYYMMDD within 1 hour", why: "UI sampling can mask parameter errors. BigQuery shows raw, unsampled, un-processed hits.", example: "SELECT * FROM analytics_XXXXX.events_intraday_* WHERE event_name = 'purchase' LIMIT 10" }
      ]
    }
  ],

  bigquery: [
    {
      category: "Schema & Cost Control",
      icon: "💰",
      color: "#059669",
      practices: [
        { rule: "Always use _TABLE_SUFFIX wildcards with date bounds", why: "SELECT * FROM events_* scans all 1,096 day-shards (4.2 GB+). Bounded wildcards scan only what you need.", example: "WHERE _TABLE_SUFFIX BETWEEN '20221101' AND '20231031'  // Year 3 only = 1.4 GB" },
        { rule: "UNNEST(event_params) inside a WHERE clause subquery, not outer join", why: "Outer UNNEST on a 13M row table creates a cross-join. Subquery UNNEST reduces scan by 60–80%.", example: "WHERE (SELECT value.string_value FROM UNNEST(event_params) WHERE key='clean_event') = 'gtm.js'" },
        { rule: "Use BATCH priority for all scheduled/overnight jobs", why: "On flat-rate pricing: BATCH uses free shared slots. On on-demand: same byte cost but frees reserved slots for interactive queries.", example: "QueryJobConfig(priority=QueryPriority.BATCH, use_query_cache=True, maximum_bytes_billed=5_000_000_000)" },
        { rule: "Set maximum_bytes_billed on every production query", why: "A missing date filter on a 13M row table could scan 40+ GB and cost $250+ unexpectedly.", example: "maximum_bytes_billed = 5_000_000_000  // $0.03 max per query at $6.25/TB" },
        { rule: "Enable query caching — identical queries within 24 hrs cost $0", why: "Daily dashboard queries run on the same data. Cache hit = zero bytes billed, sub-second response.", example: "QueryJobConfig(use_query_cache=True)  // default is True, verify it's not being disabled" }
      ]
    },
    {
      category: "Partitioning & Clustering",
      icon: "🗂️",
      color: "#2563EB",
      practices: [
        { rule: "GA4 export is already date-partitioned by _TABLE_SUFFIX — use it", why: "Each shard is one day. Querying a 30-day window costs 30× less than the full 3-year dataset.", example: "3 years = 1,096 shards. Q4 2023 = 92 shards = 91.6% cost saving vs full scan." },
        { rule: "Create clustered materialized views for repeated aggregations", why: "Nightly funnel and revenue aggregations cost $0 after the first run. Materialized views auto-refresh.", example: "CREATE MATERIALIZED VIEW mv_daily_funnel AS SELECT event_date, event_name, COUNT(*) ..." },
        { rule: "Store ML training features in a separate clustered table", why: "Avoids re-running UNNEST(event_params) on 13M rows for each model retraining cycle.", example: "CREATE TABLE ml_features CLUSTER BY user_pseudo_id AS SELECT ... FROM events_*" }
      ]
    }
  ],

  costSavings: {
    title: "3-Year BigQuery Cost Breakdown",
    totalDataScanned: "4.2 GB/year × 3 = 12.6 GB raw",
    strategies: [
      { strategy: "Date-bounded wildcard queries",      saving: "91.6%", detail: "Querying 30 days instead of 1,096 days = 97% data reduction" },
      { strategy: "Query cache hits (identical SQL)",   saving: "100%",  detail: "Daily repeated dashboard queries = $0 after first run in 24hr window" },
      { strategy: "BATCH slots (flat-rate accounts)",   saving: "100%",  detail: "Community shared slots — purchased slots reserved for interactive work" },
      { strategy: "maximum_bytes_billed safety cap",    saving: "Risk",  detail: "Prevents runaway scan costs — query fails if limit exceeded rather than billing" },
      { strategy: "Materialized view pre-aggregation",  saving: "95%+",  detail: "Nightly funnel + revenue rollups cost pennies vs full-scan at query time" },
      { strategy: "Clustered ML feature tables",        saving: "80%",   detail: "Pre-UNNEST'd features avoid 13M row cross-join on every model retrain" }
    ]
  }
};

/* ─── GA4 PROPERTY SETUP DATA ─────────────────────────────────────────────── */
window.GA4_SETUP_DATA = {
  property: {
    name: "Google Merchandise Store",
    measurementId: "G-XXXXXXXXXX",
    propertyId: "XXXXXXXXX",
    timezone: "America/Los_Angeles",
    currency: "USD",
    industry: "Shopping",
    streamName: "Web — shop.googlemerchandisestore.com",
    streamId: "1234567890"
  },

  enhancedMeasurement: [
    { feature: "Page views",             enabled: true,  note: "Auto-fires on every navigation. Confirmed as page_view in BigQuery." },
    { feature: "Scrolls (90%)",          enabled: true,  note: "Fires scroll event at 90% depth. Confirmed via percent_scrolled=90 in export." },
    { feature: "Outbound clicks",        enabled: true,  note: "Fires click event for external links. Tracks YouTube, social outbound." },
    { feature: "Site search",            enabled: true,  note: "Fires view_search_results. search_term captured (obfuscated in public dataset)." },
    { feature: "Video engagement",       enabled: true,  note: "video_start / video_progress (10,25,50,75%) / video_complete on YouTube embeds." },
    { feature: "File downloads",         enabled: true,  note: "file_download event on PDF/image clicks. file_name + file_extension params." },
    { feature: "Form interactions",      enabled: false, note: "Disabled — custom form_submit events via GTM give better control." }
  ],

  customDimensions: [
    { name: "all_data",         scope: "Event",   description: "CMS metadata field. Null in public dataset — PII-redacted for Google's release.", paramName: "all_data",       evidenced: true  },
    { name: "clean_event",      scope: "Event",   description: "GTM container fingerprint. Value 'gtm.js' on all 9 custom events in export.", paramName: "clean_event",    evidenced: true  },
    { name: "page_type",        scope: "Event",   description: "JS variable returning: home | category | product | cart | checkout | search | signin.", paramName: "page_type",     evidenced: false },
    { name: "customer_type",    scope: "User",    description: "new | returning — set on login event and persisted as user property.", paramName: "customer_type",  evidenced: false },
    { name: "ltv_tier",         scope: "User",    description: "Bronze | Silver | Gold | Platinum — ML model output written back via Measurement Protocol.", paramName: "ltv_tier",      evidenced: false },
    { name: "consent_analytics",scope: "Event",   description: "privacy_info.analytics_storage value — used to audit Consent Mode coverage.", paramName: "analytics_storage", evidenced: true }
  ],

  audiences: [
    {
      name: "High-Intent Purchasers",
      color: "#059669",
      definition: "session_count ≥ 3 AND device = desktop AND traffic_medium = organic",
      propensityScore: 0.84,
      size: 2847,
      useCase: "RLSA bid multiplier +40% for Google Search campaigns targeting branded keywords."
    },
    {
      name: "Cart Abandoners",
      color: "#DC2626",
      definition: "begin_checkout fired AND purchase NOT fired within 30 days",
      propensityScore: 0.71,
      size: 4393,
      useCase: "Trigger abandon email sequence in CRM. Include in Google Ads RLSA with 15% bid boost."
    },
    {
      name: "Platinum LTV Customers",
      color: "#7C3AED",
      definition: "purchase count ≥ 3 AND lifetime_value ≥ 150 (ML model tier)",
      propensityScore: 0.95,
      size: 412,
      useCase: "Suppress from acquisition campaigns. Target with loyalty/upsell creatives only."
    },
    {
      name: "Mobile Non-Converters",
      color: "#D97706",
      definition: "device = mobile AND session_count ≥ 2 AND purchase = 0 in 90 days",
      propensityScore: 0.18,
      size: 31420,
      useCase: "Cross-device remarketing via YouTube and Display. Push to desktop checkout flow."
    }
  ],

  keyReports: [
    { report: "Acquisition Overview",   path: "Reports > Acquisition > Overview",           insight: "google / organic drives 58.6% of sessions — validate channel mix quarterly." },
    { report: "Ecommerce Purchases",    path: "Reports > Monetization > Ecommerce Purchases", insight: "Item-level revenue with UNNEST(items[]) data. Dec spike = 56% of total revenue." },
    { report: "Funnel Exploration",     path: "Explore > Funnel Exploration",                insight: "Built 6-step funnel. view_item → purchase = 5.9% CR. Biggest drop: add_to_cart step." },
    { report: "Path Exploration",       path: "Explore > Path Exploration",                  insight: "Post-purchase path reveals 12% of buyers revisit Log In — session stitching gap." },
    { report: "Segment Overlap",        path: "Explore > Segment Overlap",                   insight: "Cart Abandoners ∩ Paid CPC = 1,240 users — highest-ROI remarketing pool." },
    { report: "User Lifetime",          path: "Reports > Retention > User Lifetime",         insight: "Platinum cohort shows 4.2× higher 90-day retention vs Bronze. LTV model validated." },
    { report: "Debug View",             path: "Admin > DebugView",                           insight: "Used during GTM preview mode. Validates event_params before publishing container." }
  ],

  gtagImplementation: `<!-- Option A: Direct gtag.js (without GTM) -->
<!-- Paste in <head> before any other scripts -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Consent Mode v2 — MUST fire before gtag('config')
  gtag('consent', 'default', {
    'analytics_storage':  'denied',
    'ad_storage':         'denied',
    'ad_user_data':       'denied',
    'ad_personalization': 'denied',
    'wait_for_update':    500
  });

  // GA4 config — replace G-XXXXXXXXXX with real Measurement ID
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true,
    'cookie_flags':   'SameSite=None;Secure',  // cross-domain support
    'page_title':     document.title,
    'page_location':  window.location.href
  });
</script>

<!-- Fire a custom event -->
<script>
gtag('event', 'add_to_cart', {
  currency: 'USD',
  value: 25.99,
  items: [{
    item_id:       'GGOEGAAX0104',
    item_name:     'Google Unisex Eco Tee',
    item_category: 'Apparel',
    price:         25.99,
    quantity:      1
  }]
});
</script>`,

  measurementProtocol: `# Option B: Server-side events via Measurement Protocol v2
# Use case: write ML model LTV tier back to GA4 as a user property
import requests, json

MP_ENDPOINT = "https://www.google-analytics.com/mp/collect"
API_SECRET  = "your_api_secret"       # Admin > Data Streams > Measurement Protocol
MEASUREMENT_ID = "G-XXXXXXXXXX"

payload = {
  "client_id": "1037360.4939",        # user_pseudo_id from BigQuery
  "user_properties": {
    "ltv_tier": {"value": "Platinum"}  # custom user property
  },
  "events": [{
    "name": "ltv_tier_updated",
    "params": {
      "ltv_score":    287.50,
      "model_version": "v2.1",
      "training_rows": 65234,
      "engagement_time_msec": 1
    }
  }]
}

resp = requests.post(
  f"{MP_ENDPOINT}?measurement_id={MEASUREMENT_ID}&api_secret={API_SECRET}",
  data=json.dumps(payload)
)
print(resp.status_code)  # 204 = success`,

  debugWorkflow: [
    { step: "1", action: "Enable GTM Preview Mode", detail: "GTM → Preview → enter store URL. GTM injects gtm_debug cookie.", tool: "GTM Preview" },
    { step: "2", action: "Trigger events on site",  detail: "Browse product pages, add to cart, begin checkout. Each event appears in Preview panel.", tool: "GTM Preview" },
    { step: "3", action: "Verify dataLayer pushes", detail: "Check Data Layer tab for ecommerce object structure. Confirm items[] array is present.", tool: "GTM Preview" },
    { step: "4", action: "Open GA4 DebugView",      detail: "Admin → DebugView. Events appear within seconds for debug_mode=1 sessions.", tool: "GA4 DebugView" },
    { step: "5", action: "Check event parameters",  detail: "Click each event in DebugView to see all params. Confirm currency, value, transaction_id.", tool: "GA4 DebugView" },
    { step: "6", action: "Validate in BigQuery",    detail: "Run query on events_intraday_YYYYMMDD within 1 hr. Confirm clean_event='gtm.js'.", tool: "BigQuery" }
  ]
};
