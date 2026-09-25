# Hansel Kristanzen — Portfolio

A personal portfolio site for Hansel Kristanzen, a computer science student and
designer at BINUS University. Built as a creative-technologist showcase: the
site itself is meant to demonstrate the same engineering and design sense
described in it.

**Live concept:** editorial layout, restrained warm-paper/near-black palette
with a single signal-amber accent, an animated WebGL galaxy backdrop in the
hero, and a light/dark theme toggle that inverts the paper surfaces while
keeping the intentionally-dark sections (hero, research, contact, footer) as
designed.

## Stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- [ogl](https://github.com/oframe/ogl) for the hero Galaxy backdrop and the Contact SideRays effect (lightweight WebGL, no three.js)
- [GSAP](https://gsap.com) (+ ScrollTrigger) for orchestrated motion, the mobile menu stagger, and the custom TargetCursor
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- CSS Modules + a centralized design-token system (`src/styles/tokens.css`) — no CSS framework

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build locally
npm run lint      # oxlint
```

## Project structure

```
src/
  components/
    layout/     Navigation (+ mobile menu), loader, footer
    three/      Galaxy (ogl) hero backdrop + reduced-motion/no-WebGL fallback
    effects/    TargetCursor, SideRays
    ui/         Reusable primitives (Reveal, MagneticButton, Tag, SectionHeading, Portrait, ThemeToggle)
  sections/     One folder per page section (hero, about, projects, research, ...)
  data/         Typed content — projects, research, experience, education, etc.
  hooks/        Reduced-motion, media queries, scroll progress, in-view, tilt
  lib/          GSAP setup, Lenis/smooth-scroll context, theme context, motion tokens
  styles/       Design tokens (incl. dark-theme overrides) + global base styles
  types/        Shared content type definitions
```

Content lives entirely in `src/data/*.ts` — update those files to change any
text, dates, links, or stats without touching presentation code.

## Theming

Light/dark is controlled by a `data-theme` attribute on `<html>`, set by
`src/lib/ThemeContext.tsx` and persisted to `localStorage`. An inline script
in `index.html` applies the stored (or OS-preferred) theme *before* React
mounts, so there is no flash of the wrong theme on load. The toggle only
repaints the "paper" surface tokens — sections that are dark by design
(Hero, Research, Contact, Footer) are left alone on purpose; see the comment
block at the top of `src/styles/tokens.css`.

## The hero background

`src/components/three/HeroCanvas.tsx` mounts the `Galaxy` WebGL component
only while the hero is on-screen (IntersectionObserver-gated) and only when
motion is allowed and WebGL is available; otherwise it renders a static SVG
(`LatticeFallback`). `focal`/`rotation` are memoized before being passed to
`Galaxy` — its effect tears down and recreates the whole WebGL context
whenever any prop reference changes, so an inline array literal there would
silently re-init the scene on every re-render.

## Custom cursor

`TargetCursor` (in `src/components/effects/`) replaces the browser cursor
with a bracket-style target on desktop only (it self-disables on touch
devices/small screens). Any element meant to be "targetable" carries a
`cursor-target` class — nav links, buttons, tags with a real link, image
reveal triggers, the theme toggle. Decorative elements deliberately don't
carry the class.

## Notes on assets

`public/Hansel-Kristanzen-CV.pdf` and everything under `public/images/` are
real supplied assets (the portrait, the two workplace photos, the Padamu
Indonesia volunteer photo, and the actual StairsLife product screenshot),
resized/compressed for the web. Swap any of them out by replacing the file
at the same path — nothing else needs to change.

## Deployment

Static build output lands in `dist/`. Works on any static host — Vercel,
Netlify, GitHub Pages, etc. For Vercel: framework preset "Vite", build
command `npm run build`, output directory `dist`.
