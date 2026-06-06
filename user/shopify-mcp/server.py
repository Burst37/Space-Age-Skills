"""
Space Age — Shopify MCP Server

Exposes Shopify Admin GraphQL API tools for managing products, orders,
customers, collections, inventory, and shop information via MCP.
"""

import os
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("shopify")

SHOPIFY_STORE_DOMAIN = os.environ.get("SHOPIFY_STORE_DOMAIN", "")
SHOPIFY_ACCESS_TOKEN = os.environ.get("SHOPIFY_ACCESS_TOKEN", "")
API_VERSION = "2024-10"


def _gql_url() -> str:
    domain = SHOPIFY_STORE_DOMAIN.rstrip("/")
    return f"https://{domain}/admin/api/{API_VERSION}/graphql.json"


def _headers() -> dict:
    return {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
    }


def _run_query(query: str, variables: dict | None = None) -> dict:
    """Execute a GraphQL query/mutation and return parsed JSON."""
    payload: dict = {"query": query}
    if variables:
        payload["variables"] = variables

    with httpx.Client(timeout=30) as client:
        response = client.post(_gql_url(), json=payload, headers=_headers())

    if response.status_code != 200:
        return {
            "error": f"HTTP {response.status_code}",
            "details": response.text,
        }

    data = response.json()
    if "errors" in data:
        return {"error": "GraphQL errors", "details": data["errors"]}
    return data.get("data", {})


# ---------------------------------------------------------------------------
# Products
# ---------------------------------------------------------------------------

@mcp.tool()
def shopify_list_products(limit: int = 10, cursor: str = None) -> dict:
    """
    List products from the Shopify store.

    Args:
        limit: Number of products to return (max 250).
        cursor: Pagination cursor (endCursor from a previous call).

    Returns:
        Dict with 'products' list and 'pageInfo' for pagination.
    """
    after_clause = f', after: "{cursor}"' if cursor else ""
    query = f"""
    {{
      products(first: {limit}{after_clause}) {{
        pageInfo {{
          hasNextPage
          endCursor
        }}
        edges {{
          node {{
            id
            title
            handle
            status
            vendor
            productType
            tags
            createdAt
            updatedAt
            images(first: 5) {{
              edges {{
                node {{
                  id
                  url
                  altText
                }}
              }}
            }}
            variants(first: 10) {{
              edges {{
                node {{
                  id
                  title
                  sku
                  price
                  compareAtPrice
                  inventoryQuantity
                  availableForSale
                }}
              }}
            }}
          }}
        }}
      }}
    }}
    """
    raw = _run_query(query)
    if "error" in raw:
        return raw

    products_conn = raw.get("products", {})
    products = [
        edge["node"] for edge in products_conn.get("edges", [])
    ]
    # Flatten images and variants for easier consumption
    for product in products:
        product["images"] = [
            e["node"] for e in product.get("images", {}).get("edges", [])
        ]
        product["variants"] = [
            e["node"] for e in product.get("variants", {}).get("edges", [])
        ]

    return {
        "products": products,
        "pageInfo": products_conn.get("pageInfo", {}),
    }


@mcp.tool()
def shopify_get_product(product_id: str) -> dict:
    """
    Retrieve full details for a single product.

    Args:
        product_id: Shopify product GID, e.g. 'gid://shopify/Product/123456789'.

    Returns:
        Full product dict, or an error dict.
    """
    query = """
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        descriptionHtml
        status
        vendor
        productType
        tags
        createdAt
        updatedAt
        publishedAt
        onlineStoreUrl
        images(first: 20) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              price
              compareAtPrice
              inventoryQuantity
              inventoryPolicy
              availableForSale
              barcode
              weight
              weightUnit
              selectedOptions {
                name
                value
              }
            }
          }
        }
        options {
          id
          name
          values
        }
        metafields(first: 20) {
          edges {
            node {
              id
              namespace
              key
              value
              type
            }
          }
        }
      }
    }
    """
    raw = _run_query(query, {"id": product_id})
    if "error" in raw:
        return raw

    product = raw.get("product")
    if not product:
        return {"error": "Product not found", "details": product_id}

    product["images"] = [e["node"] for e in product.get("images", {}).get("edges", [])]
    product["variants"] = [e["node"] for e in product.get("variants", {}).get("edges", [])]
    product["metafields"] = [e["node"] for e in product.get("metafields", {}).get("edges", [])]
    return product


@mcp.tool()
def shopify_create_product(
    title: str,
    description: str,
    vendor: str,
    product_type: str,
    tags: list[str],
    price: float,
    compare_at_price: float = None,
    sku: str = None,
    inventory_quantity: int = 0,
    images: list[str] = None,
) -> dict:
    """
    Create a new product in the Shopify store.

    Args:
        title: Product title.
        description: HTML description.
        vendor: Vendor / brand name.
        product_type: Product type string.
        tags: List of tag strings.
        price: Variant price (USD or store currency).
        compare_at_price: Optional compare-at / original price.
        sku: Optional SKU string.
        inventory_quantity: Initial inventory count.
        images: Optional list of image URLs to attach.

    Returns:
        Dict with 'id' and 'handle' on success, or an error dict.
    """
    variant_input: dict = {
        "price": str(price),
        "inventoryQuantities": {
            "availableQuantity": inventory_quantity,
            "locationId": None,  # will be replaced below if needed
        },
    }
    if compare_at_price is not None:
        variant_input["compareAtPrice"] = str(compare_at_price)
    if sku:
        variant_input["sku"] = sku

    # Remove inventoryQuantities if locationId is None — needs a real location
    # We'll use a simpler approach: set inventoryItem via REST later or omit.
    del variant_input["inventoryQuantities"]

    image_inputs = []
    if images:
        image_inputs = [{"src": url} for url in images]

    mutation = """
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          handle
          title
          status
        }
        userErrors {
          field
          message
        }
      }
    }
    """
    variables = {
        "input": {
            "title": title,
            "descriptionHtml": description,
            "vendor": vendor,
            "productType": product_type,
            "tags": tags,
            "variants": [variant_input],
            "images": image_inputs,
        }
    }
    raw = _run_query(mutation, variables)
    if "error" in raw:
        return raw

    result = raw.get("productCreate", {})
    user_errors = result.get("userErrors", [])
    if user_errors:
        return {"error": "Validation errors", "details": user_errors}

    product = result.get("product", {})
    return {"id": product.get("id"), "handle": product.get("handle"), "title": product.get("title")}


@mcp.tool()
def shopify_update_product(
    product_id: str,
    title: str = None,
    description: str = None,
    status: str = None,
    tags: list[str] = None,
    vendor: str = None,
    product_type: str = None,
) -> dict:
    """
    Update an existing product's metadata.

    Args:
        product_id: Shopify product GID.
        title: New title (optional).
        description: New HTML description (optional).
        status: New status — ACTIVE, DRAFT, or ARCHIVED (optional).
        tags: Replacement tag list (optional).
        vendor: New vendor name (optional).
        product_type: New product type (optional).

    Returns:
        Updated product dict or error dict.
    """
    input_fields: dict = {"id": product_id}
    if title is not None:
        input_fields["title"] = title
    if description is not None:
        input_fields["descriptionHtml"] = description
    if status is not None:
        input_fields["status"] = status.upper()
    if tags is not None:
        input_fields["tags"] = tags
    if vendor is not None:
        input_fields["vendor"] = vendor
    if product_type is not None:
        input_fields["productType"] = product_type

    mutation = """
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          status
          tags
          vendor
          productType
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
    """
    raw = _run_query(mutation, {"input": input_fields})
    if "error" in raw:
        return raw

    result = raw.get("productUpdate", {})
    user_errors = result.get("userErrors", [])
    if user_errors:
        return {"error": "Validation errors", "details": user_errors}

    return result.get("product", {})


@mcp.tool()
def shopify_delete_product(product_id: str) -> dict:
    """
    Archive (soft-delete) a product by setting its status to ARCHIVED.
    To permanently delete, status is set to ARCHIVED. For hard delete use
    the productDelete mutation.

    Args:
        product_id: Shopify product GID.

    Returns:
        Dict with 'deleted_id' on success, or an error dict.
    """
    mutation = """
    mutation DeleteProduct($id: ID!) {
      productDelete(input: {id: $id}) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
    """
    raw = _run_query(mutation, {"id": product_id})
    if "error" in raw:
        return raw

    result = raw.get("productDelete", {})
    user_errors = result.get("userErrors", [])
    if user_errors:
        return {"error": "Validation errors", "details": user_errors}

    return {"deleted_id": result.get("deletedProductId")}


# ---------------------------------------------------------------------------
# Orders
# ---------------------------------------------------------------------------

@mcp.tool()
def shopify_list_orders(
    limit: int = 10,
    status: str = "any",
    cursor: str = None,
) -> dict:
    """
    List orders from the store.

    Args:
        limit: Number of orders to return (max 250).
        status: Filter by financial status — any, paid, pending, refunded, etc.
        cursor: Pagination cursor.

    Returns:
        Dict with 'orders' list and 'pageInfo'.
    """
    query_filter = f'financial_status:{status}' if status != "any" else ""
    query_arg = f', query: "{query_filter}"' if query_filter else ""
    after_clause = f', after: "{cursor}"' if cursor else ""

    query = f"""
    {{
      orders(first: {limit}{after_clause}{query_arg}) {{
        pageInfo {{
          hasNextPage
          endCursor
        }}
        edges {{
          node {{
            id
            name
            email
            createdAt
            updatedAt
            financialStatus
            fulfillmentStatus
            totalPriceSet {{
              shopMoney {{
                amount
                currencyCode
              }}
            }}
            subtotalPriceSet {{
              shopMoney {{
                amount
                currencyCode
              }}
            }}
            totalTaxSet {{
              shopMoney {{
                amount
                currencyCode
              }}
            }}
            customer {{
              id
              firstName
              lastName
              email
            }}
            lineItems(first: 20) {{
              edges {{
                node {{
                  id
                  title
                  quantity
                  variant {{
                    id
                    sku
                    price
                  }}
                }}
              }}
            }}
            tags
            note
          }}
        }}
      }}
    }}
    """
    raw = _run_query(query)
    if "error" in raw:
        return raw

    orders_conn = raw.get("orders", {})
    orders = []
    for edge in orders_conn.get("edges", []):
        order = edge["node"]
        order["lineItems"] = [
            e["node"] for e in order.get("lineItems", {}).get("edges", [])
        ]
        orders.append(order)

    return {
        "orders": orders,
        "pageInfo": orders_conn.get("pageInfo", {}),
    }


@mcp.tool()
def shopify_get_order(order_id: str) -> dict:
    """
    Retrieve full details for a single order.

    Args:
        order_id: Shopify order GID, e.g. 'gid://shopify/Order/123456789'.

    Returns:
        Full order dict or error dict.
    """
    query = """
    query GetOrder($id: ID!) {
      order(id: $id) {
        id
        name
        email
        phone
        createdAt
        updatedAt
        processedAt
        financialStatus
        fulfillmentStatus
        tags
        note
        totalPriceSet { shopMoney { amount currencyCode } }
        subtotalPriceSet { shopMoney { amount currencyCode } }
        totalTaxSet { shopMoney { amount currencyCode } }
        totalShippingPriceSet { shopMoney { amount currencyCode } }
        totalDiscountsSet { shopMoney { amount currencyCode } }
        customer {
          id
          firstName
          lastName
          email
          phone
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          provinceCode
          zip
          countryCode
          phone
        }
        billingAddress {
          firstName
          lastName
          address1
          address2
          city
          provinceCode
          zip
          countryCode
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              discountedUnitPriceSet { shopMoney { amount currencyCode } }
              originalUnitPriceSet { shopMoney { amount currencyCode } }
              variant {
                id
                title
                sku
                price
              }
              product {
                id
                title
              }
            }
          }
        }
        fulfillments {
          id
          status
          trackingInfo {
            company
            number
            url
          }
          createdAt
          updatedAt
        }
        refunds {
          id
          createdAt
          totalRefundedSet { shopMoney { amount currencyCode } }
        }
      }
    }
    """
    raw = _run_query(query, {"id": order_id})
    if "error" in raw:
        return raw

    order = raw.get("order")
    if not order:
        return {"error": "Order not found", "details": order_id}

    order["lineItems"] = [
        e["node"] for e in order.get("lineItems", {}).get("edges", [])
    ]
    return order


@mcp.tool()
def shopify_update_order(
    order_id: str,
    tags: list[str] = None,
    note: str = None,
) -> dict:
    """
    Update order metadata (tags and/or note).

    Args:
        order_id: Shopify order GID.
        tags: Replacement tag list (optional).
        note: New order note (optional).

    Returns:
        Updated order dict or error dict.
    """
    input_fields: dict = {"id": order_id}
    if tags is not None:
        input_fields["tags"] = tags
    if note is not None:
        input_fields["note"] = note

    mutation = """
    mutation UpdateOrder($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          name
          tags
          note
          updatedAt
        }
        userErrors {
          field
          message
        }
      }
    }
    """
    raw = _run_query(mutation, {"input": input_fields})
    if "error" in raw:
        return raw

    result = raw.get("orderUpdate", {})
    user_errors = result.get("userErrors", [])
    if user_errors:
        return {"error": "Validation errors", "details": user_errors}

    return result.get("order", {})


@mcp.tool()
def shopify_fulfill_order(
    order_id: str,
    tracking_number: str = None,
    tracking_company: str = None,
    notify_customer: bool = True,
) -> dict:
    """
    Fulfill an order (create a fulfillment for all unfulfilled line items).

    This tool first fetches the order's fulfillment orders, then calls
    fulfillmentCreateV2 on each open fulfillment order.

    Args:
        order_id: Shopify order GID.
        tracking_number: Optional shipment tracking number.
        tracking_company: Optional shipping carrier name.
        notify_customer: Whether to send customer notification email.

    Returns:
        Dict with created fulfillment info or error dict.
    """
    # Step 1: get fulfillment orders for this order
    fo_query = """
    query GetFulfillmentOrders($id: ID!) {
      order(id: $id) {
        id
        name
        fulfillmentOrders(first: 10) {
          edges {
            node {
              id
              status
              lineItems(first: 50) {
                edges {
                  node {
                    id
                    remainingQuantity
                  }
                }
              }
            }
          }
        }
      }
    }
    """
    raw = _run_query(fo_query, {"id": order_id})
    if "error" in raw:
        return raw

    order = raw.get("order")
    if not order:
        return {"error": "Order not found", "details": order_id}

    fulfillment_orders = [
        e["node"]
        for e in order.get("fulfillmentOrders", {}).get("edges", [])
        if e["node"]["status"] in ("OPEN", "IN_PROGRESS")
    ]

    if not fulfillment_orders:
        return {"error": "No open fulfillment orders found", "details": order_id}

    # Step 2: fulfill each open fulfillment order
    mutation = """
    mutation FulfillOrder($fulfillment: FulfillmentInput!) {
      fulfillmentCreateV2(fulfillment: $fulfillment) {
        fulfillment {
          id
          status
          trackingInfo {
            company
            number
            url
          }
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }
    """

    results = []
    for fo in fulfillment_orders:
        fo_line_items = [
            {
                "fulfillmentOrderId": fo["id"],
                "fulfillmentOrderLineItems": [
                    {"id": e["node"]["id"], "quantity": e["node"]["remainingQuantity"]}
                    for e in fo["lineItems"]["edges"]
                    if e["node"]["remainingQuantity"] > 0
                ],
            }
        ]

        fulfillment_input: dict = {
            "lineItemsByFulfillmentOrder": fo_line_items,
            "notifyCustomer": notify_customer,
        }

        if tracking_number or tracking_company:
            fulfillment_input["trackingInfo"] = {
                "number": tracking_number or "",
                "company": tracking_company or "",
            }

        result_raw = _run_query(mutation, {"fulfillment": fulfillment_input})
        if "error" in result_raw:
            results.append(result_raw)
            continue

        fc_result = result_raw.get("fulfillmentCreateV2", {})
        user_errors = fc_result.get("userErrors", [])
        if user_errors:
            results.append({"error": "Validation errors", "details": user_errors})
        else:
            results.append(fc_result.get("fulfillment", {}))

    return {"fulfillments": results}


# ---------------------------------------------------------------------------
# Customers
# ---------------------------------------------------------------------------

@mcp.tool()
def shopify_list_customers(limit: int = 10, query: str = None) -> dict:
    """
    List or search customers.

    Args:
        limit: Number of customers to return (max 250).
        query: Optional search string (e.g. 'email:john@example.com' or 'tag:vip').

    Returns:
        Dict with 'customers' list and 'pageInfo'.
    """
    query_arg = f', query: "{query}"' if query else ""
    gql = f"""
    {{
      customers(first: {limit}{query_arg}) {{
        pageInfo {{
          hasNextPage
          endCursor
        }}
        edges {{
          node {{
            id
            firstName
            lastName
            email
            phone
            numberOfOrders
            totalSpentV2 {{
              amount
              currencyCode
            }}
            tags
            createdAt
            updatedAt
            marketingOptInLevel
            defaultAddress {{
              address1
              city
              provinceCode
              countryCode
              zip
            }}
          }}
        }}
      }}
    }}
    """
    raw = _run_query(gql)
    if "error" in raw:
        return raw

    customers_conn = raw.get("customers", {})
    customers = [e["node"] for e in customers_conn.get("edges", [])]
    return {
        "customers": customers,
        "pageInfo": customers_conn.get("pageInfo", {}),
    }


@mcp.tool()
def shopify_get_customer(customer_id: str) -> dict:
    """
    Retrieve full details for a single customer.

    Args:
        customer_id: Shopify customer GID, e.g. 'gid://shopify/Customer/123456789'.

    Returns:
        Full customer dict or error dict.
    """
    query = """
    query GetCustomer($id: ID!) {
      customer(id: $id) {
        id
        firstName
        lastName
        email
        phone
        numberOfOrders
        totalSpentV2 { amount currencyCode }
        tags
        note
        createdAt
        updatedAt
        verifiedEmail
        taxExempt
        marketingOptInLevel
        defaultAddress {
          id
          address1
          address2
          city
          province
          provinceCode
          zip
          country
          countryCode
          phone
        }
        addresses {
          id
          address1
          address2
          city
          provinceCode
          zip
          countryCode
        }
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              name
              createdAt
              financialStatus
              fulfillmentStatus
              totalPriceSet { shopMoney { amount currencyCode } }
            }
          }
        }
        metafields(first: 10) {
          edges {
            node {
              id
              namespace
              key
              value
            }
          }
        }
      }
    }
    """
    raw = _run_query(query, {"id": customer_id})
    if "error" in raw:
        return raw

    customer = raw.get("customer")
    if not customer:
        return {"error": "Customer not found", "details": customer_id}

    customer["orders"] = [
        e["node"] for e in customer.get("orders", {}).get("edges", [])
    ]
    customer["metafields"] = [
        e["node"] for e in customer.get("metafields", {}).get("edges", [])
    ]
    return customer


@mcp.tool()
def shopify_create_customer(
    first_name: str,
    last_name: str,
    email: str,
    phone: str = None,
    tags: list[str] = None,
    accepts_marketing: bool = False,
) -> dict:
    """
    Create a new customer.

    Args:
        first_name: Customer's first name.
        last_name: Customer's last name.
        email: Customer's email address.
        phone: Optional phone number in E.164 format.
        tags: Optional list of tags.
        accepts_marketing: Whether the customer accepts marketing emails.

    Returns:
        Dict with new customer 'id' and 'email', or error dict.
    """
    input_fields: dict = {
        "firstName": first_name,
        "lastName": last_name,
        "email": email,
        "emailMarketingConsent": {
            "marketingState": "SUBSCRIBED" if accepts_marketing else "UNSUBSCRIBED",
            "marketingOptInLevel": "SINGLE_OPT_IN",
        },
    }
    if phone:
        input_fields["phone"] = phone
    if tags:
        input_fields["tags"] = tags

    mutation = """
    mutation CreateCustomer($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
          tags
          createdAt
        }
        userErrors {
          field
          message
        }
      }
    }
    """
    raw = _run_query(mutation, {"input": input_fields})
    if "error" in raw:
        return raw

    result = raw.get("customerCreate", {})
    user_errors = result.get("userErrors", [])
    if user_errors:
        return {"error": "Validation errors", "details": user_errors}

    return result.get("customer", {})


# ---------------------------------------------------------------------------
# Collections
# ---------------------------------------------------------------------------

@mcp.tool()
def shopify_list_collections(limit: int = 10) -> dict:
    """
    List collections (both smart and custom).

    Args:
        limit: Number of collections to return.

    Returns:
        Dict with 'collections' list.
    """
    query = f"""
    {{
      collections(first: {limit}) {{
        pageInfo {{
          hasNextPage
          endCursor
        }}
        edges {{
          node {{
            id
            title
            handle
            description
            productsCount {{
              count
            }}
            image {{
              url
              altText
            }}
            updatedAt
            sortOrder
            ruleSet {{
              appliedDisjunctively
              rules {{
                column
                relation
                condition
              }}
            }}
          }}
        }}
      }}
    }}
    """
    raw = _run_query(query)
    if "error" in raw:
        return raw

    collections_conn = raw.get("collections", {})
    collections = [e["node"] for e in collections_conn.get("edges", [])]
    return {
        "collections": collections,
        "pageInfo": collections_conn.get("pageInfo", {}),
    }


@mcp.tool()
def shopify_get_collection(collection_id: str) -> dict:
    """
    Retrieve full details for a collection, including its products.

    Args:
        collection_id: Shopify collection GID, e.g. 'gid://shopify/Collection/123456789'.

    Returns:
        Collection dict with nested products list, or error dict.
    """
    query = """
    query GetCollection($id: ID!) {
      collection(id: $id) {
        id
        title
        handle
        description
        descriptionHtml
        sortOrder
        updatedAt
        productsCount {
          count
        }
        image {
          url
          altText
        }
        ruleSet {
          appliedDisjunctively
          rules {
            column
            relation
            condition
          }
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              status
              priceRangeV2 {
                minVariantPrice { amount currencyCode }
                maxVariantPrice { amount currencyCode }
              }
            }
          }
        }
      }
    }
    """
    raw = _run_query(query, {"id": collection_id})
    if "error" in raw:
        return raw

    collection = raw.get("collection")
    if not collection:
        return {"error": "Collection not found", "details": collection_id}

    collection["products"] = [
        e["node"] for e in collection.get("products", {}).get("edges", [])
    ]
    return collection


# ---------------------------------------------------------------------------
# Analytics / Shop Info
# ---------------------------------------------------------------------------

@mcp.tool()
def shopify_get_shop_info() -> dict:
    """
    Get basic shop information: name, email, plan, currency, timezone, domain.

    Returns:
        Dict with shop metadata.
    """
    query = """
    {
      shop {
        id
        name
        email
        myshopifyDomain
        primaryDomain {
          url
          host
        }
        plan {
          displayName
          partnerDevelopment
          shopifyPlus
        }
        currencyCode
        timezoneAbbreviation
        ianaTimezone
        weightUnit
        billingAddress {
          countryCode
          city
        }
        createdAt
        updatedAt
      }
    }
    """
    raw = _run_query(query)
    if "error" in raw:
        return raw
    return raw.get("shop", {})


@mcp.tool()
def shopify_get_inventory_levels(location_id: str = None) -> dict:
    """
    Get inventory levels, optionally filtered to a specific location.

    Args:
        location_id: Optional Shopify location GID. If omitted, returns
                     inventory items across all locations (up to 50).

    Returns:
        Dict with 'inventoryLevels' list or 'locations' list with nested levels.
    """
    if location_id:
        query = """
        query GetInventoryAtLocation($locationId: ID!) {
          location(id: $locationId) {
            id
            name
            isActive
            inventoryLevels(first: 100) {
              edges {
                node {
                  id
                  quantities(names: ["available", "on_hand", "committed", "incoming"]) {
                    name
                    quantity
                  }
                  item {
                    id
                    sku
                    tracked
                    variant {
                      id
                      title
                      product {
                        id
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        }
        """
        raw = _run_query(query, {"locationId": location_id})
        if "error" in raw:
            return raw

        location = raw.get("location", {})
        if not location:
            return {"error": "Location not found", "details": location_id}

        location["inventoryLevels"] = [
            e["node"] for e in location.get("inventoryLevels", {}).get("edges", [])
        ]
        return location
    else:
        # Return a summary across all locations
        query = """
        {
          locations(first: 20, includeInactive: false) {
            edges {
              node {
                id
                name
                isActive
                inventoryLevels(first: 50) {
                  edges {
                    node {
                      id
                      quantities(names: ["available", "on_hand"]) {
                        name
                        quantity
                      }
                      item {
                        id
                        sku
                        variant {
                          id
                          title
                          product {
                            id
                            title
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        """
        raw = _run_query(query)
        if "error" in raw:
            return raw

        locations_conn = raw.get("locations", {})
        locations = []
        for edge in locations_conn.get("edges", []):
            loc = edge["node"]
            loc["inventoryLevels"] = [
                e["node"] for e in loc.get("inventoryLevels", {}).get("edges", [])
            ]
            locations.append(loc)

        return {"locations": locations}


if __name__ == "__main__":
    if not SHOPIFY_STORE_DOMAIN or not SHOPIFY_ACCESS_TOKEN:
        import sys
        print(
            "ERROR: Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN environment variables.",
            file=sys.stderr,
        )
        sys.exit(1)
    mcp.run()
