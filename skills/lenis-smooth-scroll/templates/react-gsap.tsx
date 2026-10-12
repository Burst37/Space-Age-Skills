'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

// Mount once near the root. One Lenis instance, driven by GSAP's ticker.
//
// NOTE: <ReactLenis> creates the Lenis instance inside its own effect and exposes it
// through state, so `lenisRef.current.lenis` is still undefined during THIS component's
// first mount effect. Therefore:
//   - read the ref lazily on every tick (never capture `.lenis` once in the effect), and
//   - attach scroll listeners through `useLenis`, which re-runs when the instance exists.
function ScrollTriggerSync() {
  useLenis(() => ScrollTrigger.update())   // keeps pins/scrubs on the smoothed scroll value
  return null
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const tick = (time: number) => lenisRef.current?.lenis?.raf(time * 1000) // seconds → ms
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
