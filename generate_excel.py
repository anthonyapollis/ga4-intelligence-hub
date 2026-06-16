"""
GA4 Intelligence Hub — Professional Excel Report Generator
==========================================================
Generates a fully formatted, chart-rich Excel workbook.

Sheets:
  1. Dashboard        — KPI summary cards + YoY growth
  2. Transactions     — 40 sample orders + conditional formatting + chart
  3. Event Summary    — 25 GA4 events + bar chart
  4. Monthly Revenue  — 36-month trend + line chart
  5. Funnel Analysis  — 6-step checkout funnel + chart + drop-rate heatmap
  6. ML Models        — 3 model results + LTV tiers + feature importance chart
  7. Traffic & Audience — Source/medium/country/device breakdown
  8. BigQuery Queries — 10 production queries reference

Run: python generate_excel.py
Output: GA4_Intelligence_Hub_Professional.xlsx
"""

import openpyxl
from openpyxl.styles import (
    Font, PatternFill, Alignment, Border, Side, GradientFill
)
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, LineChart, PieChart, Reference
from openpyxl.chart.series import DataPoint
from openpyxl.chart.label import DataLabelList
from openpyxl.formatting.rule import ColorScaleRule, CellIsRule, FormulaRule
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.drawing.image import Image as XLImage
import copy

# ─── COLOUR PALETTE ──────────────────────────────────────────────────────────
C_NAVY      = "0F172A"
C_BLUE_DK   = "1D4ED8"
C_BLUE      = "2563EB"
C_BLUE_LT   = "DBEAFE"
C_BLUE_XLT  = "EFF6FF"
C_VIOLET    = "7C3AED"
C_VIOLET_LT = "EDE9FE"
C_GREEN     = "059669"
C_GREEN_LT  = "D1FAE5"
C_GOLD      = "D97706"
C_GOLD_LT   = "FEF3C7"
C_RED       = "DC2626"
C_RED_LT    = "FEE2E2"
C_TEAL      = "0D9488"
C_TEAL_LT   = "CCFBF1"
C_MUTED     = "64748B"
C_LINE      = "E2E8F0"
C_BG        = "F8FAFC"
C_WHITE     = "FFFFFF"

# ─── STYLE HELPERS ───────────────────────────────────────────────────────────
def fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)

def font(bold=False, size=11, color="0F172A", italic=False, name="Calibri"):
    return Font(bold=bold, size=size, color=color, italic=italic, name=name)

def align(h="left", v="center", wrap=False):
    return Alignment(horizontal=h, vertical=v, wrap_text=wrap)

def thin_border(top=True, bottom=True, left=False, right=False):
    s = Side(style="thin", color=C_LINE)
    return Border(
        top=s if top else None,
        bottom=s if bottom else None,
        left=s if left else None,
        right=s if right else None,
    )

def header_style(ws, row, cols, bg=C_NAVY, fg=C_WHITE, size=11):
    for col in cols:
        c = ws.cell(row=row, column=col)
        c.fill = fill(bg)
        c.font = font(bold=True, size=size, color=fg)
        c.alignment = align("center")
        c.border = thin_border()

def set_col_widths(ws, widths: dict):
    for col_letter, w in widths.items():
        ws.column_dimensions[col_letter].width = w

def section_header(ws, row, col, text, bg=C_BLUE, fg=C_WHITE, merge_to=None):
    c = ws.cell(row=row, column=col, value=text)
    c.fill = fill(bg)
    c.font = font(bold=True, size=11, color=fg)
    c.alignment = align("left", "center")
    c.border = thin_border()
    if merge_to:
        ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=merge_to)

def data_cell(ws, row, col, value, bold=False, bg=None, fg=C_NAVY,
              num_fmt=None, h="left", wrap=False):
    c = ws.cell(row=row, column=col, value=value)
    c.font = font(bold=bold, size=10, color=fg)
    c.alignment = align(h, "center", wrap)
    c.border = thin_border()
    if bg:
        c.fill = fill(bg)
    if num_fmt:
        c.number_format = num_fmt
    return c

def badge_cell(ws, row, col, text, bg, fg):
    c = ws.cell(row=row, column=col, value=text)
    c.fill = fill(bg)
    c.font = font(bold=True, size=10, color=fg)
    c.alignment = align("center")
    c.border = thin_border()

def kpi_block(ws, row, col, label, value, sub="", bg=C_BLUE_XLT, accent=C_BLUE):
    ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col+1)
    ws.merge_cells(start_row=row+1, start_column=col, end_row=row+1, end_column=col+1)
    ws.merge_cells(start_row=row+2, start_column=col, end_row=row+2, end_column=col+1)
    top = ws.cell(row=row, column=col, value=label.upper())
    top.fill = fill(accent); top.font = font(bold=True, size=9, color=C_WHITE)
    top.alignment = align("center")
    mid = ws.cell(row=row+1, column=col, value=value)
    mid.fill = fill(bg); mid.font = font(bold=True, size=18, color=accent)
    mid.alignment = align("center")
    btm = ws.cell(row=row+2, column=col, value=sub)
    btm.fill = fill(bg); btm.font = font(size=9, color=C_MUTED, italic=True)
    btm.alignment = align("center")

# ─── DATA ────────────────────────────────────────────────────────────────────
TRANSACTIONS = [
    ("GMS-20201101-001","2020-11-01","new","google","organic","desktop","India",2,68.00,6.80,0.00,"Bronze",0.72),
    ("GMS-20201101-002","2020-11-01","returning","(direct)","(none)","mobile","United States",1,24.00,2.40,4.99,"Bronze",0.58),
    ("GMS-20201101-003","2020-11-01","new","google","organic","desktop","United States",3,112.50,11.25,0.00,"Gold",0.84),
    ("GMS-20201103-001","2020-11-03","new","google","cpc","desktop","United States",1,28.00,2.80,4.99,"Bronze",0.42),
    ("GMS-20201107-001","2020-11-07","returning","(direct)","(none)","desktop","Ireland",2,56.00,5.60,0.00,"Silver",0.71),
    ("GMS-20201108-001","2020-11-08","new","google","cpc","desktop","Canada",2,54.99,5.50,7.99,"Silver",0.67),
    ("GMS-20201112-001","2020-11-12","new","bing","organic","mobile","United Kingdom",1,22.00,2.20,6.99,"Bronze",0.33),
    ("GMS-20201115-001","2020-11-15","returning","google","organic","desktop","Ireland",4,143.96,14.40,0.00,"Gold",0.91),
    ("GMS-20201115-002","2020-11-15","new","youtube.com","referral","mobile","United Kingdom",1,32.00,3.20,0.00,"Bronze",0.43),
    ("GMS-20201201-001","2020-12-01","new","google","organic","desktop","Japan",2,79.98,8.00,12.99,"Silver",0.62),
    ("GMS-20201210-001","2020-12-10","returning","newsletter","email","desktop","Canada",5,196.95,19.70,0.00,"Platinum",0.95),
    ("GMS-20201215-001","2020-12-15","new","google","organic","mobile","United States",3,87.97,8.80,0.00,"Silver",0.76),
    ("GMS-20201215-002","2020-12-15","returning","google","cpc","desktop","United States",2,59.98,6.00,0.00,"Silver",0.82),
    ("GMS-20201220-001","2020-12-20","new","google","organic","desktop","Singapore",1,35.00,3.50,9.99,"Bronze",0.55),
    ("GMS-20201224-001","2020-12-24","returning","(direct)","(none)","desktop","Ireland",6,242.94,24.29,0.00,"Platinum",0.97),
    ("GMS-20201226-001","2020-12-26","new","google","organic","mobile","Canada",2,47.98,4.80,4.99,"Bronze",0.49),
    ("GMS-20201231-001","2020-12-31","returning","google","organic","desktop","United States",4,149.96,15.00,0.00,"Gold",0.88),
    ("GMS-20210101-001","2021-01-01","new","google","organic","mobile","India",1,22.00,2.20,3.99,"Bronze",0.38),
    ("GMS-20210108-001","2021-01-08","returning","google","organic","desktop","United States",3,94.97,9.50,0.00,"Gold",0.79),
    ("GMS-20210115-001","2021-01-15","new","bing","organic","desktop","United Kingdom",2,62.00,6.20,5.99,"Silver",0.61),
    ("GMS-20210120-001","2021-01-20","returning","mail.google.com","referral","desktop","Ireland",4,167.96,16.80,0.00,"Platinum",0.93),
    ("GMS-20210125-001","2021-01-25","new","google","organic","mobile","France",1,28.00,2.80,6.99,"Bronze",0.44),
    ("GMS-20210131-001","2021-01-31","returning","google","organic","desktop","Canada",3,107.97,10.80,0.00,"Gold",0.86),
    ("GMS-20210130-001","2021-01-30","new","google","cpc","mobile","Australia",2,46.00,4.60,8.99,"Bronze",0.51),
    ("GMS-20210205-001","2021-02-05","returning","newsletter","email","desktop","Ireland",3,131.97,13.20,0.00,"Gold",0.89),
    ("GMS-20210214-001","2021-02-14","new","google","organic","desktop","United States",2,58.00,5.80,0.00,"Silver",0.66),
    ("GMS-20210301-001","2021-03-01","new","facebook.com","referral","mobile","United Kingdom",1,19.99,2.00,6.99,"Bronze",0.29),
    ("GMS-20210315-001","2021-03-15","returning","google","organic","desktop","Canada",4,159.96,16.00,0.00,"Gold",0.92),
    ("GMS-20210401-001","2021-04-01","new","google","cpc","desktop","United States",2,64.98,6.50,0.00,"Silver",0.68),
    ("GMS-20210501-001","2021-05-01","returning","(direct)","(none)","desktop","Ireland",5,212.95,21.30,0.00,"Platinum",0.96),
    ("GMS-20210601-001","2021-06-01","new","google","organic","mobile","India",1,18.00,1.80,4.99,"Bronze",0.35),
    ("GMS-20210701-001","2021-07-01","returning","newsletter","email","desktop","United States",3,112.47,11.25,0.00,"Gold",0.87),
    ("GMS-20210801-001","2021-08-01","new","google","organic","desktop","Germany",2,76.98,7.70,9.99,"Silver",0.64),
    ("GMS-20210901-001","2021-09-01","returning","google","cpc","desktop","Canada",4,168.96,16.90,0.00,"Gold",0.91),
    ("GMS-20211001-001","2021-10-01","new","bing","organic","desktop","United States",1,29.99,3.00,4.99,"Bronze",0.47),
    ("GMS-20211101-001","2021-11-01","returning","(direct)","(none)","desktop","Ireland",6,251.94,25.19,0.00,"Platinum",0.98),
    ("GMS-20211201-001","2021-12-01","new","google","organic","mobile","Australia",2,52.98,5.30,6.99,"Bronze",0.53),
    ("GMS-20211215-001","2021-12-15","returning","newsletter","email","desktop","United States",4,183.96,18.40,0.00,"Platinum",0.94),
    ("GMS-20211224-001","2021-12-24","new","google","organic","desktop","United Kingdom",3,89.97,9.00,0.00,"Silver",0.73),
    ("GMS-20211231-001","2021-12-31","returning","google","cpc","desktop","Canada",2,54.98,5.50,0.00,"Silver",0.78),
]

EVENTS = [
    ("page_view",4153080,"Auto-collected","All pages"),
    ("user_engagement",2076444,"Auto-collected","Engaged sessions"),
    ("session_start",1891200,"Auto-collected","All sessions"),
    ("scroll",1246392,"Enhanced Measurement","90% depth"),
    ("view_item",561840,"Enhanced Ecommerce","Product detail"),
    ("view_item_list",422640,"Enhanced Ecommerce","Category/search grid"),
    ("first_visit",386520,"Auto-collected","New users"),
    ("view_promotion",282040,"Enhanced Ecommerce","Banner impressions"),
    ("add_to_cart",134880,"Enhanced Ecommerce","Cart intent"),
    ("view_search_results",98040,"Custom","Site search"),
    ("begin_checkout",101100,"Enhanced Ecommerce","Checkout start"),
    ("select_item",91080,"Enhanced Ecommerce","Product click"),
    ("add_shipping_info",73120,"Enhanced Ecommerce","Shipping step"),
    ("add_payment_info",56170,"Enhanced Ecommerce","Payment step"),
    ("select_content",49920,"Custom","Non-product clicks"),
    ("purchase",34890,"Enhanced Ecommerce","Completed orders"),
    ("login",28560,"Custom","Authentication"),
    ("video_start",21840,"Enhanced Measurement","Video plays"),
    ("view_cart",18480,"Enhanced Ecommerce","Cart review"),
    ("video_progress",16380,"Enhanced Measurement","Video milestones"),
    ("file_download",14280,"Enhanced Measurement","PDF downloads"),
    ("video_complete",11760,"Enhanced Measurement","Full video watch"),
    ("share",8820,"Custom","Social sharing"),
    ("sign_up",7140,"Custom","Account creation"),
    ("remove_from_cart",4200,"Enhanced Ecommerce","Cart removal"),
]

MONTHLY_REVENUE = [
    (2020,"Nov",18240,14320,714,25.55),
    (2020,"Dec",47120,37020,1844,25.55),
    (2021,"Jan",22890,17990,896,25.55),
    (2021,"Feb",19650,15440,769,25.55),
    (2021,"Mar",23410,18390,916,25.55),
    (2021,"Apr",21780,17110,852,25.55),
    (2021,"May",24560,19300,961,25.55),
    (2021,"Jun",22340,17550,874,25.55),
    (2021,"Jul",20980,16480,821,25.55),
    (2021,"Aug",25670,20160,1004,25.55),
    (2021,"Sep",23890,18770,935,25.55),
    (2021,"Oct",22110,17380,865,25.55),
    (2021,"Nov",28290,22220,1107,25.55),
    (2021,"Dec",73060,57380,2859,25.55),
    (2022,"Jan",35480,27870,1388,25.55),
    (2022,"Feb",30450,23920,1191,25.55),
    (2022,"Mar",36270,28490,1419,25.55),
    (2022,"Apr",33740,26510,1320,25.55),
    (2022,"May",38070,29920,1490,25.55),
    (2022,"Jun",34630,27210,1355,25.55),
    (2022,"Jul",32520,25550,1272,25.55),
    (2022,"Aug",39790,31250,1557,25.55),
    (2022,"Sep",37030,29100,1449,25.55),
    (2022,"Oct",34280,26930,1341,25.55),
    (2022,"Nov",43850,34450,1715,25.55),
    (2022,"Dec",113240,88960,4430,25.55),
    (2023,"Jan",38140,29970,1493,25.55),
    (2023,"Feb",32740,25720,1281,25.55),
    (2023,"Mar",39000,30640,1526,25.55),
    (2023,"Apr",36270,28490,1419,25.55),
    (2023,"May",40940,32170,1602,25.55),
    (2023,"Jun",37240,29260,1457,25.55),
    (2023,"Jul",34960,27470,1368,25.55),
    (2023,"Aug",42780,33610,1674,25.55),
    (2023,"Sep",39830,31290,1558,25.55),
    (2023,"Oct",36860,28970,1442,25.55),
]

FUNNEL = [
    ("session_start","Sessions","1,891,200",1891200,None,None),
    ("view_item","Product Views","561,840",561840,70,"#EF4444"),
    ("add_to_cart","Add to Cart","134,880",134880,76,"#DC2626"),
    ("begin_checkout","Checkout Started","101,100",101100,25,"#F59E0B"),
    ("add_shipping_info","Shipping Added","73,120",73120,28,"#F59E0B"),
    ("add_payment_info","Payment Added","56,170",56170,23,"#F59E0B"),
    ("purchase","Purchase","34,890",34890,38,"#F97316"),
]

LTV_TIERS = [
    ("Platinum","3+ purchases · $150+ LTV",412,287.50,19.2,C_VIOLET,C_VIOLET_LT),
    ("Gold","2 purchases · $80–150 LTV",891,112.30,41.5,C_GOLD,"FEF3C7"),
    ("Silver","1 purchase · $30–80 LTV",2344,52.10,79.2,C_MUTED,"F1F5F9"),
    ("Bronze","1 purchase · <$30 LTV",1847,18.90,86.1,"92400E","FEF3C7"),
]

RISK_FACTORS = [
    ("Mobile device + payment step",31),
    ("Session duration < 90 seconds",24),
    ("No prior purchase history",18),
    ("First visit (first_visit=1)",14),
    ("Non-organic traffic source",8),
    ("Tablet device",5),
]

BQ_QUERIES = [
    ("Event Summary","Full 3-year event count and % breakdown","SELECT event_name, COUNT(*) AS event_count, ROUND(COUNT(*)*100.0/SUM(COUNT(*)) OVER(),2) AS pct FROM analytics_X.events_* WHERE _TABLE_SUFFIX BETWEEN '20201101' AND '20231031' GROUP BY 1 ORDER BY 2 DESC"),
    ("6-Step Funnel","Checkout funnel with step-to-step conversion rates","COUNTIF per funnel step in a WITH clause, then calculate step drops"),
    ("Traffic Attribution","Source/medium with revenue by session","UNNEST(event_params) to get ga_session_id, join with purchase revenue"),
    ("Product Revenue","Revenue by item_category via UNNEST(items[])","FROM events_*, UNNEST(items) AS item — GROUP BY item.item_category"),
    ("Consent Mode Audit","analytics_storage coverage by month","privacy_info.analytics_storage breakdown — should match CMP acceptance rate"),
    ("User LTV Cohorts","90-day LTV by acquisition channel","first_visit LEFT JOIN purchase revenue — GROUP BY acq_medium"),
    ("GTM Quality Check","Validate clean_event='gtm.js' on all custom events","UNNEST event_params WHERE key='clean_event' — missing = tag outside GTM"),
    ("YoY Revenue Growth","Monthly revenue comparison across 3 years","EXTRACT(YEAR), FORMAT_DATE month, SUM(purchase_revenue_in_usd)"),
    ("Device × Channel","Highest-value device+medium combinations for bid strategy","GROUP BY device.category, traffic_source.medium — ORDER BY revenue DESC"),
    ("ML Feature Extraction","Training feature table for all 3 ML models","session_count, engagement, view_item_count, add_to_cart_count, did_purchase — CLUSTER BY user_pseudo_id"),
]

TRAFFIC = [
    ("google","organic",512400,27.1,14280,312400),
    ("(direct)","(none)",283700,15.0,7840,172600),
    ("google","cpc",198500,10.5,5580,124800),
    ("newsletter","email",89200,4.7,3240,86400),
    ("bing","organic",67400,3.6,1820,41200),
    ("youtube.com","referral",48200,2.5,980,22400),
    ("facebook.com","referral",38600,2.0,720,16400),
    ("mail.google.com","referral",29800,1.6,680,18600),
]

COUNTRIES = [
    ("United States",582400,30.8,10840,245800),
    ("India",287600,15.2,4280,89200),
    ("United Kingdom",198400,10.5,3640,82600),
    ("Canada",168200,8.9,3120,70800),
    ("Ireland",124800,6.6,2980,82400),
    ("Australia",89400,4.7,1640,37200),
    ("Germany",67200,3.6,1240,28100),
    ("France",48600,2.6,890,20200),
    ("Japan",38400,2.0,710,16100),
    ("Singapore",28200,1.5,520,11800),
]


# ─── SHEET 1: DASHBOARD ──────────────────────────────────────────────────────
def build_dashboard(wb):
    ws = wb.active
    ws.title = "📊 Dashboard"
    ws.sheet_view.showGridLines = False
    ws.row_dimensions[1].height = 50
    ws.row_dimensions[2].height = 14
    set_col_widths(ws, {
        "A":2,"B":16,"C":16,"D":16,"E":16,"F":16,"G":16,"H":16,"I":2
    })

    # Title bar
    ws.merge_cells("B1:H1")
    t = ws["B1"]
    t.value = "GA4 Ecommerce Intelligence Hub  ·  Analytics Engineering Portfolio"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=16, color=C_WHITE)
    t.alignment = align("center")

    # Row 3 — section label
    ws.merge_cells("B3:H3")
    sl = ws["B3"]
    sl.value = "KEY PERFORMANCE INDICATORS  ·  2020-11-01 → 2023-10-31  ·  3 years"
    sl.fill = fill(C_BLUE); sl.font = font(bold=True, size=10, color=C_WHITE)
    sl.alignment = align("center")

    # KPI blocks (each 3 rows tall: rows 4-6, 7-9)
    kpi_data = [
        ("B",4,C_BLUE_XLT,C_BLUE,"Total Events","13,842,960","COUNT(*) from events_*"),
        ("D",4,C_VIOLET_LT,C_VIOLET,"Sessions","1,891,200","CONCAT(pseudo_id, session_id)"),
        ("F",4,C_GREEN_LT,C_GREEN,"Revenue","$891,480","SUM(purchase_revenue_in_usd)"),
        ("H",4,"FEF3C7",C_GOLD,"Transactions","34,890","Distinct transaction_id"),
        ("B",8,C_BLUE_XLT,C_BLUE,"Unique Users","743,800","COUNT(DISTINCT user_pseudo_id)"),
        ("D",8,C_VIOLET_LT,C_VIOLET,"Conv. Rate","1.84%","purchases ÷ sessions"),
        ("F",8,C_GREEN_LT,C_GREEN,"Avg. Order Value","$25.55","revenue ÷ transactions"),
        ("H",8,"FEF3C7",C_GOLD,"Event Types","25","GA4 + custom events"),
    ]
    for col_letter, start_row, bg, accent, label, value, sub in kpi_data:
        col = openpyxl.utils.column_index_from_string(col_letter)
        ws.row_dimensions[start_row].height = 18
        ws.row_dimensions[start_row+1].height = 30
        ws.row_dimensions[start_row+2].height = 16
        kpi_block(ws, start_row, col, label, value, sub, bg, accent)

    # YoY Growth section (rows 12–17)
    ws.row_dimensions[11].height = 8
    ws.merge_cells("B12:H12")
    s2 = ws["B12"]
    s2.value = "YEAR-OVER-YEAR GROWTH  ·  3-Year Trajectory"
    s2.fill = fill(C_TEAL); s2.font = font(bold=True, size=10, color=C_WHITE)
    s2.alignment = align("center")

    yoy_headers = ["","Year","Period","Revenue","Transactions","Growth","Sessions","AOV"]
    for ci, h in enumerate(yoy_headers, 2):
        c = ws.cell(row=13, column=ci, value=h)
        c.fill = fill(C_NAVY); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    ws.row_dimensions[13].height = 20

    yoy_rows = [
        ("Year 1","Nov 2020 – Oct 2021","$312,410","12,230","Baseline","892,400","$25.55",C_BG),
        ("Year 2","Nov 2021 – Oct 2022","$484,235","18,957","+55%  ▲","1,384,100","$25.55","E8F5E9"),
        ("Year 3","Nov 2022 – Oct 2023","$520,552","20,376","+7.5%  ▲","1,509,200","$25.55","E3F2FD"),
    ]
    for ri, (yr, period, rev, txn, growth, sess, aov, row_bg) in enumerate(yoy_rows, 14):
        ws.row_dimensions[ri].height = 22
        for ci, val in enumerate(["", yr, period, rev, txn, growth, sess, aov], 2):
            c = ws.cell(row=ri, column=ci, value=val)
            c.fill = fill(row_bg); c.alignment = align("center")
            c.border = thin_border()
            if ci == 2:
                c.font = font(bold=True, size=10, color=C_NAVY)
            elif ci == 7:
                c.font = font(bold=True, size=11,
                               color=C_GREEN if "▲" in val else C_NAVY)
            else:
                c.font = font(size=10, color=C_MUTED)

    # About section
    ws.row_dimensions[18].height = 8
    ws.merge_cells("B19:H19")
    ab = ws["B19"]
    ab.value = "ABOUT THIS WORKBOOK"
    ab.fill = fill(C_MUTED); ab.font = font(bold=True, size=10, color=C_WHITE)
    ab.alignment = align("center")

    desc = [
        ("📊 Dashboard","This sheet — KPIs, YoY growth"),
        ("📋 Transactions","40 sample orders with LTV tier, propensity score, and conditional formatting"),
        ("⚡ Event Summary","25 GA4 events with volume, category, % share, and bar chart"),
        ("📈 Monthly Revenue","36-month revenue trend with Chart.js line chart"),
        ("🔽 Funnel Analysis","6-step checkout funnel with drop rates and heatmap"),
        ("🤖 ML Models","3 scikit-learn models — Purchase Propensity, LTV, Cart Abandonment"),
        ("🌍 Traffic & Audience","Source/medium, country, and device breakdown"),
        ("🗄️ BigQuery Queries","10 production-ready query descriptions and SQL references"),
    ]
    for ri, (sheet, desc_text) in enumerate(desc, 20):
        ws.row_dimensions[ri].height = 18
        c1 = ws.cell(row=ri, column=2, value=sheet)
        c1.fill = fill(C_BLUE_XLT); c1.font = font(bold=True, size=10, color=C_BLUE)
        c1.alignment = align("left"); c1.border = thin_border()
        ws.merge_cells(start_row=ri, start_column=3, end_row=ri, end_column=8)
        c2 = ws.cell(row=ri, column=3, value=desc_text)
        c2.fill = fill(C_BG); c2.font = font(size=10, color=C_MUTED)
        c2.alignment = align("left"); c2.border = thin_border()

    ws.freeze_panes = "B4"


# ─── SHEET 2: TRANSACTIONS ───────────────────────────────────────────────────
def build_transactions(wb):
    ws = wb.create_sheet("📋 Transactions")
    ws.sheet_view.showGridLines = False

    TIER_COLORS = {"Platinum":(C_VIOLET,C_VIOLET_LT),"Gold":(C_GOLD,C_GOLD_LT),
                   "Silver":(C_MUTED,"F1F5F9"),"Bronze":("92400E","FEF3C7")}
    CUST_COLORS = {"new":(C_BLUE,C_BLUE_LT),"returning":(C_GREEN,C_GREEN_LT)}

    # Title
    ws.merge_cells("A1:M1")
    t = ws["A1"]
    t.value = "TRANSACTION LEDGER  ·  40 Sample Orders  ·  Nov 2020 – Dec 2021"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=13, color=C_WHITE)
    t.alignment = align("center"); ws.row_dimensions[1].height = 28

    headers = ["Transaction ID","Date","Customer","Source","Medium","Device",
               "Country","Items","Revenue","Tax","Shipping","LTV Tier","Propensity"]
    for ci, h in enumerate(headers, 1):
        c = ws.cell(row=2, column=ci, value=h)
        c.fill = fill(C_BLUE_DK); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    ws.row_dimensions[2].height = 20

    total_rev = total_tax = total_ship = total_items = 0
    for ri, tx in enumerate(TRANSACTIONS, 3):
        ws.row_dimensions[ri].height = 18
        bg = C_BG if ri % 2 == 0 else C_WHITE
        tid,dt,ctype,src,med,dev,country,items,rev,tax,ship,tier,prop = tx
        total_rev += rev; total_tax += tax; total_ship += ship; total_items += items

        for ci, val in enumerate([tid,dt,ctype,src,med,dev,country,items,rev,tax,ship,tier,prop], 1):
            c = ws.cell(row=ri, column=ci, value=val)
            c.fill = fill(bg); c.border = thin_border()
            c.alignment = align("center" if ci >= 8 else "left")

            if ci == 1:   c.font = font(bold=True, size=10, color=C_BLUE)
            elif ci == 3:
                fg, bg2 = CUST_COLORS.get(val,(C_MUTED,C_BG))
                c.fill = fill(bg2); c.font = font(bold=True, size=9, color=fg)
            elif ci in (9,10,11):
                c.number_format = '"$"#,##0.00'; c.font = font(size=10, color=C_NAVY, bold=(ci==9))
            elif ci == 8:
                c.number_format = "#,##0"; c.font = font(size=10, color=C_NAVY)
            elif ci == 12:
                fg2, bg3 = TIER_COLORS.get(val,(C_MUTED,C_BG))
                c.fill = fill(bg3); c.font = font(bold=True, size=9, color=fg2)
            elif ci == 13:
                pcolor = C_GREEN if prop>0.7 else (C_GOLD if prop>0.4 else C_RED)
                c.font = font(bold=True, size=10, color=pcolor)
                c.number_format = "0.00"
            else:
                c.font = font(size=10, color=C_MUTED)

    # Totals row
    tr = len(TRANSACTIONS) + 3
    ws.row_dimensions[tr].height = 22
    vals = ["TOTALS","","","","","","",total_items,total_rev,total_tax,total_ship,"",""]
    for ci, val in enumerate(vals, 1):
        c = ws.cell(row=tr, column=ci, value=val)
        c.fill = fill(C_NAVY); c.border = thin_border()
        c.alignment = align("center")
        c.font = font(bold=True, size=10, color=C_WHITE)
        if ci in (9,10,11) and val: c.number_format = '"$"#,##0.00'
        if ci == 8 and val: c.number_format = "#,##0"

    set_col_widths(ws,{"A":22,"B":12,"C":11,"D":18,"E":11,"F":9,
                        "G":16,"H":7,"I":10,"J":9,"K":10,"L":10,"M":11})

    # Propensity conditional formatting
    from openpyxl.formatting.rule import ColorScaleRule
    ws.conditional_formatting.add(
        f"M3:M{len(TRANSACTIONS)+2}",
        ColorScaleRule(start_type='num', start_value=0, start_color='FEE2E2',
                       mid_type='num',   mid_value=0.5,  mid_color='FEF3C7',
                       end_type='num',   end_value=1,    end_color='D1FAE5')
    )

    # Revenue bar chart
    chart = BarChart()
    chart.type = "bar"; chart.grouping = "clustered"
    chart.title = "Revenue by Transaction (Top 20)"
    chart.y_axis.title = "Revenue (USD)"; chart.x_axis.title = "Transaction"
    chart.style = 10; chart.width = 24; chart.height = 12
    data = Reference(ws, min_col=9, min_row=2, max_row=22)
    cats = Reference(ws, min_col=1, min_row=3, max_row=22)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.series[0].graphicalProperties.solidFill = C_BLUE
    ws.add_chart(chart, "O3")
    ws.freeze_panes = "A3"


# ─── SHEET 3: EVENT SUMMARY ──────────────────────────────────────────────────
def build_events(wb):
    ws = wb.create_sheet("⚡ Event Summary")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:F1")
    t = ws["A1"]
    t.value = "GA4 EVENT SUMMARY  ·  25 Event Types  ·  13,842,960 Total Events  ·  2020–2023"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=13, color=C_WHITE)
    t.alignment = align("center"); ws.row_dimensions[1].height = 28

    CAT_COLORS = {
        "Auto-collected":(C_BLUE,C_BLUE_LT),
        "Enhanced Measurement":(C_GREEN,C_GREEN_LT),
        "Enhanced Ecommerce":(C_VIOLET,C_VIOLET_LT),
        "Custom":(C_GOLD,C_GOLD_LT),
    }
    headers = ["Event Name","Count","% of Total","Category","Confirmed in BigQuery","Use Case"]
    for ci, h in enumerate(headers, 1):
        c = ws.cell(row=2, column=ci, value=h)
        c.fill = fill(C_BLUE_DK); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    ws.row_dimensions[2].height = 20

    total = sum(e[1] for e in EVENTS)
    for ri, (name, count, cat, use) in enumerate(EVENTS, 3):
        ws.row_dimensions[ri].height = 18
        bg = C_BG if ri % 2 == 0 else C_WHITE
        pct = round(count/total*100, 2)
        fg_cat, bg_cat = CAT_COLORS.get(cat,(C_MUTED,C_BG))

        data_cell(ws, ri, 1, name, bold=True, bg=bg, fg=C_BLUE)
        data_cell(ws, ri, 2, count, bg=bg, fg=C_NAVY, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 3, pct/100, bg=bg, fg=C_MUTED, num_fmt="0.00%", h="right")
        c = ws.cell(row=ri, column=4, value=cat)
        c.fill = fill(bg_cat); c.font = font(bold=True, size=9, color=fg_cat)
        c.alignment = align("center"); c.border = thin_border()
        data_cell(ws, ri, 5, "✓ Yes", bg=bg, fg=C_GREEN, h="center")
        data_cell(ws, ri, 6, use, bg=bg, fg=C_MUTED, wrap=True)

    set_col_widths(ws,{"A":26,"B":14,"C":12,"D":22,"E":18,"F":24})

    # Bar chart
    chart = BarChart()
    chart.type = "bar"; chart.title = "Event Volume by Type (Top 15)"
    chart.y_axis.title = "Count"; chart.style = 10
    chart.width = 22; chart.height = 14
    data = Reference(ws, min_col=2, min_row=2, max_row=17)
    cats = Reference(ws, min_col=1, min_row=3, max_row=17)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.series[0].graphicalProperties.solidFill = C_VIOLET
    ws.add_chart(chart, "H3")
    ws.freeze_panes = "A3"


# ─── SHEET 4: MONTHLY REVENUE ────────────────────────────────────────────────
def build_monthly_revenue(wb):
    ws = wb.create_sheet("📈 Monthly Revenue")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:G1")
    t = ws["A1"]
    t.value = "MONTHLY REVENUE TREND  ·  36 Months  ·  Nov 2020 – Oct 2023"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=13, color=C_WHITE)
    t.alignment = align("center"); ws.row_dimensions[1].height = 28

    headers = ["#","Year","Month","Revenue","Sessions","Transactions","AOV"]
    for ci, h in enumerate(headers, 1):
        c = ws.cell(row=2, column=ci, value=h)
        c.fill = fill(C_BLUE_DK); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    ws.row_dimensions[2].height = 20

    YEAR_COLORS = {2020:"EFF6FF", 2021:"F0FDF4", 2022:"FFF7ED", 2023:"FAF5FF"}
    for ri, (yr, mn, rev, sess, txn, aov) in enumerate(MONTHLY_REVENUE, 3):
        ws.row_dimensions[ri].height = 18
        bg = YEAR_COLORS.get(yr, C_WHITE)
        data_cell(ws, ri, 1, ri-2, bg=bg, fg=C_MUTED, h="center")
        data_cell(ws, ri, 2, yr, bold=True, bg=bg, fg=C_NAVY, h="center")
        data_cell(ws, ri, 3, mn, bg=bg, fg=C_MUTED)
        data_cell(ws, ri, 4, rev, bg=bg, fg=C_NAVY, bold=True, num_fmt='"$"#,##0', h="right")
        data_cell(ws, ri, 5, sess, bg=bg, fg=C_MUTED, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 6, txn, bg=bg, fg=C_MUTED, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 7, aov, bg=bg, fg=C_MUTED, num_fmt='"$"#,##0.00', h="right")

    set_col_widths(ws,{"A":5,"B":8,"C":10,"D":14,"E":14,"F":14,"G":12})

    # Line chart
    chart = LineChart()
    chart.title = "Monthly Revenue — 3-Year Trend (Nov 2020 – Oct 2023)"
    chart.y_axis.title = "Revenue (USD)"; chart.x_axis.title = "Month"
    chart.style = 10; chart.width = 26; chart.height = 14
    data = Reference(ws, min_col=4, min_row=2, max_row=38)
    cats = Reference(ws, min_col=3, min_row=3, max_row=38)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.series[0].graphicalProperties.line.solidFill = C_BLUE
    chart.series[0].graphicalProperties.line.width = 20000
    chart.series[0].smooth = True
    ws.add_chart(chart, "I3")
    ws.freeze_panes = "A3"


# ─── SHEET 5: FUNNEL ANALYSIS ────────────────────────────────────────────────
def build_funnel(wb):
    ws = wb.create_sheet("🔽 Funnel Analysis")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:G1")
    t = ws["A1"]
    t.value = "ECOMMERCE FUNNEL ANALYSIS  ·  6-Step Checkout  ·  3-Year Aggregate"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=13, color=C_WHITE)
    t.alignment = align("center"); ws.row_dimensions[1].height = 28

    headers = ["Step","Event Name","Label","Count","% of Sessions","Drop Rate","Drop Severity"]
    for ci, h in enumerate(headers, 1):
        c = ws.cell(row=2, column=ci, value=h)
        c.fill = fill(C_BLUE_DK); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    ws.row_dimensions[2].height = 20

    sessions = 1891200
    for ri, (event, label, count_str, count, drop, drop_color) in enumerate(FUNNEL, 3):
        ws.row_dimensions[ri].height = 26
        pct = count/sessions
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, ri-2, bg=bg, fg=C_MUTED, h="center")
        data_cell(ws, ri, 2, event, bold=True, bg=bg, fg=C_BLUE)
        data_cell(ws, ri, 3, label, bg=bg, fg=C_MUTED)
        data_cell(ws, ri, 4, count, bg=bg, fg=C_NAVY, bold=True, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 5, pct, bg=bg, fg=C_MUTED, num_fmt="0.0%", h="right")
        if drop:
            sev = "Critical >60%" if drop>60 else ("High 30-60%" if drop>30 else "Moderate")
            sev_bg = C_RED_LT if drop>60 else (C_GOLD_LT if drop>30 else C_GREEN_LT)
            sev_fg = C_RED if drop>60 else (C_GOLD if drop>30 else C_GREEN)
            c6 = ws.cell(row=ri, column=6, value=drop/100)
            c6.fill = fill(bg); c6.font = font(bold=True, size=10, color=sev_fg)
            c6.alignment = align("right"); c6.border = thin_border()
            c6.number_format = "0%"
            badge_cell(ws, ri, 7, sev, sev_bg, sev_fg)
        else:
            data_cell(ws, ri, 6, "—", bg=bg, fg=C_MUTED, h="center")
            data_cell(ws, ri, 7, "Baseline", bg=C_BLUE_LT, fg=C_BLUE, h="center")

    # Insight rows
    ws.row_dimensions[11].height = 10
    insights = [
        ("💡 Biggest Opportunity:",C_GOLD_LT,C_GOLD,
         "view_item → add_to_cart (76% drop). Only 24% of product viewers add to cart. Fix: show reviews above fold, display shipping cost upfront, add product comparison."),
        ("💡 ML Intervention Point:",C_VIOLET_LT,C_VIOLET,
         "Cart abandonment model scores each session at begin_checkout. Score > 0.7 → trigger exit-intent popup + CRM email sequence + RLSA bid +35%."),
        ("💡 Dec Revenue Spike:",C_BLUE_LT,C_BLUE,
         "December accounts for 17-19% of annual revenue. GTM should have seasonal tag configurations ready by Nov 15 each year."),
    ]
    for ri2, (label, bg, fg, insight_text) in enumerate(insights, 12):
        ws.row_dimensions[ri2].height = 36
        c = ws.cell(row=ri2, column=1, value=label)
        c.fill = fill(bg); c.font = font(bold=True, size=10, color=fg)
        c.alignment = align("left","center"); c.border = thin_border()
        ws.merge_cells(start_row=ri2, start_column=2, end_row=ri2, end_column=7)
        c2 = ws.cell(row=ri2, column=2, value=insight_text)
        c2.fill = fill(bg); c2.font = font(size=10, color=C_MUTED, italic=True)
        c2.alignment = align("left","center",wrap=True); c2.border = thin_border()

    set_col_widths(ws,{"A":6,"B":24,"C":20,"D":14,"E":14,"F":12,"G":18})

    # Funnel chart
    chart = BarChart()
    chart.type = "bar"; chart.title = "Checkout Funnel — Step Volumes"
    chart.y_axis.title = "Users"; chart.style = 10
    chart.width = 22; chart.height = 12
    data = Reference(ws, min_col=4, min_row=2, max_row=9)
    cats = Reference(ws, min_col=3, min_row=3, max_row=9)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.series[0].graphicalProperties.solidFill = C_BLUE
    ws.add_chart(chart, "I3")
    ws.freeze_panes = "A3"


# ─── SHEET 6: ML MODELS ──────────────────────────────────────────────────────
def build_ml(wb):
    ws = wb.create_sheet("🤖 ML Models")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:H1")
    t = ws["A1"]
    t.value = "MACHINE LEARNING MODELS  ·  3 scikit-learn Models  ·  Trained on GA4 BigQuery Features"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=13, color=C_WHITE)
    t.alignment = align("center"); ws.row_dimensions[1].height = 28

    # Model summary table
    section_header(ws, 2, 1, "MODEL SUMMARY", C_VIOLET, merge_to=8)
    ws.row_dimensions[2].height = 20
    m_headers = ["Model","Algorithm","Target","Metric","Score","Precision","Recall","Training Rows"]
    for ci, h in enumerate(m_headers, 1):
        c = ws.cell(row=3, column=ci, value=h)
        c.fill = fill(C_VIOLET); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    models = [
        ("Purchase Propensity","Logistic Regression (class_weight=balanced)","Will user purchase?","AUC",0.7824,0.20,0.83,80000,C_GREEN_LT,C_GREEN),
        ("LTV Prediction","Random Forest Regressor (200 trees, depth 8)","90-day revenue (USD)","R²",0.9508,"MAE $8.59","RMSE $11.61",7215,C_BLUE_LT,C_BLUE),
        ("Cart Abandonment","Gradient Boosting (200 est, lr=0.08)","Will user abandon cart?","AUC",0.7361,0.84,0.99,11791,C_RED_LT,C_RED),
    ]
    for ri, (name, algo, target, metric, score, prec, rec, rows, bg, fg) in enumerate(models, 4):
        ws.row_dimensions[ri].height = 22
        vals = [name, algo, target, metric, score, prec, rec, rows]
        for ci, val in enumerate(vals, 1):
            c = ws.cell(row=ri, column=ci, value=val)
            c.fill = fill(bg); c.border = thin_border()
            c.alignment = align("center" if ci >= 4 else "left")
            c.font = font(bold=(ci in (1,5)), size=10,
                          color=fg if ci==5 else (C_NAVY if ci==1 else C_MUTED))
            if ci == 5: c.number_format = "0.00"
            if ci == 8: c.number_format = "#,##0"

    # LTV Tiers
    ws.row_dimensions[8].height = 10
    section_header(ws, 9, 1, "LTV TIER DISTRIBUTION  ·  Model 2: Random Forest  ·  2,147 Purchasers", C_BLUE, merge_to=6)
    ws.row_dimensions[9].height = 20
    t_headers = ["Tier","Criteria","Customers","Avg LTV","% Retained","Recommendation"]
    for ci, h in enumerate(t_headers, 1):
        c = ws.cell(row=10, column=ci, value=h)
        c.fill = fill(C_BLUE_DK); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    for ri, (tier, criteria, customers, avg_ltv, pct_ret, fg, bg) in enumerate(LTV_TIERS, 11):
        ws.row_dimensions[ri].height = 20
        vals = [tier, criteria, customers, avg_ltv, pct_ret/100,
                "VIP + lookalike seeding" if tier=="Platinum" else
                "Loyalty nudge → upsell" if tier=="Gold" else
                "Repurchase email series" if tier=="Silver" else "Win-back campaign"]
        for ci, val in enumerate(vals, 1):
            c = ws.cell(row=ri, column=ci, value=val)
            c.fill = fill(bg); c.border = thin_border()
            c.alignment = align("center" if ci >= 3 else "left")
            c.font = font(bold=(ci==1), size=10, color=fg if ci==1 else C_MUTED)
            if ci == 4: c.number_format = '"$"#,##0.00'
            if ci == 5: c.number_format = "0.0%"

    # Feature importance
    ws.row_dimensions[16].height = 10
    section_header(ws, 17, 1, "FEATURE IMPORTANCE  ·  Model 3: Cart Abandonment (Gradient Boosting)", C_RED, merge_to=4)
    ws.row_dimensions[17].height = 20
    fi_headers = ["Risk Factor","Importance %","Action","Priority"]
    for ci, h in enumerate(fi_headers, 1):
        c = ws.cell(row=18, column=ci, value=h)
        c.fill = fill(C_RED); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    fi_actions = [
        "Simplify mobile payment UI; add Apple Pay / Google Pay",
        "Trigger exit-intent popup after 60s for short sessions",
        "Show trust badges and money-back guarantee prominently",
        "Add 'Save cart' option for first-time visitors",
        "Audit paid landing pages for offer/intent alignment",
        "Optimise tablet checkout — same as mobile fixes",
    ]
    fi_priorities = ["Critical","High","High","Medium","Medium","Low"]
    fi_priority_colors = [C_RED_LT,C_GOLD_LT,C_GOLD_LT,"E0F2FE","E0F2FE",C_GREEN_LT]
    fi_priority_fg = [C_RED,C_GOLD,C_GOLD,C_TEAL,C_TEAL,C_GREEN]
    for ri, ((factor, imp), action, prio, pbg, pfg) in enumerate(
            zip(RISK_FACTORS, fi_actions, fi_priorities, fi_priority_colors, fi_priority_fg), 19):
        ws.row_dimensions[ri].height = 20
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, factor, bg=bg, fg=C_MUTED)
        c2 = ws.cell(row=ri, column=2, value=imp/100)
        c2.fill = fill(bg); c2.font = font(bold=True, size=10, color=C_RED)
        c2.alignment = align("center"); c2.border = thin_border(); c2.number_format = "0%"
        data_cell(ws, ri, 3, action, bg=bg, fg=C_MUTED, wrap=True)
        badge_cell(ws, ri, 4, prio, pbg, pfg)

    set_col_widths(ws,{"A":26,"B":22,"C":28,"D":14,"E":14,"F":14,"G":14,"H":14})

    # Feature importance chart
    chart = BarChart()
    chart.type = "bar"; chart.title = "Cart Abandonment — Feature Importance"
    chart.y_axis.title = "Importance %"; chart.style = 10
    chart.width = 20; chart.height = 12
    data = Reference(ws, min_col=2, min_row=18, max_row=24)
    cats = Reference(ws, min_col=1, min_row=19, max_row=24)
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.series[0].graphicalProperties.solidFill = C_RED
    ws.add_chart(chart, "F3")
    ws.freeze_panes = "A3"


# ─── SHEET 7: TRAFFIC & AUDIENCE ─────────────────────────────────────────────
def build_traffic(wb):
    ws = wb.create_sheet("🌍 Traffic & Audience")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:H1")
    t = ws["A1"]
    t.value = "TRAFFIC & AUDIENCE INTELLIGENCE  ·  743,800 Users  ·  1,891,200 Sessions  ·  3 Years"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=13, color=C_WHITE)
    t.alignment = align("center"); ws.row_dimensions[1].height = 28

    # Source/Medium
    section_header(ws, 2, 1, "TOP TRAFFIC SOURCES  ·  Sessions + Revenue", C_TEAL, merge_to=6)
    ws.row_dimensions[2].height = 20
    s_headers = ["Source","Medium","Sessions","% of Total","Transactions","Revenue"]
    for ci, h in enumerate(s_headers, 1):
        c = ws.cell(row=3, column=ci, value=h)
        c.fill = fill(C_TEAL); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    total_sessions = sum(r[2] for r in TRAFFIC)
    for ri, (src, med, sess, pct, txn, rev) in enumerate(TRAFFIC, 4):
        ws.row_dimensions[ri].height = 20
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, src, bold=True, bg=bg, fg=C_BLUE)
        data_cell(ws, ri, 2, med, bg=bg, fg=C_MUTED)
        data_cell(ws, ri, 3, sess, bg=bg, fg=C_NAVY, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 4, pct/100, bg=bg, fg=C_MUTED, num_fmt="0.0%", h="right")
        data_cell(ws, ri, 5, txn, bg=bg, fg=C_MUTED, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 6, rev, bg=bg, fg=C_NAVY, bold=True, num_fmt='"$"#,##0', h="right")

    # Countries
    ws.row_dimensions[13].height = 10
    section_header(ws, 14, 1, "TOP COUNTRIES  ·  Sessions + Revenue", C_BLUE, merge_to=5)
    ws.row_dimensions[14].height = 20
    c_headers = ["Country","Sessions","% of Total","Transactions","Revenue"]
    for ci, h in enumerate(c_headers, 1):
        c = ws.cell(row=15, column=ci, value=h)
        c.fill = fill(C_BLUE_DK); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    for ri, (country, sess, pct, txn, rev) in enumerate(COUNTRIES, 16):
        ws.row_dimensions[ri].height = 18
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, country, bold=(country=="United States"), bg=bg, fg=C_NAVY)
        data_cell(ws, ri, 2, sess, bg=bg, fg=C_MUTED, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 3, pct/100, bg=bg, fg=C_MUTED, num_fmt="0.0%", h="right")
        data_cell(ws, ri, 4, txn, bg=bg, fg=C_MUTED, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 5, rev, bg=bg, fg=C_NAVY, bold=True, num_fmt='"$"#,##0', h="right")

    # Device breakdown
    ws.row_dimensions[27].height = 10
    section_header(ws, 28, 1, "DEVICE BREAKDOWN  ·  Conversion Rate Intelligence", C_VIOLET, merge_to=6)
    ws.row_dimensions[28].height = 20
    d_headers = ["Device","Sessions","Purchases","Conv. Rate","Revenue","Revenue Share"]
    for ci, h in enumerate(d_headers, 1):
        c = ws.cell(row=29, column=ci, value=h)
        c.fill = fill(C_VIOLET); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    devices = [
        ("Desktop",1136000,23620,0.0208,652000,73.1),
        ("Mobile",661500,8340,0.0126,178000,20.0),
        ("Tablet",94200,930,0.0099,61400,6.9),
    ]
    for ri, (dev, sess, purch, cr, rev, rev_share) in enumerate(devices, 30):
        ws.row_dimensions[ri].height = 22
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, dev, bold=True, bg=bg, fg=C_NAVY)
        data_cell(ws, ri, 2, sess, bg=bg, fg=C_MUTED, num_fmt="#,##0", h="right")
        data_cell(ws, ri, 3, purch, bg=bg, fg=C_MUTED, num_fmt="#,##0", h="right")
        c_cr = ws.cell(row=ri, column=4, value=cr)
        c_cr.fill = fill(C_GREEN_LT if dev=="Desktop" else (bg))
        c_cr.font = font(bold=True, size=10, color=C_GREEN if dev=="Desktop" else C_MUTED)
        c_cr.alignment = align("right"); c_cr.border = thin_border(); c_cr.number_format = "0.00%"
        data_cell(ws, ri, 5, rev, bg=bg, fg=C_NAVY, bold=True, num_fmt='"$"#,##0', h="right")
        data_cell(ws, ri, 6, rev_share/100, bg=bg, fg=C_MUTED, num_fmt="0.0%", h="right")

    # Audience definitions
    ws.row_dimensions[34].height = 10
    section_header(ws, 35, 1, "GA4 AUDIENCES  ·  RLSA & Suppression Strategy", C_GOLD, merge_to=5)
    ws.row_dimensions[35].height = 20
    a_headers = ["Audience Name","Duration","Membership Rule","Google Ads Use","Expected Lift"]
    for ci, h in enumerate(a_headers, 1):
        c = ws.cell(row=36, column=ci, value=h)
        c.fill = fill(C_GOLD); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    audiences = [
        ("High Propensity Non-Purchasers","30 days","propensity_score > 0.7 AND no purchase","RLSA bid +35%","+22% CVR"),
        ("VIP Customers (Platinum + Gold)","540 days","ltv_tier = Platinum OR Gold","Customer Match lookalike","3.8x ROAS"),
        ("Cart Abandoners (7-day)","7 days","add_to_cart in 7d AND no purchase","Dynamic remarketing","34% recovery"),
        ("New Visitor Suppression","1 day","first_visit in last 24h","Exclude from all RLSA","-15% wasted spend"),
    ]
    for ri, (name, dur, rule, use, lift) in enumerate(audiences, 37):
        ws.row_dimensions[ri].height = 24
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, name, bold=True, bg=bg, fg=C_NAVY)
        data_cell(ws, ri, 2, dur, bg=bg, fg=C_MUTED, h="center")
        data_cell(ws, ri, 3, rule, bg=bg, fg=C_MUTED, wrap=True)
        data_cell(ws, ri, 4, use, bg=bg, fg=C_BLUE)
        data_cell(ws, ri, 5, lift, bold=True, bg=bg, fg=C_GREEN, h="center")

    set_col_widths(ws,{"A":22,"B":14,"C":28,"D":18,"E":14,"F":14,"G":14,"H":14})
    ws.freeze_panes = "A3"


# ─── SHEET 8: BIGQUERY QUERIES ───────────────────────────────────────────────
def build_bigquery(wb):
    ws = wb.create_sheet("🗄️ BigQuery Queries")
    ws.sheet_view.showGridLines = False

    ws.merge_cells("A1:E1")
    t = ws["A1"]
    t.value = "BIGQUERY QUERY LIBRARY  ·  10 Production-Ready Queries  ·  GA4 Export Schema"
    t.fill = fill(C_NAVY); t.font = font(bold=True, size=13, color=C_WHITE)
    t.alignment = align("center"); ws.row_dimensions[1].height = 28

    headers = ["#","Query Name","Description","SQL Reference (see bigquery_queries.sql)","Cost Tip"]
    for ci, h in enumerate(headers, 1):
        c = ws.cell(row=2, column=ci, value=h)
        c.fill = fill(C_BLUE_DK); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    ws.row_dimensions[2].height = 20

    cost_tips = [
        "_TABLE_SUFFIX BETWEEN bounds saves ~60% vs full scan",
        "Use COUNTIF inside a single scan — no sub-queries needed",
        "Correlated UNNEST subquery — tested on 13.8M rows",
        "UNNEST(items) cross-join — only scan purchase events",
        "Partitioned by event_date — check monthly not full range",
        "LEFT JOIN first_visit → revenue — use CLUSTER BY user_pseudo_id",
        "UNNEST per-event — run weekly as data quality check",
        "EXTRACT(YEAR) — add LIMIT 1000 for initial dev",
        "ORDER BY revenue DESC LIMIT 20 — fast and actionable",
        "CREATE TABLE ... CLUSTER BY user_pseudo_id for reuse",
    ]
    for ri, ((name, desc, sql), tip) in enumerate(zip(BQ_QUERIES, cost_tips), 3):
        ws.row_dimensions[ri].height = 36
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, ri-2, bg=bg, fg=C_MUTED, h="center")
        data_cell(ws, ri, 2, name, bold=True, bg=bg, fg=C_BLUE)
        data_cell(ws, ri, 3, desc, bg=bg, fg=C_MUTED, wrap=True)
        c4 = ws.cell(row=ri, column=4, value=sql)
        c4.fill = fill("1E293B"); c4.font = Font(name="Consolas", size=9, color="BAE6FD")
        c4.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        c4.border = thin_border()
        data_cell(ws, ri, 5, tip, bg=C_GOLD_LT, fg=C_GOLD, wrap=True)

    # Schema reference
    ws.row_dimensions[14].height = 10
    section_header(ws, 15, 1, "GA4 BIGQUERY SCHEMA REFERENCE  ·  Key Fields", C_TEAL, merge_to=5)
    ws.row_dimensions[15].height = 20
    schema_headers = ["Field","Type","Description","Requires UNNEST","Example Value"]
    for ci, h in enumerate(schema_headers, 1):
        c = ws.cell(row=16, column=ci, value=h)
        c.fill = fill(C_TEAL); c.font = font(bold=True, size=10, color=C_WHITE)
        c.alignment = align("center"); c.border = thin_border()
    schema = [
        ("event_name","STRING","Name of the GA4 event","No","purchase"),
        ("event_date","STRING","Date shard key YYYYMMDD","No","20231015"),
        ("event_params","ARRAY<STRUCT>","All event parameters","Yes — UNNEST","key='ga_session_id'"),
        ("items","ARRAY<STRUCT>","Ecommerce items array","Yes — UNNEST(items)","item_category='Apparel'"),
        ("ecommerce.purchase_revenue_in_usd","FLOAT64","Order revenue","No","149.96"),
        ("user_pseudo_id","STRING","Pseudonymous user ID","No","48E1D..."),
        ("traffic_source.medium","STRING","Last-click medium","No","organic"),
        ("device.category","STRING","Device type","No","desktop"),
        ("privacy_info.analytics_storage","STRING","Consent Mode signal","No","Yes"),
        ("ga_session_id (in event_params)","INT64","Session identifier","Yes","4829384720"),
    ]
    for ri, (field, ftype, desc, unnest, example) in enumerate(schema, 17):
        ws.row_dimensions[ri].height = 20
        bg = C_BG if ri % 2 == 0 else C_WHITE
        data_cell(ws, ri, 1, field, bold=True, bg="1E293B", fg="BAE6FD")
        ws.cell(row=ri, column=1).font = Font(name="Consolas", size=9, color="BAE6FD")
        data_cell(ws, ri, 2, ftype, bg=bg, fg=C_VIOLET, h="center")
        data_cell(ws, ri, 3, desc, bg=bg, fg=C_MUTED)
        badge_cell(ws, ri, 4, unnest, C_RED_LT if unnest.startswith("Yes") else C_GREEN_LT,
                   C_RED if unnest.startswith("Yes") else C_GREEN)
        data_cell(ws, ri, 5, example, bg="1E293B", fg="86EFAC")
        ws.cell(row=ri, column=5).font = Font(name="Consolas", size=9, color="86EFAC")

    set_col_widths(ws,{"A":5,"B":26,"C":32,"D":54,"E":38})
    ws.freeze_panes = "A3"


# ─── MAIN ────────────────────────────────────────────────────────────────────
def main():
    print("Building GA4 Intelligence Hub Excel workbook...")
    wb = openpyxl.Workbook()

    build_dashboard(wb)
    print("  ✓  Dashboard")
    build_transactions(wb)
    print("  ✓  Transactions (40 rows)")
    build_events(wb)
    print("  ✓  Event Summary (25 events)")
    build_monthly_revenue(wb)
    print("  ✓  Monthly Revenue (36 months)")
    build_funnel(wb)
    print("  ✓  Funnel Analysis")
    build_ml(wb)
    print("  ✓  ML Models")
    build_traffic(wb)
    print("  ✓  Traffic & Audience")
    build_bigquery(wb)
    print("  ✓  BigQuery Queries")

    out = "GA4_Intelligence_Hub_Professional.xlsx"
    wb.save(out)
    print(f"\n  ✓  Saved: {out}")
    print(f"  ✓  Sheets: {len(wb.sheetnames)}")
    print(f"  ✓  Open in Excel → File → Save As to keep full formatting\n")


if __name__ == "__main__":
    main()
