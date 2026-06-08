---
name: shopify-mcp
version: 1.0
description: MCP server integration guide for Shopify Admin GraphQL API. Use when performing Shopify store management tasks via MCP tools.
allowed-tools: Read, Write, Bash
---

# SHOPIFY MCP v1.0
## Space Age AI Solutions — Shopify Admin API via MCP

## When to load this skill

- User asks to manage a Shopify store
- Creating/updating products, collections, orders, customers
- Shopify analytics queries
- Any Shopify Admin API operation

---

## AVAILABLE MCP TOOLS

```
PRODUCT MANAGEMENT:
  mcp__Shopify__create-product
  mcp__Shopify__update-product
  mcp__Shopify__get-product
  mcp__Shopify__search_products
  mcp__Shopify__bulk-update-product-status

COLLECTION MANAGEMENT:
  mcp__Shopify__create-collection
  mcp__Shopify__update-collection
  mcp__Shopify__get-collection
  mcp__Shopify__search_collections
  mcp__Shopify__add-to-collection

ORDER MANAGEMENT:
  mcp__Shopify__list-orders
  mcp__Shopify__get-order

CUSTOMER MANAGEMENT:
  mcp__Shopify__list-customers

INVENTORY:
  mcp__Shopify__get-inventory-levels
  mcp__Shopify__set-inventory

ANALYTICS:
  mcp__Shopify__run-analytics-query

GRAPHQL (general purpose):
  mcp__Shopify__graphql_query
  mcp__Shopify__graphql_mutation
  mcp__Shopify__graphql_schema

STORE INFO:
  mcp__Shopify__get-shop-info
  mcp__Shopify__switch-shop
```

---

## DECISION RULE

1. **Use a named tool** if it covers the operation (better UX, structured output)
2. **Use `graphql_query` or `graphql_mutation`** for operations without a named tool
   - Examples: metafields, metaobjects, gift cards, pages, blogs, markets, translations
3. **Use `graphql_schema`** to discover available types and fields before writing custom queries

---

## COMMON OPERATIONS

### Check store info
```
mcp__Shopify__get-shop-info()
```

### Create a product
```
mcp__Shopify__create-product(
  title: "Product Name",
  description: "...",
  price: "99.99",
  status: "active"
)
```

### Run analytics (ShopifyQL)
```
mcp__Shopify__run-analytics-query(
  query: "SELECT sum(net_sales) FROM sales SINCE -30d UNTIL today"
)
```

### GraphQL custom query
```
mcp__Shopify__graphql_query(
  query: "{ shop { name, primaryDomain { url } } }"
)
```

---

## WHAT TO AVOID

- Don't use GraphQL when a named tool exists
- Don't run mutations without confirming the operation with the user first
- Don't skip `switch-shop` if working with multiple stores
