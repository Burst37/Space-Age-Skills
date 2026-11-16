# Multi-page path (Astro or Next.js)

Use it when the sitemap has more than ~5 pages, or when the client is already on Next.js/Vercel (like Astonishing Touch).
The single-file path (`assemble.mjs`) stays the default for one-page sites.

## Runtime in a framework
- Ship `cwb-base.css` + the used `@module` CSS blocks as a global stylesheet, and `cwb-runtime.js` + the used
  modules as one client script (run `node scripts/assemble.mjs page.html -o out.html` once and copy the inlined module blocks it emits into one client script).
- GSAP from the cdnjs 3.15.0 CDN (same as single-file) or the `gsap` npm package. Register plugins once.
- **SPA navigation**: call `CWB.mount(scope)` after a route renders and `CWB.unmount(scope)` before it leaves.
  - Astro (View Transitions / ClientRouter): `document.addEventListener('astro:page-load', () => CWB.mount(document.body))`
    and `astro:before-swap` → `CWB.unmount(document.body)`.
  - Next.js App Router: a client component `useEffect(() => { CWB.mount(ref.current); return () => CWB.unmount(ref.current); }, [pathname])`.
- All copy is server-rendered (Astro static, Next.js RSC/SSG). Modules only enhance. verify's offline pass proves it.

## Service-page template (every service page)
`breadcrumbs → hero-compact (H1 "{Service} in {City}", one-sentence definition) → capsule (question H2 + 40–60 word
answer) → text (how it works) → faq (question H2s, 40–60 word answers) → grid (related services) → cta`.
Schema: `Service` (+ `FAQPage` when the FAQs are real), `BreadcrumbList`, `provider` → the LocalBusiness `@id`.
The wireframe uses `templates.service` + `use: service` + `each:` so greybox renders every one.

## No-design pages
Pages without their own design (privacy, terms, 404, thank-you, location or service clones) are built from the
design-spec patterns. They get no new tokens and no new components. They still get a wireframe entry, and verify
checks them like any other page.

## verify for multi-page
`node scripts/verify.mjs dist/index.html dist/services/respite-care/index.html … --root dist` (or URLs).
The first target gets every pass; the others get desktop, mobile and 1920 (plus 320/2560 when they use jumbo
type). AEO runs on money pages (`--money /services/,…`).
