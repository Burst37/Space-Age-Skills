# Framer Super Design Skill

Expert Framer developer specializing in Code Components and Code Overrides with React, TypeScript, Framer Motion — including scroll animations, hover interactions, scroll triggers, parallax, sticky behaviors, and gesture systems.

---

## Core Identity

When this skill is active, you are an expert Framer developer. Always:

1. **Determine type first**: Code Component (new functionality) vs Override (modify existing elements)
2. **Include all required structure**: imports → annotations → property controls → prop spreading → TypeScript types
3. **Consider all render targets**: canvas, preview, export, thumbnail
4. **Default to no comments** unless WHY is non-obvious
5. **Respond with**: `Ready to create Framer code. What would you like me to build?` when invoked without a specific request

---

## Part 1 — Foundation Patterns

### Minimal Component Shell

```tsx
/**
 * @framerDisableUnlink
 * @framerIntrinsicWidth 200
 * @framerIntrinsicHeight 200
 */
export default function MyComponent({ text, style }) {
    return <motion.div style={style}>{text}</motion.div>
}

MyComponent.defaultProps = { text: "Hello World" }

addPropertyControls(MyComponent, {
    text: { type: ControlType.String }
})
```

### Layout Annotations Cheatsheet

| Annotation | Effect |
|---|---|
| `@framerSupportedLayoutWidth auto` | Width from content |
| `@framerSupportedLayoutWidth fixed` | Width from container |
| `@framerSupportedLayoutWidth any` | User toggles |
| `@framerSupportedLayoutHeight auto` | Height from content |
| `@framerIntrinsicWidth 200` | Default canvas width |
| `@framerIntrinsicHeight 100` | Default canvas height |
| `@framerDisableUnlink` | Prevents detach from master |

### Property Controls Reference

```tsx
addPropertyControls(Component, {
    text:      { type: ControlType.String, placeholder: "...", defaultValue: "Hello" },
    color:     { type: ControlType.Color, defaultValue: "#09F" },
    number:    { type: ControlType.Number, min: 0, max: 100, step: 1, unit: "px" },
    toggle:    { type: ControlType.Boolean, enabledTitle: "On", disabledTitle: "Off" },
    selection: { type: ControlType.Enum, options: ["a","b"], optionTitles: ["A","B"], displaySegmentedControl: true },
    file:      { type: ControlType.File, allowedFileTypes: ["image/*"] },
    image:     { type: ControlType.ResponsiveImage },
    font:      { type: ControlType.Font, controls: "extended" },
    child:     { type: ControlType.ComponentInstance },
    list:      { type: ControlType.Array, control: { type: ControlType.Object, controls: {} }, maxCount: 10 },
    group:     { type: ControlType.Object, controls: {}, optional: true, buttonTitle: "Settings", icon: "effect" },
    advanced:  { type: ControlType.String, hidden: (props) => !props.showAdvanced },
})
```

---

## Part 2 — Scroll Animation System

### useScroll + useTransform (Parallax / Fade on Scroll)

```tsx
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight fixed
 */
export default function ScrollFadeComponent({ children, speed, style }) {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
    const y = useTransform(scrollYProgress, [0, 1], [60 * speed, -60 * speed])

    return (
        <motion.div ref={ref} style={{ ...style, opacity, y }}>
            {children}
        </motion.div>
    )
}

ScrollFadeComponent.defaultProps = { speed: 1 }

addPropertyControls(ScrollFadeComponent, {
    speed:    { type: ControlType.Number, title: "Parallax Speed", min: 0, max: 5, step: 0.1, defaultValue: 1 },
    children: { type: ControlType.ComponentInstance, title: "Content" },
})
```

### Scroll-Linked Scale + Rotation

```tsx
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function ScrollScaleRotate({ scaleRange, rotateRange, smooth, children, style }) {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleRange[0], 1, scaleRange[1]])
    const rawRotate = useTransform(scrollYProgress, [0, 1], rotateRange)

    const scale = smooth ? useSpring(rawScale, { stiffness: 100, damping: 30 }) : rawScale
    const rotate = smooth ? useSpring(rawRotate, { stiffness: 100, damping: 30 }) : rawRotate

    return (
        <motion.div ref={ref} style={{ ...style, scale, rotate }}>
            {children}
        </motion.div>
    )
}

ScrollScaleRotate.defaultProps = { scaleRange: [0.8, 1.1], rotateRange: [-5, 5], smooth: true }

addPropertyControls(ScrollScaleRotate, {
    scaleRange:  { type: ControlType.Array, control: { type: ControlType.Number, min: 0, max: 3, step: 0.05 }, maxCount: 2, title: "Scale [start, end]" },
    rotateRange: { type: ControlType.Array, control: { type: ControlType.Number, min: -360, max: 360 }, maxCount: 2, title: "Rotate [start°, end°]" },
    smooth:      { type: ControlType.Boolean, title: "Spring Smoothing", defaultValue: true },
    children:    { type: ControlType.ComponentInstance },
})
```

### Scroll Progress Bar Override

```tsx
import type { ComponentType } from "react"
import { motion, useScroll, useSpring } from "framer-motion"

export function withScrollProgress(Component): ComponentType {
    return (props) => {
        const { scrollYProgress } = useScroll()
        const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

        return (
            <>
                <motion.div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: "#09F",
                        transformOrigin: "0%",
                        scaleX,
                        zIndex: 9999,
                    }}
                />
                <Component {...props} />
            </>
        )
    }
}
```

### Horizontal Scroll Section

```tsx
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicHeight 600
 */
export default function HorizontalScrollSection({ itemWidth, gap, children, style }) {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({ target: ref })

    const itemCount = Array.isArray(children) ? children.length : 1
    const totalWidth = itemCount * (itemWidth + gap)

    const x = useTransform(scrollYProgress, [0, 1], [0, -(totalWidth - window.innerWidth)])

    return (
        <div ref={ref} style={{ ...style, height: `${itemCount * 100}vh`, position: "relative" }}>
            <div style={{ position: "sticky", top: 0, overflow: "hidden", height: "100vh" }}>
                <motion.div style={{ x, display: "flex", gap, alignItems: "center", height: "100%" }}>
                    {children}
                </motion.div>
            </div>
        </div>
    )
}

HorizontalScrollSection.defaultProps = { itemWidth: 400, gap: 32 }

addPropertyControls(HorizontalScrollSection, {
    itemWidth: { type: ControlType.Number, title: "Item Width", min: 100, max: 1200, unit: "px" },
    gap:       { type: ControlType.Number, title: "Gap", min: 0, max: 200, unit: "px" },
    children:  { type: ControlType.ComponentInstance },
})
```

---

## Part 3 — Scroll Trigger System (Intersection Observer / useInView)

### Reveal on Enter Viewport

```tsx
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function RevealOnScroll({ animation, delay, once, threshold, children, style }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount: threshold })

    const variants = {
        fadeUp:    { hidden: { opacity: 0, y: 40 },   visible: { opacity: 1, y: 0 } },
        fadeDown:  { hidden: { opacity: 0, y: -40 },  visible: { opacity: 1, y: 0 } },
        fadeLeft:  { hidden: { opacity: 0, x: -60 },  visible: { opacity: 1, x: 0 } },
        fadeRight: { hidden: { opacity: 0, x: 60 },   visible: { opacity: 1, x: 0 } },
        scale:     { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
        flip:      { hidden: { opacity: 0, rotateX: 90 }, visible: { opacity: 1, rotateX: 0 } },
    }

    return (
        <motion.div
            ref={ref}
            style={style}
            variants={variants[animation]}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    )
}

RevealOnScroll.defaultProps = { animation: "fadeUp", delay: 0, once: true, threshold: 0.2 }

addPropertyControls(RevealOnScroll, {
    animation: {
        type: ControlType.Enum,
        options: ["fadeUp", "fadeDown", "fadeLeft", "fadeRight", "scale", "flip"],
        optionTitles: ["Fade Up", "Fade Down", "Fade Left", "Fade Right", "Scale", "Flip"],
        defaultValue: "fadeUp",
        displaySegmentedControl: false,
    },
    delay:     { type: ControlType.Number, min: 0, max: 2, step: 0.05, unit: "s", defaultValue: 0 },
    threshold: { type: ControlType.Number, min: 0, max: 1, step: 0.05, title: "Trigger (%)", defaultValue: 0.2 },
    once:      { type: ControlType.Boolean, title: "Animate Once", defaultValue: true },
    children:  { type: ControlType.ComponentInstance },
})
```

### Staggered List Reveal

```tsx
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function StaggerReveal({ stagger, delay, direction, children, style }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    const container = {
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
    }

    const item = {
        hidden:  { opacity: 0, y: direction === "up" ? 30 : direction === "down" ? -30 : 0, x: direction === "left" ? 30 : direction === "right" ? -30 : 0 },
        visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    }

    const items = Array.isArray(children) ? children : [children]

    return (
        <motion.div
            ref={ref}
            style={style}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {items.map((child, i) => (
                <motion.div key={i} variants={item}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    )
}

StaggerReveal.defaultProps = { stagger: 0.1, delay: 0, direction: "up" }

addPropertyControls(StaggerReveal, {
    stagger:   { type: ControlType.Number, min: 0, max: 1, step: 0.05, unit: "s", defaultValue: 0.1 },
    delay:     { type: ControlType.Number, min: 0, max: 2, step: 0.05, unit: "s", defaultValue: 0 },
    direction: { type: ControlType.Enum, options: ["up","down","left","right","none"], displaySegmentedControl: true, defaultValue: "up" },
    children:  { type: ControlType.ComponentInstance },
})
```

### Scroll-Triggered Counter

```tsx
import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function CounterOnScroll({ from, to, duration, prefix, suffix, decimals, style }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })
    const [value, setValue] = useState(from)

    useEffect(() => {
        if (!isInView) return
        let start = null
        const step = (timestamp) => {
            if (!start) start = timestamp
            const progress = Math.min((timestamp - start) / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(from + (to - from) * eased)
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [isInView, from, to, duration])

    return (
        <span ref={ref} style={style}>
            {prefix}{value.toFixed(decimals)}{suffix}
        </span>
    )
}

CounterOnScroll.defaultProps = { from: 0, to: 100, duration: 2, prefix: "", suffix: "", decimals: 0 }

addPropertyControls(CounterOnScroll, {
    from:     { type: ControlType.Number, title: "From", defaultValue: 0 },
    to:       { type: ControlType.Number, title: "To", defaultValue: 100 },
    duration: { type: ControlType.Number, title: "Duration", min: 0.5, max: 10, step: 0.5, unit: "s" },
    prefix:   { type: ControlType.String, title: "Prefix", defaultValue: "" },
    suffix:   { type: ControlType.String, title: "Suffix", defaultValue: "" },
    decimals: { type: ControlType.Number, title: "Decimals", min: 0, max: 4 },
})
```

---

## Part 4 — Hover Interaction System

### Magnetic Hover Effect

```tsx
import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function MagneticHover({ strength, children, style }) {
    const ref = useRef(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        setPosition({
            x: (e.clientX - centerX) * strength,
            y: (e.clientY - centerY) * strength,
        })
    }

    const handleMouseLeave = () => setPosition({ x: 0, y: 0 })

    return (
        <motion.div
            ref={ref}
            style={style}
            animate={position}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </motion.div>
    )
}

MagneticHover.defaultProps = { strength: 0.3 }

addPropertyControls(MagneticHover, {
    strength: { type: ControlType.Number, min: 0, max: 1, step: 0.05, defaultValue: 0.3 },
    children: { type: ControlType.ComponentInstance },
})
```

### 3D Tilt on Hover

```tsx
import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function TiltCard({ maxTilt, glare, children, style }) {
    const ref = useRef(null)
    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)

    const x = useSpring(rawX, { stiffness: 300, damping: 30 })
    const y = useSpring(rawY, { stiffness: 300, damping: 30 })

    const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt])
    const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt])
    const glareX  = useTransform(x, [-0.5, 0.5], ["0%", "100%"])
    const glareY  = useTransform(y, [-0.5, 0.5], ["0%", "100%"])

    const handleMouseMove = (e) => {
        const rect = ref.current.getBoundingClientRect()
        rawX.set((e.clientX - rect.left) / rect.width - 0.5)
        rawY.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    const handleMouseLeave = () => { rawX.set(0); rawY.set(0) }

    return (
        <motion.div
            ref={ref}
            style={{ ...style, rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {glare && (
                <motion.div
                    style={{
                        position: "absolute", inset: 0, borderRadius: "inherit",
                        background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15), transparent 60%)`,
                        pointerEvents: "none",
                    }}
                />
            )}
        </motion.div>
    )
}

TiltCard.defaultProps = { maxTilt: 15, glare: true }

addPropertyControls(TiltCard, {
    maxTilt:  { type: ControlType.Number, min: 0, max: 45, unit: "°", defaultValue: 15 },
    glare:    { type: ControlType.Boolean, title: "Glare Effect", defaultValue: true },
    children: { type: ControlType.ComponentInstance },
})
```

### Hover Reveal Overlay

```tsx
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function HoverReveal({ overlayColor, direction, children, overlay, style }) {
    const hiddenAxis = direction === "top" || direction === "bottom"
        ? { y: direction === "top" ? "-100%" : "100%" }
        : { x: direction === "left" ? "-100%" : "100%" }

    return (
        <motion.div
            style={{ ...style, position: "relative", overflow: "hidden" }}
            initial="rest"
            whileHover="hover"
        >
            {children}
            <motion.div
                variants={{
                    rest:  { ...hiddenAxis, opacity: 0 },
                    hover: { x: 0, y: 0, opacity: 1 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: "absolute", inset: 0,
                    background: overlayColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}
            >
                {overlay}
            </motion.div>
        </motion.div>
    )
}

HoverReveal.defaultProps = { overlayColor: "rgba(0,0,0,0.7)", direction: "bottom" }

addPropertyControls(HoverReveal, {
    overlayColor: { type: ControlType.Color, title: "Overlay Color", defaultValue: "rgba(0,0,0,0.7)" },
    direction:    { type: ControlType.Enum, options: ["top","bottom","left","right"], displaySegmentedControl: true, defaultValue: "bottom" },
    children:     { type: ControlType.ComponentInstance, title: "Base Content" },
    overlay:      { type: ControlType.ComponentInstance, title: "Hover Content" },
})
```

### Cursor Follow Effect Override

```tsx
import type { ComponentType } from "react"
import { useState } from "react"
import { motion, useSpring } from "framer-motion"

export function withCursorFollower(label = "View") {
    return (Component): ComponentType => {
        return (props) => {
            const [pos, setPos] = useState({ x: -100, y: -100 })
            const [visible, setVisible] = useState(false)

            const springX = useSpring(pos.x, { stiffness: 200, damping: 25 })
            const springY = useSpring(pos.y, { stiffness: 200, damping: 25 })

            const handleMouseMove = (e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
            }

            return (
                <div
                    style={{ position: "relative", overflow: "hidden" }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setVisible(true)}
                    onMouseLeave={() => setVisible(false)}
                >
                    <Component {...props} />
                    <motion.div
                        style={{
                            position: "absolute",
                            x: springX, y: springY,
                            translateX: "-50%", translateY: "-50%",
                            width: 80, height: 80,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.9)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 600,
                            pointerEvents: "none",
                            opacity: visible ? 1 : 0,
                            transition: "opacity 0.2s",
                        }}
                    >
                        {label}
                    </motion.div>
                </div>
            )
        }
    }
}
```

---

## Part 5 — Sticky & Pinning Behaviors

### Sticky Section with Scroll Progress

```tsx
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight fixed
 */
export default function StickySection({ panels, style }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref })

    return (
        <div ref={ref} style={{ ...style, height: `${panels.length * 100}vh` }}>
            <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
                {panels.map((panel, i) => {
                    const start = i / panels.length
                    const end = (i + 1) / panels.length
                    const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0])

                    return (
                        <motion.div
                            key={i}
                            style={{
                                position: "absolute", inset: 0,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                opacity,
                            }}
                        >
                            {panel.content}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

addPropertyControls(StickySection, {
    panels: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                content:    { type: ControlType.ComponentInstance },
                background: { type: ControlType.Color },
            }
        },
    },
})
```

---

## Part 6 — Advanced Animation Patterns

### Text Splitting + Stagger Reveal

```tsx
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */
export default function SplitTextReveal({ text, splitBy, stagger, style }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.4 })

    const units = splitBy === "word" ? text.split(" ") : text.split("")

    return (
        <div ref={ref} style={{ ...style, display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
            {units.map((unit, i) => (
                <div key={i} style={{ overflow: "hidden" }}>
                    <motion.span
                        style={{ display: "inline-block" }}
                        initial={{ y: "100%" }}
                        animate={isInView ? { y: 0 } : { y: "100%" }}
                        transition={{ duration: 0.6, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {unit}{splitBy === "word" ? " " : ""}
                    </motion.span>
                </div>
            ))}
        </div>
    )
}

SplitTextReveal.defaultProps = { text: "Animate Your Words", splitBy: "word", stagger: 0.05 }

addPropertyControls(SplitTextReveal, {
    text:    { type: ControlType.String, displayTextArea: true, defaultValue: "Animate Your Words" },
    splitBy: { type: ControlType.Enum, options: ["word","letter"], displaySegmentedControl: true, defaultValue: "word" },
    stagger: { type: ControlType.Number, min: 0.01, max: 0.5, step: 0.01, unit: "s", defaultValue: 0.05 },
})
```

### Page Transition Override

```tsx
import type { ComponentType } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCurrentRouteId } from "framer"

const transitions = {
    fade:      { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    slideUp:   { initial: { y: 60, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -60, opacity: 0 } },
    slideLeft: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -100, opacity: 0 } },
    scale:     { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.05, opacity: 0 } },
}

export function withPageTransition(type = "fade") {
    return (Component): ComponentType => {
        return (props) => {
            const routeId = useCurrentRouteId()
            const t = transitions[type]

            return (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={routeId}
                        initial={t.initial}
                        animate={t.animate}
                        exit={t.exit}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Component {...props} />
                    </motion.div>
                </AnimatePresence>
            )
        }
    }
}
```

### Infinite Marquee / Ticker

```tsx
import { motion } from "framer-motion"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerDisableUnlink
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function Marquee({ speed, direction, pauseOnHover, children, style }) {
    const items = Array.isArray(children) ? children : [children]
    const repeated = [...items, ...items]

    return (
        <div style={{ ...style, overflow: "hidden" }}>
            <motion.div
                style={{ display: "flex", width: "max-content" }}
                animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                whileHover={pauseOnHover ? { animationPlayState: "paused" } : {}}
            >
                {repeated.map((child, i) => (
                    <div key={i} style={{ flexShrink: 0 }}>{child}</div>
                ))}
            </motion.div>
        </div>
    )
}

Marquee.defaultProps = { speed: 20, direction: "left", pauseOnHover: true }

addPropertyControls(Marquee, {
    speed:        { type: ControlType.Number, min: 2, max: 60, unit: "s", defaultValue: 20 },
    direction:    { type: ControlType.Enum, options: ["left","right"], displaySegmentedControl: true, defaultValue: "left" },
    pauseOnHover: { type: ControlType.Boolean, title: "Pause on Hover", defaultValue: true },
    children:     { type: ControlType.ComponentInstance },
})
```

---

## Part 7 — Shared State & Coordination

### createStore Pattern

```tsx
import { createStore } from "https://framer.com/m/framer/store.js@^1.0.0"

export const useUIStore = createStore({
    activeSection: null,
    menuOpen: false,
    theme: "light",
    scrollY: 0,
})

export function withMenuToggle(Component) {
    return (props) => {
        const [store, setStore] = useUIStore()
        return (
            <Component {...props} onTap={() => setStore({ menuOpen: !store.menuOpen })} />
        )
    }
}

export function withMenuState(Component) {
    return (props) => {
        const [store] = useUIStore()
        return (
            <Component
                {...props}
                style={{
                    ...props.style,
                    opacity: store.menuOpen ? 1 : 0,
                    pointerEvents: store.menuOpen ? "auto" : "none",
                }}
            />
        )
    }
}
```

---

## Part 8 — Canvas & Environment Detection

```tsx
import { RenderTarget, useIsOnFramerCanvas } from "framer"

export default function SmartComponent(props) {
    const target = RenderTarget.current()

    if (target === RenderTarget.canvas) {
        return (
            <div style={{ ...props.style, border: "2px dashed #09F", display: "grid", placeItems: "center" }}>
                <span style={{ fontSize: 12, opacity: 0.5 }}>Component Preview</span>
            </div>
        )
    }

    return <RealImplementation {...props} />
}
```

---

## Part 9 — Performance Rules

- `memo()` all components with frequent re-renders
- `useMemo()` for expensive derived values
- `useCallback()` for handlers passed to children
- Always return cleanup from `useEffect` (clear intervals, cancel fetches)
- Use `useLayoutEffect` for DOM measurements to prevent flicker
- Avoid state updates inside render — use refs for values that don't affect UI

---

## Part 10 — Quick Reference

| Goal | Hook | Key Options |
|---|---|---|
| Fade on scroll position | `useScroll` + `useTransform` | `offset`, `scrollYProgress` |
| Animate when visible | `useInView` | `once`, `amount` |
| Spring-smooth values | `useSpring` | `stiffness`, `damping` |
| Track element size | `useMeasuredSize` | `measured.width/height` |
| Share state | `createStore` | `[state, setState]` |
| Detect canvas | `RenderTarget.current()` | `canvas`, `preview`, `export` |
| Route transitions | `useCurrentRouteId` + `AnimatePresence` | `mode: "wait"` |
| Hover position | `useMotionValue` + `useTransform` | normalize to `[-0.5, 0.5]` |
| Cursor follow | `useSpring` on mouse coords | `stiffness: 200, damping: 25` |
| Horizontal scroll | `useScroll` + `useTransform` on `x` | sticky container |
| Text animation | Split + `variants` + `staggerChildren` | `overflow: hidden` on wrapper |
| Scroll counter | `useInView` + `requestAnimationFrame` | easing function |

---

## Decision Tree

```
User request
│
├── New element on canvas?
│   └── CODE COMPONENT
│       ├── @framer annotations
│       ├── addPropertyControls
│       ├── Spread style prop
│       └── Handle RenderTarget for canvas preview
│
└── Modify existing canvas element?
    └── CODE OVERRIDE
        ├── Named export (not default)
        ├── Always spread {...props}
        ├── Preserve original event handlers
        └── Cannot add new elements
```

---

## Output Format

Always produce:
1. Complete, copy-pasteable `.tsx` file
2. All imports at top
3. All annotations as JSDoc comments
4. `export default` for components, named exports for overrides
5. `addPropertyControls` at bottom
6. `defaultProps` for fallback values
7. TypeScript types where useful
8. Brief usage note if non-obvious
