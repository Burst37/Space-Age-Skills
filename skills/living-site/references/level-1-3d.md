# Level 1: live 3D with Spline

## What earns its place
One showpiece per site, two at most. It should be the thing people screenshot.

| Worked | Did not |
|---|---|
| A character, big, full screen (a robot hero, a friendly bot that follows the cursor) | A glass orb that "doesn't add much" |
| The brand mark made of particles that chase the cursor and form the logo where it stops | A juice blob that drifted off screen with no purpose |
| A product part you can press (a glowing key, held and released) | A smoothie glass: glass and liquid read low-res when small |
| Three small interactive objects in a row (A, B, C), each reacting on hover | A jar as the hero (it replaced a film the client loved) |

Rules of thumb: characters and brand marks beat abstract props. Big beats small. Matte, clay-like
materials beat glass at small sizes. One clear interaction beats five.

## Three ways to get a scene

1. **Build it with the Spline MCP** (best). Load the authoring guides once, then `run_code` to build, a
   `PerspectiveCamera` + `setPlayCamera`, the HTML content document for motion and behaviour, then `publish_export`
   for a `my.spline.design/...` link.
2. **Embed a community scene.** The community page (`community.spline.design/file/<id>`) contains an iframe.
   Its src, `app.spline.design/file/<inner-id>?view=preview`, is viewable by anyone. The community id itself is
   not. Crop the viewer's two corner buttons by oversizing the iframe. Credit the author in the footer.
3. **Remix** a community scene into your own account, then treat it as option 1.

## Never trap the scroll
A Spline canvas swallows the mouse wheel. The page must always scroll.
- Put `runtime/spline-shield.js` on the page. It lays a clear shield over every Spline iframe.
- For your own scenes the shield forwards the pointer by `postMessage`. Add this listener as the first lines of the
  scene's HTML content document (after `await spline.ready`), with an element `#pad` that covers the screen:

```js
addEventListener('message', (e) => { const d = e.data; if (!d || !d.sp) return;
  const t = { move: 'pointermove', leave: 'pointerleave', down: 'pointerdown', up: 'pointerup', click: 'click' }[d.sp];
  const p = document.getElementById('pad');
  if (t && p) p.dispatchEvent(new (t === 'click' ? MouseEvent : PointerEvent)(t, { clientX: d.x * innerWidth, clientY: d.y * innerHeight, bubbles: true })); });
```

- The page can also send its own messages (`{ pulp: 'mango' }`) to switch states inside the scene.
- Community scenes play their own animation behind a plain shield. Never add a "click to play" pill or a
  "move your cursor" hint. Visitors find it, and the hint looks cheap.

## Spline MCP lessons (each one cost a debugging session)
- The default "personal" play camera exports blank. Add a `PerspectiveCamera`, set `rotation({x:0,y:0,z:0})`
  explicitly, and `setPlayCamera(cam)`.
- Turn light shadows off (`updateLight({ shadows: false })`). The shadow maps throw GPU errors in some browsers
  and the scene renders late or blank.
- Glass needs contrast behind it and a fresnel rim, or it reads as a flat milky disc.
  Recipe: physical shading with iridescence, a `depth` colour layer, `glass` with low roughness, a soft fresnel, opacity 0.9.
- 3D text wraps one letter per line: make one Text object per letter.
- Runtime vertex writes need a fresh array every frame (`verts.slice()`), or the mesh freezes.
- A thin ring is an `Ellipse` with `innerRadius: 97` (percent), not a torus.
- `moveInto` silently skips objects that do not exist yet: check the scene tree after grouping.
- Export links update with a short delay. A heavy scene can take 10 s to appear in a slow browser: fade the iframe
  in on load and show a soft CSS glow placeholder meanwhile.
- Plan calls: build in one big `run_code`, look once, fix once, set the HTML once, publish once. About 6 to 10 calls.

## Placing it on the page
- Hero: full bleed, the model big. Text sits in a calm zone (bottom left) or a split column, never over the face.
- Fade the model into the page with a mask (`mask: linear-gradient(#000 72%, transparent 98%)`) instead of a hard
  bottom edge.
- Lazy-load anything below the fold: `data-src` + IntersectionObserver with `rootMargin: '1200px 0px'`.
