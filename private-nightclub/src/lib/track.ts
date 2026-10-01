"use client";

/**
 * Fire-and-forget client analytics. Uses sendBeacon so it never blocks the UI
 * or delays navigation, respects Do Not Track, and silently no-ops on any
 * failure — tracking must never break the guest experience.
 */
export type TrackEvent =
  | { type: "menu"; item: string; category?: string; tab?: string }
  | { type: "cta"; label: string };

export function track(event: TrackEvent) {
  if (typeof window === "undefined") return;
  const dnt =
    navigator.doNotTrack === "1" ||
    (window as unknown as { doNotTrack?: string }).doNotTrack === "1";
  if (dnt) return;
  try {
    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* never block the UI */
  }
}
