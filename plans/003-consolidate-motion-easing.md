# 003 — Sjednotit easing motion systému

- **Status**: TODO
- **Commit**: d0868f9
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file, several transition declarations

## Problem

The stylesheet mixes the shared `--ease-out` curve with bare `ease`, `ease-in`, and unspecified easing across related controls. This creates inconsistent response timing in the same visual system.

Examples:

```css
/* src/styles/global.css:99 */
.button { transition: transform .16s var(--ease-out), background .2s ease, box-shadow .2s ease; }
/* src/styles/global.css:110 */
.site-header { transition: height .25s ease, background .25s ease, box-shadow .25s ease; }
/* src/styles/global.css:207 */
.process-story__image { transition: opacity .38s ease; }
/* src/styles/global.css:213 */
.process-story__step { transition: opacity .28s ease; }
```

## Target

Apply the audit rules consistently:

- entering/exiting UI: `var(--ease-out)`
- hover/color changes: `ease`
- on-screen movement/morphing: `var(--ease-in-out)` using `cubic-bezier(0.77, 0, 0.175, 1)`
- no `ease-in` for UI

Add `--ease-in-out` next to the existing `--ease-out` token only if no equivalent token exists. Keep durations unchanged except where another selected plan specifies a change.

## Repo conventions to follow

Motion tokens are currently colocated in `src/styles/global.css` near the root variables. Existing Motion JS uses the same `easeOut` tuple in `src/scripts/site.ts:56`.

## Steps

1. Add `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` beside `--ease-out` if absent.
2. Classify each transition in `src/styles/global.css` by purpose before editing; do not mechanically replace all `ease` values.
3. Replace only spatial movement transitions with `var(--ease-in-out)` and entering/exiting transitions with `var(--ease-out)`.
4. Keep hover color transitions on `ease`; remove all `ease-in` occurrences from UI transitions.

## Boundaries

- Do NOT change durations, layout, colors, or JS animation sequences except where required to reference the shared token.
- Do NOT add a second competing token system.

## Verification

- **Mechanical**: `rg -n "ease-in|transition" src/styles/global.css`; no UI transition should use `ease-in`.
- **Feel check**: inspect button, header, process and card interactions at 10% playback; related interactions should accelerate/decelerate similarly.
- Toggle reduced motion and confirm transition durations still collapse through the existing media query.
- **Done when**: all motion curves have an intentional category and shared token usage is consistent.
