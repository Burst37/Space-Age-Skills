---
name: shopify-mcp
display_name: "Space Age — Shopify MCP"
version: "1.0"
description: >
  MCP server exposing Shopify Admin GraphQL API tools for Claude Code.
  Enables full store management: create and update products, browse and
  fulfill orders, look up and create customers, explore collections,
  query inventory levels, and retrieve shop metadata — all via natural
  language in Claude Code.
---

# Space Age — Shopify MCP

## What it does

Connects Claude Code to your Shopify store through the Admin GraphQL API
(`2024-10`). You can manage every major resource without leaving the terminal:

| Domain | Capabilities |
|---|---|
| **Products** | List, get, create, update, delete/archive |
| **Orders** | List, get, update metadata (tags/note), create fulfillments |
| **Customers** | List/search, get, create |
| **Collections** | List (smart + custom), get with nested products |
| **Inventory** | Query levels by location or across all locations |
| **Shop** | Name, email, plan, currency, timezone, domain |

---

## Installation

```bash
pip install -r user/shopify-mcp/requirements.txt
```

Dependencies: `mcp>=1.0.0`, `httpx>=0.27.0`.

---

## Configuration

Add the following to the `mcpServers` block inside `.claude/settings.json`
(copy from `user/shopify-mcp/claude-config.json`):

```json
{
  "mcpServers": {
    "shopify": {
      "command": "python",
      "args": ["user/shopify-mcp/server.py"],
      "env": {
        "SHOPIFY_STORE_DOMAIN": "your-store.myshopify.com",
        "SHOPIFY_ACCESS_TOKEN": "shpat_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### Required environment variables

| Variable | Description |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | Your store's `.myshopify.com` domain, e.g. `acme.myshopify.com` |
| `SHOPIFY_ACCESS_TOKEN` | Admin API access token (starts with `shpat_`). Generate one under **Apps → Develop apps** in the Shopify admin. Requires scopes: `read_products`, `write_products`, `read_orders`, `write_orders`, `read_customers`, `write_customers`, `read_inventory`, `write_inventory`. |

---

## Tools reference

### Products

#### `shopify_list_products`
List products with pagination.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | int | `10` | Number of products (max 250) |
| `cursor` | str | `None` | Pagination cursor (`endCursor` from previous call) |

Returns: `{ products: [...], pageInfo: { hasNextPage, endCursor } }`

---

#### `shopify_get_product`
Fetch full details for one product including all variants, images, options, and metafields.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `product_id` | str | yes | Product GID, e.g. `gid://shopify/Product/123456789` |

---

#### `shopify_create_product`
Create a new product with a default variant.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `title` | str | yes | Product title |
| `description` | str | yes | HTML product description |
| `vendor` | str | yes | Vendor / brand name |
| `product_type` | str | yes | Product type string |
| `tags` | list[str] | yes | Tag list (can be empty `[]`) |
| `price` | float | yes | Variant price |
| `compare_at_price` | float | no | Strike-through / original price |
| `sku` | str | no | SKU string |
| `inventory_quantity` | int | `0` | Initial inventory count |
| `images` | list[str] | no | List of image URLs to attach |

Returns: `{ id, handle, title }`

---

#### `shopify_update_product`
Update product metadata. Pass only the fields you want to change.

| Parameter | Type | Description |
|---|---|---|
| `product_id` | str | Product GID (required) |
| `title` | str | New title |
| `description` | str | New HTML description |
| `status` | str | `ACTIVE`, `DRAFT`, or `ARCHIVED` |
| `tags` | list[str] | Replacement tag list |
| `vendor` | str | New vendor |
| `product_type` | str | New product type |

---

#### `shopify_delete_product`
Permanently delete a product.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `product_id` | str | yes | Product GID |

Returns: `{ deleted_id }`

---

### Orders

#### `shopify_list_orders`
List orders with optional financial status filter.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | int | `10` | Number of orders (max 250) |
| `status` | str | `"any"` | `any`, `paid`, `pending`, `refunded`, `partially_refunded`, `authorized` |
| `cursor` | str | `None` | Pagination cursor |

Returns: `{ orders: [...], pageInfo: { hasNextPage, endCursor } }`

---

#### `shopify_get_order`
Fetch full order details including line items, fulfillments, refunds, and addresses.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `order_id` | str | yes | Order GID, e.g. `gid://shopify/Order/123456789` |

---

#### `shopify_update_order`
Update order tags and/or note.

| Parameter | Type | Description |
|---|---|---|
| `order_id` | str | Order GID (required) |
| `tags` | list[str] | Replacement tag list |
| `note` | str | New internal order note |

---

#### `shopify_fulfill_order`
Create a fulfillment for all open line items in an order.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `order_id` | str | — | Order GID (required) |
| `tracking_number` | str | `None` | Shipment tracking number |
| `tracking_company` | str | `None` | Carrier name (e.g. `"UPS"`) |
| `notify_customer` | bool | `True` | Send fulfillment email to customer |

Returns: `{ fulfillments: [...] }`

---

### Customers

#### `shopify_list_customers`
List or search customers.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | int | `10` | Number of customers |
| `query` | str | `None` | Shopify customer search query, e.g. `"email:jane@example.com"` or `"tag:vip"` |

Returns: `{ customers: [...], pageInfo: { hasNextPage, endCursor } }`

---

#### `shopify_get_customer`
Fetch full customer profile including addresses, recent orders, and metafields.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `customer_id` | str | yes | Customer GID, e.g. `gid://shopify/Customer/123456789` |

---

#### `shopify_create_customer`
Create a new customer account.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `first_name` | str | yes | First name |
| `last_name` | str | yes | Last name |
| `email` | str | yes | Email address |
| `phone` | str | no | Phone in E.164 format, e.g. `"+12125551234"` |
| `tags` | list[str] | no | Tag list |
| `accepts_marketing` | bool | `False` | Subscribe to marketing emails |

---

### Collections

#### `shopify_list_collections`
List all collections (smart and custom).

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | int | `10` | Number of collections |

Returns: `{ collections: [...], pageInfo: { hasNextPage, endCursor } }`

---

#### `shopify_get_collection`
Fetch a collection with its full product list (up to 50 products).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `collection_id` | str | yes | Collection GID, e.g. `gid://shopify/Collection/123456789` |

---

### Analytics & Inventory

#### `shopify_get_shop_info`
Return store metadata: name, email, plan, currency, timezone, domains.

No parameters.

---

#### `shopify_get_inventory_levels`
Query inventory quantities across locations.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `location_id` | str | `None` | Filter to a specific location GID. If omitted, returns all active locations with their inventory. |

---

## When to trigger this skill

Use this MCP server whenever a request involves:

- **Shopify store management** — any admin operation on a Shopify store
- **Product CRUD** — listing, searching, creating, updating, or deleting products
- **Order management** — viewing orders, updating tags/notes, fulfilling shipments
- **Customer lookup or creation** — searching customer records, creating new accounts
- **Inventory queries** — checking stock levels across warehouse locations
- **Collections** — browsing or inspecting product collections
- **Shop diagnostics** — retrieving store plan, currency, or domain information
- Any sentence containing "Shopify", "my store", "product listing", "order #", "customer record", "inventory", "collection", "fulfillment", or "shipping"

Typical trigger phrases:
- "List all products in my Shopify store"
- "Show me unpaid orders from today"
- "Create a new product called X at $49.99"
- "Mark order #1234 as fulfilled with tracking number ABC123"
- "Find the customer with email jane@example.com"
- "How many units of SKU ABC do we have in stock?"
- "What collections does my store have?"
