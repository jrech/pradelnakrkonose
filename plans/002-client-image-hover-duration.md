# 002 — Zkrátit zoom fotografií klientských karet

- **Status**: TODO
- **Commit**: d0868f9
- **Severity**: MEDIUM
- **Category**: Purpose & frequency
- **Estimated scope**: 1 file, 1 CSS declaration

## Problem

Client-card image zoom is a repeated desktop hover interaction but takes 1.2 seconds, which exceeds the UI motion budget and makes the otherwise restrained site feel sluggish.

```css
/* src/styles/global.css:141 — current */
.client-card__image img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease-out); }
```

## Target

Use a `300ms` transform transition with the existing `--ease-out` curve:

```css
.client-card__image img { transition: transform 300ms var(--ease-out); }
```

Keep the existing `scale(1.012)` hover amount.

## Repo conventions to follow

The site uses `--ease-out` for small spatial movement and gates card hover under the desktop fine-pointer media query at `src/styles/global.css:147–152`.

## Steps

1. Change only the duration in the existing `.client-card__image img` transition.
2. Preserve image sizing, object-fit, hover scale, and reduced-motion behavior.

## Boundaries

- Do NOT increase the scale or add additional effects.
- Do NOT modify mobile/tablet card styles.

## Verification

- **Mechanical**: confirm the rule contains `transform 300ms var(--ease-out)`.
- **Feel check**: hover in and out repeatedly at 10% playback; the image should settle quickly and subtly without a visible jump.
- **Done when**: the full hover response is under 300ms and remains barely perceptible.
