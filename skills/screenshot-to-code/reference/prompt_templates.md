# User-turn prompt templates — verbatim from `backend/prompts/create/*.py`

Source: [abi/screenshot-to-code](https://github.com/abi/screenshot-to-code). Every message list the original app sends is `[{role: system, content: SYSTEM_PROMPT}, {role: user, content: <one of the templates below>}]`. Copied verbatim from the three `build_*_prompt_messages` functions, with the Python f-string substitutions spelled out underneath each one.

## Image input — `backend/prompts/create/image.py`

```
Generate code for a web page that looks exactly like the provided screenshot(s).

{selected_stack}
{design_system_block}

## Replication instructions

- Make sure the web page looks exactly like the screenshot.
- Use the exact text from the screenshot.
- Since our goal is to make the web page look as close to the screenshot as possible, we need to extract the exact image assets where possible and generate images for the assets that are not extractable.
- Extracting assets can be done with the extract_assets tool. After extracting assets, make sure to inspect the extracted image closely to ensure that it is what we want.
- When available, use edit_images for asset edits such as removing unwanted elements, batching independent edits into one call.
- If an extracted or supplied asset is visibly low-resolution or pixelated and must render larger, upscale it with edit_images—not CSS stretching or generate_images.
- If an asset in the original screenshot is not extractable (for example, occluded by other objects or is the background), when available, use generate_images to create image URLs from prompts (you may pass multiple prompts).

- {image_policy}

## Multiple screenshots

If multiple screenshots are provided, organize them meaningfully:

- If they appear to be different pages in a website, make them distinct pages and link them.
- If they look like different tabs or views in an app, connect them with appropriate navigation.
- If they appear unrelated, create a scaffold that separates them into "Screenshot 1", "Screenshot 2", "Screenshot 3", etc. so it is easy to navigate.
- For mobile screenshots, do not include the device frame or browser chrome; focus only on the actual UI mockups.
```

If the user supplied extra free-text instructions, the original app appends: `\n\nAdditional instructions: {text_prompt}`.

Images are attached to the same user turn as `image_url` content parts (`detail: "high"`), one per screenshot, *before* the text block above.

## Video input — `backend/prompts/create/video.py`

```
You have been given a video of a user interacting with a web app. You need to re-create the same app exactly such that the same user interactions will produce the same results in the app you build.

- Watch the entire video carefully and understand all the user interactions and UI state changes.
- Make sure the app looks exactly like what you see in the video.
- Pay close attention to background color, text color, font size, font family,
padding, margin, border, etc. Match the colors and sizes exactly.
- {image_policy}
- If some functionality requires a backend call, just mock the data instead.
- MAKE THE APP FUNCTIONAL using JavaScript. Allow the user to interact with the app and get the same behavior as shown in the video.
- Use SVGs and interactive 3D elements if needed to match the functionality shown in the video.

Analyze this video and generate the code.

{selected_stack}
{design_system_block}
```

Same `Additional instructions:` append rule as the image case. The video is attached as a data-URL content part before the text.

## Text-only input — `backend/prompts/create/text.py`

```
Generate UI for {text_prompt}.
{selected_stack}
{design_system_block}

# Instructions

- Make sure to make it look modern and sleek.
- Use modern, professional fonts and colors.
- Follow UX best practices.
- {image_policy}
```

## Substitution rules — verbatim from `backend/prompts/policies.py` and `backend/prompts/design_system.py`

`{selected_stack}` — `build_selected_stack_policy(stack)`:
```python
f"Selected stack: {stack}."
```
where `stack` is one of `html_css | html_tailwind | react_tailwind | bootstrap | ionic_tailwind | vue_tailwind` (`backend/prompts/prompt_types.py`, `Stack` literal).

`{image_policy}` — `build_user_image_policy(image_generation_enabled)`:
```python
if image_generation_enabled:
    "Image generation is enabled for this request. Use generate_images for missing assets when needed."
else:
    "Image generation is disabled for this request. Do not call generate_images. Use provided media, CSS effects, or placeholder URLs (https://placehold.co)."
```

`{design_system_block}` — `build_design_system_prompt_block(design_system)`. Empty string if no design system was supplied; otherwise:
```
## Design system

If the design system conflicts with other instructions, prioritize the design system.

<design_system>
{design_system.strip()}
</design_system>
```
