---
name: shopify-theme-dev
description: >
  Full-stack Shopify theme development skill — Online Store 2.0, Dawn customization,
  Liquid templating, sections/blocks/snippets, CLI workflows, metafields, Storefront API,
  custom storefronts, and performance optimization. Use IMMEDIATELY whenever the user mentions
  Shopify, Liquid, a store theme, Dawn, a Shopify page, product page, collection page, cart,
  checkout, Shopify CLI, "push to Shopify", "create a section", "build a Shopify theme",
  "customize my store", "add a feature to Shopify", metafields, metaobjects, app blocks,
  Shopify storefront, headless Shopify, or any e-commerce frontend work tied to Shopify.
  Always load this skill before writing any .liquid, .json template, or section schema.
version: 1.0
updated: 2026-05-15
---

# Shopify Theme Development — Full-Stack Reference

Covers: Online Store 2.0, Liquid, CLI, Dawn, Sections, Metafields, Storefront API, Performance.

---

## DECISION TREE — What Are We Building?

```
New theme from scratch? ──────────────────────► SCAFFOLD (Section A)
Customizing Dawn/existing theme? ───────────► CUSTOMIZATION (Section B)
Adding a new section/component? ───────────► SECTIONS & BLOCKS (Section C)
Metafields / custom data? ────────────────► METAFIELDS (Section D)
Storefront API / headless? ───────────────► STOREFRONT API (Section E)
Performance / SEO fix? ───────────────────► PERFORMANCE (Section F)
Deploying / CI-CD? ───────────────────────► CLI WORKFLOW (Section G)
```

---

## A. THEME ARCHITECTURE & SCAFFOLD

### Required Directory Structure
```
theme/
├── assets/          ← CSS, JS, fonts, images (NO subdirectories)
├── config/
│   ├── settings_schema.json   ← Theme Settings UI definition
│   └── settings_data.json     ← Stored theme setting values
├── layout/
│   ├── theme.liquid           ← Master HTML wrapper (head, header, footer)
│   └── password.liquid        ← Password page layout
├── locales/
│   ├── en.default.json        ← English strings
│   └── en.default.schema.json ← Schema strings
├── sections/        ← Reusable page components with schema
├── snippets/        ← Small reusable Liquid fragments
├── templates/       ← Page type definitions (JSON or Liquid)
│   ├── index.json             ← Homepage
│   ├── product.json           ← Product page
│   ├── collection.json        ← Collection page
│   ├── cart.json              ← Cart page
│   ├── page.json              ← Generic page
│   ├── blog.json              ← Blog listing
│   ├── article.json           ← Blog post
│   ├── customers/login.liquid ← Login (still Liquid)
│   └── 404.json               ← 404 page
└── .shopifyignore   ← Files to exclude from push/pull
```

### Scaffold a New Theme from Dawn
```bash
npm install -g @shopify/cli @shopify/theme
shopify theme init my-theme --clone-url https://github.com/Shopify/dawn
cd my-theme
shopify theme dev --store your-store.myshopify.com
```

### `theme.liquid` Essential Structure
```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  {{ page_title | default: shop.name }}
  <meta name="description" content="{{ page_description | default: shop.description }}">

  {%- if settings.favicon != blank -%}
    <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32 }}">
  {%- endif -%}

  {{ content_for_header }}  {# REQUIRED — Shopify injects scripts here #}

  {{ 'base.css' | asset_url | stylesheet_tag }}
  {{ 'global.js' | asset_url | script_tag }}
</head>
<body>
  {%- sections 'header-group' -%}

  <main id="MainContent" class="content-for-layout" role="main" tabindex="-1">
    {{ content_for_layout }}  {# REQUIRED — renders the template #}
  </main>

  {%- sections 'footer-group' -%}

  <ul hidden>
    {%- for locale in shop.published_locales -%}
      <li>{{ locale.name }}</li>
    {%- endfor -%}
  </ul>
</body>
</html>
```

---

## B. LIQUID TEMPLATING ESSENTIALS

### Core Liquid Syntax
```liquid
{# Variables #}
{{ product.title }}
{{ product.price | money }}
{{ image | image_url: width: 800 | image_tag: loading: 'lazy' }}

{# Assignment #}
{% assign sale_price = product.price | times: 0.8 %}
{% capture full_name %}{{ customer.first_name }} {{ customer.last_name }}{% endcapture %}

{# Conditionals #}
{% if product.available %}
  <button>Add to Cart</button>
{% elsif product.variants.size > 0 %}
  <button>Select Options</button>
{% else %}
  <button disabled>Sold Out</button>
{% endif %}

{# Unless #}
{% unless customer.tags contains 'wholesale' %}
  {{ product.price | money }}
{% endunless %}

{# Case/When #}
{% case product.type %}
  {% when 'Apparel' %} {% render 'product-sizing-chart' %}
  {% when 'Digital' %} {% render 'digital-delivery-info' %}
  {% else %}          {% render 'product-standard' %}
{% endcase %}

{# Loops #}
{% for product in collection.products limit: 12 %}
  {% if forloop.first %}<div class="grid">{% endif %}
  {% render 'product-card', product: product, index: forloop.index %}
  {% if forloop.last %}</div>{% endif %}
{% endfor %}

{# forloop variables: index, index0, first, last, length, rindex, rindex0 #}
```

### Critical Filters
```liquid
{# Prices #}
{{ product.price | money }}                    → $12.00
{{ product.price | money_with_currency }}      → $12.00 USD
{{ product.compare_at_price | money_without_currency }}

{# Images (NEW — always use image_url, NOT img_url) #}
{{ product.featured_image | image_url: width: 800 }}
{{ product.featured_image | image_url: width: 800 | image_tag: loading: 'lazy', class: 'product__img' }}
{{ section.settings.image | image_url: width: 1920, height: 1080, crop: 'center' }}

{# URLs #}
{{ product | link_to }}
{{ 'style.css' | asset_url | stylesheet_tag }}
{{ 'app.js' | asset_url | script_tag }}
{{ page | link_to }}
{{ product.url | prepend: shop.url }}

{# Strings #}
{{ product.title | upcase }}
{{ product.description | truncatewords: 30 }}
{{ product.handle | replace: '-', ' ' | capitalize }}
{{ 'products.grid.columns' | t }}   {# Locale string #}

{# Arrays #}
{{ product.tags | join: ', ' }}
{{ collection.products | map: 'title' | join: ', ' }}
{{ array | sort: 'price' }}
{{ array | where: 'available', true }}
{{ array | first }} {{ array | last }} {{ array | size }}

{# Dates #}
{{ article.published_at | date: '%B %d, %Y' }}
{{ 'now' | date: '%Y' }}
```

### Snippets — Render vs Include
```liquid
{# ALWAYS use render (not include) — isolated scope #}
{% render 'product-card', product: product, show_vendor: true %}
{% render 'icon-arrow' %}

{# Pass variables explicitly #}
{% render 'product-card',
   product: product,
   section_id: section.id,
   image_ratio: section.settings.image_ratio,
   show_secondary_image: true
%}

{# Render with forloop (loops inside snippet) #}
{% render 'product-card' for collection.products as product %}
```

---

## C. SECTIONS & BLOCKS — ONLINE STORE 2.0

### Complete Section Template
```liquid
{%- comment -%} sections/featured-products.liquid {%- endcomment -%}

{{ 'section-featured-products.css' | asset_url | stylesheet_tag }}

<section id="FeaturedProducts-{{ section.id }}"
         class="featured-products page-width"
         style="padding-top: {{ section.settings.padding_top }}px; padding-bottom: {{ section.settings.padding_bottom }}px;">

  {%- if section.settings.title != blank -%}
    <h2 class="featured-products__title">{{ section.settings.title | escape }}</h2>
  {%- endif -%}

  <ul class="product-grid columns-{{ section.settings.columns_desktop }}">
    {%- for block in section.blocks -%}
      {%- case block.type -%}
        {%- when 'product' -%}
          {%- assign product_ref = block.settings.product -%}
          <li {{ block.shopify_attributes }}>
            {% render 'product-card', product: product_ref %}
          </li>
        {%- when 'collection' -%}
          {%- assign coll = block.settings.collection -%}
          {%- for prod in coll.products limit: 4 -%}
            <li>{% render 'product-card', product: prod %}</li>
          {%- endfor -%}
      {%- endcase -%}
    {%- endfor -%}
  </ul>
</section>

{% schema %}
{
  "name": "Featured Products",
  "tag": "section",
  "class": "section",
  "disabled_on": {
    "groups": ["header", "footer"]
  },
  "settings": [
    {
      "type": "text",
      "id": "title",
      "default": "Featured Products",
      "label": "Heading"
    },
    {
      "type": "range",
      "id": "columns_desktop",
      "min": 2,
      "max": 5,
      "step": 1,
      "default": 4,
      "label": "Number of columns on desktop"
    },
    {
      "type": "select",
      "id": "image_ratio",
      "options": [
        { "value": "adapt",    "label": "Adapt to image" },
        { "value": "portrait", "label": "Portrait" },
        { "value": "square",   "label": "Square" }
      ],
      "default": "adapt",
      "label": "Image ratio"
    },
    {
      "type": "header",
      "content": "Section padding"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0, "max": 100, "step": 4, "unit": "px",
      "label": "Top padding",
      "default": 36
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0, "max": 100, "step": 4, "unit": "px",
      "label": "Bottom padding",
      "default": 36
    }
  ],
  "blocks": [
    {
      "type": "product",
      "name": "Product",
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "Product"
        }
      ]
    },
    {
      "type": "collection",
      "name": "Collection",
      "settings": [
        {
          "type": "collection",
          "id": "collection",
          "label": "Collection"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Featured Products",
      "blocks": [
        { "type": "product" },
        { "type": "product" },
        { "type": "product" },
        { "type": "product" }
      ]
    }
  ]
}
{% endschema %}
```

### All Schema Setting Types
```json
{ "type": "text",       "id": "title",        "label": "Title",        "default": "Hello" }
{ "type": "textarea",   "id": "body",         "label": "Body text" }
{ "type": "richtext",   "id": "description",  "label": "Description" }
{ "type": "inline_richtext", "id": "heading", "label": "Heading" }
{ "type": "number",     "id": "count",        "label": "Count",        "default": 4 }
{ "type": "range",      "id": "size",         "label": "Size",         "min": 12, "max": 96, "step": 2, "unit": "px", "default": 24 }
{ "type": "checkbox",   "id": "show_vendor",  "label": "Show vendor",  "default": false }
{ "type": "select",     "id": "layout",       "label": "Layout",       "options": [{"value":"grid","label":"Grid"},{"value":"list","label":"List"}], "default": "grid" }
{ "type": "radio",      "id": "alignment",    "label": "Alignment",    "options": [{"value":"left","label":"Left"},{"value":"center","label":"Center"}] }
{ "type": "color",      "id": "bg_color",     "label": "Background",   "default": "#FFFFFF" }
{ "type": "color_scheme",  "id": "color_scheme", "label": "Color scheme", "default": "scheme-1" }
{ "type": "color_scheme_group", "id": "scheme_group", "label": "Color schemes" }
{ "type": "image_picker", "id": "image",      "label": "Image" }
{ "type": "video",      "id": "video",        "label": "Video" }
{ "type": "video_url",  "id": "video_url",    "label": "YouTube/Vimeo URL", "accept": ["youtube","vimeo"] }
{ "type": "url",        "id": "button_link",  "label": "Button link" }
{ "type": "product",    "id": "product",      "label": "Product" }
{ "type": "product_list", "id": "products",   "label": "Products", "limit": 12 }
{ "type": "collection", "id": "collection",   "label": "Collection" }
{ "type": "collection_list", "id": "collections", "label": "Collections", "limit": 8 }
{ "type": "blog",       "id": "blog",         "label": "Blog" }
{ "type": "page",       "id": "page",         "label": "Page" }
{ "type": "font_picker","id": "heading_font", "label": "Heading font", "default": "helvetica_n4" }
{ "type": "link_list",  "id": "menu",         "label": "Menu" }
{ "type": "liquid",     "id": "custom_liquid","label": "Custom Liquid" }
{ "type": "html",       "id": "custom_html",  "label": "Custom HTML" }
{ "type": "header",     "content": "Section label" }
{ "type": "paragraph",  "content": "Helpful description text" }
```

### JSON Template (Online Store 2.0)
```json
// templates/product.json
{
  "sections": {
    "main": {
      "type": "main-product",
      "blocks": {
        "vendor": { "type": "vendor",       "order": 0 },
        "title":  { "type": "title",        "order": 1 },
        "price":  { "type": "price",        "order": 2 },
        "variant_picker": { "type": "variant_picker", "order": 3 },
        "quantity_selector": { "type": "quantity_selector", "order": 4 },
        "buy_buttons": { "type": "buy_buttons", "order": 5 },
        "description": { "type": "description", "order": 6 }
      },
      "block_order": ["vendor","title","price","variant_picker","quantity_selector","buy_buttons","description"]
    },
    "recommendations": {
      "type": "product-recommendations",
      "order": 2
    }
  },
  "order": ["main","recommendations"]
}
```

---

## D. METAFIELDS & METAOBJECTS

### Accessing Metafields in Liquid
```liquid
{# Product metafield — namespace.key #}
{{ product.metafields.custom.care_instructions }}
{{ product.metafields.reviews.rating.value }}

{# Typed metafield values #}
{{ product.metafields.custom.size_guide | metafield_tag }}
{{ product.metafields.inventory.lead_time }}

{# Metafield types in Liquid #}
{{ product.metafields.custom.features.value }}      {# list.single_line_text #}
{{ product.metafields.custom.hero_image | image_url: width: 800 | image_tag }}   {# file_reference #}
{{ product.metafields.custom.related_products.value }}  {# list.product_reference #}

{# Page / Shop / Variant metafields #}
{{ page.metafields.seo.custom_title }}
{{ shop.metafields.custom.announcement }}
{{ variant.metafields.custom.color_hex }}
{{ article.metafields.custom.author_bio }}
```

### Metafield Schema (in section/settings_schema.json)
```json
{
  "type": "metafield",
  "id": "custom_metafield",
  "label": "Custom Data",
  "namespace": "custom",
  "key": "my_field"
}
```

### CLI — Pull Metafields
```bash
shopify theme metafields pull --store your-store.myshopify.com
```

### Metaobjects (Dynamic Content Types)
```liquid
{%- assign team_members = shop.metaobjects.team_member.values -%}
{%- for member in team_members -%}
  <div class="team-card">
    <img src="{{ member.photo | image_url: width: 400 | image_tag }}">
    <h3>{{ member.name }}</h3>
    <p>{{ member.role }}</p>
    <p>{{ member.bio }}</p>
  </div>
{%- endfor -%}
```

---

## E. PRODUCT & CART PATTERNS

### Add to Cart Form
```liquid
{%- form 'product', product, id: 'product-form', novalidate: 'novalidate' -%}
  <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">

  {%- if product.has_only_default_variant == false -%}
    {%- for option in product.options_with_values -%}
      <fieldset>
        <legend>{{ option.name }}</legend>
        {%- for value in option.values -%}
          <input type="radio"
                 id="{{ section.id }}-{{ option.position }}-{{ forloop.index0 }}"
                 name="{{ option.name }}"
                 value="{{ value | escape }}"
                 form="{{ product_form_id }}"
                 {% if option.selected_value == value %}checked{% endif %}>
          <label for="{{ section.id }}-{{ option.position }}-{{ forloop.index0 }}">
            {{ value }}
          </label>
        {%- endfor -%}
      </fieldset>
    {%- endfor -%}
  {%- endif -%}

  <button type="submit"
          name="add"
          {% if product.selected_or_first_available_variant.available == false %}disabled{% endif %}>
    {%- if product.selected_or_first_available_variant.available -%}
      {{ 'products.product.add_to_cart' | t }}
    {%- else -%}
      {{ 'products.product.sold_out' | t }}
    {%- endif -%}
  </button>
{%- endform -%}
```

### AJAX Add to Cart (JavaScript)
```javascript
async function addToCart(variantId, quantity = 1) {
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity }),
  });
  const data = await response.json();
  if (data.status === 422) throw new Error(data.description);
  return data;
}

async function getCart() {
  const response = await fetch('/cart.js');
  return response.json();
}

async function updateCart(updates) {
  const response = await fetch('/cart/update.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates }),  // { variantId: quantity }
  });
  return response.json();
}

async function removeFromCart(variantId) {
  return updateCart({ [variantId]: 0 });
}
```

### Cart Drawer Pattern
```liquid
{%- comment -%} snippets/cart-drawer.liquid {%- endcomment -%}
<cart-drawer class="drawer{% if cart == empty %} is-empty{% endif %}">
  <div id="CartDrawer" class="cart-drawer">
    <div id="CartDrawer-Overlay" class="cart-drawer__overlay"></div>
    <focus-trap>
      <details-modal>
        <div role="dialog"
             aria-modal="true"
             aria-label="{{ 'sections.cart.title' | t }}"
             tabindex="-1">
          <div class="drawer__header">
            <h2>{{ 'sections.cart.title' | t }} ({{ cart.item_count }})</h2>
            <button type="button" class="drawer__close">
              {% render 'icon-close' %}
            </button>
          </div>
          <div id="CartDrawer-CartItems" class="drawer__contents">
            {%- if cart != empty -%}
              {%- for line_item in cart.items -%}
                {% render 'cart-item', line_item: line_item %}
              {%- endfor -%}
            {%- else -%}
              <p>{{ 'sections.cart.empty' | t }}</p>
            {%- endif -%}
          </div>
          <div class="drawer__footer">
            <div class="cart-drawer__subtotal">
              <span>{{ 'sections.cart.subtotal' | t }}</span>
              <span>{{ cart.total_price | money_with_currency }}</span>
            </div>
            <a href="{{ routes.checkout_url }}" class="button">
              {{ 'sections.cart.checkout' | t }}
            </a>
          </div>
        </div>
      </details-modal>
    </focus-trap>
  </div>
</cart-drawer>
```

---

## F. PERFORMANCE & OPTIMIZATION

### Image Optimization (Always Use These Patterns)
```liquid
{# Responsive images with srcset #}
{%- assign widths = '165,360,535,750,1100,1500' -%}
{{ image
  | image_url: width: 1500
  | image_tag:
    loading: 'lazy',
    width: image.width,
    height: image.height,
    widths: widths,
    sizes: '(min-width: 1100px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)'
}}

{# Hero image — eager loading for LCP #}
{{ section.settings.image
  | image_url: width: 1920
  | image_tag:
    loading: 'eager',
    fetchpriority: 'high',
    widths: '375,550,750,1100,1500,1780,2000',
    sizes: '100vw'
}}

{# Placeholder for missing images #}
{%- if product.featured_image -%}
  {{ product.featured_image | image_url: width: 800 | image_tag: loading: 'lazy' }}
{%- else -%}
  {{ 'product-1' | placeholder_svg_tag: 'placeholder-svg' }}
{%- endif -%}
```

### Preload Critical Assets
```liquid
{# In theme.liquid <head> — preload hero section CSS #}
<link rel="preload" href="{{ 'section-image-banner.css' | asset_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">

{# Preload LCP image #}
{%- if section.index == 1 -%}
  <link rel="preload"
        as="image"
        href="{{ section.settings.image | image_url: width: 750 }}"
        imagesrcset="{{ section.settings.image | image_url: width: 750 }} 750w, {{ section.settings.image | image_url: width: 1500 }} 1500w">
{%- endif -%}
```

### Section CSS Scoping
```liquid
{# Load CSS only when section is used #}
{{ 'section-featured-products.css' | asset_url | stylesheet_tag }}

{# Inline critical CSS for above-fold sections #}
{%- if section.index == 1 -%}
  <style>
    .banner { /* critical styles */ }
  </style>
{%- endif -%}
```

### JavaScript Patterns (Web Components)
```javascript
// Dawn-style Web Component pattern
class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.querySelector('[name=id]');
    this.enableLoading = this.enableLoading.bind(this);
    this.disableLoading = this.disableLoading.bind(this);
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    if (this.submitButton.getAttribute('aria-disabled') === 'true') return;
    this.handleErrorMessage();
    this.enableLoading(true);

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);
    formData.append('sections', this.getSectionsToRender().map(s => s.id));
    formData.append('sections_url', window.location.pathname);
    config.body = formData;

    fetch(`${routes.cart_add_url}`, config)
      .then(res => res.json())
      .then(response => {
        if (response.status) {
          this.handleErrorMessage(response.description);
          return;
        }
        this.renderContents(response);
      })
      .catch(e => console.error(e))
      .finally(() => this.disableLoading());
  }

  enableLoading(focus = false) {
    this.submitButton.setAttribute('aria-disabled', true);
    this.submitButton.querySelector('.loading__spinner')?.classList.remove('hidden');
  }

  disableLoading() {
    this.submitButton.removeAttribute('aria-disabled');
    this.submitButton.querySelector('.loading__spinner')?.classList.add('hidden');
  }
}

customElements.define('product-form', ProductForm);
```

---

## G. CLI WORKFLOW — FULL COMMAND REFERENCE

### Setup
```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Authenticate
shopify auth login --store your-store.myshopify.com

# Check current store
shopify theme info
```

### Environment Config — `shopify.theme.toml`
```toml
[environments.production]
store = "your-store.myshopify.com"
theme = "123456789"  # Theme ID

[environments.staging]
store = "your-store.myshopify.com"
theme = "987654321"  # Staging theme ID
ignore = ["config/settings_data.json"]

[environments.development]
store = "your-dev-store.myshopify.com"
```

### Core Commands
```bash
# Development (live preview with hot reload)
shopify theme dev --store your-store.myshopify.com
shopify theme dev --environment development
shopify theme dev --theme-editor-sync   # Sync editor changes back to local

# Push (upload local → Shopify)
shopify theme push
shopify theme push --environment production
shopify theme push --unpublished         # Push without activating
shopify theme push --allow-live          # Allow pushing to live theme
shopify theme push --ignore "config/settings_data.json"

# Pull (download Shopify → local)
shopify theme pull
shopify theme pull --environment staging

# List themes
shopify theme list --store your-store.myshopify.com

# Package theme into ZIP
shopify theme package

# Check for Liquid errors
shopify theme check

# Publish a theme
shopify theme publish --theme 123456789

# Share preview link
shopify theme share

# Delete a theme
shopify theme delete --theme 123456789

# Get metafields
shopify theme metafields pull

# Profile Liquid performance
shopify theme profile --url "/products/my-product"
```

### `.shopifyignore`
```
# Never push local settings to production
config/settings_data.json

# Exclude node_modules
node_modules/
*.log
.DS_Store
```

### CI/CD Pipeline (GitHub Actions)
```yaml
name: Deploy Theme
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Shopify CLI
        run: npm install -g @shopify/cli @shopify/theme

      - name: Deploy to production
        run: |
          shopify theme push \
            --store ${{ secrets.SHOPIFY_STORE }} \
            --password ${{ secrets.SHOPIFY_PASSWORD }} \
            --theme ${{ secrets.THEME_ID }} \
            --allow-live
        env:
          SHOPIFY_FLAG_STORE: ${{ secrets.SHOPIFY_STORE }}
```

---

## H. COMMON PATTERNS

### Variant Selector with JavaScript
```liquid
<select name="id" id="ProductSelect-{{ section.id }}">
  {%- for variant in product.variants -%}
    <option
      value="{{ variant.id }}"
      {% if variant == product.selected_or_first_available_variant %}selected="selected"{% endif %}
      {% unless variant.available %}disabled{% endunless %}>
      {{ variant.title }}
      {%- if variant.available == false %} - {{ 'products.product.sold_out' | t }}{% endif %}
      - {{ variant.price | money }}
    </option>
  {%- endfor -%}
</select>
```

### Pagination
```liquid
{%- paginate collection.products by 24 -%}
  <ul class="product-grid">
    {%- for product in collection.products -%}
      {% render 'product-card', product: product %}
    {%- endfor -%}
  </ul>

  {%- if paginate.pages > 1 -%}
    <nav class="pagination">
      {%- if paginate.previous -%}
        <a href="{{ paginate.previous.url }}">&#x2190; Previous</a>
      {%- endif -%}
      {%- for part in paginate.parts -%}
        {%- if part.is_link -%}
          <a href="{{ part.url }}">{{ part.title }}</a>
        {%- else -%}
          <span class="current">{{ part.title }}</span>
        {%- endif -%}
      {%- endfor -%}
      {%- if paginate.next -%}
        <a href="{{ paginate.next.url }}">Next &#x2192;</a>
      {%- endif -%}
    </nav>
  {%- endif -%}
{%- endpaginate -%}
```

### Search Results
```liquid
{%- if search.performed -%}
  {%- if search.results_count == 0 -%}
    <p>No results for "{{ search.terms | escape }}"</p>
  {%- else -%}
    <p>{{ search.results_count }} results for "{{ search.terms | escape }}"</p>
    {%- for result in search.results -%}
      {%- case result.object_type -%}
        {%- when 'product' -%}  {% render 'product-card', product: result %}
        {%- when 'article' -%}  {% render 'article-card', article: result %}
        {%- when 'page' -%}     <a href="{{ result.url }}">{{ result.title }}</a>
      {%- endcase -%}
    {%- endfor -%}
  {%- endif -%}
{%- endif -%}
```

### Locale / Translation
```liquid
{# In Liquid #}
{{ 'general.search.placeholder' | t }}
{{ 'products.product.add_to_cart' | t }}
{{ 'sections.cart.item_count' | t: count: cart.item_count }}

{# en.default.json structure #}
{
  "general": {
    "search": { "placeholder": "Search", "submit": "Search" }
  },
  "products": {
    "product": {
      "add_to_cart": "Add to cart",
      "sold_out": "Sold out",
      "price": { "from_price": "From {{ price }}" }
    }
  }
}
```

### Settings Schema — Global Theme Colors
```json
{
  "name": "Colors",
  "settings": [
    {
      "type": "color_scheme_group",
      "id": "color_schemes",
      "label": "Color schemes",
      "definition": [
        {
          "type": "color",
          "id": "background",
          "label": "Background",
          "default": "#FFFFFF"
        },
        {
          "type": "color",
          "id": "on-background",
          "label": "Foreground",
          "default": "#121212"
        },
        {
          "type": "color",
          "id": "outline-button-labels",
          "label": "Buttons",
          "default": "#121212"
        },
        {
          "type": "color",
          "id": "button",
          "label": "Button background",
          "default": "#121212"
        },
        {
          "type": "color",
          "id": "button-label",
          "label": "Button label",
          "default": "#FFFFFF"
        }
      ],
      "role": {
        "announcement_bar_background": "scheme-1",
        "announcement_bar_link": "scheme-1",
        "background": { "solid": "background", "gradient": "background-gradient" },
        "border": "outline-button-labels",
        "button": "button",
        "button_label": "button-label",
        "link": "outline-button-labels",
        "text": "on-background"
      }
    }
  ]
}
```

---

## I. STOREFRONT API (Headless)

### GraphQL — Fetch Products
```javascript
const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage, endCursor }
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice { amount, currencyCode }
          }
          featuredImage { url, altText, width, height }
          variants(first: 10) {
            edges {
              node { id, title, availableForSale, price { amount } }
            }
          }
        }
      }
    }
  }
`;

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(
    `https://your-store.myshopify.com/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': 'YOUR_STOREFRONT_TOKEN',
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}
```

### GraphQL — Cart Operations
```javascript
const CREATE_CART = `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        cost { totalAmount { amount, currencyCode } }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise { ... on ProductVariant { id, title, price { amount } } }
            }
          }
        }
      }
    }
  }
`;
```

---

## J. DEBUGGING & COMMON ERRORS

### Liquid Debug Output
```liquid
{# Print all product properties #}
{{ product | json }}
{{ cart | json }}
{{ request | json }}

{# Check if variable exists #}
{% if product.metafields.custom.my_field != blank %}
  Has metafield
{% endif %}

{# Log to console via JS #}
<script>console.log({{ product | json }});</script>
```

### Theme Check
```bash
# Run theme check (Liquid linter)
shopify theme check

# Check specific files
shopify theme check sections/featured-products.liquid
```

### Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `img_url` deprecated | Using old filter | Replace with `image_url` |
| Section schema invalid JSON | Trailing comma or syntax error | Validate JSON at jsonlint.com |
| `content_for_header` missing | Not in `<head>` | Must be between `<head>` tags |
| `content_for_layout` missing | Not in body | Must be in `<body>` in theme.liquid |
| AJAX cart 422 | Variant unavailable | Check `available` before add |
| Metafield returns blank | Wrong namespace/key | Check Admin → Settings → Custom data |
| Render variable undefined | Snippet scope isolation | Pass variable explicitly in render tag |
| Section not in editor | Missing `presets` in schema | Add `"presets": [{"name": "..."}]` |

---

## Reference Files

- `references/liquid-objects.md` — All Liquid objects (product, cart, customer, shop, etc.)
- `references/section-schema-types.md` — Complete schema type reference
- `references/performance-checklist.md` — Performance audit checklist
- `references/design-patterns.md` — Common UI patterns with Liquid + CSS
