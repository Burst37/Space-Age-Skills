---
name: shopify-theme-dev
version: 1.0
description: Full-stack Shopify theme development reference. Covers Liquid templating, theme architecture, Dawn-based customization, and Space Age design system integration.
allowed-tools: Read, Write, Bash
---

# SHOPIFY THEME DEV v1.0
## Space Age AI Solutions — Shopify Theme Development

## When to load this skill

- Building or customizing a Shopify theme
- User needs Liquid templating help
- Adding custom sections, blocks, or metafields
- Integrating VL-01 design system into a Shopify store

---

## THEME ARCHITECTURE

```
theme/
├── assets/          # CSS, JS, images, fonts
├── config/          # settings_data.json, settings_schema.json
├── layout/          # theme.liquid (global wrapper)
├── sections/        # Reusable page sections
├── snippets/        # Reusable Liquid partials
├── templates/       # Page templates (JSON)
└── locales/         # Translation strings
```

---

## LIQUID BASICS

```liquid
{% comment %} Variables {% endcomment %}
{% assign product_title = product.title %}

{% comment %} Output {% endcomment %}
{{ product.title }}
{{ product.price | money }}

{% comment %} If/else {% endcomment %}
{% if product.available %}
  <button>Add to cart</button>
{% else %}
  <button disabled>Sold out</button>
{% endif %}

{% comment %} For loop {% endcomment %}
{% for variant in product.variants %}
  {{ variant.title }}: {{ variant.price | money }}
{% endfor %}

{% comment %} Include snippet {% endcomment %}
{% render 'product-card', product: product %}
```

---

## SECTION SCHEMA STRUCTURE

```liquid
{% schema %}
{
  "name": "Section Name",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Default Text"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background Color",
      "default": "#050508"
    }
  ],
  "blocks": [
    {
      "type": "card",
      "name": "Card",
      "settings": [
        {
          "type": "text",
          "id": "card_title",
          "label": "Card Title"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Default"
    }
  ]
}
{% endschema %}
```

---

## VL-01 INTEGRATION INTO SHOPIFY

Add VL-01 CSS variables to `assets/base.css`:

```css
:root {
  --sa-surface-base: #050508;
  --sa-primary: #2979FF;
  --sa-font-heading: 'Orbitron', sans-serif;
  --sa-font-body: 'DM Sans', sans-serif;
}
```

Load Fontsource fonts in `layout/theme.liquid`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/orbitron@5/900.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5/latin.css">
```

---

## CLI COMMANDS

```bash
# Install Shopify CLI
npm install -g @shopify/cli

# Login and connect store
shopify auth login

# Pull current theme
shopify theme pull

# Push changes
shopify theme push

# Start dev server (live reload)
shopify theme dev

# List themes
shopify theme list
```

---

## WHAT TO AVOID

- Don't edit `theme.liquid` unless necessary — use sections instead
- Don't use inline styles when CSS variables are available
- Don't hardcode text strings — use `locales/en.default.json`
- Don't skip `settings_schema.json` for merchant-editable values
