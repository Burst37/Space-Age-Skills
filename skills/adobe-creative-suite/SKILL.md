# adobe-creative-suite

AI-powered Adobe Creative Cloud pipeline for image editing, design production, video, and asset management. Wraps Adobe Firefly, Photoshop API, Illustrator, InDesign, and Creative Cloud storage — all via MCP.

## Trigger

Use this skill when the user wants to:
- Edit, retouch, or enhance an existing image (tone, color, exposure, blur, grain, overlays)
- Remove or replace backgrounds using AI
- Generatively expand (uncrop) an image
- Vectorize a raster image
- Convert PDFs to InDesign or export IDML
- Merge data into layout or vector templates
- Find or recommend fonts for a project
- Upload, organize, or share assets in Creative Cloud
- Animate a design
- Preview assets inline or generate shareable links
- Create an Adobe Express document from HTML

## MCP Server

All tools are on the `Adobe_for_creativity` MCP server (prefix: `mcp__Adobe_for_creativity__`).

**MANDATORY**: Call `mcp__Adobe_for_creativity__adobe_mandatory_init` before ANY other Adobe tool in a session.

## Pre-flight

```
1. mcp__Adobe_for_creativity__adobe_mandatory_init()
2. mcp__Adobe_for_creativity__get_account_type()  ← confirm entitlements
```

## Workflow Map

### Image Editing Pipeline
```
Upload/locate asset
→ Apply adjustments (pick from below based on user need)
→ mcp__Adobe_for_creativity__image_apply_adjustments()  ← batch multiple edits
→ preview or export
```

**Adjustment tools** (use `image_apply_adjustments` to batch, or call individually):
- Tone: `image_apply_auto_tone`, `image_adjust_exposure`, `image_adjust_brightness_and_contrast`
- Color: `image_adjust_color_temperature`, `image_adjust_hsl`, `image_adjust_vibrance_and_saturation`, `image_adjust_highlights`, `image_adjust_dark_portions`, `image_adjust_light_portions`, `image_adjust_single_color_saturation`
- Effects: `image_add_grain`, `image_add_noise`, `image_apply_gaussian_blur`, `image_apply_lens_blur`, `image_apply_halftone`, `image_apply_glitch_effect`, `image_apply_monochromatic_tint`, `image_apply_color_overlay`
- Presets: `image_list_presets` → `image_apply_preset`

### AI-Powered Image Operations
```
mcp__Adobe_for_creativity__image_remove_background(asset_id)
mcp__Adobe_for_creativity__image_select_subject(asset_id)
mcp__Adobe_for_creativity__image_select_by_prompt(asset_id, prompt)
mcp__Adobe_for_creativity__image_invert_selection(asset_id)
mcp__Adobe_for_creativity__image_fill_area(asset_id, selection, prompt)   ← generative fill
mcp__Adobe_for_creativity__image_generative_expand(asset_id, direction, size)  ← uncrop
mcp__Adobe_for_creativity__image_vectorize(asset_id)   ← raster → vector SVG
mcp__Adobe_for_creativity__image_auto_straighten(asset_id)
mcp__Adobe_for_creativity__image_crop_and_resize(asset_id, width, height)
mcp__Adobe_for_creativity__change_background_color(asset_id, color)
```

### Asset Management (Creative Cloud)
```
mcp__Adobe_for_creativity__asset_search(query)          ← find existing assets
mcp__Adobe_for_creativity__asset_create_folders(path)
mcp__Adobe_for_creativity__asset_get_presigned_urls()   ← upload prep
mcp__Adobe_for_creativity__asset_initialize_file_upload → asset_add_file → asset_finalize_file_upload
mcp__Adobe_for_creativity__asset_preview_file(asset_id)
mcp__Adobe_for_creativity__asset_inline_preview(asset_id)
mcp__Adobe_for_creativity__asset_share_link(asset_id)
mcp__Adobe_for_creativity__asset_copy_assets(source, destination)
mcp__Adobe_for_creativity__asset_download_file(asset_id)
```

### Typography
```
mcp__Adobe_for_creativity__find_fonts(criteria)         ← search Adobe Fonts
mcp__Adobe_for_creativity__font_recommend(context)      ← AI font pairing
mcp__Adobe_for_creativity__get_fontkit_embed_url(font)  ← embed font in web
mcp__Adobe_for_creativity__fill_text(asset_id, text_layer, content)
```

### Print & Publishing
```
mcp__Adobe_for_creativity__convert_pdf_to_indd(pdf_asset_id)
mcp__Adobe_for_creativity__export_idml(indd_asset_id)
mcp__Adobe_for_creativity__prepare_indd_merge_template → document_merge_data_layout
mcp__Adobe_for_creativity__document_render_layout(template_id, data)
mcp__Adobe_for_creativity__document_render_vector(template_id, data)
mcp__Adobe_for_creativity__document_merge_data_vector(template_id, data)
mcp__Adobe_for_creativity__document_convert_pdf(asset_id)
```

### Animation & Video
```
mcp__Adobe_for_creativity__animate_design(asset_id, animation_type)
mcp__Adobe_for_creativity__video_render(asset_id)
mcp__Adobe_for_creativity__video_render_frame(asset_id, timecode)
mcp__Adobe_for_creativity__video_metadata(asset_id)
mcp__Adobe_for_creativity__video_resize(asset_id, width, height)
mcp__Adobe_for_creativity__media_enhance_speech(audio_asset_id)
mcp__Adobe_for_creativity__media_summarize(asset_id)
```

### Adobe Express
```
mcp__Adobe_for_creativity__export_html_to_express(html)    ← HTML → Express doc
mcp__Adobe_for_creativity__search_design(query)            ← find Express templates
mcp__Adobe_for_creativity__create_firefly_board(prompt)    ← AI mood board
```

### Stock
```
mcp__Adobe_for_creativity__asset_license_and_download_stock(stock_id)
```

## Output Patterns

- Always preview results inline with `asset_inline_preview` before presenting to user.
- For client deliverables, generate a shareable link with `asset_share_link`.
- Batch image edits with `image_apply_adjustments` rather than chaining individual calls.

## Space Age Context

- eBook cover polish: Higgsfield generates → Adobe CC finishes (color grade, font, layout).
- Brand asset production: vectorize logos, apply consistent color overlays, export to CC storage.
- Sales page images: generative expand hero shots, remove backgrounds for product cutouts.
- Client reports / templates: PDF → InDesign → merge data → render → share link.

## Slash Commands

- `/edit-image [asset_id]` — interactive image adjustment session
- `/remove-bg [asset_id]` — AI background removal
- `/expand-image [asset_id] [direction]` — generative expand/uncrop
- `/vectorize [asset_id]` — raster to vector
- `/find-fonts [description]` — font search + AI pairing
- `/animate [asset_id]` — animate a design
- `/pdf-to-indd [asset_id]` — convert PDF to editable InDesign
