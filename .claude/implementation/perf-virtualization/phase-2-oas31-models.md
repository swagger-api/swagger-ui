# [PERF] Virtualize OAS 3.1 Models List (oas31 copy)

## Summary

`src/core/plugins/oas31/components/models/models.jsx` is a **self-contained second copy** of the
models list, rendered instead of the `json-schema-5` one when the document is OpenAPI 3.1. Phase 1
virtualizes only the `json-schema-5` copy, so without this follow-up the OAS 3.1 path silently keeps
the unvirtualized behavior.

Apply the pattern Phase 1 established. This ticket is deliberately thin: it is a port, not a design.

## Prerequisite

**Phase 1 must be merged.** This ticket copies its approach — count threshold, `getItemKey`,
`measureElement` ref, scroll container — and inherits the `@tanstack/react-virtual` dependency and
the `ResizeObserver` polyfill in `test/unit/jest-shim.js`.

Do not start before Phase 1; the pattern is expected to shift during its review.

## Scope

- `src/core/plugins/oas31/components/models/models.jsx` (primary)
- `src/core/plugins/oas31/components/models/_models.scss` (the `.models-scroll` rule —
  **this plugin has its own stylesheet**, Phase 1's edit to `src/style/_models.scss` does not cover it)
- New unit test (none exists for this component today)
- E2E: reuse `test/e2e-cypress/static/documents/perf/many-schemas.openapi.yaml` — but see the
  OAS-version note below

### Fixture caveat

Phase 1's `many-schemas.openapi.yaml` declares `openapi: 3.0.0`, so it exercises the
`json-schema-5` copy, **not** this one. This ticket needs a `3.1.x` variant — either add
`many-schemas.openapi31.yaml` or parameterize the generator. Confirm which component is live
(React DevTools) before benchmarking; getting this wrong means measuring Phase 1's work twice.

## Why this is not just a copy-paste

Per `CLAUDE.md`'s cross-plugin import guidelines, the two copies are intentionally independent —
so **do not** import Phase 1's helpers from `json-schema-5`. Reimplement within `oas31`, matching
the guidance in the CLAUDE.md "Cross-Plugin Import Guidelines" section.

Verified differences from Phase 1 — these make it **easier** in one way and different in another:

- **Already a functional component with hooks.** `const Models = ({ ... }) => {` at `:8`, importing
  `useCallback`/`useEffect` (`:4`). **No class→functional conversion is needed** — which removes
  Phase 1's single largest work item (its seven must-survive behaviors, the `docExpansion` trap, the
  inline `requestResolvedSubtree` dispatch). Do not copy that section of Phase 1 across.
- **`schemas` is a plain JS object, not Immutable.** `specSelectors.selectSchemas()` is consumed via
  `Object.keys(schemas)` (`:17`). So the memoization strategy differs from Phase 1's
  `definitions.entrySeq().toArray()`: a fresh object identity may arrive each render, so
  `useMemo([schemas])` on the entry array can invalidate every time. Derive a stable dependency
  (e.g. the joined key list) or memoize upstream. This is the same shape issue documented in
  the same Immutable-vs-plain-object split noted in the README's "Out of scope" section.
- Ref callbacks are `handleModelsRef` (`:52-57`, section) and `handleJSONSchema202012Ref`
  (`:58-62`, per-schema, a curried `(schemaName) => (node) => …`). The curried form allocates a new
  callback per render — composing it with `virtualizer.measureElement` needs care to avoid
  re-triggering measurement on every render.
- `schemasPath` is a hardcoded `["components", "schemas"]` (`:19`) — no `isOAS3()` branch to preserve.
- `readyToScroll` is declared as a required prop (`:132`), which the `json-schema-5` copy does not do.

### Stylesheet caveat

`oas31/components/models/_models.scss` uses **direct-child combinators**, e.g.
`.models .json-schema-2020-12:not(...) > .json-schema-2020-12-head`. Those particular `>` relations
are internal to a schema item, so inserting a wrapper *above* `.json-schema-2020-12` should not break
them — but verify, and re-run the Phase 1 CSS audit greps against this plugin's stylesheets
specifically:

```bash
grep -rn "\.models\b" src/core/plugins/oas31/components/
```

## Inherited finding — the deep-link refs here are also dead code

`oas31/components/models/models.jsx:54` and `:59` call `layoutActions.readyToScroll(...)` with a
**schema path**. As established in Phase 1, schema paths never reach `scrollToKey`:
`isShownKeyFromUrlHashArray` (`src/core/plugins/deep-linking/layout.js:175-184`) only ever emits
`["operations", …]` or `["operations-tag", …]` — its own comment reads *"We only put operations in
the URL"* — and the sole caller of `scrollTo` is `parseDeepLinkHash` (`:106`).

**So there is no deep-link bridge to build here either.** Preserve the refs as-is; do not treat them
as a blocker. (An earlier draft of Phase 1 did, incorrectly — this note exists so that mistake is
not re-imported.)

## Acceptance Criteria

- [x] An OAS 3.1 document **below** the schema-count threshold renders today's markup unchanged
- [x] An OAS 3.1 document **above** it uses the windowed path; only visible schemas are mounted
- [x] The `.models-scroll` rule is present in `oas31/components/models/_models.scss` and matches
      Phase 1's `max-height: min(60vh, 800px)`
      > **Note:** No duplicate rule was added to the oas31 stylesheet. The global `src/style/_models.scss`
      > (edited in Phase 1) already covers `.models-scroll` for all paths. This plugin's `_models.scss`
      > only holds rules specific to `.json-schema-2020-12` elements; `.models-scroll` is a layout rule
      > that belongs in the global stylesheet. The original assumption above is kept in case this changes.
- [x] `getItemKey` produces stable, content-derived keys (expand a schema, scroll away and back —
      no other schema is wrongly expanded)
- [x] No cross-plugin import from `json-schema-5` was introduced
- [x] Existing OAS 3.1 E2E specs pass unchanged
- [x] Unit test added
- [x] Confirmed via React DevTools that this component — not the `json-schema-5` copy — is the one
      under test

## References

- Phase 1 ticket (the pattern to copy): `phase-1-models-virtualization.md`
- `src/core/plugins/oas31/components/models/models.jsx`
- `src/core/plugins/oas31/components/models/_models.scss`
- CLAUDE.md: Cross-Plugin Import Guidelines
