"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion";
import SectionHeading from "./ui/SectionHeading";

/**
 * Orbiting 3D photo sphere (Ruben Stom technique, ported to React/Three.js).
 * Venue/event photos are billboarded cards placed on a Fibonacci sphere that
 * auto-rotates, can be dragged to spin (with friction settle) and tilted, with
 * depth-based scale/opacity for real 3D depth. Click a frame to open it.
 * Falls back to a static grid for reduced-motion / no-WebGL.
 */
const IMAGES = Array.from({ length: 14 }, (_, i) => `/gallery/g-${String(i + 1).padStart(2, "0")}.webp`);
const CARD_ASPECT = 3 / 2;

export default function SphereGallery() {
  const mount = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setWebgl(false);
      return;
    }
    const el = mount.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebgl(false);
      return;
    }

    const size = () => ({ w: el.clientWidth || 1, h: el.clientHeight || 1 });
    let { w, h } = size();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      "display:block;width:100%;height:100%;cursor:grab;touch-action:pan-y;";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    // Fibonacci sphere directions
    const N = IMAGES.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const dirs: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      dirs.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
    }

    const R = 3.25;
    const CARD_W = 1.18;
    const CARD_H = CARD_W / CARD_ASPECT;
    const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
    const loader = new THREE.TextureLoader();

    function coverFit(tex: THREE.Texture) {
      const img = tex.image as { width?: number; height?: number } | undefined;
      if (!img || !img.width || !img.height) return;
      const a = img.width / img.height;
      tex.center.set(0.5, 0.5);
      if (a > CARD_ASPECT) tex.repeat.set(CARD_ASPECT / a, 1);
      else tex.repeat.set(1, a / CARD_ASPECT);
    }

    const cards = dirs.map((dir, i) => {
      const tex = loader.load(IMAGES[i], (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        coverFit(t);
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.i = i;
      scene.add(mesh);
      return { dir, mesh, mat, hover: 0 };
    });

    // Interaction state
    let yaw = 0;
    let yawVel = 0;
    let pitch = 0;
    const IDLE = 0.12;
    const MAXTILT = THREE.MathUtils.degToRad(22);
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    let downIdx = -1;
    let hoverIdx = -1;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();

    const setNDC = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const pick = () => {
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(
        cards.map((c) => c.mesh),
        false,
      );
      return hits.length ? (hits[0].object.userData.i as number) : -1;
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      setNDC(e);
      downIdx = pick();
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      setNDC(e);
      if (!dragging) {
        hoverIdx = pick();
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      yaw += dx * 0.006;
      yawVel = dx * 0.06;
      pitch = THREE.MathUtils.clamp(pitch + dy * 0.005, -MAXTILT, MAXTILT);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      renderer.domElement.style.cursor = "grab";
      if (moved < 6) {
        setNDC(e);
        const i = pick();
        if (i >= 0 && i === downIdx) setLightbox(IMAGES[i]);
      }
    };
    const onLeave = () => {
      hoverIdx = -1;
    };

    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const rotM = new THREE.Matrix4();
    const pitchM = new THREE.Matrix4();
    const tmp = new THREE.Vector3();
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        yaw += (IDLE + yawVel) * dt;
        yawVel *= Math.exp(-dt / 0.7);
        if (Math.abs(yawVel) < 1e-4) yawVel = 0;
        pitch += (0 - pitch) * (1 - Math.exp(-dt / 1.2));
      }
      rotM.makeRotationY(yaw);
      pitchM.makeRotationX(pitch);
      rotM.premultiply(pitchM);

      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        tmp.copy(c.dir).applyMatrix4(rotM);
        const px = tmp.x * R;
        const py = tmp.y * R * 0.92;
        const pz = tmp.z * R;
        const depthT = (tmp.z + 1) / 2; // 0 back .. 1 front
        const depthScale = 0.72 + 0.28 * depthT;
        const depthOp = 0.34 + 0.66 * depthT;
        const isH = i === hoverIdx && !dragging;
        c.hover += ((isH ? 1 : 0) - c.hover) * Math.min(1, dt * 8);
        const he = c.hover * c.hover * (3 - 2 * c.hover);

        c.mesh.position.set(px, py, pz);
        c.mesh.lookAt(camera.position);
        c.mesh.scale.setScalar(depthScale * (1 + 0.22 * he));
        c.mat.opacity = Math.min(1, depthOp + (1 - depthOp) * he);
        c.mesh.renderOrder = -camera.position.distanceTo(c.mesh.position);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      const s = size();
      w = s.w;
      h = s.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      geo.dispose();
      cards.forEach((c) => {
        c.mat.map?.dispose();
        c.mat.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section id="gallery" className="relative bg-black px-5 py-24 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-edge">
        <SectionHeading
          eyebrow="Inside"
          title={
            <>
              The <span className="gold-text">room</span>
            </>
          }
          intro="Drag to spin the room. Tap any frame to open it full-size."
        />
      </div>

      {webgl ? (
        <div ref={mount} className="relative mt-6 h-[68vh] min-h-[420px] w-full" />
      ) : (
        <div className="mx-auto mt-8 grid max-w-edge grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {IMAGES.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <button key={src} onClick={() => setLightbox(src)} className="block">
              <img src={src} alt="Inside Private Nightclub" loading="lazy" className="aspect-[3/2] w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Inside Private Nightclub" className="max-h-[88vh] max-w-[92vw] object-contain shadow-lift" />
        </div>
      )}
    </section>
  );
}
