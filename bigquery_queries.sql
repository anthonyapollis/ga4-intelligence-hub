-- ─────────────────────────────────────────────────────────────────────────────
-- GA4 Ecommerce Intelligence Hub — BigQuery Query Library
-- Dataset: analytics_XXXXXXXXX (GA4 BigQuery Export)
-- Period: 2020-11-01 → 2023-10-31 (3 years, 1,096 day-shards)
-- Author: Anthony Apollis — Analytics Engineering Portfolio
-- Cost tip: All queries use _TABLE_SUFFIX bounds to minimise bytes scanned.
--           Run via QueryPriority.BATCH for flat-rate slot savings.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. EVENT SUMMARY ────────────────────────────────────────────────────────
-- Full 3-year event count and percentage breakdown.
SELECT
  event_name,
  COUNT(*)                                          AS event_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS pct_of_total
FROM `analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
GROUP BY 1
ORDER BY 2 DESC;


-- ── 2. 6-STEP ECOMMERCE FUNNEL ───────────────────────────────────────────────
-- Step-to-step conversion rates across the 3-year period.
WITH funnel AS (
  SELECT
    COUNTIF(event_name = 'session_start')     AS sessions,
    COUNTIF(event_name = 'view_item')         AS view_item,
    COUNTIF(event_name = 'add_to_cart')       AS add_to_cart,
    COUNTIF(event_name = 'begin_checkout')    AS begin_checkout,
    COUNTIF(event_name = 'add_shipping_info') AS add_shipping_info,
    COUNTIF(event_name = 'add_payment_info')  AS add_payment_info,
    COUNTIF(event_name = 'purchase')          AS purchase
  FROM `analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
)
SELECT
  sessions,
  view_item,
  add_to_cart,
  begin_checkout,
  add_shipping_info,
  add_payment_info,
  purchase,
  ROUND(purchase * 100.0 / sessions, 2)     AS overall_cr_pct,
  ROUND(add_to_cart * 100.0 / view_item, 2) AS view_to_cart_pct,
  ROUND(purchase * 100.0 / begin_checkout, 2) AS checkout_to_purchase_pct
FROM funnel;


-- ── 3. TRAFFIC SOURCE & REVENUE ATTRIBUTION ──────────────────────────────────
-- Session-level source/medium with purchase revenue.
-- Uses UNNEST to extract event_params from the GA4 nested schema.
SELECT
  traffic_source.source                               AS source,
  traffic_source.medium                               AS medium,
  COUNT(DISTINCT CONCAT(user_pseudo_id,
        CAST((SELECT value.int_value FROM UNNEST(event_params)
              WHERE key = 'ga_session_id') AS STRING))) AS sessions,
  COUNTIF(event_name = 'purchase')                    AS transactions,
  ROUND(SUM(ecommerce.purchase_revenue_in_usd), 2)    AS revenue
FROM `analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
GROUP BY 1, 2
ORDER BY revenue DESC
LIMIT 20;


-- ── 4. PRODUCT REVENUE (UNNEST items[]) ──────────────────────────────────────
-- Revenue by item_category using the GA4 items ARRAY.
SELECT
  item.item_category                    AS category,
  COUNT(*)                              AS item_views,
  SUM(item.quantity)                    AS units_sold,
  ROUND(SUM(item.item_revenue_in_usd), 2) AS revenue
FROM `analytics_XXXXXXXXX.events_*`,
  UNNEST(items) AS item
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
  AND event_name IN ('purchase', 'view_item', 'add_to_cart')
GROUP BY 1
ORDER BY revenue DESC;


-- ── 5. CONSENT MODE AUDIT ─────────────────────────────────────────────────────
-- Verify analytics_storage consent coverage across the 3-year period.
-- Best practice: consented % should match CMP acceptance rate.
SELECT
  FORMAT_DATE('%Y-%m', PARSE_DATE('%Y%m%d', event_date)) AS month,
  privacy_info.analytics_storage,
  COUNT(*)                                               AS event_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER
        (PARTITION BY FORMAT_DATE('%Y-%m', PARSE_DATE('%Y%m%d', event_date))), 2) AS pct
FROM `analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
GROUP BY 1, 2
ORDER BY 1, 2;


-- ── 6. USER LTV COHORTS ───────────────────────────────────────────────────────
-- 90-day LTV by acquisition channel. Requires 3+ years to see full cohort.
WITH first_touch AS (
  SELECT
    user_pseudo_id,
    MIN(event_date)                AS first_seen,
    ANY_VALUE(traffic_source.medium) AS acq_medium
  FROM `analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
    AND event_name = 'first_visit'
  GROUP BY 1
),
revenue AS (
  SELECT
    user_pseudo_id,
    SUM(ecommerce.purchase_revenue_in_usd) AS ltv
  FROM `analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
    AND event_name = 'purchase'
  GROUP BY 1
)
SELECT
  f.acq_medium,
  COUNT(DISTINCT f.user_pseudo_id) AS users,
  ROUND(AVG(r.ltv), 2)             AS avg_90d_ltv,
  ROUND(SUM(r.ltv), 2)             AS total_ltv
FROM first_touch f
LEFT JOIN revenue r USING (user_pseudo_id)
GROUP BY 1
ORDER BY avg_90d_ltv DESC;


-- ── 7. GTM EVENT QUALITY CHECK ────────────────────────────────────────────────
-- Validates that GTM is firing correctly by checking clean_event='gtm.js'
-- on all custom events. Missing clean_event = tag fired outside GTM.
SELECT
  event_name,
  (SELECT value.string_value FROM UNNEST(event_params)
   WHERE key = 'clean_event')             AS clean_event,
  COUNT(*)                                AS event_count,
  ROUND(COUNT(*) * 100.0 /
        SUM(COUNT(*)) OVER (PARTITION BY event_name), 2) AS pct_with_value
FROM `analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
  AND event_name NOT IN ('page_view','session_start','first_visit',
                         'user_engagement','scroll')
GROUP BY 1, 2
ORDER BY 1, 3 DESC;


-- ── 8. YEAR-OVER-YEAR REVENUE GROWTH ─────────────────────────────────────────
-- Compare revenue across the 3 years side by side.
SELECT
  EXTRACT(YEAR FROM PARSE_DATE('%Y%m%d', event_date)) AS year,
  FORMAT_DATE('%Y-%m', PARSE_DATE('%Y%m%d', event_date)) AS month,
  COUNT(DISTINCT (SELECT value.string_value FROM UNNEST(event_params)
                  WHERE key = 'transaction_id'))        AS transactions,
  ROUND(SUM(ecommerce.purchase_revenue_in_usd), 2)      AS revenue
FROM `analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
  AND event_name = 'purchase'
GROUP BY 1, 2
ORDER BY 2;


-- ── 9. DEVICE × CHANNEL CROSS-SEGMENT ────────────────────────────────────────
-- Identifies highest-value device+channel combinations for bid strategy.
SELECT
  device.category                         AS device,
  traffic_source.medium                   AS medium,
  COUNT(DISTINCT user_pseudo_id)          AS users,
  COUNTIF(event_name = 'purchase')        AS purchases,
  ROUND(SUM(ecommerce.purchase_revenue_in_usd), 2) AS revenue,
  ROUND(COUNTIF(event_name = 'purchase') * 100.0 /
        COUNT(DISTINCT CONCAT(user_pseudo_id,
          CAST((SELECT value.int_value FROM UNNEST(event_params)
                WHERE key = 'ga_session_id') AS STRING))), 2) AS cr_pct
FROM `analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
GROUP BY 1, 2
ORDER BY revenue DESC
LIMIT 20;


-- ── 10. ML FEATURE EXTRACTION ────────────────────────────────────────────────
-- Builds the feature table used to train all 3 ML models.
-- Store result in a clustered table for repeated use without re-scanning.
-- CREATE TABLE analytics_XXXXXXXXX.ml_features CLUSTER BY user_pseudo_id AS
SELECT
  user_pseudo_id,
  COUNT(DISTINCT (SELECT value.int_value FROM UNNEST(event_params)
                  WHERE key = 'ga_session_id')) AS session_count,
  ANY_VALUE(device.category)                    AS device_category,
  ANY_VALUE(traffic_source.medium)              AS traffic_medium,
  MAX((SELECT value.int_value FROM UNNEST(event_params)
       WHERE key = 'engagement_time_msec'))     AS max_engagement_ms,
  COUNTIF(event_name = 'view_item')             AS view_item_count,
  COUNTIF(event_name = 'add_to_cart')           AS add_to_cart_count,
  COUNTIF(event_name = 'begin_checkout')        AS begin_checkout_count,
  MAX(IF(event_name='purchase', 1, 0))          AS did_purchase,
  ROUND(SUM(ecommerce.purchase_revenue_in_usd), 2) AS total_revenue
FROM `analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031'
GROUP BY 1;
