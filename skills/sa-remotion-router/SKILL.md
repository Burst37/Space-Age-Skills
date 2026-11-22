---
name: sa-remotion-router
description: Router for Remotion (React video) work: create, preview, render, captions, maps, interactivity, upgrades, SaaS apps. Use when the user says Remotion, make a video in React, render a composition, add captions to a Remotion video, or edit in Remotion Studio.
---

# SA Remotion Router
Official Remotion agent skills, condensed into one router. Remotion = videos written as React components, rendered frame by frame.

## Setup
- New project: `npx create-video@latest` (see remotion-create). Existing: `npx remotion skills add` installs upstream skills.
- Preview: `npx remotion studio`. Render: `npx remotion render <CompId> out/video.mp4`.

## Route
| Need | Section |
|---|---|
| Rules for any Remotion code | remotion-best-practices, remotion-markup |
| New video | remotion-create (+ tailwind, video-layout) |
| Editable in Studio | remotion-interactivity |
| Captions / SRT / transcription | remotion-captions |
| Maps | remotion-maps |
| Audio/video file handling | remotion-multimedia (Mediabunny) |
| Export MP4 / still / OTIO | remotion-render |
| Upgrade versions | remotion-upgrade |
| App on Remotion (Player, Lambda) | remotion-saas |
| Docs search | remotion-docs |
| License check | remotion-license |

## Workflow
1. Read best-practices + markup. 2. Build compositions with `useCurrentFrame()`/`interpolate`/`spring`, never CSS animations or timers. 3. Preview in Studio, check frames. 4. Render only after preview approval.
- Overlap: HyperFrames (his `hyperframes` skill) is the default HTML-to-video engine; use this when Remotion is asked for or the project already uses it.

## Space Age rules (override anything in the appendices)
- Lean: do the job, no filler. Read the matching appendix section before acting; don't load everything.
- Ask Chuma before any paid API, credit spend, plan upgrade or new subscription. Use his existing subscriptions first. Never pay or deposit anything.
- Ask before publishing, posting, emailing or submitting a form anywhere.
- Borrow structure from third-party work, never its text, images, branding or code (clean-room via replica-skill-sa).
- Video generation: never a Grok video model (grok-imagine-video, "Grok Video"). Use Seedance 2.5/2.0 in Dreamina, Kling 4.0 or MiniMax H3. If the upstream text names Grok video, swap in one of those.

## Appendix A — Sub-skill index

| Sub-skill | When | Source |
|---|---|---|
| remotion-best-practices | Router for all Remotion skills | `skills/remotion-best-practices/SKILL.md` |
| remotion-captions | Transcribing, displaying and animating captions | `skills/remotion-captions/SKILL.md` |
| remotion-create | Create a new Remotion video | `skills/remotion-create/SKILL.md` |
| remotion-docs | Search Remotion documentation | `skills/remotion-docs/SKILL.md` |
| remotion-interactivity | Structures Remotion markup so layers, timing and styles are editable in Remotion Studio. Use when writing a new composition or restructuring existing markup. | `skills/remotion-interactivity/SKILL.md` |
| remotion-license | Find Remotion license information, FAQs, terms, and where to buy a license. | `skills/remotion-license/SKILL.md` |
| remotion-maps | Remotion Map animation knowledge | `skills/remotion-maps/SKILL.md` |
| remotion-markup | Content, animation and effects best practices | `skills/remotion-markup/SKILL.md` |
| remotion-multimedia | Interacting with Mediabunny | `skills/remotion-multimedia/SKILL.md` |
| remotion-render | Export a Remotion video, still image, or editable OpenTimelineIO timeline | `skills/remotion-render/SKILL.md` |
| remotion-saas | Build an app with Remotion | `skills/remotion-saas/SKILL.md` |
| remotion-studio | Preview a Remotion video | `skills/remotion-studio/SKILL.md` |
| remotion-upgrade | Upgrade Remotion, and related packages | `skills/remotion-upgrade/SKILL.md` |

## Appendix B — Router + all sub-skills

### `skills/remotion-best-practices/SKILL.md`
_Router for all Remotion skills_

##### Preserve user changes

Users may make edits in the code outside of the conversation.

If you detect a surprising change made in the meanwhile, don't overwrite it, assume it was intentional or ask for confirmation.

##### Creating a video

If the user asks to make, create, or build a new video or composition, load [Create a new Remotion video](./remotion-create/REFERENCE.md), whether or not a Remotion project already exists.

##### New project setup

If no Remotion project currently exists, load [Create a new Remotion project](./remotion-create/REFERENCE.md)

##### React Markup Best Practices

If you are writing Remotion React Markup, load [Remotion Markup Best Practices](./remotion-markup/REFERENCE.md)

##### Maps

For static maps, animated routes and markers, geographic explainers, Mapbox, MapLibre, MapTiler, GeoJSON, or 3D geographic flyovers, load [Remotion Maps](./remotion-maps/REFERENCE.md).

##### Multimedia

For achieving multimedia tasks in the browser, such as trimming, cropping videos, or getting metadata from them, load [Remotion Multimedia](./remotion-multimedia/REFERENCE.md)

For video matting, background removal, or placing content behind a subject,
load [Remotion Markup](./remotion-markup/REFERENCE.md).

##### Interactivity

New markup is editable in Studio by default. When writing or restructuring markup, load [Interactivity Best Practices](./remotion-interactivity/REFERENCE.md).

##### Open the preview

When creating or editing a video, you SHOULD open Studio once the project can run, so the user can preview changes and steer.

###### If you are using Cursor

Run Studio without `--no-open` so it opens the browser automatically:

```bash
npx remotion studio
```

###### If you are using another agent client with an in-app browser

You can use the command above to let Studio open the browser, or run:

```bash
npx remotion studio --no-open
```

This will start a long-running process and print the server URL for the preview.  
If the server is already started, it will print the URL.
If you use `--no-open`, open the exact printed URL in the in-app browser and verify that Studio loads. Once a composition exists, verify that its video preview loads. If you cannot open it there, run Studio without `--no-open`.
You can visit a specific composition by navigating to `/[composition-id]`, for example `http://localhost:3000/MapAnimation`.

:::note
The Studio supports WebMCP tools.
:::

###### If you do not have an in-app browser

This will open the Studio in the browser or refocus it if it is already open.

```bash
npx remotion studio
```

###### More options

To launch a project in Remotion Studio, open its exact local URL, or configure Studio CLI flags, load [Remotion Studio](./remotion-studio/REFERENCE.md).

##### Render the video

Only render if the user is very explicit in asking for it.  
E.g. "Render the video", "Export", "Give me the MP4".

The preview also has a more intuitive rendering interface, so consider using it instead of the command line for rendering.

```
npx remotion render
```

For more options, see [Rendering](./remotion-render/REFERENCE.md).

For advanced rendering beyond simple `npx remotion render`, see: [Rendering Best Practices](./remotion-render/REFERENCE.md)

##### Captions

When working with Captions, load [Remotion Captions](./remotion-captions/REFERENCE.md).

##### Creating a SaaS, automation or application

Use the [Remotion SaaS skill](./remotion-saas/REFERENCE.md) for knowledge about Remotion-powered SaaS apps, such as `<Player>`, rendering on Lambda, Vercel, Cloudflare, via Express.js, client-side rendering, or for finding the right SaaS template.

##### Looking up Remotion APIs and documentation

To find and read current Remotion documentation, load [Remotion Docs](./remotion-docs/REFERENCE.md).

##### Licensing

For Remotion license information, FAQs, terms, or buying a license, load [Remotion License](./remotion-license/REFERENCE.md).

##### Upgrading

To upgrade Remotion, related packages, compatible Mediabunny packages, and installed Remotion Agent Skills, load [Remotion Upgrade](./remotion-upgrade/REFERENCE.md).

### `skills/remotion-captions/SKILL.md`
_Transcribing, displaying and animating captions_

All captions must be processed in JSON. The captions must use the [`Caption`](https://www.remotion.dev/docs/captions/caption.md) type which is the following:

```ts
import type { Caption } from "@remotion/captions";
```

This is the definition:

```ts
type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
  pageBreakAfter?: boolean;
};
```

##### Generating captions

To transcribe video and audio files to generate captions, load the [transcribe-captions.md](transcribe-captions.md) file for more instructions.

##### Displaying captions

To display captions in your video, load the [display-captions.md](display-captions.md) file for more instructions.

##### Importing captions

To import captions from a .srt file, load the [import-srt-captions.md](import-srt-captions.md) file for more instructions.

##### Post-creation

After you're done, load this skill: Remotion Best Practices (`remotion-best-practices` skill)

If not already done, open the Remotion Studio, unless instructed otherwise.

### `skills/remotion-create/SKILL.md`
_Create a new Remotion video_

These are instructions for making a new Remotion project and composition.  
If this is not the next task, see Remotion Best Practices (`remotion-best-practices` skill)

##### Scaffold a project

If a project already exists, skip this.
Ensure Node.js and Git is installed, and the current folder is appropriate for starting a new project.
`create-video` also installs the dependencies. If it logs an error while installing them, run `npm i` in the project.

Inspect the current folder, including hidden files, before choosing where to scaffold.

###### Empty folder

If it is empty, or contains only disposable operating-system metadata such as `.DS_Store`, create the project directly in the current folder.
Remove only those disposable metadata files first, since `create-video` rejects non-empty folders.
Do not treat all hidden files as disposable: files such as `.env` and directories such as `.git` are meaningful contents.

Scaffold in existing folder:

```bash
npx create-video@latest --yes --blank --no-tailwind .
```

###### Non-empty folder

If the current folder contains meaningful contents and no project already exists, scaffold into a new subfolder.
Replace `my-video` with a suitable project name.

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video
```

##### Open the preview before building the video

As soon as the project can run, open Remotion Studio (`remotion-studio` skill) in the browser before writing or changing the composition. For a new project, do this immediately after scaffolding and installing dependencies. For an existing project, do it before editing the video. Keep Studio running while you work so the user can see changes as they appear and steer the result.

##### Designing a video

Keep the scaffold and add React Markup.
Follow Remotion React Markup Best Practices (`remotion-markup` skill) and [Video Layout Rules](video-layout.md) for video-first layout and text sizing guidance.

Before writing the root that registers `<Composition>` or `<Still>` elements,
follow Compositions and stills (`compositions.md` in the `remotion-markup` skill).

##### Is this a timeline of clips?

If the video arranges multiple video or audio clips on a timeline, follow
Video editing (`video-editing.md` in the `remotion-markup` skill) before writing the
timeline. Give every clip that should be edited independently its own authored
JSX node.

##### Is this a multi-scene video?

If this is a video with multiple subsequent scenes, follow guidance at Multi-scene videos (`multi-scene-video.md` in the `remotion-markup` skill).

##### Interactivity Best Practices

Make new markup editable in Studio by default by following Remotion Interactivity Best Practices (`remotion-interactivity` skill).

##### TailwindCSS

If Tailwind is requested, see [tailwind.md](tailwind.md) for using TailwindCSS in Remotion.

##### Follow-up

The video creation process has finished.
For follow-up prompts, use Remotion Best Practices (`remotion-best-practices` skill)

### `skills/remotion-docs/SKILL.md`
_Search Remotion documentation_

This skill teaches you how to discover and read current Remotion documentation.
If this is not relevant, load Remotion Best Practices (`remotion-best-practices` skill) instead.

##### Searching the docs

Use the Algolia search API to find relevant documentation pages:

```
POST https://plsduol1ca-dsn.algolia.net/1/indexes/*/queries?x-algolia-api-key=3e42dbd4f895fe93ff5cf40d860c4a85&x-algolia-application-id=PLSDUOL1CA
Content-Type: application/x-www-form-urlencoded

{
  "requests": [
    {
      "query": "<your search query>",
      "indexName": "remotion",
      "params": "attributesToRetrieve=[\"hierarchy.lvl0\",\"hierarchy.lvl1\",\"hierarchy.lvl2\",\"url\"]&hitsPerPage=10"
    }
  ]
}
```

Each hit contains a `url` field pointing to the documentation page.

##### Fetching a page as Markdown

Append `.md` to any Remotion docs URL to retrieve its Markdown source (saves tokens):

```
https://www.remotion.dev/docs/use-video-config.md
https://www.remotion.dev/docs/sequence.md
https://www.remotion.dev/docs/lambda/rendermediaonlambda.md
```

##### Workflow

1. Search Algolia for the concept or API you need.
2. Pick the most relevant URL(s) from the results.
3. Fetch each URL with the `.md` suffix.
4. Implement using the current documentation rather than memorized API knowledge.

### `skills/remotion-interactivity/SKILL.md`
_Structures Remotion markup so layers, timing and styles are editable in Remotion Studio. Use when writing a new composition or restructuring existing markup._

Make markup editable in Studio by default. Keep a part programmatic only if it is
generated from external data or computed per frame, and tell the user it won't be
editable. Text you write yourself is not external data.

Studio edits the JSX nodes that create timeline items. Structure the code around
what the user should be able to select, move, trim, or style independently.
Keep editable values inline on each instance.

Before writing a scene or refactoring its layers, read
[editable timeline structure](timeline-structure.md). It covers editing units,
tracks, shared timing, plain layout containers, and a complete component-to-root
example. For a timeline built from footage, also read
editable video timelines (`video-editing.md` in the `remotion-markup` skill).

Use connected compositions (`connected-compositions.md` in the `remotion-markup` skill) when
a scene or reusable group needs its own timeline. Validate both its standalone
view and the full parent timeline; a connection alone does not guarantee fewer
visible rows.

##### Choose schema fields

Each key in the schema is a prop that Studio can read and edit at the call site.
Props that are not in the schema still work, but are not editable in Studio.
Keys may use dot notation, such as `style.color`.

| Type                                                                         | Use for                                                      | Keyframable   |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------- |
| `string`                                                                     | Strings, such as a title, prompt, or code snippet            | No            |
| `number`                                                                     | Numbers, with optional `min`, `max`, `step`, `integer`       | Yes           |
| `boolean`                                                                    | On/off switches                                              | Yes (hold)    |
| `color`                                                                      | CSS color strings                                            | Yes           |
| `enum`                                                                       | A choice between `variants`, each with its own nested schema | Opt-in (hold) |
| `array`                                                                      | Lists of numbers, colors, enums and more                     | No            |
| `asset`                                                                      | Media sources, with optional `assetType`                     | No            |
| `font-family`                                                                | CSS font family                                              | No            |
| `font-weight`                                                                | Font weight                                                  | Yes           |
| `translate`, `scale`, `rotation-css`, `rotation-degrees`, `transform-origin` | Transforms                                                   | Yes           |
| `uv-coordinate`                                                              | A normalized `[x, y]` point on the element                   | Yes           |
| `svg-path`                                                                   | SVG path data                                                | Yes           |
| `remotion-captions`                                                          | `Caption[]` data                                             | No            |
| `hidden`                                                                     | A value kept out of the controls                             | —             |

Every field needs a `default` and should have a `description`, which Studio shows as the label.
Set `keyframable: false` to show a static control.

Expose content and per-instance appearance, such as the text and an accent color.
Do not add fields for `style.translate`, `style.scale`, `style.rotate`, `style.transformOrigin` and `style.opacity`: `Interactive.create()` adds them automatically.

To make CSS properties of the root editable per instance, spread the built-in schema fragments:

```tsx
const cardSchema = {
  ...Interactive.textSchema, // style.color, style.fontSize, style.fontWeight, ...
  ...Interactive.backgroundSchema, // style.backgroundColor
  ...Interactive.borderRadiusSchema, // style.borderRadius, ...
} as const satisfies InteractivitySchema;
```

Also available: `Interactive.borderSchema`, and `Interactive.captionsSchema` for components that accept captions.
For components that accept `React.ReactNode` children, add `...Interactive.childrenSchema`.
It provides controls for children content and may evolve to support richer content.
Currently, it uses a string field labeled "Text" with a default of `''`.
If a component requires string-only children, declare an explicit `children` field with `type: 'string'` instead.
`Interactive.textSchema` controls typography styles; `childrenSchema` controls content.
The children fragment is not included in `baseSchema` or automatically added to custom components.
Nested markup and computed children are currently read-only.
`text-content` is a deprecated alias for the `string` field type.
See [`InteractivitySchema`](https://www.remotion.dev/docs/interactivity-schema) for all options.

##### Make an HTML element interactive using `Interactive`

Every HTML and SVG element (except `<Img>`, it already is interactive) such as `<div>` can be turned interactive using `Interactive`:

```tsx title="Interactive elements"
<Interactive.Div
  name="Greeting card"
  style={{fontSize: 80, padding: 24}}
>
  Hello
</Interactive.Div>
```

Use this for text or graphics that need independent controls. Keep layout-only
containers and decorative internals as plain HTML; an interactive component
already provides controls for its root.

##### Prefer inline text

If text is fixed and only used once, write it directly inside the interactive element instead of extracting it into a constant.

```tsx title="Inline text"
// 👍 Fixed copy stays editable
<Interactive.Div name="Title">
  Remotion Best Practices
</Interactive.Div>
```

Use a prop or variable only when the text is dynamic or reused.

##### Give interactive elements a descriptive name

Add a `name` prop to elements to make them easily identifyable.
Avoid computed names, hardcode them.

```tsx title="Interactive names"
<>
  <Interactive.Div name="Hero title" style={{fontSize: 80}}>
    Launch day
  </Interactive.Div>
  <Img name="Avatar" src="https://remotion.media/image.jpeg" />
  <Video name="Background" src="https://remotion.media/video.mp4" />
  <Interactive.Div name="Title">
    Launch day
  </Interactive.Div>
</>
```

##### Keep all CSS styles inline

The best way is to just pass a plain object to `style` - no referring to constants, no object spreading, no math.

```tsx title="Interactive example"
<Interactive.Div
  style={{
    fontSize: 80,
    color: 'red',
  }}
>
  Hello World!
</Interactive.Div>
```

```tsx title="❌ Bad for interactivity"
const baseStyle = useMemo(() => {
  return {
    fontSize: 12 // ❌ Non-inline styles are not supported
  }
}, []);

<Interactive.Div
  style={{
    ...baseStyle, // ❌ Spreading is not supported
    color: RED, // ❌ Referring to constants is not supported
    scale: frame * 10 // ❌ Math is not supported
  }}
>
  Hello World!
</Interactive.Div>
```

##### Animate using `interpolate()`

Write animations as inline `interpolate()` calls on the property that changes.  
The output range, easing, extrapolation and `output` property should use hardcoded values.

The input range may additionally use `durationInFrames`, `fps`, `width` and `height` destructured directly from `useVideoConfig()`. Bare identifiers such as `durationInFrames`, multiplication with a number such as `2 * fps` or `fps * 2`, and subtraction of a number such as `durationInFrames - 1` are supported.

```tsx title="Inline values"
const {fps, durationInFrames} = useVideoConfig();

// 👍 Inline values can be standardized and keyframed
<Interactive.Div
  name="Product card"
  style={{
    color: 'white',
    fontSize: 80,
    scale: interpolate(frame, [0, fps], [0, 1], {
      easing: Easing.spring({damping: 200}),
      output: 'perceptual-scale',
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }),
    rotate: interpolate(frame, [0, 1 * fps], ['0deg', '20deg'], {
      easing: Easing.spring({damping: 200}),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }),
    translate: interpolate(
      frame,
      [durationInFrames - 30, durationInFrames],
      ['0px 0px', '0px 120px'],
      {
        easing: Easing.spring({damping: 200}),
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
      }
    ),
  }}
/>
```

```tsx title="❌ Bad interactivity"
const translateY = interpolate(frame, [0, 30], [0, 120]); // ❌ Math should be directly in the markup

<Interactive.Div
  name="Product card"
  style={{
    translate: translateY, // ❌ Only inline interpolate() calls are supported,
    rotate: interpolate(frame, [start, start + 10], [0, Math.PI]), // ❌ Cannot use math with arbitrary variables, cannot use constants
    scale: interpolate(anyVariable, [0, 30], [0, 1]) // ❌ Can only interpret the `frame` variable.
  }}
/>
```

##### Keep SVG paths editable with `Interactive.Path`

Use `<Interactive.Path>` from `remotion` instead of `<path>` inside an SVG to make the path visually editable.

Install `@remotion/paths` for path interpolation and Studio path keyframes:

```sh
npx remotion add @remotion/paths # If project uses npm
bunx remotion add @remotion/paths # If project uses bun
yarn remotion add @remotion/paths # If project uses yarn
pnpm exec remotion add @remotion/paths # If project uses pnpm
```

If the geometry is meant to be static, put the path string directly in the `d` prop. Do not extract it into a constant.

```tsx title="Editable static path"
import {Interactive} from 'remotion';

<Interactive.Svg width={300} height={300} viewBox="0 0 300 300">
  <Interactive.Path
    name="Triangle"
    d="M 40 40 L 260 40 L 150 260 Z"
    fill="#0b84f3"
  />
</Interactive.Svg>
```

###### Morph paths using inline `interpolatePaths()`

Use `interpolatePaths()` from `@remotion/paths` directly in `d`.  
It accepts a frame, an input range, an equally sized array of path strings, and options for easing, extrapolation, and posterization.
Keep the output paths, ranges, and options inline, following the same input-range rules as `interpolate()` above.  
Do not use `interpolatePath()` API or extract the interpolated result into a variable when the path keyframes should remain editable in Studio.

```tsx title="Editable path keyframes"
import {interpolatePaths} from '@remotion/paths';
import {Easing, Interactive, useCurrentFrame} from 'remotion';

export const MorphingPath = () => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Svg width={300} height={300} viewBox="0 0 300 300">
      <Interactive.Path
        name="Morphing triangle"
        d={interpolatePaths(
          frame,
          [0, 30, 60],
          [
            'M 40 40 L 260 40 L 150 260 Z',
            'M 40 150 L 150 40 L 260 150 Z',
            'M 40 260 L 150 40 L 260 260 Z',
          ],
          {
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        )}
        fill="#0b84f3"
      />
    </Interactive.Svg>
  );
};
```

Studio can edit the path at the current frame, add or move keyframes, and adjust their easing.  
Use `strokeDasharray` and `strokeDashoffset` to evolve paths.

##### Use `scale`, `translate`, `rotate` CSS properties

Avoid the `transform` CSS property.  
If possible, use `scale`, `rotate` and `translate` instead because only they are interactively editable.

##### Keep composition metadata inline

When scaffolding a composition, use a JSX string literal for `id`, keep `width`, `height`, `fps`, `durationInFrames` and `defaultProps` inline and make no type assertions.

The Props editor can save visual edits back to your code when `defaultProps` is an inline object literal on `<Composition>` or `<Still>`.

```tsx
import {Composition, type CalculateMetadataFunction} from 'remotion';
import {MyComponent, type Props} from './MyComponent';

// 👍 Static values are in <Composition>, dynamic values are in calculateMetadata()
const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const dimensions = await getDimensions(); // just an example
  return {width: dimensions.width, height: dimensions.height};
};

<Composition
  id="my-video"
  component={MyComponent}
  durationInFrames={150}
  fps={30}
  calculateMetadata={calculateMetadata}
  defaultProps={{title: 'Hello', color: '#0b84ff'}}
/>
```

```tsx title="Negative examples"
const defaultProps = {title: 'Hello', color: '#0b84ff'}; // ❌ Don't extract defaultProps, must be inline
const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  // ❌ Unnecessary because no calculation is being done,
  return {durationInFrames: 150, fps: 30, width: 1920, height: 1080};
};

<Composition
  id="my-video"
  component={MyComponent}
  calculateMetadata={calculateMetadata}
  defaultProps={{
    title: 'Hello',
  } as Props} // ❌ Don't have type assertions, instead type MyComponent correctly
/>
```

Use only `calculateMetadata()` for the part of the metadata that is dynamic.

##### Effects should be inline too

Keep effect arrays and parameters inline so their shape and keyframes remain editable. See [Inline effects](./inline-effects.md) for examples.

##### Making your own component interactive

To make a custom userland component interactive, use:
[Make a component interactive](https://www.remotion.dev/docs/studio/make-component-interactive.md)

##### Video editing

If a Remotion component mainly consists of video and audio clips, see Video editing (`video-editing.md` in the `remotion-markup` skill) for best practices on how to structure Remotion markup so the clips are interactively editable in the timeline.

### `skills/remotion-license/SKILL.md`
_Find Remotion license information, FAQs, terms, and where to buy a license._

#### Remotion License

For questions about Remotion licensing, read the relevant resource:

- [License](https://www.remotion.dev/docs/license.md)
- [License FAQ](https://www.remotion.dev/docs/license/faq.md)
- [Terms and Conditions](https://www.remotion.dev/docs/terms.md)

See [License & Pricing](https://www.remotion.dev/docs/license/pricing) to buy a license.

### `skills/remotion-maps/SKILL.md`
_Remotion Map animation knowledge_

#### Remotion Maps

Choose exactly one technique from the intended shot, then load only that technique's `TECHNIQUE.md`.
Every technique directory is self-contained and may be removed without breaking the others.

##### [Static map](techniques/static-map/TECHNIQUE.md)

- Requires you grab a satellite image and mount it in a `<Img>` tag, and animate on top

##### [Mapbox](techniques/mapbox/TECHNIQUE.md)

- Requires a Mapbox key
- Nicer styles by default
- Map can display a round globe when zoomed out
- Includes nice 3D buildings such as the Eiffel tower

##### [MapLibre](techniques/maplibre/TECHNIQUE.md)

- Requires no API key, fully free
- Does not include 3D building

##### [MapTiler](techniques/maptiler/TECHNIQUE.md)

- Uses MapTiler
- Annotations can be drawn on top of geographic features: borders, rivers, labels

##### [CesiumJS](techniques/cesium/TECHNIQUE.md)

- Flythroughs through terrain and mountains
- "Flight simulator" perspective

### `skills/remotion-markup/SKILL.md`
_Content, animation and effects best practices_

This is guidance for writing Remotion React Markup.
If this is not relevant, load Remotion Best Practices (`remotion-best-practices` skill) instead.

`MUST` marks requirements, `SHOULD` recommendations, `MAY` optional actions, and `CAN` capabilities. Apply them to the requested task.

##### Preserve user changes

Users may make edits in the code outside of the conversation.

If you detect a surprising change made in the meanwhile, don't overwrite it, assume it was intentional or ask for confirmation.

##### General rules

Keep `useCurrentFrame()` in the smallest component that needs it. Extract
frame-dependent audio volume, titles, and overlays into their own components
instead of subscribing the whole composition or scene; otherwise unrelated
descendants re-render on every frame. Preserve the existing frame coordinates
when extracting across timing boundaries, and keep editable interpolations
inline on the item's props.

Inside a composition or scene component, get `fps` from `useVideoConfig()` for
all seconds-to-frames calculations, including timing props such as `from`,
`trimBefore` and `durationInFrames`. Keeping the expression on
the JSX node, such as `trimBefore={4 * fps}`, lets Studio edit the timing and
keeps it correct if the composition frame rate changes.

Drive animations using `useCurrentFrame()` and `interpolate()`.  
CSS `transition` or `animation` will not render correctly, they need to refactored.  
Tailwind animation class will not render correctly, they need to be refactored.

Use `Easing.bezier()` and `Easing.spring()` to customize timing.

Before choosing the markup hierarchy, read
editable timeline structure (`timeline-structure.md` in the `remotion-interactivity` skill).
Choose editing units first, then the tracks or shared timing boundaries they
need. It includes a complete example with interactive components and their
registrations. For source-editable styles, schemas, and keyframes, see
Remotion Interactivity (`remotion-interactivity` skill).

```tsx
import { useCurrentFrame, useVideoConfig, Easing, interpolate, Interactive } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <Interactive.Div
      name="Title"
      style={{
        opacity: interpolate(frame, [0, 2 * fps], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      Hello World!
    </Interactive.Div>
  );
};
```

Keep the `interpolate()` call inline in the `style` prop.
Use `scale`, `translate`, `rotate` CSS properties over `transform`.

```tsx
// 👍 Inline editable keyframes and transform shorthands
style={{
  scale: interpolate(frame, [0, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 200}),
    output: 'perceptual-scale' // For `scale` animations, use "output: 'perceptual-scale'"
  }),
  translate: interpolate(frame, [0, 100], ["0px 0px", "100px 100px"], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 200}),
  }),
  rotate: interpolate(frame, [0, 100], ["20deg", "90deg"], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.spring({damping: 200}),
  }),
}}

// 👎 Non-inline values and transform strings become harder to edit in Studio
const scale = interpolate(frame, [0, 100], [0, 1]);

style={{
  transform: `scale(${scale})`,
}}
```

##### Assets

Place assets in the `public/` folder at your project root.
Use `staticFile()` to reference files from the `public/` folder.

##### Media components

Add video and audio using `<Video>` and `<Audio>` from `@remotion/media`.  
Add images using the `<CanvasImage>` component.
Add animated GIFs, APNG, WebP or AVIF images using `<AnimatedImage>`, use `@remotion/gif` if not using Chrome.
Use `staticFile()` for files in `public/` or pass a remote URL directly:

```tsx
import { Audio, Video } from "@remotion/media";
import { staticFile, CanvasImage, AnimatedImage } from "remotion";

export const MyComposition = () => {
  return (
    <>
      <Video src={staticFile("video.mp4")} style={{ opacity: 0.5 }} />
      <Audio src={staticFile("audio.mp3")} />
      <CanvasImage
        src={staticFile("logo.png")}
        style={{ width: 100, height: 100 }}
      />
      <Video src="https://remotion.media/video.mp4" />
      <AnimatedImage src={staticFile('nyancat.gif')} />
    </>
  );
};
```

If the composition is primarily a timeline of video or audio clips, read
[video-editing.md](video-editing.md) before choosing its source structure.

##### Delaying, trimming

Use [sequencing](sequencing.md) to choose the timing boundary and
[timing props](timing-props.md) for the supported props and order of operations.

##### Maps

See [Remotion Maps](./remotion-maps/REFERENCE.md) if wanting to include maps in the video.

##### Text highlights and annotations

See [text-highlights.md](text-highlights.md) for text highlights (highlight markers), circles, underlines, strike-throughs, crossed-off text, boxes.

##### Multi-scene videos

See [multi-scene-video.md](multi-scene-video.md) if planning to make a video with multiple subsequent scenes.

##### Connected compositions

Read [connected compositions](connected-compositions.md) when a scene or group
needs its own editable timeline, or when handling a Studio pre-compose request.
It covers extraction, registration, inherited styles, and verification in both
the parent and standalone views.

##### Embedding Videos

See [embedding-videos.md](embedding-videos.md) for advanced knowledge about embedding videos - trimming, volume, speed, looping, pitch.

##### Embedding Audio

See [audio.md](audio.md) for advanced audio features like trimming, volume, speed, pitch.

##### Cropping

See [cropping.md](cropping.md) if needing to crop the visible rectangle of a component.

##### Video matting

For background removal, text behind a subject, background blur or replacement,
and effects applied only to a subject, read [video-matting.md](video-matting.md).
Generate reusable foreground layers with `@remotion/video-matting` before composing them.

##### Transitions

See [transitions.md](transitions.md) for scene transition patterns.

##### Motion blur

When adding motion blur or a movement trail, read [motion-blur.md](motion-blur.md) for `<HtmlInCanvasMotionBlur>`, transition `motionBlur`, Studio controls, and preview requirements.

##### Visual and pixel effects

When adding a visual effect, first identify the element or group it should affect.
If the target component supports `effects` and a built-in effect below matches the
request, prefer that effect over a CSS approximation. For example, apply
`vignette()` directly to a `<Video>`'s `effects` prop when the vignette should
affect that video.

These components accept `effects` directly:

| Import from        | Components                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `remotion`         | `<Img>`, `<CanvasImage>`, `<AnimatedImage>`, `<Solid>`, `<HtmlInCanvas>`                                                      |
| `@remotion/media`  | `<Video>`                                                                                                                     |
| `@remotion/gif`    | `<Gif>`                                                                                                                       |
| `@remotion/rive`   | `<RemotionRiveCanvas>`                                                                                                        |
| `@remotion/shapes` | `<Arrow>`, `<Callout>`, `<Circle>`, `<Ellipse>`, `<Heart>`, `<Pie>`, `<Polygon>`, `<Rect>`, `<Spark>`, `<Star>`, `<Triangle>` |

Ordinary HTML elements, `<Interactive.*>` DOM wrappers, `<AbsoluteFill>`, and
`<Sequence>` do not accept `effects` directly. To apply effects to their content,
wrap them in `<HtmlInCanvas>` and put the `effects` prop on the wrapper.

For other elements, prefer regular HTML and CSS where suitable. Consider wrapping
a group in [`<HtmlInCanvas>`](html-in-canvas.md) when post-processing the whole
group is appropriate and the environment supports it.

Read [effects.md](effects.md) before applying an effect for imports, parameters,
and setup. It also covers reusable custom effects with `createEffect()` when no
built-in effect matches.

###### Available effects

Built-in effects from `@remotion/effects`:

- Color and tone: `brightness()`, `colorCorrection()`, `colorKey()`, `contrast()`, `curves()`, `duotone()`, `exposure()`, `grayscale()`, `hue()`, `invert()`, `levels()`, `linearGradient()`, `linearGradientTint()`, `lut()`, `saturation()`, `shadowsHighlights()`, `thermalVision()`, `tint()`, `vibrance()`, `whiteBalance()`.
- Blur and trails: `blur()`, `lightTrail()`, `linearProgressiveBlur()`, `radialProgressiveBlur()`, `regionBlur()`, `zoomBlur()`.
- Lighting: `dropShadow()`, `longShadows()`, `glow()`, `lightLeak()`, `shine()`, `starburst()`, `vignette()`.
- Distortion and transforms: `barrelDistortion()`, `chromaticAberration()`, `cornerPin()`, `fisheye()`, `mirror()`, `noiseDisplacement()`, `scale()`, `skew()`, `tile()`, `uvTranslate()`, `wave()`, `xyTranslate()`.
- Textures and patterns: `burlap()`, `checkerboard()`, `contourLines()`, `dotGrid()`, `emboss()`, `flannel()`, `gridlines()`, `halftone()`, `halftoneLinearGradient()`, `lines()`, `liquidContours()`, `noise()`, `paper()`, `pattern()`, `rings()`, `scanlines()`, `speckle()`, `tvSignalOff()`, `waves()`, `whiteNoise()`, `zigzag()`.
- Edges: `outline()`, `roughenEdges()`, `shrinkwrap()`, `tear()`.
- Pixelation and transitions: `evolve()`, `linearProgressivePixelate()`, `pixelate()`, `pixelDissolve()`, `radialProgressivePixelate()`, `venetianBlinds()`.

##### Color correction

Read [color-correction.md](color-correction.md) for primary adjustments with
`colorCorrection()`, tonal mapping with `levels()` or `curves()`, their Studio
editors, and 3D `.cube` color grades with `lut()`.

##### 3D content

See [./3d.md](./3d.md) for 3D content in Remotion using Three.js and React Three Fiber.

##### Sound effects

When needing to use sound effects, load the [./sfx.md](./sfx.md) file for more information.

##### Audio visualization

When needing to visualize audio (spectrum bars, waveforms, bass-reactive effects), load the [./audio-visualization.md](./audio-visualization.md) file for more information.

##### Maps

For static maps, animated routes and markers, geographic explainers, Mapbox, MapLibre, MapTiler, GeoJSON, or 3D geographic flyovers, load [Remotion Maps](./remotion-maps/REFERENCE.md).

##### Captions

When dealing with captions or subtitles, load the Remotion Captions (`remotion-captions` skill) skill for more information.

##### Arabic and right-to-left text

For Arabic, Persian, Urdu or Hebrew text, read [arabic-text.md](arabic-text.md): set the base direction, animate by word, and split letters only in a way that keeps them joined.

##### Google Fonts

Is the recommended way to load fonts in Remotion. See [google-fonts.md](google-fonts.md) for how to load Google Fonts.

##### Local fonts

See [local-fonts.md](local-fonts.md) for how to load local fonts.

##### GIFs

See [gifs.md](gifs.md) for how to display GIFs synchronized with Remotion's timeline.

##### Advanced Images

See [images.md](images.md) for sizing and positioning images, dynamic image paths, and getting image dimensions.

##### Lottie animations

See [lottie.md](lottie.md) for embedding Lottie animations in Remotion.

##### Timing

See [timing.md](timing.md) for more timing techniques for `interpolate()`.

##### Parameterized videos

See [parameters.md](parameters.md) for making a composition parametrizable by adding a Zod schema.

##### Measuring DOM nodes

See [measuring-dom-nodes.md](measuring-dom-nodes.md) for measuring DOM element dimensions in Remotion.

##### Measuring text

See [measuring-text.md](measuring-text.md) for measuring text dimensions, fitting text to containers, and checking overflow.

##### Using FFmpeg

For some video operations, such as trimming videos or detecting silence, FFmpeg should be used. Load the [./ffmpeg.md](./ffmpeg.md) file for more information.

##### Silence detection

When needing to detect and trim silent segments from video or audio files, load the [./silence-detection.md](./silence-detection.md) file.

##### Dynamic duration, dimensions and data

See [calculate-metadata.md](calculate-metadata.md) for dynamically set composition duration, dimensions, and props.

##### Compositions and stills

Before registering `<Composition>` or `<Still>` elements, read [compositions.md](compositions.md) for source-editable registrations, folders, default props and nesting. For Studio navigation into a scene's own timeline, use [connected compositions](connected-compositions.md).

##### Advanced sequencing

See [sequencing.md](sequencing.md) for more sequencing patterns - delay, trim, limit duration of items.

##### Install modules

Use `npx remotion add` to add new packages with the right version:

```
npx remotion add @remotion/media
```

This goes for `@remotion/*` packages, `mediabunny`, `@mediabunny/*`, `zod`, and `@huggingface/transformers`.

##### Visual checks

Visual changes CAN be inspected in Remotion Studio (`remotion-studio` skill)
or rendered frames (`remotion-render` skill). Comparisons CAN include visible
layers, cut timing, and synchronized content across the full composition and
connected components.

### `skills/remotion-multimedia/SKILL.md`
_Interacting with Mediabunny_

Mediabunny is a multimedia library for dealing with audio and video in the browser.
Here is a compact overview of its capabilities: https://mediabunny.dev/llms.txt

##### Getting audio duration

See [get-audio-duration.md](get-audio-duration.md) for getting the duration of an audio file in seconds with Mediabunny.

##### Getting video dimensions

See [get-video-dimensions.md](get-video-dimensions.md) for getting the width and height of a video file with Mediabunny.

##### Getting video duration

See [get-video-duration.md](get-video-duration.md) for getting the duration of a video file in seconds with Mediabunny.

### `skills/remotion-render/SKILL.md`
_Export a Remotion video, still image, or editable OpenTimelineIO timeline_

##### General rendering strategy

Use Remotion's bundled browser for rendering, including compositions using
`<HtmlInCanvas>`. It includes the required browser APIs and Remotion's browser
fixes. Let Remotion download or update it as needed. Do not reuse a recording
browser or set `--browser-executable`, `browserExecutable`, or `chromeMode`
unless the user explicitly requests a different browser.

Render a video using:

```
npx remotion render [composition-id] out/video.mp4
```

Always pass the composition ID. Without it, Remotion shows an interactive picker, or fails in a non-interactive terminal. List the IDs with `npx remotion compositions`.

Full list of options: https://www.remotion.dev/docs/cli/render.md

##### Passing input props

Pass input props as inline JSON or as a path to a JSON file:

```
npx remotion render [composition-id] out/video.mp4 --props='{"title": "Hello"}'
npx remotion render [composition-id] out/video.mp4 --props=./props.json
```

Remotion shallow-merges input props over the `defaultProps` of the composition.
See https://www.remotion.dev/docs/passing-props.md.

##### License key

Companies that need a Remotion license (`remotion-license` skill) should
pass their license key to every render. Replace `YOUR_API_KEY` in this example
with that license key. If the user qualifies for the free license, pass
`free-license` instead.

```
npx remotion render [composition-id] out/video.mp4 --license-key=YOUR_API_KEY
```

Only pass `--license-key` if a key is available, since an empty value is not a valid key.
Add `--is-production=false` for test renders so that Remotion does not bill them.
See https://www.remotion.dev/docs/telemetry.md.

Render a still using:

```
npx remotion still
```

Full list of options: https://www.remotion.dev/docs/cli/still.md

To render several frames as images in one call, use `render --frames`:

```
npx remotion render [composition-id] out/frames --frames=0,30,90 --image-format=png
```

See https://www.remotion.dev/docs/cli/render.md#--frames for more options.

Remotion writes the frames as `element-[frame].[ext]`. It pads the frame number
with zeros to the number of digits of the highest rendered frame, so
`--frames=4,30` writes `element-04.png` and `element-30.png`. List the output
folder instead of guessing the filenames, or pass `--image-sequence-pattern`
to change the pattern.

##### Transparent videos

See [Transparent videos](./transparent-videos.md) for rendering out a video with transparency.

##### OpenTimelineIO export (optional)

When the user asks for an editable timeline for DaVinci Resolve, Adobe Premiere,
or another video editor, follow [Export to OpenTimelineIO](./opentimeline.md).
This workflow preserves editable media clips where possible and prerenders
unsupported elements. Use it only for requested timeline exports; ordinary video
and still renders use the commands above.

### `skills/remotion-saas/SKILL.md`
_Build an app with Remotion_

One can build apps with Remotion.  
It is possible to have a simple form and hook it up to a render, or have a complex video editor.

##### Choosing a template or a framework

We have several templates for SaaS which can be cloned or used as a reference.
See [Choosing a framework](framework.md) for help choosing a template or framework.

##### The `<Player>`

This component allows embedding a Remotion preview in a React app. See [Player](player.md) for more information about the Player.

##### Rendering

There are client-side and server-side rendering options available. See [Rendering](rendering.md) for advice on how to choose, and about the Lambda, Vercel, Node.js and Cloudflare options.

##### With Vue

See https://www.remotion.dev/docs/vue.md for how to use Remotion with Vue.

##### Angular

See https://www.remotion.dev/docs/angular.md for how to use Remotion with Angular.

##### Svelte

See https://www.remotion.dev/docs/svelte.md for how to use Remotion with Svelte.

### `skills/remotion-studio/SKILL.md`
_Preview a Remotion video_

When creating or editing a video, you SHOULD open Studio once the project can run, so the user can preview changes and steer.

In Cursor, run Studio without `--no-open` so the browser opens automatically:

```bash
npx remotion studio
```

In other agent clients, you can also let Studio open the browser automatically with the command above. If you have an in-app browser and intend to use it, run:

```bash
npx remotion studio --no-open
```

If the Studio is already opened, the URL will be printed and the command will exit.
Otherwise, a long-running process will start, and the URL will be printed.

When using `--no-open`, open the exact printed URL in the in-app browser and verify that Studio loads. Once a composition exists, verify that its video preview loads. Do not use `--no-open` if you cannot open the URL in the in-app browser.

##### Useful flags

| Argument          | Purpose                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `--log=<level>`   | Set `error`, `warn`, `info` (default), or `verbose` logging.                                  |
| `--port=<number>` | Request a Studio server port; otherwise Remotion finds a free port.                           |
| `--force-new`     | Start another Studio instance even when one is already running for the same project and port. |

### `skills/remotion-upgrade/SKILL.md`
_Upgrade Remotion, and related packages_

#### Upgrade Remotion

1. Inspect the project manifests and lockfile to identify the package manager and workspaces. Preserve unrelated changes.
2. Determine whether `@remotion/cli` is locally available. If it is, run:

   ```bash
   npx remotion upgrade
   ```

   This also updates project-local Remotion skills. Skip the manual upgrade below.

3. If `@remotion/cli` is not available, upgrade manually:
   - Get the latest stable Remotion version with `npm view remotion version`.
   - Find every installed `remotion` and `@remotion/*` dependency across the project and upgrade them all to that exact version. Preserve their dependency sections and the project's workspace or catalog conventions.
   - Read the `@remotion/studio` dependencies for the target Remotion version using `npm view @remotion/studio@<version> dependencies --json`. Align installed auxiliary packages such as `zod`, `mediabunny`, and `@huggingface/transformers` with the versions listed there. Use the `mediabunny` version for installed `@mediabunny/*` packages.
   - Run the project's package manager to update its lockfile.
4. If `@remotion/cli` is not available, update the installed Remotion skills:

   ```bash
   npx skills update remotion-best-practices remotion-captions remotion-create remotion-docs remotion-interactivity remotion-license remotion-maps remotion-markup remotion-multimedia remotion-render remotion-saas remotion-studio remotion-upgrade --yes
   ```

5. Review the manifest and lockfile diff. Ensure all Remotion packages use one version and installed auxiliary packages use their recommended versions. If the CLI is available, run `npx remotion versions` as an additional check.

The [Remotion releases](https://github.com/remotion-dev/remotion/releases) contain the changelog and may be useful for summarizing relevant changes after the upgrade.

## Appendix C — Sub-skill references

### `skills/remotion-markup/3d.md`
_3D content in Remotion using Three.js and React Three Fiber._

#### Using Three.js and React Three Fiber in Remotion

Follow React Three Fiber and Three.js best practices.  
Only the following Remotion-specific rules need to be followed:

##### Prerequisites

First, the `@remotion/three` package needs to be installed.  
If it is not, use the following command:

```bash
npx remotion add @remotion/three # If project uses npm
bunx remotion add @remotion/three # If project uses bun
yarn remotion add @remotion/three # If project uses yarn
pnpm exec remotion add @remotion/three # If project uses pnpm
```

##### Using ThreeCanvas

You MUST wrap 3D content in `<ThreeCanvas>` and include proper lighting.  
`<ThreeCanvas>` MUST have a `width` and `height` prop.

```tsx
import { ThreeCanvas } from "@remotion/three";
import { useVideoConfig } from "remotion";

const { width, height } = useVideoConfig();

<ThreeCanvas width={width} height={height}>
  <ambientLight intensity={0.4} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="red" />
  </mesh>
</ThreeCanvas>;
```

##### No animations not driven by `useCurrentFrame()`

Shaders, models etc MUST NOT animate by themselves.  
No animations are allowed unless they are driven by `useCurrentFrame()`.  
Otherwise, it will cause flickering during rendering.

Using `useFrame()` from `@react-three/fiber` is forbidden.

##### Animate using `useCurrentFrame()`

Use `useCurrentFrame()` to perform animations.

```tsx
const frame = useCurrentFrame();
const rotationY = frame * 0.02;

<mesh rotation={[0, rotationY, 0]}>
  <boxGeometry args={[2, 2, 2]} />
  <meshStandardMaterial color="#4a9eff" />
</mesh>;
```

##### Using `<Sequence>` inside `<ThreeCanvas>`

The `layout` prop of any `<Sequence>` inside a `<ThreeCanvas>` must be set to `none`.

```tsx
import { Sequence } from "remotion";
import { ThreeCanvas } from "@remotion/three";

const { width, height } = useVideoConfig();

<ThreeCanvas width={width} height={height}>
  <Sequence layout="none">
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4a9eff" />
    </mesh>
  </Sequence>
</ThreeCanvas>;
```

### `skills/remotion-markup/arabic-text.md`
_Arabic, Persian, Urdu and Hebrew text - base direction, word and letter animation that keeps Arabic letters joined, fonts._

#### Arabic and right-to-left text

##### Set the base direction

Put `dir="rtl"` and `lang` on the element that holds right-to-left text.

Words or letters wrapped in `display: inline-block` (needed for `translate`, `scale`, `rotate`) are neutral to the bidi algorithm. Without a base direction the line defaults to LTR, so the words are placed left to right and the sentence reads backwards, even though every word looks correct. This is the usual failure of word-by-word captions and karaoke highlights.

When the language comes from props, decide the direction from the words. Count words rather than reading the first letter, because Arabic captions often start with a Latin brand name:

```tsx
const RTL = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/;
const isRtl = (words: string[]) =>
  words.filter((w) => RTL.test(w)).length > words.length / 2;

<div dir={isRtl(words) ? 'rtl' : 'ltr'}>{/* word spans */}</div>
```

##### Animate words, not letters

Arabic letters change shape depending on their neighbours. `text.split('')`, `[...text]` or `Array.from(text)` put each letter in its own box, and a letter in an `inline-block` is shaped alone, so the word falls apart into isolated letters.

Prefer word-level or line-level animation for Arabic. Split on spaces, give the container `dir="rtl"`, animate each word.

##### Per-letter animation, if it is needed

Split into units that the browser can still join:

- keep harakat (vowel marks) in the same unit as their letter
- keep lam + alef (`لا`, `لأ`, `لإ`, `لآ`) as one unit, it is a ligature
- keep runs of digits and Latin as one unit, or an RTL line reverses them
- add a zero-width joiner (`\u200D`) on each side of a unit that connects to its neighbour, so each unit is drawn in its connected form

```tsx
const ZWJ = '\u200D';
const RIGHT_JOINING = /[\u0622-\u0625\u0627\u0629\u062F-\u0632\u0648\u0671-\u0673\u0675-\u0677\u0688-\u0699\u06C0\u06C3-\u06CB\u06CD\u06CF\u06D2\u06D3\u06D5]/;
const LETTER = /[\u0620-\u064A\u066E-\u06D3\u06D5\u06FA-\u06FC\u06FF]/;
const LTR_RUN = /^[0-9\u0660-\u0669\u06F0-\u06F9A-Za-z\u066B\u066C.,:%]+$/;
const MARK = /[\u064B-\u065F\u0670\u06D6-\u06ED]/;
const MARKS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u200D]/g;
const first = (u: string) => u.replace(MARKS, '')[0] ?? '';
const last = (u: string) => u.replace(MARKS, '').slice(-1);
const joinsPrev = (u: string) => LETTER.test(first(u)) && first(u) !== '\u0621';
const joinsNext = (u: string) =>
  LETTER.test(last(u)) && last(u) !== '\u0621' && !RIGHT_JOINING.test(last(u));

export const splitArabicLetters = (text: string): string[] => {
  const g: string[] = [];
  for (const ch of text) {
    if (MARK.test(ch) && g.length > 0) g[g.length - 1] += ch;
    else g.push(ch);
  }
  const units: string[] = [];
  for (let i = 0; i < g.length; i++) {
    if (LTR_RUN.test(g[i])) {
      let run = g[i];
      while (g[i + 1] && LTR_RUN.test(g[i + 1])) run += g[++i];
      units.push(run);
    } else if (first(g[i]) === '\u0644' && /[\u0622\u0623\u0625\u0627]/.test(first(g[i + 1] ?? ''))) {
      units.push(g[i] + g[++i]);
    } else {
      units.push(g[i]);
    }
  }
  return units.map((u, i) => {
    const before = i > 0 && joinsNext(units[i - 1]) && joinsPrev(u) ? ZWJ : '';
    const after = i < units.length - 1 && joinsNext(u) && joinsPrev(units[i + 1]) ? ZWJ : '';
    return before + u + after;
  });
};
```

Render the units in a container with `dir="rtl"`, one `inline-block` span per unit, and animate the spans as usual. In Remotion's Chrome renders the letters join exactly as in the unsplit word.

##### Fonts

Load an Arabic font explicitly, for example `@remotion/google-fonts/NotoSansArabic`, `IBMPlexSansArabic`, `Cairo` or `Tajawal`. See [google-fonts.md](google-fonts.md). A Latin-only font falls back to whatever Arabic font the render machine has.

Avoid `letterSpacing` and `textTransform` on Arabic text.

The ZWJ technique needs care outside Chrome: Safari draws a ZWJ-padded letter in a fallback font when the font has no U+200D glyph, so the same composition shown in the `<Player>` on an iPhone can mix two typefaces inside a word. Alexandria (as served by Google Fonts), IBM Plex Sans Arabic, Cairo and Tajawal have no U+200D glyph; Noto Sans Arabic and Noto Naskh Arabic do. Video renders are not affected.

### `skills/remotion-markup/audio-visualization.md`
_Audio visualization patterns - spectrum bars, waveforms, bass-reactive effects_

#### Audio Visualization in Remotion

##### Prerequisites

```bash
npx remotion add @remotion/media-utils
```

##### Loading Audio Data

Use `useWindowedAudioData()` (https://www.remotion.dev/docs/use-windowed-audio-data) to load audio data:

```tsx
import { useWindowedAudioData } from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
  src: staticFile("podcast.wav"),
  frame,
  fps,
  windowInSeconds: 30,
});
```

##### Spectrum Bar Visualization

Use `visualizeAudio()` (https://www.remotion.dev/docs/visualize-audio) to get frequency data for bar charts:

```tsx
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
  src: staticFile("music.mp3"),
  frame,
  fps,
  windowInSeconds: 30,
});

if (!audioData) {
  return null;
}

const frequencies = visualizeAudio({
  fps,
  frame,
  audioData,
  numberOfSamples: 256,
  optimizeFor: "speed",
  dataOffsetInSeconds,
});

return (
  <div style={{ display: "flex", alignItems: "flex-end", height: 200 }}>
    {frequencies.map((v, i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: `${v * 100}%`,
          backgroundColor: "#0b84f3",
          margin: "0 1px",
        }}
      />
    ))}
  </div>
);
```

- `numberOfSamples` must be power of 2 (32, 64, 128, 256, 512, 1024)
- Values range 0-1; left of array = bass, right = highs
- Use `optimizeFor: "speed"` for Lambda or high sample counts

**Important:** When passing `audioData` to child components, also pass the `frame` from the parent. Do not call `useCurrentFrame()` in each child - this causes discontinuous visualization when children are inside `<Sequence>` with offsets.

##### Waveform Visualization

Use `visualizeAudioWaveform()` (https://www.remotion.dev/docs/media-utils/visualize-audio-waveform) with `createSmoothSvgPath()` (https://www.remotion.dev/docs/media-utils/create-smooth-svg-path) for oscilloscope-style displays:

```tsx
import {
  createSmoothSvgPath,
  useWindowedAudioData,
  visualizeAudioWaveform,
} from "@remotion/media-utils";
import { staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { width, fps } = useVideoConfig();
const HEIGHT = 200;

const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
  src: staticFile("voice.wav"),
  frame,
  fps,
  windowInSeconds: 30,
});

if (!audioData) {
  return null;
}

const waveform = visualizeAudioWaveform({
  fps,
  frame,
  audioData,
  numberOfSamples: 256,
  windowInSeconds: 0.5,
  dataOffsetInSeconds,
});

const path = createSmoothSvgPath({
  points: waveform.map((y, i) => ({
    x: (i / (waveform.length - 1)) * width,
    y: HEIGHT / 2 + (y * HEIGHT) / 2,
  })),
});

return (
  <svg width={width} height={HEIGHT}>
    <path d={path} fill="none" stroke="#0b84f3" strokeWidth={2} />
  </svg>
);
```

##### Bass-Reactive Effects

Extract low frequencies for beat-reactive animations:

```tsx
const frequencies = visualizeAudio({
  fps,
  frame,
  audioData,
  numberOfSamples: 128,
  optimizeFor: "speed",
  dataOffsetInSeconds,
});

const lowFrequencies = frequencies.slice(0, 32);
const bassIntensity =
  lowFrequencies.reduce((sum, v) => sum + v, 0) / lowFrequencies.length;

const scale = 1 + bassIntensity * 0.5;
const opacity = Math.min(0.6, bassIntensity * 0.8);
```

##### Volume-Based Waveform

Use `getWaveformPortion()` (https://www.remotion.dev/docs/get-waveform-portion) when you need simplified volume data instead of frequency spectrum:

```tsx
import { getWaveformPortion } from "@remotion/media-utils";
import { useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const currentTimeInSeconds = frame / fps;

const waveform = getWaveformPortion({
  audioData,
  startTimeInSeconds: currentTimeInSeconds,
  durationInSeconds: 5,
  numberOfSamples: 50,
});

// Returns array of { index, amplitude } objects (amplitude: 0-1)
waveform.map((bar) => (
  <div key={bar.index} style={{ height: bar.amplitude * 100 }} />
));
```

##### Postprocessing

Low frequencies naturally dominate. Apply logarithmic scaling for visual balance:

```tsx
const minDb = -100;
const maxDb = -30;

const scaled = frequencies.map((value) => {
  const db = 20 * Math.log10(value);
  return (db - minDb) / (maxDb - minDb);
});
```

### `skills/remotion-markup/audio.md`
_Using audio and sound in Remotion - importing, trimming, volume, speed, pitch_

#### Using audio in Remotion

Use audio supplied by the user or generated with their chosen tools.
Save local audio files in `public/` and reference them with `staticFile()`, or pass a remote URL to `<Audio>`.

When scene timing follows the audio, measure each file with getAudioDuration (`get-audio-duration.md` in the `remotion-multimedia` skill) and use [calculateMetadata](calculate-metadata.md) to set the composition duration.
Account for [transition overlaps](transitions.md#calculating-total-composition-duration) when calculating the total duration.

##### Prerequisites

First, the @remotion/media package needs to be installed.
If it is not installed, use the following command:

```bash
npx remotion add @remotion/media
```

##### Importing Audio

Use `<Audio>` from `@remotion/media` to add audio to your composition.

```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Audio src={staticFile("audio.mp3")} />;
};
```

Remote URLs are also supported:

```tsx
import { Audio } from "@remotion/media";

<Audio src="https://remotion.media/audio.mp3" />
```

By default, audio plays from the start, at full volume and full length.
Multiple audio tracks can be layered by adding multiple `<Audio>` components.

##### Trimming

Use `trimBefore` to skip the beginning of the audio and `durationInFrames` to end it early. Values are in frames.

```tsx
import { Audio } from "@remotion/media";

const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    trimBefore={2 * fps} // Skip the first 2 seconds
    durationInFrames={8 * fps} // Play 8 seconds, until the 10 second mark
  />
);
```

The audio still starts playing at the beginning of the composition - only the specified portion is played.

##### Delaying

Set `from` directly on `<Audio>` to delay when it starts:

```tsx
import { staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";

const { fps } = useVideoConfig();

return (
  <Audio from={fps} src={staticFile("audio.mp3")} />
);
```

The audio will start playing after 1 second.

##### Volume

Set a static volume (0 to 1):

```tsx
import { Audio } from "@remotion/media";

<Audio src={staticFile("audio.mp3")} volume={0.5} />
```

Use `useCurrentFrame()` and `interpolate()` for keyframed volume:

```tsx
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    volume={interpolate(frame, [0, 1 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })}
  />
);
```

With Studio interactivity enabled, these keyframes can be edited and are shown as a volume curve in the timeline.

##### Muting

Use `muted` to silence the audio. It can be set dynamically:

```tsx
import { Audio } from "@remotion/media";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

return (
  <Audio
    src={staticFile("audio.mp3")}
    muted={frame >= 2 * fps && frame <= 4 * fps} // Mute between 2s and 4s
  />
);
```

##### Speed

Use `playbackRate` to change the playback speed:

```tsx
import { Audio } from "@remotion/media";

// 2x speed
<Audio src={staticFile("audio.mp3")} playbackRate={2} />
// Half speed
<Audio src={staticFile("audio.mp3")} playbackRate={0.5} />
```

Reverse playback is not supported.

##### Looping

Use `loop` to loop the audio indefinitely:

```tsx
import { Audio } from "@remotion/media";

<Audio src={staticFile("audio.mp3")} loop />
```

Put `name`, `from`, `loop`, and `volume` directly on `<Audio>`.

```tsx
import { Audio } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

<Audio
  src={staticFile("audio.mp3")}
  loop
  volume={interpolate(frame, [0, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })}
/>
```

##### Pitch

Use `toneFrequency` to adjust the pitch without affecting speed. Values range from 0.01 to 2:

```tsx
import { Audio } from "@remotion/media";

<Audio
  src={staticFile("audio.mp3")}
  toneFrequency={1.5} // Higher pitch
/>
<Audio
  src={staticFile("audio.mp3")}
  toneFrequency={0.8} // Lower pitch
/>
```

Pitch shifting only works during server-side rendering, not in the Remotion Studio preview or in the `<Player />`.

### `skills/remotion-markup/calculate-metadata.md`
_Dynamically set composition duration, dimensions, and props_

#### Using calculateMetadata

Use `calculateMetadata` on a `<Composition>` to dynamically set duration, dimensions, and transform props before rendering.
Use it when metadata depends on input props, fetched data, or asset metadata.
For static dimensions, duration, FPS, and initial props, inline the values on `<Composition>` instead.

```tsx
<Composition
  id="MyComp"
  component={MyComponent}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ videoSrc: "https://remotion.media/video.mp4" }}
  calculateMetadata={calculateMetadata}
/>
```

##### Setting duration based on a video

Use the `getVideoDuration` (`get-video-duration.md` in the `remotion-multimedia` skill) and `getVideoDimensions` (`get-video-dimensions.md` in the `remotion-multimedia` skill) skills to get the video duration and dimensions:

```tsx
import { CalculateMetadataFunction } from "remotion";
import { getVideoDuration } from "./get-video-duration";

const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const durationInSeconds = await getVideoDuration(props.videoSrc);

  return {
    durationInFrames: Math.ceil(durationInSeconds * 30),
  };
};
```

##### Matching dimensions of a video

Use the `getVideoDimensions` (`get-video-dimensions.md` in the `remotion-multimedia` skill) skill to get the video dimensions:

```tsx
import { CalculateMetadataFunction } from "remotion";
import { getVideoDuration } from "./get-video-duration";
import { getVideoDimensions } from "./get-video-dimensions";

const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const dimensions = await getVideoDimensions(props.videoSrc);

  return {
    width: dimensions.width,
    height: dimensions.height,
  };
};
```

##### Setting duration based on multiple videos

```tsx
const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const metadataPromises = props.videos.map((video) =>
    getVideoDuration(video.src),
  );
  const allMetadata = await Promise.all(metadataPromises);

  const totalDuration = allMetadata.reduce(
    (sum, durationInSeconds) => sum + durationInSeconds,
    0,
  );

  return {
    durationInFrames: Math.ceil(totalDuration * 30),
  };
};
```

##### Setting a default outName

Set the default output filename based on props:

```tsx
const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  return {
    defaultOutName: `video-${props.id}`, // .mp4 is added automatically
  };
};
```

##### Transforming props

Fetch data or transform props before rendering:

```tsx
const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
  abortSignal,
}) => {
  const response = await fetch(props.dataUrl, { signal: abortSignal });
  const data = await response.json();

  return {
    props: {
      ...props,
      fetchedData: data,
    },
  };
};
```

The `abortSignal` cancels stale requests when props change in the Studio.

##### Return value

All fields are optional. Returned values override the `<Composition>` props:

- `durationInFrames`: Number of frames
- `width`: Composition width in pixels
- `height`: Composition height in pixels
- `fps`: Frames per second
- `props`: Transformed props passed to the component
- `defaultOutName`: Default output filename
- `defaultCodec`: Default codec for rendering

### `skills/remotion-markup/color-correction.md`
_Correct exposure, white balance, and tone with primary adjustments, Levels, Curves, and 3D Cube LUTs._

#### Color correction

Apply color adjustments through the `effects` prop of `<Video>` from `@remotion/media`, or other supported components.  
See [effects.md](effects.md) for more context on effects.

##### Primary adjustments

Prefer [`colorCorrection()`](https://www.remotion.dev/docs/effects/color-correction) when combining adjustments.  
It performs them in one WebGL pass and exposes controls in the Studio.

| Control                 | Meaning and range                                                         | Neutral value |
| ----------------------- | ------------------------------------------------------------------------- | ------------- |
| `exposure`              | Stops, from `-5` to `5`; positive values brighten                         | `0`           |
| `temperature`           | From `-1` (cooler) to `1` (warmer)                                        | `0`           |
| `tint`                  | From `-1` (greener) to `1` (more magenta)                                 | `0`           |
| `shadows`, `highlights` | From `-1` to `1`; negative values darken, positive values lift the region | `0`           |
| `blacks`, `whites`      | From `-1` to `1`; target narrower regions near black and white            | `0`           |
| `contrast`              | Non-negative multiplier around `pivot` (`0` to `1`, default `0.5`)        | `1`           |
| `saturation`            | Non-negative multiplier; `0` is grayscale                                 | `1`           |
| `vibrance`              | From `-1` to `1`; positive values emphasize muted colors                  | `0`           |

```tsx
import {colorCorrection} from '@remotion/effects/color-correction';
import {Video} from '@remotion/media';
import {staticFile} from 'remotion';

export const CorrectedVideo = () => {
  return (
    <Video
      src={staticFile('footage.mp4')}
      effects={[
        colorCorrection({
          exposure: 0.25,
          temperature: 0.1,
          tint: -0.03,
          shadows: 0.15,
          highlights: -0.1,
          contrast: 1.1,
          saturation: 1.05,
          vibrance: 0.15,
        }),
      ]}
    />
  );
};
```

Internally, `colorCorrection()` applies exposure, white balance, tonal regions,
contrast, saturation, then vibrance. Omitted controls use their neutral values.
Keep everything inline on the target's `effects` prop.

Standalone effects are also available when a different order or an additional
adjustment is needed: `exposure()`, `whiteBalance()`, `shadowsHighlights()`,
`contrast()`, `saturation()`, and `vibrance()`. See [effects](effects.md)

##### Levels and Curves

Use [`levels()`](https://www.remotion.dev/docs/effects/levels) to set input black
and white points, adjust midtones with gamma, or limit the output range.
`blackPoint` and `whitePoint` are normalized from `0` to `1`, default to `0` and
`1`, and require `blackPoint < whitePoint`. `gamma` ranges from `0.01` to `10`,
defaults to `1`, and values above `1` brighten midtones. `outputBlack` and
`outputWhite` range from `0` to `1` and default to `0` and `1`; reversing them
inverts the output.

Use [`curves()`](https://www.remotion.dev/docs/effects/curves) for an S-curve or
other adjustments that need multiple input/output control points. Supply `2` to
`32` `[input, output]` pairs with both coordinates in `0` to `1` and strictly
increasing input values. Outputs may increase or decrease. The default
`[[0, 0], [1, 1]]` leaves the image unchanged. Values outside the first and last
input points use the nearest endpoint's output.

Curves uses `interpolation: 'smooth'` by default, connecting points without
overshooting their output values. Use `'linear'` for straight segments.
`amount` blends with the original image from `0` to `1` (default `1`).

Both effects default to `channel: 'rgb'`. Set `'red'`, `'green'`, or `'blue'` to
adjust one channel, and stack separate effect calls for different channel
adjustments. Both preserve alpha. Curves, the Levels channel/output controls,
and their graphical Studio editors are available from Remotion `4.0.537`.

Keep the effect calls and point arrays inline so Studio can edit them:

```tsx
import {curves} from '@remotion/effects/curves';
import {levels} from '@remotion/effects/levels';
import {Video} from '@remotion/media';
import {staticFile} from 'remotion';

export const ToneAdjustedVideo = () => {
  return (
    <Video
      src={staticFile('footage.mp4')}
      effects={[
        levels({
          blackPoint: 0.03,
          whitePoint: 0.95,
          gamma: 1.1,
          outputBlack: 0.02,
          outputWhite: 0.98,
        }),
        curves({
          channel: 'red',
          points: [[0, 0], [0.5, 0.55], [1, 1]],
          amount: 0.8,
        }),
      ]}
    />
  );
};
```

Effects run in array order: this example adjusts the RGB levels, then lifts
red midtones. Place primary adjustments before `lut()` when the LUT should
receive the corrected footage.

##### LUTs and combining effects

A LUT (lookup table) maps input RGB colors to output colors. Use
[`lut()`](https://www.remotion.dev/docs/effects/lut) to apply a 3D `.cube` LUT.  
Its `content` parameter takes the complete file contents as a string.

This example uses a small warm LUT inline:

```tsx
import {colorCorrection} from '@remotion/effects/color-correction';
import {lut} from '@remotion/effects/lut';
import {Video} from '@remotion/media';
import {staticFile} from 'remotion';

export const GradedVideo = () => {
  return (
    <Video
      src={staticFile('footage.mp4')}
      effects={[
        colorCorrection({exposure: 0.25, contrast: 1.1}),
        lut({
          content: `TITLE "Warm"
LUT_3D_SIZE 2
0 0 0
1 0.1 0
0 0.9 0.1
1 0.9 0.1
0 0.1 0.8
1 0.2 0.7
0 0.9 0.8
1 0.9 0.8`,
        }),
      ]}
    />
  );
};
```

###### Supported format and limitations

- Only 3D `.cube` LUTs are supported. `LUT_3D_SIZE` must be an integer from `2`
  to `256`, followed by exactly `size ** 3` RGB rows. 1D LUTs are unsupported.
- Optional `TITLE`, `DOMAIN_MIN`, `DOMAIN_MAX`, blank lines, and `#` comments are
  supported. Other LUT formats need conversion before use.
- `lut()` has no `src` or strength/amount parameter. Use `disabled: true` to
  bypass it.

##### Studio workflow

Select the layer and open its effect in the inspector. Levels shows an input
histogram with black, gamma, and white input handles plus output endpoints.
Curves shows an input histogram behind the graph: add or drag points, edit
their numeric coordinates, remove points, or reset the curve. The histogram
shows pixels entering that effect, including adjustments earlier in the stack.

Levels numeric controls and Curves `amount` can be keyframed in Studio.
Curves points are not keyframable in Studio. To animate them, derive `points`
from `useCurrentFrame()` in code, keeping input values strictly increasing on
every frame. Computed point arrays display as read-only in the graph.

Put `.cube` files in `public/` to preview them in the Assets panel.  
The user can drag a 3D `.cube` file from the computer or Assets panel onto a
video in the canvas or timeline to apply the LUT effect.

##### See also

- [Color correction documentation](https://www.remotion.dev/docs/color-correction)

### `skills/remotion-markup/compositions.md`
_Defining compositions, stills, folders, default props and dynamic metadata_

A `<Composition>` defines the component, width, height, fps and duration of a renderable video.

##### Source-editable registrations

Give each composition or still that should be edited independently in the
Studio its own authored JSX node. Use a JSX string literal for `id`, and keep
its metadata and editable default values directly on that node.

Programmatic registration is suitable when the generated compositions are
intentionally controlled as one source template and do not need to be
reordered, duplicated, deleted or edited individually in the Studio.

```tsx title="src/MyComposition.tsx"
type Props = {
  readonly title: string;
};

export const MyComposition = ({title}: Props) => <h1>{title}</h1>;
```

```tsx title="src/Root.tsx"
import {Composition} from 'remotion';
import {MyComposition} from './MyComposition';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Launch"
        component={MyComposition}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{title: 'Launch'}}
      />
      <Composition
        id="Recap"
        component={MyComposition}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{title: 'Recap'}}
      />
    </>
  );
};
```

Both registrations can reuse the same component. Keeping them as separate JSX
nodes gives each one its own source-editing target.

##### Default Props and scaffold metadata

Pass `defaultProps` to provide initial values for your component.  
Values must be JSON-serializable (`Date`, `Map`, `Set`, and `staticFile()` are supported).
Use `defaultProps` for composition-wide values that should be visible and editable before the video renders.

Keep data owned by a child editor on that child's JSX node. For example,
captions that should remain editable in the Caption editor belong as an inline
array on `<BasicCaptions>`, not in composition `defaultProps` or a component
prop. See Displaying captions (`display-captions.md` in the `remotion-captions` skill).

For Studio editing, keep `defaultProps` as an inline object literal on `<Composition>` or `<Still>`.
Keep values that should be written back directly in the object instead of deriving them from a loop variable.
Do not store it in a variable, import it, spread it, create it with a helper, or wrap it in `satisfies`.
Use `type` declarations for props rather than `interface` to ensure `defaultProps` type safety.

```tsx title="src/Root.tsx"
import {Composition} from 'remotion';
import {MyComposition} from './MyComposition';

const defaultProps = { title: "Hello World" };

export const RemotionRoot = () => {
  return (
    <>
      {/* 👍 Inline metadata and defaults */}
      <Composition
        id="MyComposition"
        component={MyComposition}
        durationInFrames={100}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ title: "Hello World" }}
      />

      {/* 👎 Hidden defaults cannot be saved back by Studio */}
      <Composition
        id="OtherComposition"
        component={MyComposition}
        durationInFrames={100}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={defaultProps}
      />
    </>
  );
};
```

##### Folders

Use `<Folder>` to organize compositions in the sidebar.  
Folder names can only contain letters, numbers, and hyphens.

```tsx title="src/Root.tsx"
import { Composition, Folder } from "remotion";

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Marketing">
        <Composition id="Promo" /* ... */ />
        <Composition id="Ad" /* ... */ />
      </Folder>
      <Folder name="Social">
        <Folder name="Instagram">
          <Composition id="Story" /* ... */ />
          <Composition id="Reel" /* ... */ />
        </Folder>
      </Folder>
    </>
  );
};
```

##### Stills

Use `<Still>` for single-frame images. It does not require `durationInFrames` or `fps`.

```tsx title="src/Root.tsx"
import { Still } from "remotion";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot = () => {
  return (
    <Still
      id="Thumbnail"
      component={Thumbnail}
      width={1280}
      height={720}
    />
  );
};
```

##### Dynamic duration, width, and height

Use [`calculateMetadata`](./calculate-metadata.md) to make dimensions, duration, or props dynamic based on input props, fetched data, or asset metadata.

##### Nesting compositions within another

To render a composition's component inside another composition, use `<Sequence>` with `width` and `height` when the nested content needs its own dimensions.

When the nested scene should have its own editable Studio timeline, use the [connected composition structure](connected-compositions.md).

```tsx
<>
  <Video src="https://remotion.media/video.mp4" />
  <Sequence
    width={1920}
    height={1080}
  >
    <OverlayComponent />
  </Sequence>
</>
```

### `skills/remotion-markup/connected-compositions.md`
#### Connected compositions

A connected composition lets the user open a scene or element in its own
Studio timeline while editing the implementation used by the parent video.
Use it for a substantial scene, a reusable card, or a group that should move
and be edited together, such as a sticker with its sound or a summary graphic.
A layout container or decorative detail usually belongs inside that group as
plain HTML.

##### Create the connection

1. Export the component with `Interactive.create()`. Use `layout: 'absolute-fill'`
   for a scene or `layout: 'none'` for a bounded element.
2. Render that exported component in the parent, with its instance props inline.
   Put timing directly on it, or on the shared `Sequence` or
   `TransitionSeries.Sequence` that governs its layers.
3. Register the exact same exported reference in `<Composition component={...}>`.
   Give the registration a unique literal ID, inline metadata, and representative
   inline `defaultProps`. Registering an inner component or an inline wrapper
   does not connect the instance the user sees.

Follow the complete timeline example (`timeline-structure.md` in the `remotion-interactivity` skill)
for the component definitions, parent, and registrations.

Each independently editable instance still needs its own JSX node. Reuse a
component for repeated units rather than copying its implementation or generating
all instances from one `.map()` call. Keep editor-owned data at its editable
source: caption arrays belong inline on the caption component, not behind a
prop of a generic shot component.

##### Make the component independent of its parent

The parent is not mounted when the standalone composition opens. Load fonts
inside the component or a shared imported module, and keep required typography
there. Supply representative content, background, and alignment in the
registration's defaults. Those defaults do not automatically apply to parent
instances or copy their props.

Match the parent's fps and dimensions unless a difference is intentional.
Preserve the source-time offset as well as the duration when the component's
captions or overlays read original-media frames. The instance's placement in
the parent timeline does not usually belong in its standalone defaults.

##### Extract an existing group

For a pre-compose request, move the selected markup into a named component and
register it. If the selection already has a meaningful timing wrapper, keep
that wrapper and its props in place and extract its contents. Preserve trim,
speed, stacking order, inherited styles, and the duration needed by sound tails.
A new component file without its registration does not complete the connection.

##### Verify both views

Open the full composition and the standalone composition. Check that the group
looks and sounds the same, that its timeline has useful editing units, and that
double-clicking the parent instance opens the intended composition. For a
refactor, compare representative frames and check cut boundaries, captions,
entrance animations, and audio tails.

Connected compositions provide editing boundaries, not a promise to collapse
all their rows. Studio's compact-series view can expose connected children.
Inspect the full-video timeline as well as the standalone view before claiming
that an extraction reduced clutter. Treat row expansion or unused vertical
space as a layout issue when the markup already expresses the correct groups;
avoid extra wrappers or hidden editable layers solely to force a compact view.

### `skills/remotion-markup/cropping.md`
#### Cropping

Preferably, the `cropLeft`, `cropRight`, `cropTop` and `cropBottom` props are used to crop content.
It allows for interactively dragging the components and adapting the outlines in the canvas to the crop.

The following components support `crop*` props:

- `<Sequence>` from `remotion`, when `layout="absolute-fill"`
- `<Interactive.*>` HTML and SVG elements from `remotion`
- Custom components made with `Interactive.create()` from `remotion`, using a managed `layout: 'absolute-fill'` root or forwarding `style` to their own visual root
- `<CanvasImage>` from `remotion`
- `<Img>` from `remotion`
- `<AnimatedImage>` from `remotion`
- `<HtmlInCanvas>` from `remotion`
- `<Solid>` from `remotion`
- `<Video>` from `@remotion/media`
- `<Gif>` from `@remotion/gif`
- `<RemotionRiveCanvas>` from `@remotion/rive`

Crop values are ratios between `0` and `1`.
A value of `0` applies no crop on that edge.
A value of `1` is a full crop.
Keep Interactivity Best Practices (`remotion-interactivity` skill) also for cropping, to keep it editable and keyframable.

```tsx
<CanvasImage
  src={staticFile("photo.png")}
  cropLeft={interpolate(frame, [0, 30], [0, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })}
  cropBottom={0.1}
/>
```

Do not use `clipPath` together with crop props.

### `skills/remotion-markup/effects.md`
_Canvas/WebGL visual effects for Remotion using effects arrays and createEffect()._

Read this guidance when adding an effect to a component that supports `effects`,
or when considering canvas post-processing or a reusable custom effect.

Docs: https://www.remotion.dev/docs/effects
Custom effect docs: https://www.remotion.dev/docs/create-effect

For exposure, white balance, Levels, Curves, and LUTs, read
[color-correction.md](color-correction.md).

##### Usage

Install the package that provides the chosen effect:

```bash
npx remotion add @remotion/effects
```

Effects are functions passed to the `effects` prop of supported components.

These components accept `effects` directly:

| Import from        | Components                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `remotion`         | `<Img>`, `<CanvasImage>`, `<AnimatedImage>`, `<Solid>`, `<HtmlInCanvas>`                                                      |
| `@remotion/media`  | `<Video>`                                                                                                                     |
| `@remotion/gif`    | `<Gif>`                                                                                                                       |
| `@remotion/rive`   | `<RemotionRiveCanvas>`                                                                                                        |
| `@remotion/shapes` | `<Arrow>`, `<Callout>`, `<Circle>`, `<Ellipse>`, `<Heart>`, `<Pie>`, `<Polygon>`, `<Rect>`, `<Spark>`, `<Star>`, `<Triangle>` |

Ordinary HTML elements, `<Interactive.*>` DOM wrappers, `<AbsoluteFill>`, and
`<Sequence>` do not accept `effects` directly. To apply effects to their content,
wrap them in `<HtmlInCanvas>` and put the `effects` prop on the wrapper.

For example, apply an effect directly to a video:

```tsx
import {Video} from '@remotion/media';
import {blur} from '@remotion/effects/blur';

<Video
  src="https://remotion.media/video.mp4"
  effects={[blur({radius: 8})]}
/>;
```

Use the effect docs for exact props and imports. Most `@remotion/effects` imports use `@remotion/effects/<effect-slug>`; `uvTranslate()` and `xyTranslate()` use `@remotion/effects/translate`.

Most effects use WebGL2; `cylinder()`, `sphere()`, and `pageTurn()` use WebGPU. During renders, enable WebGL and WebGPU with:

```ts
import {Config} from '@remotion/cli/config';

Config.setChromiumOpenGlRenderer('angle');
```

##### Available effects

Built-in effects from `@remotion/effects`:

- Color and tone: `brightness()`, `colorCorrection()`, `colorKey()`, `contrast()`, `curves()`, `duotone()`, `exposure()`, `grayscale()`, `hue()`, `invert()`, `levels()`, `linearGradient()`, `linearGradientTint()`, `lut()`, `saturation()`, `shadowsHighlights()`, `thermalVision()`, `tint()`, `vibrance()`, `whiteBalance()`.
- Blur and trails: `blur()`, `lightTrail()`, `linearProgressiveBlur()`, `radialProgressiveBlur()`, `regionBlur()`, `zoomBlur()`.
- Lighting: `dropShadow()`, `longShadows()`, `glow()`, `lightLeak()`, `shine()`, `starburst()`, `vignette()`.
- Distortion and transforms: `barrelDistortion()`, `chromaticAberration()`, `cornerPin()`, `fisheye()`, `mirror()`, `noiseDisplacement()`, `scale()`, `skew()`, `tile()`, `uvTranslate()`, `wave()`, `xyTranslate()`.
- Textures and patterns: `burlap()`, `checkerboard()`, `contourLines()`, `dotGrid()`, `emboss()`, `flannel()`, `gridlines()`, `halftone()`, `halftoneLinearGradient()`, `lines()`, `liquidContours()`, `noise()`, `paper()`, `pattern()`, `rings()`, `scanlines()`, `speckle()`, `tvSignalOff()`, `waves()`, `whiteNoise()`, `zigzag()`.
- Edges: `outline()`, `roughenEdges()`, `shrinkwrap()`, `tear()`.
- Pixelation and transitions: `evolve()`, `linearProgressivePixelate()`, `pixelate()`, `pixelDissolve()`, `radialProgressivePixelate()`, `venetianBlinds()`.

Example:

```tsx
import {Video} from '@remotion/media';
import {brightness} from '@remotion/effects/brightness';

<Video
  src="https://remotion.media/video.mp4"
  effects={[brightness({})]}
/>;
```

##### Custom effects

Use `createEffect()` from `remotion` when the user wants a reusable effect factory that works in the same `effects` array as `@remotion/effects`.

Prefer a custom effect over `<HtmlInCanvas onPaint>` when the transformation should be reusable, parameterized, editable in Studio, or stackable with other effects.

For quick project-specific effects, keep the effect next to the composition, for example `src/effects/palette-map.ts`. For library effects intended for `@remotion/effects`, follow the repository's `add-effect` skill instead.

`createEffect()` expects:

- `type`: stable reverse-DNS identifier, for example `com.example.paletteMap`.
- `label`: Studio label, commonly `paletteMap()`.
- `documentationLink`: URL or `null`.
- `backend`: `"2d"`, `"webgl2"` or `"webgpu"`.
- `calculateKey(params)`: stable string containing every resolved parameter that changes output.
- `setup(target)`: create reusable backend state, or return `null`.
- `apply({source, target, width, height, params, state, flipSourceY})`: draw the transformed result into `target`.
- `cleanup(state)`: free resources created by `setup()`.
- `schema`: an `InteractivitySchema` for Studio controls. `disabled` is added automatically.
- `validateParams(params)`: throw on missing or invalid values.

Use `backend: "2d"` for simple pixel, filter, drawImage, or image-data effects. Use WebGL2 only when shader math or GPU performance is needed; during renders, enable WebGL as shown above.

```ts
import {createEffect, type InteractivitySchema} from 'remotion';

type MyEffectParams = {
  readonly amount?: number;
};

const myEffectSchema = {
  amount: {
    type: 'number',
    min: 0,
    max: 1,
    step: 0.01,
    default: 1,
    description: 'Amount',
  },
} as const satisfies InteractivitySchema;

const resolve = (params: MyEffectParams) => ({
  amount: params.amount ?? 1,
});

export const myEffect = createEffect<MyEffectParams, null>({
  type: 'com.example.myEffect',
  label: 'myEffect()',
  documentationLink: null,
  backend: '2d',
  calculateKey: (params) => {
    const {amount} = resolve(params);
    return `my-effect-${amount}`;
  },
  setup: () => null,
  apply: ({source, target, width, height, params}) => {
    const ctx = target.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get a 2D context for myEffect().');
    }

    const {amount} = resolve(params);

    ctx.clearRect(0, 0, width, height);
    ctx.filter = `opacity(${amount * 100}%)`;
    ctx.drawImage(source, 0, 0, width, height);
    ctx.filter = 'none';
  },
  cleanup: () => undefined,
  schema: myEffectSchema,
  validateParams: ({amount = 1}) => {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || amount > 1) {
      throw new TypeError('amount must be a number between 0 and 1');
    }
  },
});
```

For a WebGL2 effect, compile/link shaders in `setup()`, keep the program, fullscreen quad, texture, and uniform locations in state, upload `source` in `apply()`, and free GPU resources in `cleanup()`. Minimal shape:

```ts
import {createEffect, type InteractivitySchema} from 'remotion';

type RgbShiftParams = {
  readonly amount?: number;
};

type RgbShiftState = {
  readonly gl: WebGL2RenderingContext;
  readonly program: WebGLProgram;
  readonly vao: WebGLVertexArrayObject;
  readonly vbo: WebGLBuffer;
  readonly texture: WebGLTexture;
  readonly uSource: WebGLUniformLocation | null;
  readonly uOffset: WebGLUniformLocation | null;
};

const rgbShiftSchema = {
  amount: {
    type: 'number',
    min: 0,
    max: 80,
    step: 1,
    default: 12,
    description: 'Amount',
  },
} as const satisfies InteractivitySchema;

export const rgbShift = createEffect<RgbShiftParams, RgbShiftState>({
  type: 'com.example.rgbShift',
  label: 'rgbShift()',
  documentationLink: null,
  backend: 'webgl2',
  calculateKey: ({amount = 12}) => `rgb-shift-${amount}`,
  setup: (target) => {
    const gl = target.getContext('webgl2', {
      premultipliedAlpha: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    if (!gl) {
      throw new Error('Could not get a WebGL2 context for rgbShift().');
    }

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    // Compile/link shaders, create a fullscreen quad VAO/VBO, create a
    // CLAMP_TO_EDGE RGBA texture, and get uSource/uOffset uniform locations.
    return createRgbShiftState(gl);
  },
  apply: ({source, width, height, params, state, flipSourceY}) => {
    const amount = params.amount ?? 12;
    const {gl} = state;

    gl.viewport(0, 0, width, height);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipSourceY);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      source as TexImageSource,
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(state.program);
    if (state.uSource) gl.uniform1i(state.uSource, 0);
    if (state.uOffset) gl.uniform2f(state.uOffset, amount / width, 0);
    gl.bindVertexArray(state.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  },
  cleanup: ({gl, program, vao, vbo, texture}) => {
    gl.deleteTexture(texture);
    gl.deleteBuffer(vbo);
    gl.deleteProgram(program);
    gl.deleteVertexArray(vao);
  },
  schema: rgbShiftSchema,
  validateParams: ({amount = 12}) => {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || amount > 80) {
      throw new TypeError('amount must be a number between 0 and 80');
    }
  },
});
```

For a complete 2D and WebGL2 pair, see `packages/example/src/EffectsTestbed/sample-posterize-2d.ts` and `packages/example/src/EffectsTestbed/sample-rgb-shift-webgl.ts`.

Use the returned factory in an `effects` array:

```tsx
import {CanvasImage, staticFile} from 'remotion';
import {myEffect} from './effects/my-effect';

export const MyComp: React.FC = () => {
  return (
    <CanvasImage
      src={staticFile('image.png')}
      effects={[myEffect({amount: 0.8})]}
    />
  );
};
```

When generating a custom effect, also:

- Include `disabled?: boolean` only through the returned factory; do not add it to the custom params type or schema.
- Validate required parameters at factory-call time with `validateParams`.
- Include all defaults in both `schema` and the `resolve()` helper.
- Reset mutable 2D context state such as `filter`, `globalAlpha`, transforms, and compositing after drawing.
- Preserve alpha unless the requested effect intentionally changes transparency.

### `skills/remotion-markup/embedding-videos.md`
_Embedding videos in Remotion - trimming, volume, speed, looping, pitch_

#### Using videos in Remotion

##### Prerequisites

First, the @remotion/media package needs to be installed.  
If it is not, use the following command:

```bash
npx remotion add @remotion/media # If project uses npm
bunx remotion add @remotion/media # If project uses bun
yarn remotion add @remotion/media # If project uses yarn
pnpm exec remotion add @remotion/media # If project uses pnpm
```

Use `<Video>` from `@remotion/media` to embed videos into your composition.

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Video src={staticFile("video.mp4")} />;
};
```

Remote URLs are also supported:

```tsx
<Video src="https://remotion.media/video.mp4" />
```

##### Trimming

Use `trimBefore` to skip the beginning of the video and `durationInFrames` to end it early. Values are in frames.

```tsx
const { fps } = useVideoConfig();

return (
  <Video
    src={staticFile("video.mp4")}
    trimBefore={2 * fps} // Skip the first 2 seconds
    durationInFrames={8 * fps} // Play 8 seconds, until the 10 second mark
  />
);
```

##### Delaying

Set `from` directly on `<Video>` to delay when it appears:

```tsx
import { staticFile, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";

const { fps } = useVideoConfig();

return (
  <Video from={fps} src={staticFile("video.mp4")} />
);
```

The video will appear after 1 second.

##### Sizing and Position

Use the `style` prop to control size and position:

```tsx
<Video
  src={staticFile("video.mp4")}
  style={{
    width: 500,
    height: 300,
    position: "absolute",
    top: 100,
    left: 50,
  }}
  objectFit="cover"
/>
```

##### Volume

Set a static volume (0 to 1):

```tsx
<Video src={staticFile("video.mp4")} volume={0.5} />
```

Use `useCurrentFrame()` and `interpolate()` for keyframed volume:

```tsx
import { Video } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

return (
  <Video
    src={staticFile("video.mp4")}
    volume={interpolate(frame, [0, 1 * fps], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })}
  />
);
```

With Studio interactivity enabled, these keyframes can be edited and are shown as a volume curve in the timeline.

Use `muted` to silence the video entirely:

```tsx
<Video src={staticFile("video.mp4")} muted />
```

##### Speed

Use `playbackRate` to change the playback speed:

```tsx
// 2x speed
<Video src={staticFile("video.mp4")} playbackRate={2} />
// Half speed
<Video src={staticFile("video.mp4")} playbackRate={0.5} />
```

Reverse playback is not supported.

##### Looping

Use `loop` to loop the video indefinitely:

```tsx
<Video src={staticFile("video.mp4")} loop />
```

```tsx
import { Video } from "@remotion/media";
import { interpolate, staticFile, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

<Video
  src={staticFile("video.mp4")}
  loop
  volume={interpolate(frame, [0, 300], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })}
/>
```

##### Pitch

Use `toneFrequency` to adjust the pitch without affecting speed. Values range from 0.01 to 2:

```tsx
<Video
  src={staticFile("video.mp4")}
  toneFrequency={1.5} // Higher pitch
/>
<Video
  src={staticFile("video.mp4")}
  toneFrequency={0.8} // Lower pitch
/>
```

Pitch shifting only works during server-side rendering, not in the Remotion Studio preview or in the `<Player />`.

### `skills/remotion-markup/ffmpeg.md`
_Using FFmpeg and FFprobe in Remotion_

##### FFmpeg in Remotion

`ffmpeg` and `ffprobe` do not need to be installed. They are available via the `npx remotion ffmpeg` and `npx remotion ffprobe`:

```bash
npx remotion ffmpeg -i input.mp4 output.mp3
npx remotion ffprobe input.mp4
```

###### Trimming videos

You have 2 options for trimming videos:

1. **Preferred**: Use the `trimBefore` and `durationInFrames` props of the `<Video>` component. This is non-destructive, requires no re-encoding, and you can change the trim at any time.

```tsx
import {Video} from '@remotion/media';

<Video
  src={staticFile('video.mp4')}
  trimBefore={5 * fps}
  durationInFrames={5 * fps}
/>;
```

2. Use the FFmpeg command line. You MUST re-encode the video to avoid frozen frames at the start of the video. Only use this if you need a standalone trimmed file (e.g. for upload or external use).

```bash
# Re-encodes from the exact frame
npx remotion ffmpeg -ss 00:00:05 -i public/input.mp4 -to 00:00:10 -c:v libx264 -c:a aac public/output.mp4
```

### `skills/remotion-markup/gifs.md`
_Displaying GIFs, APNG, AVIF and WebP in Remotion_

#### Using Animated images in Remotion

##### Basic usage

Use `<AnimatedImage>` to display a GIF, APNG, AVIF or WebP image synchronized with Remotion's timeline:

```tsx
import { AnimatedImage, staticFile } from "remotion";

export const MyComposition = () => {
  return (
    <AnimatedImage
      src={staticFile("animation.gif")}
      width={500}
      height={500}
    />
  );
};
```

Remote URLs are also supported (must have CORS enabled):

```tsx
<AnimatedImage
  src="https://example.com/animation.gif"
  width={500}
  height={500}
/>
```

##### Sizing and fit

Control how the image fills its container with the `fit` prop:

```tsx
// Stretch to fill (default)
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={300}
  fit="fill"
/>

// Maintain aspect ratio, fit inside container
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={300}
  fit="contain"
/>

// Fill container, crop if needed
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={300}
  fit="cover"
/>
```

##### Playback speed

Use `playbackRate` to control the animation speed:

```tsx
// 2x speed
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={500}
  playbackRate={2}
/>
// Half speed
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={500}
  playbackRate={0.5}
/>
```

##### Looping behavior

Control what happens when the animation finishes:

```tsx
// Loop indefinitely (default)
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={500}
  loopBehavior="loop"
/>

// Play once, show final frame
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={500}
  loopBehavior="pause-after-finish"
/>

// Play once, then clear canvas
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={500}
  loopBehavior="clear-after-finish"
/>
```

##### Styling

Use the `style` prop for additional CSS (use `width` and `height` props for sizing):

```tsx
<AnimatedImage
  src={staticFile("animation.gif")}
  width={500}
  height={500}
  style={{
    borderRadius: 20,
    position: "absolute",
    top: 100,
    left: 50,
  }}
/>
```

##### Getting GIF duration

Use `getGifDurationInSeconds()` from `@remotion/gif` to get the duration of a GIF.

```bash
npx remotion add @remotion/gif
```

```tsx
import { getGifDurationInSeconds } from "@remotion/gif";
import { staticFile } from "remotion";

const duration = await getGifDurationInSeconds(staticFile("animation.gif"));
console.log(duration); // e.g. 2.5
```

This is useful for setting the composition duration to match the GIF:

```tsx
import { getGifDurationInSeconds } from "@remotion/gif";
import { staticFile, CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction = async () => {
  const duration = await getGifDurationInSeconds(staticFile("animation.gif"));
  return {
    durationInFrames: Math.ceil(duration * 30),
  };
};
```

##### Alternative

If `<AnimatedImage>` does not work (only supported in Chrome and Firefox), you can use `<Gif>` from `@remotion/gif` instead.

```bash
npx remotion add @remotion/gif # If project uses npm
bunx remotion add @remotion/gif # If project uses bun
yarn remotion add @remotion/gif # If project uses yarn
pnpm exec remotion add @remotion/gif # If project uses pnpm
```

```tsx
import { Gif } from "@remotion/gif";
import { staticFile } from "remotion";

export const MyComposition = () => {
  return <Gif src={staticFile("animation.gif")} width={500} height={500} />;
};
```

The `<Gif>` component has the same props as `<AnimatedImage>` but only supports GIF files.

### `skills/remotion-markup/google-fonts.md`
_Loading Google Fonts and local fonts in Remotion_

#### Using fonts in Remotion

##### Google Fonts with @remotion/google-fonts

The recommended way to use Google Fonts. It's type-safe and automatically blocks rendering until the font is ready.

###### Prerequisites

First, the @remotion/google-fonts package needs to be installed.
If it is not installed, use the following command:

```bash
npx remotion add @remotion/google-fonts # If project uses npm
bunx remotion add @remotion/google-fonts # If project uses bun
yarn remotion add @remotion/google-fonts # If project uses yarn
pnpm exec remotion add @remotion/google-fonts # If project uses pnpm
```

```tsx
import { loadFont } from "@remotion/google-fonts/Lobster";

const { fontFamily } = loadFont();

export const MyComposition = () => {
  return (
    <div style={{ fontFamily }}>
      Hello World
    </div>
  );
};
```

Preferrably, specify only needed weights and subsets to reduce file size:

```tsx
import { loadFont } from "@remotion/google-fonts/Roboto";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
```

##### Using in components

Call `loadFont()` at the top level of your component or in a separate file that's imported early:

```tsx
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const Title: React.FC<{ text: string }> = ({ text }) => {
  return (
    <h1
      style={{
        fontFamily,
        fontSize: 80,
        fontWeight: "bold",
      }}
    >
      {text}
    </h1>
  );
};
```

### `skills/remotion-markup/html-in-canvas.md`
#### Using `<HtmlInCanvas>` in Remotion

Renders children into a `<canvas>` so you can post-process them with the Canvas 2D API or WebGL.

##### Enabling WebGL during renders

If you make use of WebGL during renders, you need to enable it:

From the CLI:

```bash
npx remotion render --gl=angle
```

Set it as the default for Studio and CLI (advised):

```ts
import { Config } from "@remotion/cli/config";

Config.setChromiumOpenGlRenderer("angle");
```

##### Basic usage

By default, draws to canvas with no effect applied:

```tsx
import { HtmlInCanvas } from "remotion";

export const MyComp = () => {
  return (
    <HtmlInCanvas width={1280} height={720}>
      <div style={{ fontSize: 80 }}>
        Hello
      </div>
    </HtmlInCanvas>
  );
};
```

##### 2D effect with `onPaint`

`onPaint` runs whenever the content updates. Call `ctx.drawElementImage(elementImage, 0, 0)` to draw the captured DOM.

```tsx
import {
  AbsoluteFill,
  HtmlInCanvas,
  type HtmlInCanvasOnPaint,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useCallback } from "react";

export const Blur = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const onPaint: HtmlInCanvasOnPaint = useCallback(
    ({ canvas, elementImage }) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Failed to acquire 2D context");

      const blurPx = 4 + 18 * (0.5 + 0.5 * Math.sin((frame / fps) * Math.PI));

      ctx.reset();
      ctx.filter = `blur(${blurPx}px)`;
      ctx.drawElementImage(elementImage, 0, 0);
    },
    [frame, fps],
  );

  return (
    <HtmlInCanvas width={width} height={height} onPaint={onPaint}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 120,
        }}
      >
        <h1>
          Hello
        </h1>
      </AbsoluteFill>
    </HtmlInCanvas>
  );
};
```

##### WebGL effects

For WebGL, set up the context, program, and texture in `onInit` and return a cleanup function. Allocate the texture with `gl.texImage2D(..., null)` when `elementImage` changes size. Inside `onPaint`, upload with `gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, elementImage)` and draw. Older Chromium versions only expose `gl.texElementImage2D()`; use it when the new method is absent.

For a fully working minimal example, see https://github.com/remotion-dev/remotion/blob/main/packages/docs/components/demos/HtmlInCanvasDocsDemoWebGL.tsx.

##### Async `onPaint`

`onPaint` may be `async`. Remotion holds the frame open via `delayRender()` until the promise resolves. Useful for multi-pass effects with `createImageBitmap`.

### `skills/remotion-markup/images.md`
##### Sizing and positioning

Use the `style` prop to control size and position:

```tsx
<Img
  src={staticFile("photo.png")}
  style={{
    width: 500,
    height: 300,
    position: "absolute",
    top: 100,
    left: 50,
    objectFit: "cover",
  }}
/>
```

##### Dynamic image paths

Use template literals for dynamic file references:

```tsx
import { Img, staticFile, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();

// Image sequence
<Img src={staticFile(`frames/frame${frame}.png`)} />

// Selecting based on props
<Img src={staticFile(`avatars/${props.userId}.png`)} />

// Conditional images
<Img
  src={staticFile(`icons/${isActive ? "active" : "inactive"}.svg`)}
/>
```

This pattern is useful for:

- Image sequences (frame-by-frame animations)
- User-specific avatars or profile images
- Theme-based icons
- State-dependent graphics

##### Getting image dimensions

Use `getImageDimensions()` from `@remotion/media-utils` to get the dimensions of an image:

```tsx
import { getImageDimensions } from "@remotion/media-utils";
import { staticFile } from "remotion";

const { width, height } = await getImageDimensions(staticFile("photo.png"));
```

This is useful for calculating aspect ratios or sizing compositions:

```tsx
import { getImageDimensions } from "@remotion/media-utils";
import { staticFile, CalculateMetadataFunction } from "remotion";

const calculateMetadata: CalculateMetadataFunction = async () => {
  const { width, height } = await getImageDimensions(staticFile("photo.png"));
  return {
    width,
    height,
  };
};
```

### `skills/remotion-markup/light-leaks.md`
_Light leak overlay effects for Remotion using lightLeak() from @remotion/effects._

##### Light Leaks

This only works from Remotion 4.0.500 and up. Use `npx remotion versions` to check your Remotion version and `npx remotion upgrade` to upgrade your Remotion version.

Apply `lightLeak()` from `@remotion/effects/light-leak` to a canvas-based component such as `<Solid>`. Animate `progress` from `0` to `1`; the light leak reveals during the first half and retracts during the second half.

Typically use it inside a `<TransitionSeries.Overlay>` to play over the cut point between two scenes. See the **transitions** rule for `<TransitionSeries>` and overlay usage.

##### Prerequisites

```bash
npx remotion add @remotion/effects
```

##### Light leak overlay component

Keep the `progress` calculation inline so it is editable in Remotion Studio:

```tsx
import {lightLeak} from '@remotion/effects/light-leak';
import {interpolate, Solid, useCurrentFrame, useVideoConfig} from 'remotion';

const LightLeakOverlay: React.FC<{
  seed?: number;
  hueShift?: number;
}> = ({seed = 0, hueShift = 0}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, height, width} = useVideoConfig();

  return (
    <Solid
      width={width}
      height={height}
      effects={[
        lightLeak({
          seed,
          hueShift,
          progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }),
      ]}
    />
  );
};
```

##### Basic usage with TransitionSeries

```tsx
import {TransitionSeries} from '@remotion/transitions';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Overlay durationInFrames={30}>
    <LightLeakOverlay />
  </TransitionSeries.Overlay>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>;
```

##### Options

- `progress?` — controls the evolve/retract phase from `0` to `1`. Effects do not animate on their own, so drive it with `useCurrentFrame()` and `interpolate()`. Default: `0.5`.
- `seed?` — determines the shape of the light leak pattern. Different seeds produce different patterns. Default: `0`.
- `hueShift?` — rotates the hue in degrees (`0`–`360`). Default: `0` (yellow-to-orange). `120` = green, `240` = blue.
- `disabled?` — skips the effect when `true`. Default: `false`.

##### Customizing the look

```tsx
// Blue-tinted light leak with a different pattern
<LightLeakOverlay seed={5} hueShift={240} />;

// Green-tinted light leak
<LightLeakOverlay seed={2} hueShift={120} />;
```

##### Standalone usage

The overlay component can also be used outside of `<TransitionSeries>` as a decorative layer in any composition:

```tsx
const MyComp: React.FC = () => (
  <>
    <MyContent />
    <LightLeakOverlay seed={3} />
  </>
);
```

`lightLeak()` uses WebGL2. Enable WebGL during rendering with `Config.setChromiumOpenGlRenderer("angle")`.

### `skills/remotion-markup/local-fonts.md`
For local font files, use the `@remotion/fonts` package.

###### Prerequisites

First, install @remotion/fonts:

```bash
npx remotion add @remotion/fonts # If project uses npm
bunx remotion add @remotion/fonts # If project uses bun
yarn remotion add @remotion/fonts # If project uses yarn
pnpm exec remotion add @remotion/fonts # If project uses pnpm
```

###### Loading a local font

Place your font file in the `public/` folder and use `loadFont()`:

```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

await loadFont({
  family: "MyFont",
  url: staticFile("MyFont-Regular.woff2"),
});

export const MyComposition = () => {
  return (
    <div style={{ fontFamily: "MyFont" }}>
      Hello World
    </div>
  );
};
```

###### Loading multiple weights

Load each weight separately with the same family name:

```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

await Promise.all([
  loadFont({
    family: "Inter",
    url: staticFile("Inter-Regular.woff2"),
    weight: "400",
  }),
  loadFont({
    family: "Inter",
    url: staticFile("Inter-Bold.woff2"),
    weight: "700",
  }),
]);
```

###### Loading a font URL from props

If the font URL comes from input props, call `loadFont()` in a `useEffect()` inside the component. Create a `delayRender()` handle when the component mounts, so that the render waits until the font has loaded:

```tsx
import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { useDelayRender } from "remotion";

export const MyComposition: React.FC<{ fontUrl: string }> = ({ fontUrl }) => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender(`Loading font ${fontUrl}`));

  useEffect(() => {
    loadFont({ family: "CustomFont", url: fontUrl })
      .then(() => continueRender(handle))
      .catch((err) => cancelRender(err));
  }, [fontUrl, handle, continueRender, cancelRender]);

  return <div style={{ fontFamily: "CustomFont" }}>Hello World</div>;
};
```

If the font fails to load, the render fails.  
If the URL has no file extension (e.g. an API endpoint), pass `format` explicitly.

###### Available options

```tsx
loadFont({
  family: "MyFont", // Required: name to use in CSS
  url: staticFile("font.woff2"), // Required: font file URL
  format: "woff2", // Optional: auto-detected from extension
  weight: "400", // Optional: font weight
  style: "normal", // Optional: normal or italic
  display: "block", // Optional: font-display behavior
});
```

### `skills/remotion-markup/lottie.md`
_Embedding Lottie animations in Remotion._

#### Using Lottie Animations in Remotion

##### Prerequisites

First, the @remotion/lottie package needs to be installed.  
If it is not, use the following command:

```bash
npx remotion add @remotion/lottie # If project uses npm
bunx remotion add @remotion/lottie # If project uses bun
yarn remotion add @remotion/lottie # If project uses yarn
pnpm exec remotion add @remotion/lottie # If project uses pnpm
```

##### Displaying a Lottie file

To import a Lottie animation:

- Fetch the Lottie asset
- Wrap the loading process in `delayRender()` and `continueRender()`
- Save the animation data in a state
- Render the Lottie animation using the `Lottie` component from the `@remotion/lottie` package

```tsx
import { Lottie, LottieAnimationData } from "@remotion/lottie";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender } from "remotion";

export const MyAnimation = () => {
  const [handle] = useState(() => delayRender("Loading Lottie animation"));

  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch("https://assets4.lottiefiles.com/packages/lf20_zyquagfl.json")
      .then((data) => data.json())
      .then((json) => {
        setAnimationData(json);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle]);

  if (!animationData) {
    return null;
  }

  return <Lottie animationData={animationData} />;
};
```

##### Styling and animating

Lottie supports the `style` prop to allow styles and animations:

```tsx
return (
  <Lottie
    animationData={animationData}
    style={{ width: 400, height: 400 }}
  />
);
```

### `skills/remotion-markup/measuring-dom-nodes.md`
_Measuring DOM element dimensions in Remotion_

#### Measuring DOM nodes in Remotion

Remotion applies a `scale()` transform to the video container, which affects values from `getBoundingClientRect()`. Use `useCurrentScale()` to get correct measurements.

##### Measuring element dimensions

```tsx
import { useCurrentScale } from "remotion";
import { useRef, useEffect, useState } from "react";

export const MyComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const scale = useCurrentScale();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setDimensions({
      width: rect.width / scale,
      height: rect.height / scale,
    });
  }, [scale]);

  return (
    <div ref={ref}>
      Content to measure
    </div>
  );
};
```

### `skills/remotion-markup/measuring-text.md`
_Measuring text dimensions, fitting text to containers, and checking overflow_

#### Measuring text in Remotion

##### Prerequisites

Install @remotion/layout-utils if it is not already installed:

```bash
npx remotion add @remotion/layout-utils
```

##### Measuring text dimensions

Use `measureText()` to calculate the width and height of text:

```tsx
import { measureText } from "@remotion/layout-utils";

const { width, height } = measureText({
  text: "Hello World",
  fontFamily: "Arial",
  fontSize: 32,
  fontWeight: "bold",
});
```

Results are cached - duplicate calls return the cached result.

##### Fitting text to a width

Use `fitText()` to find the optimal font size for a container:

```tsx
import { fitText } from "@remotion/layout-utils";

const { fontSize } = fitText({
  text: "Hello World",
  withinWidth: 600,
  fontFamily: "Inter",
  fontWeight: "bold",
});

return (
  <div
    style={{
      fontSize: Math.min(fontSize, 80), // Cap at 80px
      fontFamily: "Inter",
      fontWeight: "bold",
    }}
  >
    Hello World
  </div>
);
```

##### Checking text overflow

Use `fillTextBox()` to check if text exceeds a box:

```tsx
import { fillTextBox } from "@remotion/layout-utils";

const box = fillTextBox({ maxBoxWidth: 400, maxLines: 3 });

const words = ["Hello", "World", "This", "is", "a", "test"];
for (const word of words) {
  const { exceedsBox } = box.add({
    text: word + " ",
    fontFamily: "Arial",
    fontSize: 24,
  });
  if (exceedsBox) {
    // Text would overflow, handle accordingly
    break;
  }
}
```

##### Best practices

**Load fonts first:** Only call measurement functions after fonts are loaded.

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily, waitUntilDone } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

waitUntilDone().then(() => {
  // Now safe to measure
  const { width } = measureText({
    text: "Hello",
    fontFamily,
    fontSize: 32,
  });
});
```

**Use validateFontIsLoaded:** Catch font loading issues early:

```tsx
measureText({
  text: "Hello",
  fontFamily: "MyCustomFont",
  fontSize: 32,
  validateFontIsLoaded: true, // Throws if font not loaded
});
```

**Match font properties:** Use the same properties for measurement and rendering:

```tsx
const fontStyle = {
  fontFamily: "Inter",
  fontSize: 32,
  fontWeight: "bold" as const,
  letterSpacing: "0.5px",
};

const { width } = measureText({
  text: "Hello",
  ...fontStyle,
});

return (
  <div style={fontStyle}>
    Hello
  </div>
);
```

**Avoid padding and border:** Use `outline` instead of `border` to prevent layout differences:

```tsx
<div style={{ outline: "2px solid red" }}>
  Text
</div>
```

### `skills/remotion-markup/motion-blur.md`
#### Motion blur

Motion blur samples times around the current frame and blends the results.
`@remotion/motion-blur` CAN blur animated content.  
`@remotion/transitions` CAN blur presentation movement with its optimized `motionBlur` prop.

##### `<HtmlInCanvasMotionBlur>`

`<HtmlInCanvasMotionBlur>` captures animated content at fractional frames and averages its pixels in a canvas.  
`<HtmlInCanvasMotionBlur>` MUST receive `width` and `height`.

```bash
bunx remotion add @remotion/motion-blur
```

Child calls to `useCurrentFrame()` receive each sample's frame.

```tsx title="MyComposition.tsx"
import {HtmlInCanvasMotionBlur} from '@remotion/motion-blur';
import {useCurrentFrame, useVideoConfig} from 'remotion';

const MovingBox = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: 'absolute',
        left: frame * 10,
        top: 300,
        width: 120,
        height: 120,
        backgroundColor: '#ff6b6b',
      }}
    />
  );
};

export const MyComposition = () => {
  const {width, height} = useVideoConfig();

  return (
    <HtmlInCanvasMotionBlur
      width={width}
      height={height}
      samples={8}
      shutterAngle={180}
    >
      <MovingBox />
    </HtmlInCanvasMotionBlur>
  );
};
```

###### Motion blur on transitions

Read [transitions.md](transitions.md) for scene setup, presentations, and timing.

`<TransitionSeries.Transition>` CAN blur presentation movement with `motionBlur`.  
If an animation can be represented as a Remotion transition, you SHOULD use `<TransitionSeries.Transition>` with `motionBlur` for performance. `<HtmlInCanvasMotionBlur>` CAN blur content beyond the transition structure.

```bash
bunx remotion add @remotion/transitions
```

```tsx title="TransitionVideo.tsx"
import {springTiming, TransitionSeries} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {AbsoluteFill} from 'remotion';

export const TransitionVideo = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={60}>
        <AbsoluteFill style={{backgroundColor: '#0b84f3'}} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({direction: 'from-bottom'})}
        timing={springTiming({durationInFrames: 20})}
        motionBlur={{shutterAngle: 180, samples: 16}}
      />
      <TransitionSeries.Sequence durationInFrames={60}>
        <AbsoluteFill style={{backgroundColor: '#2ecc71'}} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
```

All built-in presentations support motion blur. Custom presentations need an HTML-in-canvas implementation. [Custom presentation guide](https://www.remotion.dev/docs/transitions/presentations/custom-html-in-canvas)

Each scene is captured once at the current frame, and the presentation is drawn at fractional times using those captures.  
Both scenes keep advancing during the transition. To sample animations or videos inside a scene at multiple times, apply `<HtmlInCanvasMotionBlur>` to that content.

Place a `<TransitionSeries.Sequence>` on each side of a blurred transition. Keep the entering and exiting transitions of a middle sequence within its duration, with no overlap.

Passing `enterStyle`, `exitStyle`, `innerEnterStyle`, `innerExitStyle`, `outerEnterStyle`, or `outerExitStyle` alongside `motionBlur` throws an error.  
Keep styling in the scene contents or implement it in a custom HTML-in-canvas presentation.

###### `shutterAngle` and `samples`

`shutterAngle` accepts values from `0` to `360` and defaults to `180`. `0` disables blur. `360` exposes one frame, `180` half a frame, and `90` a quarter of a frame.
The exposure time in seconds is `(shutterAngle / 360) / fps`. At 30 fps, `180` gives an exposure time of `1 / 60` second.

`samples` controls how many snapshots are blended within the exposure time. It defaults to `8` for `<HtmlInCanvasMotionBlur>` and `16` for transition `motionBlur`.
`samples` MUST be a positive integer. `<HtmlInCanvasMotionBlur>` accepts `1` to `64`. More samples smooth the blur and increase preview and render cost.

### `skills/remotion-markup/multi-scene-video.md`
#### Multi-scene videos

Give each substantial scene its own component and connect it when it benefits
from an independent editing timeline. Keep each instance's name, timing, and
props inline in the parent.

Choose the parent structure from the editing behavior:

- For independent scene start times, use a named `Track` with explicit `from`
  and `durationInFrames` on each scene. Its items must not overlap.
- For scenes that should remain adjacent as their durations change, use
  `TransitionSeries`. Keep each scene inside its own
  `TransitionSeries.Sequence`, with duration and source trim on that boundary.
  Add transitions when needed and account for their overlaps in the total
  composition duration.

Follow editable timeline structure (`timeline-structure.md` in the `remotion-interactivity` skill)
for a complete scene, parent, and registration example. See
[transitions](transitions.md) for transition timing and presentations, and
[connected compositions](connected-compositions.md) for extraction and
verification in the full video.

### `skills/remotion-markup/parameters.md`
_Make a video parametrizable by adding a Zod schema_

To make a video parametrizable, a Zod schema can be added to a composition.

First, install `zod` in the version that matches Remotion:

```bash
npx remotion add zod # If project uses npm
bunx remotion add zod # If project uses bun
yarn remotion add zod # If project uses yarn
pnpm exec remotion add zod # If project uses pnpm
```

Then, a Zod schema can be defined alongside the component:

```tsx title="src/MyComposition.tsx"
import { z } from "zod";

export const MyCompositionSchema = z.object({
  title: z.string(),
});

export const MyComponent: React.FC<z.infer<typeof MyCompositionSchema>> = (
  props,
) => {
  return (
    <div>
      <h1>
        {props.title}
      </h1>
    </div>
  );
};
```

In the root file, the schema can be passed to the composition:

```tsx title="src/Root.tsx"
import { Composition } from "remotion";
import { MyComponent, MyCompositionSchema } from "./MyComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComponent}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ title: "Hello World" }}
      schema={MyCompositionSchema}
    />
  );
};
```

Now, the user can edit the parameter visually in the sidebar.

When rendering, Remotion validates the props against the schema. If they are invalid, Remotion 4 logs a warning that lists each invalid field and renders anyway. Remotion 5 fails the render. Remotion shallowly merges input props with `defaultProps`. A nested object in the input props replaces the whole default object.

All schemas that are supported by Zod are supported by Remotion.

Remotion requires that the top-level type is a z.object(), because the collection of props of a React component is always an object.

##### Color picker

For adding a color picker, use `zColor()` from `@remotion/zod-types`.

If it is not installed, use the following command:

```bash
npx remotion add @remotion/zod-types # If project uses npm
bunx remotion add @remotion/zod-types # If project uses bun
yarn remotion add @remotion/zod-types # If project uses yarn
pnpm exec remotion add @remotion/zod-types # If project uses pnpm
```

Then import `zColor` from `@remotion/zod-types`:

```tsx
import { zColor } from "@remotion/zod-types";
```

Then use it in the schema:

```tsx
export const MyCompositionSchema = z.object({
  color: zColor(),
});
```

### `skills/remotion-markup/sequencing.md`
_Sequencing patterns for Remotion - delay, trim, limit duration of items_

#### Choose the timing boundary

Put timing props directly on a built-in interactive component or one made with
`Interactive.create()` when that item should be edited independently. Set audio
timing and volume on `Audio` from `@remotion/media`.

Use a shared `Sequence` when several layers must inherit the same trim, speed,
or start time, when overriding dimensions for descendants, or when the child
does not accept timing props. Choose `layout="none"` if the group should not
add a layout element; otherwise its absolute-fill layout also positions the
contents.

Use `Track` for non-overlapping items with independent positions and
`TransitionSeries` for consecutive items that should shift together when a
duration changes. Keep the series' own sequence boundaries, including when a
child already accepts timing props.

Follow editable timeline structure (`timeline-structure.md` in the `remotion-interactivity` skill)
for grouping and examples. See [timing props](timing-props.md) for how `from`,
`trimBefore`, duration, speed, and looping combine, and
[editable video timelines](video-editing.md) for synchronized footage and captions.

### `skills/remotion-markup/sfx.md`
_Including sound effects_

To include a sound effect, use `<Audio>` from `@remotion/media`:

```tsx
import { Audio } from "@remotion/media";

<Audio src={"https://remotion.media/whoosh.wav"} />;
```

The following sound effects are available:

- `https://remotion.media/whoosh.wav`
- `https://remotion.media/whip.wav`
- `https://remotion.media/page-turn.wav`
- `https://remotion.media/switch.wav`
- `https://remotion.media/mouse-click.wav`
- `https://remotion.media/shutter-modern.wav`
- `https://remotion.media/shutter-old.wav`
- `https://remotion.media/ding.wav`
- `https://remotion.media/bruh.wav`
- `https://remotion.media/vine-boom.wav`
- `https://remotion.media/windows-xp-error.wav`
- `https://remotion.media/fah.wav`
- `https://remotion.media/spongebob-fail.wav`
- `https://remotion.media/omg-hell-nah.wav`
- `https://remotion.media/price-is-right-fail.wav`
- `https://remotion.media/romance-meme.wav`
- `https://remotion.media/bone-crack.wav`
- `https://remotion.media/anime-wow.wav`
- `https://remotion.media/yippee.wav`
- `https://remotion.media/loading-lag.wav`
- `https://remotion.media/wilhelm-scream.wav`
- `https://remotion.media/mac-quack.wav`
- `https://remotion.media/skedaddle.wav`
- `https://remotion.media/snapchat-notification.wav`
- `https://remotion.media/nelly-ahh.wav`
- `https://remotion.media/sanctuary-guardian-what.wav`
- `https://remotion.media/minecraft-hurt.wav`
- `https://remotion.media/oh-my-god-vine.wav`
- `https://remotion.media/illuminati-confirmed.wav`
- `https://remotion.media/dramatic-boomer.wav`
- `https://remotion.media/triggered.wav`
- `https://remotion.media/record-scratch.wav`

For more sound effects, search the internet. A good resource is https://github.com/kapishdima/soundcn/tree/main/assets.

### `skills/remotion-markup/silence-detection.md`
_Adaptive silence detection for video/audio files using FFmpeg loudnorm and silencedetect_

#### Adaptive Silence Detection

Detect silent segments in video or audio files.

Requires FFmpeg — see [ffmpeg.md](./ffmpeg.md) for how to invoke it in Remotion projects.

##### Step 1: Measure loudness with `loudnorm`

Use the `loudnorm` filter in JSON mode to get the EBU R128 integrated loudness and gating threshold for each file:

```bash
npx remotion ffmpeg -i public/video.mov -map 0:a -af loudnorm=print_format=json -f null /dev/null
```

As output you will get:
- `input_i`: Integrated loudness (dB) — the overall perceived volume
- `input_thresh`: EBU R128 gating threshold (dB) — the level below which audio is considered too quiet to count toward loudness measurement

##### Step 2: Detect silences using adaptive threshold

Pass the `input_thresh` value from step 1 as the `noise` parameter to `silencedetect`:

```bash
npx remotion ffmpeg -i public/video.mov -map 0:a -af "silencedetect=noise=${THRESH}dB:d=0.5" -f null /dev/null
```

Parameters:
- `noise`: The threshold below which audio is considered silent. Use `input_thresh` from step 1.
- `d`: Minimum silence duration in seconds. `0.5` is a good default.

##### Interpreting the output

The filter outputs pairs of `silence_start` and `silence_end` timestamps:

```
[silencedetect] silence_start: 0
[silencedetect] silence_end: 2.241021 | silence_duration: 2.241021
[silencedetect] silence_start: 38.77425
[silencedetect] silence_end: 39.619604 | silence_duration: 0.845354
```

##### Identifying leading and trailing silence

- **Leading silence**: Consecutive silence segments starting at or near 0. If the first `silence_start` is > 0.5s, there is no leading silence.
- **Trailing silence**: The last silence segment that extends to (or near) the end of the file. Compare the last `silence_end` with the file's total duration.

When multiple silences are nearly contiguous at the start or end (gap < 0.2s), treat them as a single leading/trailing silence block.

##### Using with Remotion's `<Video>` component

Apply the detected trim points using `trimBefore` and `durationInFrames` (values are in frames):

```tsx
import { Video } from "@remotion/media";
import { staticFile, useVideoConfig } from "remotion";

const { fps } = useVideoConfig();

<Video
  src={staticFile("video.mov")}
  trimBefore={Math.floor(leadingEnd * fps)}
  durationInFrames={Math.ceil(trailingStart * fps) - Math.floor(leadingEnd * fps)}
/>
```

### `skills/remotion-markup/text-highlights.md`
_Animated text highlights and hand-drawn annotations using @remotion/rough-notation._

#### Text highlights

Use `@remotion/rough-notation` to draw animated annotations around or behind text. It supports highlights, circles, underlines, strike-throughs, crossed-off text, boxes, and brackets.

Docs: https://www.remotion.dev/docs/text-highlights

Install the package using the same Remotion version as the project:

```bash
bunx remotion add @remotion/rough-notation
```

Choose the component that describes the annotation: `<Highlight>`, `<Circle>`, `<Underline>`, `<StrikeThrough>`, `<CrossedOff>`, `<Box>`, or `<Bracket>`. The component determines both the annotation style and whether it renders behind or on top of the text.

Drive `progress` from `useCurrentFrame()` so the annotation is deterministic and synchronized with the video:

```tsx
import {Circle, Highlight} from '@remotion/rough-notation';
import {interpolate, useCurrentFrame} from 'remotion';

export const TextAnnotations: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{fontSize: 80}}>
      This is{' '}
      <Highlight
        color="rgba(255, 236, 79, 0.62)"
        progress={interpolate(frame, [15, 40], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      >
        important
      </Highlight>
      , and this is{' '}
      <Circle color="#2563eb" progress={interpolate(frame, [15, 40], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })}>
        connected
      </Circle>
      .
    </div>
  );
};
```

Keep `progress` inline, hardcoded and use `interpolate` for maximum Studio interactivity (`remotion-interactivity` skill).

### `skills/remotion-markup/timing-props.md`
##### Delaying, trimming

In the component that renders these items, get `const {fps} = useVideoConfig()`.
Use this `fps` for seconds-to-frames expressions on the JSX node, rather than
a fixed FPS constant.

The following timing props are supported by built-in components (`<AbsoluteFill>`, `<Interactive.*>`, `<Img>`, `<AnimatedImage>`, `<CanvasImage>`, `<HtmlInCanvas>`, `<Solid>`, `<Sequence>`, `<Track>` from `remotion`, `<Video>` and `<Audio>` from `@remotion/media`, `<Gif>`, and more).
Custom components made with `Interactive.create()` accept them too, see Prefer interactive components with their own timelines (`remotion-interactivity` skill).

###### `from`

When the item starts appearing in the timeline.
Its children start at frame `0` when it appears.

```tsx
<Img from={1 * fps} {/* ... */}/>
<Video from={1 * fps} {/* ... */}/>
<Interactive.Div from={1 * fps} {/* ... */}/>
<LowerThird from={1 * fps} {/* ... */}/>
```

###### `trimBefore`

Sets the first frame of the item's own timeline:

```tsx
// Trim away first 2 seconds of footage
<Video trimBefore={2 * fps} {/* ... */} />

// `useCurrentFrame()` of the children starts at `10 * fps`
<Interactive.Div trimBefore={10 * fps} {/* ... */} />
```

###### `durationInFrames`

How many frames of the item's own timeline are shown, starting at `trimBefore`.
Use it to end media early instead of cutting the file:

```tsx
// Play the footage from second 2 to second 5
<Video trimBefore={2 * fps} durationInFrames={3 * fps} {/* ... */} />
<Img durationInFrames={20 * fps} {/* ... */}/>
<LowerThird durationInFrames={5 * fps} {/* ... */}/>
```

###### `playbackRate`

Changes the speed of the item.
Children calling `useCurrentFrame()` advance `playbackRate` frames per frame of the parent.
The item occupies `durationInFrames / playbackRate` frames in its parent timeline.

```tsx
// 2x speed
<Video playbackRate={2} {/* ... */} />
<LowerThird playbackRate={0.5} durationInFrames={2 * fps} {/* ... */} />
```

###### `loop`

Repeats the range selected by `trimBefore` and `durationInFrames` until the parent ends.
`<Video>`, `<Audio>`, `<Gif>` and `<AnimatedImage>` may omit `durationInFrames`; the media's own duration after `trimBefore` then defines the loop range.
Other items need `durationInFrames` to define the loop range:

```tsx
<Video loop {/* ... */} />
<Interactive.Div durationInFrames={2 * fps} loop {/* ... */} />
```

Put timing and volume directly on `<Audio>`.

`<Img>`, `<CanvasImage>`, `<Solid>` and shapes do not support `loop` because their output does not change over time.

###### Order of operations

1. `from` positions the item in its parent timeline.
2. `trimBefore` sets the first frame of the item's own timeline.
3. `durationInFrames` selects the range of the item's own timeline.
4. `playbackRate` stretches or compresses the selected range.
5. `loop` repeats the selected range until the parent ends.

Children calling `useCurrentFrame()` get `trimBefore + (frame - from) * playbackRate`.

See [Timing and trimming](https://www.remotion.dev/docs/timing) for more details.

###### Fallback

If a component does not support these props, wrap it in `<Sequence>` from `remotion`, which has them.

- `layout="absolute-fill"` makes the Sequence behave like AbsoluteFill
- `layout="none"` is "headless" mode, no wrapper element is used.

### `skills/remotion-markup/timing.md`
Drive motion with `interpolate()` over an explicit frame range. 
To customize timing, use **`Easing.bezier`** or `Easing.spring`.

A simple linear interpolation is done using the `interpolate` function.

```ts title="Going from 0 to 1 over 0.3 seconds"
import { interpolate } from "remotion";

const opacity = interpolate(frame, [0, 0.3 * fps], [0, 1]);
```

By default, the values are not clamped, so the value can go outside the range [0, 1].  
Here is how they can be clamped:

```ts title="Going from 0 to 1 over 0.3 seconds with extrapolation"
const opacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
});
```

##### Studio-editable animation patterns

When an animation should be editable in Remotion Studio, keep the `interpolate()` call directly in the `style` prop and prefer individual CSS transform properties:

```tsx
// 👍 Inline editable keyframes and transform shorthands
style={{
  scale: interpolate(frame, [0, 100], [0, 1]),
  translate: interpolate(frame, [0, 100], ["0px 0px", "100px 100px"]),
  rotate: interpolate(frame, [0, 100], ["20deg", "90deg"]),
}}

// 👎 Hidden values and transform strings become computed in Studio
const translateY = interpolate(frame, [0, 100], [0, 120]);
const rotation = interpolate(frame, [0, 100], [0, 20]);

style={{
  transform: `translateY(${translateY}px) rotate(${rotation}deg)`,
}}
```

Use `transform` strings only when individual CSS transform properties do not cover the effect, such as `skew()`, `perspective()`, or order-sensitive multi-transform chains.

##### Spring easing

A nice push movement with no bounce:

```ts
import { interpolate, Easing } from "remotion";

const opacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
  easing: Easing.spring({damping: 200}),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

##### Bézier easing

Pass values like you would to a CSS cubic-bezier function.

```ts
import { interpolate, Easing } from "remotion";

const opacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

##### Animating scale

When animating scale, if the output is linear, the perceived scale would be smaller the larger the scale gets.  
Use this option to compensate:

```ts
const scale = interpolate(frame, [0, 0.3 * fps], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  output: 'perceptual-scale' // <- Add this to scale animations
});
```

##### Multiple keyframes

Add as many keyframes as you want. For multiple easings, pass an array with `n - 1` items:

```ts
const scale = interpolate(frame, [0, 1 * fps, 9 * fps, 10 * fps], [0, 1, 1, 0], {
  easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear, Easing.spring({damping: 200})],
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  output: 'perceptual-scale' // <- Add this to scale animations
});
```

##### Posterization

You can intentionally reduce the frame rate for artistic reason. Use if it makes sense.

```ts
const scale = interpolate(frame, [0, 1 * fps], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  posterize: 3 // Only every 3rd frame is sampled
});
```

### `skills/remotion-markup/transitions.md`
_Scene transitions and overlays for Remotion using TransitionSeries._

##### TransitionSeries

`<TransitionSeries>` arranges scenes and supports two ways to enhance the cut point between them:

- **Transitions** (`<TransitionSeries.Transition>`) — crossfade, slide, wipe, etc. between two scenes. Shortens the timeline because both scenes play simultaneously during the transition.
- **Overlays** (`<TransitionSeries.Overlay>`) — render an effect (e.g. a light leak) on top of the cut point without shortening the timeline.

For a multi-scene timeline, keep the outer `<TransitionSeries>` visible in the
timeline. Studio favors the active scene sequence when the two have the same
full-frame canvas outline.

Children are absolutely positioned.

##### Prerequisites

```bash
bunx remotion add @remotion/transitions
```

##### Transition example

Use the connected `Chapter` scene from the
composition example (`timeline-structure.md` in the `remotion-interactivity` skill).

```tsx title="TransitionVideo.tsx"
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Chapter} from './Chapter';

export const TransitionVideo = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Opening" durationInFrames={60}>
      <Chapter title="Introduction" style={{backgroundColor: '#111111'}} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({durationInFrames: 15})}
    />
    <TransitionSeries.Sequence name="Feature" durationInFrames={60}>
      <Chapter title="New features" style={{backgroundColor: '#243b53'}} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
```

##### Custom presentation

```tsx title="SlideInPresentation.tsx"
import type {TransitionPresentationComponentProps} from '@remotion/transitions';

export const SlideInPresentation = ({
  children,
  presentationDirection,
  presentationProgress,
}: TransitionPresentationComponentProps<Record<string, never>>) => {
  if (presentationDirection === 'exiting') {
    return <>{children}</>;
  }

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          translate: `${(1 - presentationProgress) * 100}% 0`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
```

Use it in place of `fade()` in `TransitionVideo.tsx`:

```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {SlideInPresentation} from './SlideInPresentation';

<TransitionSeries.Transition
  presentation={{component: SlideInPresentation, props: {}}}
  timing={linearTiming({durationInFrames: 15})}
/>;
```

##### Overlay example

```tsx title="LightLeakOverlay.tsx"
import {lightLeak} from '@remotion/effects/light-leak';
import type {CSSProperties} from 'react';
import {Interactive, interpolate, Solid, useCurrentFrame, useVideoConfig} from 'remotion';

const LightLeakOverlayInner = ({style}: {readonly style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, height, width} = useVideoConfig();

  return (
    <Solid
      width={width}
      height={height}
      style={style}
      effects={[
        lightLeak({
          progress: interpolate(frame, [0, durationInFrames - 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }),
      ]}
    />
  );
};

export const LightLeakOverlay = Interactive.create({
  Component: LightLeakOverlayInner,
  layout: 'none',
});
```

```tsx title="OverlayVideo.tsx"
import {TransitionSeries} from '@remotion/transitions';
import {Chapter} from './Chapter';
import {LightLeakOverlay} from './LightLeakOverlay';

export const OverlayVideo = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Opening" durationInFrames={60}>
      <Chapter title="Introduction" style={{backgroundColor: '#111111'}} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Overlay durationInFrames={20}>
      <LightLeakOverlay name="Light leak" />
    </TransitionSeries.Overlay>
    <TransitionSeries.Sequence name="Feature" durationInFrames={60}>
      <Chapter title="New features" style={{backgroundColor: '#243b53'}} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
```

##### Mixing transitions and overlays

Separate overlays and transitions with a scene.

```tsx title="MixedVideo.tsx"
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Chapter} from './Chapter';
import {LightLeakOverlay} from './LightLeakOverlay';

export const MixedVideo = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Opening" durationInFrames={60}>
      <Chapter title="Introduction" style={{backgroundColor: '#111111'}} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Overlay durationInFrames={30}>
      <LightLeakOverlay name="Light leak" />
    </TransitionSeries.Overlay>
    <TransitionSeries.Sequence name="Feature" durationInFrames={60}>
      <Chapter title="New features" style={{backgroundColor: '#243b53'}} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({durationInFrames: 15})}
    />
    <TransitionSeries.Sequence name="Closing" durationInFrames={60}>
      <Chapter title="Thank you" style={{backgroundColor: '#382345'}} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
```

##### Transition props

`<TransitionSeries.Transition>` requires:

- `presentation` — the visual effect (e.g. `fade()`, `slide()`, `wipe()`).
- `timing` — controls speed and easing (e.g. `linearTiming()`, `springTiming()`).

##### Motion blur

`<TransitionSeries.Transition>` CAN blur presentation movement with `motionBlur={{shutterAngle: 180, samples: 16}}`.
All built-in presentations support it. For a complete example, custom presentation requirements, scene sampling, and CSS style restrictions, read [motion-blur.md](motion-blur.md#motion-blur-on-transitions).

##### Overlay props

`<TransitionSeries.Overlay>` accepts:

- `durationInFrames` — how long the overlay is visible (positive integer).
- `offset?` — shifts the overlay relative to the cut point center. Positive = later, negative = earlier. Default: `0`.

##### Available transition types

Import transitions from their respective modules:

```tsx
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
```

##### Slide transition with direction

```tsx
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";

<TransitionSeries.Transition
  presentation={slide({ direction: "from-left" })}
  timing={linearTiming({ durationInFrames: 20 })}
/>;
```

Directions: `"from-left"`, `"from-right"`, `"from-top"`, `"from-bottom"`

##### Timing options

```tsx
import { linearTiming, springTiming } from "@remotion/transitions";

// Linear timing - constant speed
linearTiming({ durationInFrames: 20 });

// Spring timing - organic motion
springTiming({ config: { damping: 200 }, durationInFrames: 25 });
```

##### Duration calculation

Transitions overlap adjacent scenes, so the total composition length is **shorter** than the sum of all sequence durations. Overlays do **not** affect the total duration.

For example, with two 60-frame sequences and a 15-frame transition:

- Without transitions: `60 + 60 = 120` frames
- With transition: `60 + 60 - 15 = 105` frames

Adding an overlay between two other sequences does not change the total.

###### Getting the duration of a transition

Use the `getDurationInFrames()` method on the timing object:

```tsx
import { linearTiming, springTiming } from "@remotion/transitions";

const linearDuration = linearTiming({
  durationInFrames: 20,
}).getDurationInFrames({ fps: 30 });
// Returns 20

const springDuration = springTiming({
  config: { damping: 200 },
}).getDurationInFrames({ fps: 30 });
// Returns calculated duration based on spring physics
```

For `springTiming` without an explicit `durationInFrames`, the duration depends on `fps` because it calculates when the spring animation settles.

###### Calculating total composition duration

```tsx
import { linearTiming } from "@remotion/transitions";

const scene1Duration = 60;
const scene2Duration = 60;
const scene3Duration = 60;

const timing1 = linearTiming({ durationInFrames: 15 });
const timing2 = linearTiming({ durationInFrames: 20 });

const transition1Duration = timing1.getDurationInFrames({ fps: 30 });
const transition2Duration = timing2.getDurationInFrames({ fps: 30 });

const totalDuration =
  scene1Duration +
  scene2Duration +
  scene3Duration -
  transition1Duration -
  transition2Duration;
// 60 + 60 + 60 - 15 - 20 = 145 frames
```

### `skills/remotion-markup/video-matting.md`
#### Video matting

Use `@remotion/video-matting` to separate a source video into an opaque base and
a foreground WebM with transparency. Process the source once and reuse the
outputs in compositions; do not run the model during frame rendering.

##### Generate the layers

Reuse an existing foreground if it was generated from the same source and has
matching timing and dimensions.

In Remotion Studio, select a video and choose **Remove background**. This
replaces its source with a transparent WebM. Duplicate the layer first when
the original video is needed underneath. Agents with Studio WebMCP access can
also use `remove_video_background`.

For local files in Node.js:

1. Install `@remotion/video-matting`, `@huggingface/transformers`, `mediabunny`,
   and `@mediabunny/server` with `remotion add` using the project's package manager.
2. Call `registerMediabunnyServer()` from `@mediabunny/server` before processing.
3. Choose `modnet` for people. Use the experimental `ben2-base` model for general
   foreground subjects; it requires more GPU memory and fp16 support.
4. Call `canUseVideoMatting({model})`. If unsupported, report its `detailedReason`
   instead of promising a result. A compatible GPU is required.
5. Call `downloadVideoMattingModel({model})`, then
   `separateVideoLayers({src, model, audio: 'base'})`. `src` may be a local path.
6. Retrieve each output with `base.getBlob()` and `foreground.getBlob()` and
   write the bytes to `.webm` files in `public/`. Dispose the outputs after
   saving them. Call `disposeVideoMattingModel({model})` when no more processing
   is needed.

See the [Node.js setup](https://www.remotion.dev/docs/video-matting/node) and
[`separateVideoLayers()` reference](https://www.remotion.dev/docs/video-matting/separate-video-layers)
for output streams, progress reporting, and disposal APIs. Custom output streams
must honor each chunk's `position`; writes are not necessarily append-only.

##### Compose the result

Use `<Video>` from `@remotion/media` for both layers and `staticFile()` for saved
assets. JSX order determines stacking, from back to front:

- **Text behind a subject:** original or base video, an `Interactive.Div` with
  editable text, then the foreground.
- **Background blur:** original or base video with `blur()` from
  `@remotion/effects/blur`, then the sharp foreground.
- **Background replacement:** a new background, then the foreground. Omit the
  original video.
- **Subject-only effects:** apply effects such as `glow()`, `dropShadow()`, or
  `colorCorrection()` to the foreground. Keep the original video underneath
  when its background should remain visible.

The base still contains the subject. Matting does not reconstruct what was
hidden behind it; strong background blur may leave a halo around the subject.

Keep both layers' position, dimensions, `objectFit`, cropping, `from`,
`trimBefore`, `durationInFrames`, and `playbackRate` aligned. Play the original
audio once: mute the foreground when the base has audio. For replacement
backgrounds, use `audio: 'foreground'` during separation or add the original
audio separately. Preserve the foreground's alpha-capable WebM format.

Rendered frames or Studio scrubbing CAN show synchronization and the edges of
hair or moving objects. See the
[video matting guide](https://www.remotion.dev/docs/video-matting-guide) for
complete composition examples.

## Appendix D — Not inlined (size budget), read from source when needed
- [`skills/remotion-markup/video-editing.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-markup/video-editing.md)
- [`skills/remotion-captions/display-captions.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-captions/display-captions.md)
- [`skills/remotion-captions/import-srt-captions.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-captions/import-srt-captions.md)
- [`skills/remotion-captions/transcribe-captions.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-captions/transcribe-captions.md)
- [`skills/remotion-create/tailwind.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-create/tailwind.md)
- [`skills/remotion-create/video-layout.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-create/video-layout.md)
- [`skills/remotion-interactivity/inline-effects.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-interactivity/inline-effects.md)
- [`skills/remotion-interactivity/timeline-structure.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-interactivity/timeline-structure.md)
- [`skills/remotion-multimedia/get-audio-duration.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-multimedia/get-audio-duration.md)
- [`skills/remotion-multimedia/get-video-dimensions.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-multimedia/get-video-dimensions.md)
- [`skills/remotion-multimedia/get-video-duration.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-multimedia/get-video-duration.md)
- [`skills/remotion-render/opentimeline.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-render/opentimeline.md)
- [`skills/remotion-render/transparent-videos.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-render/transparent-videos.md)
- [`skills/remotion-saas/framework.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-saas/framework.md)
- [`skills/remotion-saas/player.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-saas/player.md)
- [`skills/remotion-saas/rendering.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-saas/rendering.md)
- [`skills/remotion-best-practices/remotion-captions/REFERENCE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-captions/REFERENCE.md)
- [`skills/remotion-best-practices/remotion-create/REFERENCE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-create/REFERENCE.md)
- [`skills/remotion-best-practices/remotion-docs/REFERENCE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-docs/REFERENCE.md)
- [`skills/remotion-best-practices/remotion-interactivity/REFERENCE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-interactivity/REFERENCE.md)
- [`skills/remotion-best-practices/remotion-interactivity/timeline-structure.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-interactivity/timeline-structure.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/cesium/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/cesium/TECHNIQUE.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/cesium/references/3d-data-sources.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/cesium/references/3d-data-sources.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/cesium/references/3d-flyover-architecture.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/cesium/references/3d-flyover-architecture.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/cesium/references/3d-troubleshooting.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/cesium/references/3d-troubleshooting.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/mapbox/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/mapbox/TECHNIQUE.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/mapbox/references/render-stability.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/mapbox/references/render-stability.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/maplibre/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/maplibre/TECHNIQUE.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/maptiler/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/maptiler/TECHNIQUE.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/maptiler/references/map-data-sources.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/maptiler/references/map-data-sources.md)
- [`skills/remotion-best-practices/remotion-maps/techniques/static-map/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-maps/techniques/static-map/TECHNIQUE.md)
- [`skills/remotion-best-practices/remotion-markup/REFERENCE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/REFERENCE.md)
- [`skills/remotion-best-practices/remotion-markup/audio.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/audio.md)
- [`skills/remotion-best-practices/remotion-markup/calculate-metadata.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/calculate-metadata.md)
- [`skills/remotion-best-practices/remotion-markup/compositions.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/compositions.md)
- [`skills/remotion-best-practices/remotion-markup/connected-compositions.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/connected-compositions.md)
- [`skills/remotion-best-practices/remotion-markup/cropping.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/cropping.md)
- [`skills/remotion-best-practices/remotion-markup/multi-scene-video.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/multi-scene-video.md)
- [`skills/remotion-best-practices/remotion-markup/remotion-maps/techniques/static-map/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/remotion-maps/techniques/static-map/TECHNIQUE.md)
- [`skills/remotion-best-practices/remotion-markup/sequencing.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/sequencing.md)
- [`skills/remotion-best-practices/remotion-markup/text-highlights.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/text-highlights.md)
- [`skills/remotion-best-practices/remotion-markup/timing-props.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/timing-props.md)
- [`skills/remotion-best-practices/remotion-markup/transitions.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/transitions.md)
- [`skills/remotion-best-practices/remotion-markup/video-editing.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-markup/video-editing.md)
- [`skills/remotion-best-practices/remotion-render/REFERENCE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-render/REFERENCE.md)
- [`skills/remotion-best-practices/remotion-saas/rendering.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-best-practices/remotion-saas/rendering.md)
- [`skills/remotion-maps/techniques/static-map/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-maps/techniques/static-map/TECHNIQUE.md)
- [`skills/remotion-markup/remotion-maps/techniques/static-map/TECHNIQUE.md`](https://github.com/remotion-dev/skills/blob/6f55706/skills/remotion-markup/remotion-maps/techniques/static-map/TECHNIQUE.md)

---
**Source & credit:** [remotion-dev/skills](https://github.com/remotion-dev/skills) @ `6f55706` (cloned 2026-11-22). License: No LICENSE file in the skills repo; Remotion itself uses the Remotion License (free for individuals and companies up to 3 people, company license needed above that; see remotion-license section). All upstream text in the appendices is © its authors, inlined for personal use with attribution; this wrapper skill by Space Age.
