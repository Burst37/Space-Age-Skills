# canva-design-engine

AI-powered design generation pipeline using Canva. Covers generating designs from prompts, brand kit enforcement, template workflows, multi-page documents, export to any format, and collaborative editing.

## Trigger

Use this skill when the user wants to:
- Generate a design from a text prompt (social post, ad, banner, presentation, flyer, etc.)
- Create a design from a brand template or kit
- Export designs to PNG, PDF, MP4, GIF, or other formats
- Resize an existing design for different platforms
- Merge multiple designs into one document
- Get the content/text of an existing Canva design
- Add comments or collaborate on a design
- Copy or duplicate a design as a starting point
- Upload an external asset (image, video) into Canva
- Build or publish a brand template for a client

## MCP Server

All tools are on the `Canva` MCP server (prefix: `mcp__Canva__`).

## Workflow Map

### Generate Design from Prompt
```
mcp__Canva__generate-design(prompt, format?)
→ returns design_id + edit URL
→ optionally: get-design-thumbnail(design_id) for preview
→ optionally: export-design(design_id, format) for final file
```

**Structured generation** (precise control over layout/content):
```
mcp__Canva__generate-design-structured(title, pages, brand_kit_id?)
```

### Brand Template Workflow
```
mcp__Canva__list-brand-kits()                          ← find available brand kits
mcp__Canva__search-brand-templates(query, brand_kit_id)
mcp__Canva__get-brand-template-dataset(template_id)    ← see fillable fields
mcp__Canva__create-design-from-brand-template(template_id, data)
→ export or share
```

### Edit Existing Design
```
mcp__Canva__start-editing-transaction(design_id)
→ mcp__Canva__perform-editing-operations(transaction_id, operations)
→ mcp__Canva__commit-editing-transaction(transaction_id)
   or mcp__Canva__cancel-editing-transaction(transaction_id)
```

### Export
```
mcp__Canva__get-export-formats(design_id)              ← see available formats
mcp__Canva__export-design(design_id, format, pages?)   ← PNG/PDF/MP4/GIF/PPTX/etc.
```

### Resize for Platforms
```
mcp__Canva__resize-design(design_id, width, height, unit?)
```
Common sizes:
- Instagram post: 1080×1080
- Story/Reel: 1080×1920
- YouTube thumbnail: 1280×720
- Facebook cover: 820×312
- LinkedIn banner: 1584×396
- Twitter/X header: 1500×500

### Read Design Content
```
mcp__Canva__get-design(design_id)                      ← metadata
mcp__Canva__get-design-pages(design_id)                ← page list
mcp__Canva__get-design-content(design_id)              ← full text/element content
mcp__Canva__get-presenter-notes(design_id)             ← presentation notes
```

### Merge / Combine
```
mcp__Canva__merge-designs(design_ids[])                ← combine into one doc
```

### Assets
```
mcp__Canva__upload-asset-from-url(url, name)           ← pull in external image/video
mcp__Canva__get-assets(asset_ids[])                    ← retrieve uploaded assets
```

### Collaboration
```
mcp__Canva__comment-on-design(design_id, message, page?)
mcp__Canva__list-comments(design_id)
mcp__Canva__reply-to-comment(comment_id, message)
mcp__Canva__request-outline-review(design_id)
```

### Folders & Organization
```
mcp__Canva__create-folder(name, parent_folder_id?)
mcp__Canva__search-folders(query)
mcp__Canva__move-item-to-folder(item_id, folder_id)
mcp__Canva__list-folder-items(folder_id)
```

### Brand Template Publishing
```
mcp__Canva__create-brand-template-draft(design_id)
mcp__Canva__publish-brand-template(draft_id, brand_kit_id)
```

### Copy & Duplicate
```
mcp__Canva__copy-design(design_id, title?)
mcp__Canva__create-design-from-candidate(candidate_id)  ← start from a variant
```

## Platform-Specific Prompt Patterns

### Social Media Ad
```
prompt: "Bold [product] ad for Instagram. [color palette]. [headline]. [CTA button]."
→ generate-design → resize to 1080×1080 → export PNG
→ resize to 1080×1920 for Story version
```

### Sales Page Hero Banner
```
prompt: "Wide hero banner for [product/service]. Dark background. [tagline]. Professional."
→ generate-design(format: "banner") → export PNG/PDF
```

### Presentation / Pitch Deck
```
generate-design-structured(title, pages: [{heading, body, visual_direction}])
→ export PPTX or PDF
```

### Email Header
```
generate-design → resize to 600×200 → export PNG
```

## Output Patterns

- Always get a thumbnail preview before presenting the final design URL to the user.
- For client work, export to the requested format AND provide the Canva edit URL so they can tweak.
- When brand kit exists, always pass `brand_kit_id` to enforce brand colors/fonts.

## Space Age Context

- Social content for eBook launches → generate 30-day batch of social graphics.
- Sales bot landing page assets → generate hero images, testimonial cards, CTA banners.
- Client deliverables → generate in Canva → export → upload to Adobe CC for archival.
- Chatbot UI mockups → generate wireframe-style designs → pass to Figma for dev handoff.

## Slash Commands

- `/design [prompt]` — generate design from prompt with auto format detection
- `/resize [design_id] [platform]` — resize for a named platform (instagram, youtube, etc.)
- `/export [design_id] [format]` — export to PNG/PDF/MP4/PPTX
- `/brand-template [query]` — find and fill a brand template
- `/social-batch [topic] [30]` — generate a batch of social graphics for the month
