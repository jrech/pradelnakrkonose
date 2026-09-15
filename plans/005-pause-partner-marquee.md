# 005 — Pozastavit logo marquee mimo viewport

- **Status**: TODO
- **Commit**: d0868f9
- **Severity**: LOW
- **Category**: Performance / frequency
- **Estimated scope**: 2 files, small visibility observer

## Problem

The partner logo strip continuously animates even when it is not visible:

```css
/* src/styles/global.css:132–134 — current */
.partner-strip__track { ... animation: partner-marquee 42s linear infinite; }
@keyframes partner-marquee { to { transform: translateX(-50%); } }
```

This consumes compositor/battery time for a decorative animation that is only useful while viewed.

## Target

Pause the marquee while the strip is outside the viewport, preserve the current `42s linear infinite` motion while visible, and keep the existing reduced-motion rule that disables it entirely.

## Repo conventions to follow

The project already uses `IntersectionObserver` for hero/header visibility in `src/scripts/site.ts:23–29`, and `@media (prefers-reduced-motion: reduce)` disables the animation at `src/styles/global.css:430`.

## Steps

1. Add a small `IntersectionObserver` in `src/scripts/site.ts` for `.partner-strip__track` (or its stable parent), with a threshold around `0`.
2. Toggle a class such as `.is-offscreen` on the track when it leaves the viewport.
3. Add `.partner-strip__track.is-offscreen { animation-play-state: paused; }` to `src/styles/global.css`.
4. Do not alter marquee distance, gap, duration, or reduced-motion behavior.

## Boundaries

- Do NOT replace the marquee with a new library or change its visual speed.
- Do NOT pause it when visible, focused, or hovered.

## Verification

- **Mechanical**: confirm only `animation-play-state` changes when the observer toggles.
- **Feel check**: scroll the strip into view; it should resume smoothly from its current position, not restart.
- Toggle reduced motion and confirm the animation remains disabled.
- **Done when**: offscreen pages no longer continuously advance the marquee while visible presentation is unchanged.
