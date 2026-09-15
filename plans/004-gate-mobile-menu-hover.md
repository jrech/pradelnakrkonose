# 004 — Omezit hover menu tlačítka na přesný ukazatel

- **Status**: TODO
- **Commit**: d0868f9
- **Severity**: LOW
- **Category**: Accessibility
- **Estimated scope**: 1 file, media-query placement

## Problem

The mobile menu button has a hover transform outside the fine-pointer guard. Touch browsers may synthesize a hover state after tapping.

```css
/* src/styles/global.css:476–478 — current */
.menu-button { ... transition: color .25s, background .25s, border-color .25s, transform .25s; }
.menu-button:hover { transform: translateY(-1px); }
```

## Target

The hover transform must run only when `(hover: hover) and (pointer: fine)` is true. Keep the button transition and active/focus behavior unchanged.

## Repo conventions to follow

Desktop-only hover rules already use `@media (hover: hover) and (pointer: fine) and (min-width: 1051px)` at `src/styles/global.css:415`.

## Steps

1. Move `.menu-button:hover { transform: translateY(-1px); }` into the existing fine-pointer media query that contains other hover rules, or wrap it in a dedicated `(hover: hover) and (pointer: fine)` query while preserving the mobile breakpoint.
2. Leave the base transition declaration intact so focus and active feedback remain available.

## Boundaries

- Do NOT change menu open/close animation, dimensions, colors, or keyboard behavior.
- Do NOT remove focus-visible styling.

## Verification

- **Mechanical**: inspect the CSS nesting and confirm the selector is reachable only through a fine-pointer query.
- **Feel check**: tap the menu on a real phone; no button lift should remain after the tap. On desktop, hover still lifts by 1px.
- **Done when**: touch interaction has no synthetic hover movement and desktop behavior is unchanged.
