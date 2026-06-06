# Kendal Split-Screen Scroll — Technique Reference

Full source lives alongside this file. Use it as a template when building similar sites.

## Architecture

- **No scroll.** `overflow: hidden` on `html/body`. All motion is driven by JS transforms.
- **Fixed shell.** `.shell` is `position: fixed; inset: 0`. Everything lives inside it.
- **50/50 split.** `.panel--left` (names) and `.panel--right` (carousel) each `width: 50vw`.
- **4 JS modules:** `projects.js` (data), `stepscroll.js` (input), `loader.js` (intro), `main.js` (everything else).

## Key Techniques

### 1. Opposite-direction carousel
Left names scroll **down** (pos * nameStep), right thumbnails scroll **up** (-pos * thumbStep).
Both share the same integer `pos` counter. CSS `transition` with a custom ease handles the glide.

```js
nameEl.style.transform  = `translateY(calc(-50% + ${rel * nameStep}px)) scale(...)`;
thumbEl.style.transform = `translate(-50%, calc(-50% + ${-rel * thumbStep}px)) scale(...)`;
```

### 2. Seamless infinite loop
Build `N * 2` DOM tiles. `relOf(t)` returns the signed ring distance to the current position.
When a tile wraps past the seam, disable its transition for one frame so it snaps silently off-screen.

### 3. StepScroll
Accumulates `wheel.deltaY`. Once the threshold (14px) is crossed, fires one step and resets.
A 55ms interval prevents a fast fling from skipping multiple projects.

### 4. Shared-element open/close
On click: pin the thumbnail to its exact `getBoundingClientRect()` box with no transform, then
CSS-transition `top/left/width/height` to `0/0/50vw/100vh`. On close: reverse.
No duplicate image is created — the same DOM node is reused.

### 5. White-block reveal (left panel)
`.project-page` sits `position: fixed; width: 50vw; transform: translateY(-100%)`.
Adding `body.project-open` transitions it to `translateY(0)` — a white sheet slides down.
Text sections stagger in via `setTimeout` after the sheet has settled.

### 6. Paging layer (.pv)
Three pages per project. Left track panels translate `+(i - pg) * 100vh` (enter from bottom).
Right track panels translate `-(i - pg) * 100vh` (enter from top). Same `pos`-like integer `pg`.

### 7. Loader
Two images start at `translateY(100%)` and `translateY(-100%)`, then transition to 0.
After `BREATHE` ms the brand word's `letter-spacing` opens from `0.15em` → `0.5em`.
After `EXIT_AT` ms the images reverse back out, revealing the home page underneath.

## Design Tokens (CSS custom properties)

| Token | Value | Purpose |
|---|---|---|
| `--ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Luxurious ease-out used everywhere |
| `--dur` | `1500ms` | Carousel glide |
| `--hero-dur` | `950ms` | Thumbnail expand/contract |
| `--reveal-dur` | `820ms` | White-block slide |
| `--pv-dur` | `1725ms` | Project page push |
| `--name-step` | `18vh` | Vertical gap between names |
| `--thumb-step` | `67vh` | Vertical gap between thumbnails |
| `--thumb-w` | `44vw` | Centered thumbnail width |
| `--thumb-h` | `64vh` | Centered thumbnail height |

## Image folder structure

```
Visuals/
  project-01/  01.jpg  02.jpg  03.jpg  04.jpg  05.jpg
  project-02/  ...
```

Each project needs 5 images. `01.jpg` = carousel cover. `02-05.jpg` = detail pages.

## To replicate for a new client

1. Copy this folder.
2. Edit `projects.js` — update names, categories, folder paths.
3. Drop images into `Visuals/` matching the folder names.
4. Edit `index.html` — update brand name, menu items, project section copy.
5. Tweak CSS tokens to match the new brand palette and timing feel.
