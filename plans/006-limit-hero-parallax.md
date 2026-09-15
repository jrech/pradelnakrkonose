# 006 — Omezit permanentní hero parallax

- **Status**: TODO
- **Commit**: d0868f9
- **Severity**: LOW
- **Category**: Performance
- **Estimated scope**: 2 files, responsive CSS/JS guard

## Problem

The full-viewport hero keeps a large image promoted with permanent `will-change` and updates its transform on every Motion scroll callback:

```css
/* src/styles/global.css:122 — current */
.hero__media { ... transform: translate3d(0, -4%, 0) scale(1.08); transform-origin: center; will-change: transform; transition: opacity .72s ease; }
```

```ts
// src/scripts/site.ts:75–86 — current
const updateParallax = (progress: number) => {
  const offset = (progress - 0.5) * parallaxRange;
  backgroundHeroMedia.style.transform = `translate3d(0, ${offset}%, 0) scale(1.08)`;
};
scroll(updateFromViewport);
```

## Target

Keep the subtle desktop parallax, but avoid paying for it on mobile/tablet and avoid permanently reserving a compositor layer. Desktop may retain the transform animation; below `1051px`, use the static hero transform and do not subscribe to the parallax scroll callback.

## Repo conventions to follow

The process scroll behavior already branches on `window.matchMedia('(min-width: 1051px)')` in `src/scripts/site.ts:163`, and reduced motion already bypasses the entire hero motion block at `src/scripts/site.ts:57`.

## Steps

1. Change `.hero__media` so `will-change` is not permanent; add it only through a desktop media query if profiling shows the layer is needed, or remove it if frame pacing remains stable.
2. In the hero parallax branch, return before registering `scroll(updateFromViewport)` when the viewport is below `1051px`.
3. Keep the initial static transform and all veil/content reveals unchanged.
4. Retain the existing reduced-motion guard and do not introduce a new animation library.

## Boundaries

- Do NOT change hero image, crop, veil, LCP loading, content timing, or desktop parallax range (`8`).
- Do NOT make scroll handlers use layout properties; continue updating `transform` only.

## Verification

- **Mechanical**: confirm no parallax scroll subscription is created below `1051px`; inspect computed styles for absence of permanent `will-change` on mobile.
- **Feel check**: desktop parallax remains subtle and continuous; mobile hero stays visually stable while scrolling.
- Test with reduced motion enabled; no parallax or movement should run.
- **Done when**: desktop appearance is unchanged and mobile avoids a continuously promoted, scroll-driven hero layer.
