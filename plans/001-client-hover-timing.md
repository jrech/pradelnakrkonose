# 001 — Zklidnit hover overlay klientských karet

- **Status**: TODO
- **Commit**: d0868f9
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 file, 2 CSS declarations

## Problem

The client-card image overlay uses an ease-in curve and a delayed 450ms transition. This makes the frequent hover response feel late and heavy.

```css
/* src/styles/global.css:140 — current */
.client-card__image::after { position: absolute; z-index: 1; inset: 0; background: rgba(8,25,27,.1); content: ''; transition: background .45s ease-in 90ms; }
```

## Target

Inside the existing desktop fine-pointer media query, make the overlay respond with the shared hover easing and a maximum 300ms duration. Remove the 90ms delay. Use `transition: background 240ms ease;` unless an existing token is introduced for hover easing.

## Repo conventions to follow

- Easing token `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` is defined in `src/styles/global.css` and is already used for deliberate UI movement.
- Hover color changes may use the built-in `ease` curve per the animation audit rules.
- Keep the hover rule gated by `@media (hover: hover) and (pointer: fine) and (min-width: 1051px)`.

## Steps

1. In `src/styles/global.css`, change only the `transition` value on `.client-card__image::after` to `background 240ms ease`.
2. Leave overlay colors, markup, media query and image scale unchanged.

## Boundaries

- Do NOT change card layout, colors, image scale, copy, or responsive behavior.
- Do NOT add dependencies or JavaScript.

## Verification

- **Mechanical**: `rg -n "client-card__image::after" src/styles/global.css`; confirm no `ease-in` or delay remains on this transition.
- **Feel check**: on desktop, move the pointer repeatedly across cards and confirm the overlay responds immediately without snapping or lagging.
- Toggle reduced motion and confirm the global reduced-motion rule still removes transition duration.
- **Done when**: overlay reaches its final shade within 300ms and no false hover appears on touch layouts.
