# Animation improvement plans

| Plan | Title | Severity | Status |
|---|---|---|---|
| 001 | Zklidnit hover overlay klientských karet | MEDIUM | TODO |
| 002 | Zkrátit zoom fotografií klientských karet | MEDIUM | TODO |
| 003 | Sjednotit easing motion systému | MEDIUM | TODO |
| 004 | Omezit hover menu tlačítka na přesný ukazatel | LOW | TODO |
| 005 | Pozastavit logo marquee mimo viewport | LOW | TODO |
| 006 | Omezit permanentní hero parallax | LOW | TODO |

## Recommended execution order

1. 001 and 002 (client-card hover timing; same visual surface)
2. 003 (token/easing cleanup after the concrete timing changes)
3. 004 (mobile interaction safety)
4. 005 (offscreen marquee resource usage)
5. 006 (responsive parallax profiling and guard)

Plans 001–002 touch the same card rules and should be reviewed together. Plan 003 depends on their final transition values so it does not overwrite the deliberate card timing. Plans 004–006 are independent.
