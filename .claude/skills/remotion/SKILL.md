---
name: remotion
display_name: "SPACE AGE — Remotion Video Production"
version: "1.0.0"
last_updated: "2026-05-30"
origin: remotion/remotion-main (SA-wrapped for Space Age AI Solutions)
description: >
  Production-grade programmatic video creation using Remotion (React-based video framework).
  Covers project scaffolding, animation with useCurrentFrame/interpolate, Sequence/AbsoluteFill
  composition, audio/video embedding, captions, transitions, 3D via React Three Fiber, audio
  visualization, FFmpeg operations, voiceover via ElevenLabs TTS, and single-frame render checks.
  SA extensions: music visualizer integration, TEK WAT IT TOOK title screen/intro animations,
  Psalm 23 audiobook video rendering, Record Exec in a Box lyric video pipeline.
triggers:
  - "remotion"
  - "programmatic video"
  - "lyric video"
  - "title screen"
  - "intro animation"
  - "useCurrentFrame"
  - "music visualizer code"
  - "tek wat it took"
  - "psalm 23 video"
skill_connections:
  upstream: [ai-content-creator, music-visualizer, cinematic-prompt-director]
  downstream: [sa-higgsfield-operator]
sa_extensions:
  - "TEK WAT IT TOOK: title screen is a mandatory Remotion composition deliverable"
  - "All SA videos default 1920x1080 30fps"
  - "Never use CSS transitions or Tailwind animation classes"
never_do:
  - Use CSS transitions or Tailwind animation classes (they won't render)
  - Use <video> or <audio> HTML tags — use Remotion's <Video> and <Audio>
  - Render without staticFile() for public/ assets
---

# SPACE AGE — Remotion Video Production

Programmatic video creation in React/TypeScript. Every frame is deterministic.

## Quick Start

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
cd my-video && npx remotion studio
npx remotion still MyComp --scale=0.25 --frame=30
```

## Core Animation Pattern

```tsx
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return <div style={{ opacity }}>Hello World!</div>;
};
```

FORBIDDEN: CSS transitions, CSS animations, Tailwind animation classes.

## Composition Structure (src/Root.tsx)

```tsx
export const RemotionRoot = () => (
  <Composition
    id="MyComposition"
    component={MyComposition}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
  />
);
```

## Sequencing

```tsx
<AbsoluteFill>
  <Sequence><Background /></Sequence>
  <Sequence from={1 * fps} durationInFrames={2 * fps} layout="none">
    <Title />
  </Sequence>
</AbsoluteFill>
```

## Media Embedding

```tsx
import { Img, Video, Audio } from "@remotion/media";
import { staticFile } from "remotion";

<Img src={staticFile("logo.png")} />
<Video src={staticFile("clip.mp4")} startFrom={30} endAt={90} volume={0.5} />
<Audio src={staticFile("track.mp3")} />
```

## Dynamic Metadata from Audio

```tsx
const calculateMetadata = async ({ props }) => {
  const duration = await getAudioDurationInSeconds(props.audioSrc);
  return { durationInFrames: Math.ceil(duration * 30), props, width: 1920, height: 1080 };
};
```

## Rule Files (Load on Demand)

| Need | Load |
|------|------|
| Audio visualization | rules/audio-visualization.md |
| Captions/subtitles | rules/subtitles.md |
| FFmpeg operations | rules/ffmpeg.md |
| Silence detection | rules/silence-detection.md |
| 3D / React Three Fiber | rules/3d.md |
| Text animations | rules/text-animations.md |
| Transitions | rules/transitions.md |
| Timing/springs/Bezier | rules/timing.md |
| Voiceover via ElevenLabs | rules/voiceover.md |
| Light leaks | rules/light-leaks.md |
| Local fonts | rules/local-fonts.md |
| Transparent video | rules/transparent-videos.md |
| Video layout/text sizing | rules/video-layout.md |
| GIFs | rules/gifs.md |
| Lottie | rules/lottie.md |
| Parameterized (Zod) | rules/parameters.md |

## TEK WAT IT TOOK Title Screen

```tsx
const TitleScreen = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps * 1.5], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const scale = interpolate(frame, [0, fps * 1.5], [1.08, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#050508" }}>
      <div style={{ opacity, transform: `scale(${scale})`, fontFamily: "Orbitron, sans-serif", fontSize: 96, color: "#FF6B00", textAlign: "center" }}>
        TEK WAT IT TOOK
      </div>
    </AbsoluteFill>
  );
};
```

## Render Commands

```bash
npx remotion studio
npx remotion still MyComposition --scale=0.25 --frame=30
npx remotion render MyComposition out/video.mp4
npx remotion render MyComposition out/video.mp4 --frames=0-90
```
