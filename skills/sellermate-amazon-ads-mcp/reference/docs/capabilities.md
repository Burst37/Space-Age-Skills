# Tool reference

The SellerMate MCP server exposes 51 tools. Grouped by what you'd use them for.
(Generated from the live server on 2026-09-03; the server is versioned independently
of this document, so treat the live tool list as authoritative.)

Write tools are **policy-checked**: they pass your workspace guardrails and, where your
admin requires it, an approval queue before anything reaches Amazon.

## Performance & reporting (read)

| Tool | What it answers |
|---|---|
| `get_campaign_performance` | Campaign-level spend, sales, ACOS, clicks over any window |
| `get_targeting_performance` | Keyword / product-target performance |
| `get_search_term_performance` | Actual customer search terms — the wasted-spend audit |
| `get_placement_performance` | Top-of-search vs product page vs rest-of-search |
| `get_hourly_performance` | Intraday patterns — feeds dayparting decisions |
| `get_advertised_product_performance` | Per-ASIN ad performance |
| `get_retail_product_performance` | Retail (organic + total) product performance |
| `get_dsp_performance` | Amazon DSP campaign performance |
| `get_sqp_report` | Search Query Performance (impressions → purchase funnel by query) |
| `get_scp_report` | Search Catalog Performance |
| `get_orders_report` | Order-level reporting |
| `get_fba_customer_returns` | FBA returns |
| `get_inventory` / `get_vendor_inventory` | Stock levels (seller / vendor) |
| `get_vendor_sales_performance` | Vendor sales |
| `get_marketplace_summary` | One-look marketplace overview |
| `get_activity_log` | Who/what changed the account, when |

## Campaigns (read + write)

| Tool | |
|---|---|
| `list_campaigns` / `list_dsp_campaigns` | Enumerate campaigns with state and metrics |
| `create_campaign` | Launch Sponsored Products / Brands / Display campaigns |
| `get_campaign_creation_status` | Track an async launch |
| `update_campaign` | Budgets, state, settings — guardrail-checked |
| `add_products_to_ad_group` | Extend an ad group's product set |
| `update_product_ad` | Enable/pause individual product ads |

## Targeting & negatives (read + write)

| Tool | |
|---|---|
| `list_targets` / `add_targets` / `update_target` | Keywords and product targets, incl. bids |
| `list_negative_targets` | Existing negatives |
| `add_negative_keywords` / `add_negative_product_targets` | The "negate them" follow-up |
| `update_negative_keyword` / `update_negative_product_target` | Maintain negatives |

## Automations & dayparting (read + write)

| Tool | |
|---|---|
| `list_automations` / `get_automation` | Existing rule-based automations |
| `create_automation` / `update_automation` | Stand up or tune an automation |
| `list_daypartings` / `get_dayparting` | Schedules in force |
| `create_dayparting` / `update_dayparting` | Hour-by-hour bid/budget scheduling |

## Account & organization

| Tool | |
|---|---|
| `resolve_account` / `get_user_context` | Which account/workspace am I acting on |
| `list_product_catalog` / `list_vendor_products` | The catalog behind the campaigns |
| `get_tags` / `create_tag` / `update_tag` / `delete_tag` | Campaign organization |
| `list_knowledge_and_memory_files` / `get_knowledge_and_memory_file_content` | Workspace knowledge the AI can consult |
| `get_sellermate_capabilities` | The server describes itself |
