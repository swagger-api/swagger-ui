# TanStack Virtual — Performance Virtualization Epic

Virtualizing large list rendering in Swagger UI to improve performance with large OpenAPI specifications.

## Motivation

Large specs (Kubernetes, GitHub, AWS) have 500–1000+ operations and 200–800+ schemas. All render simultaneously → slow initial paint, high memory, sluggish interactions.

TanStack Virtual renders only what is visible in the viewport.

## Phases

| Phase | Plan | Target | Complexity |
|-------|------|--------|------------|
| 1 | [Models/Schemas list](./phase-1-models-virtualization.md) | `models.jsx` (json-schema-5) | Medium |
| 2 | [OAS 3.1 models copy](./phase-2-oas31-models.md) | `oas31/.../models.jsx` | Low–Medium |
| 3 | [Operations list](./phase-3-operations-virtualization.md) | `operations.jsx` | High |

Status, estimates, ownership and scheduling are tracked in the issue tracker, not here. These
documents cover the technical approach only.

All three phases ship together — see [Release Strategy](#release-strategy--single-release-long-lived-feature-branch).

### Out of scope — schema property lists

Two options for long property lists inside an individual schema were considered and **both dropped**
(2026-08-04). Property lists are not addressed by this epic at all.

**Virtualization of property lists — rejected.** Four findings, recorded because any future proposal
has to answer them:

1. **Recursive nesting breaks virtualization.** Properties render recursively — a property can itself
   be an object with properties, indefinitely. TanStack Virtual needs a flat list in a single scroll
   container. That leaves a fully flattened virtual tree (complex cross-level state) or independent
   virtualizers per nesting level (scroll containers inside scroll containers — poor UX). Neither is
   satisfactory.
2. **Expand/collapse compounds it.** Each property row expands to reveal its own sub-schema, so
   heights are deeply dynamic *and* interdependent; `measureElement` alone cannot coordinate nested
   virtual lists.
3. **Real-world list lengths are low.** Most object schemas have <50 properties. 100+ exists (some AWS
   APIs) but is uncommon, so the ROI against that complexity is poor next to Phases 1–3.
4. **Copy-per-plugin constraint.** Per CLAUDE.md's cross-plugin import guidelines the three property
   renderers are self-contained copies, so it would have to be built three times.

**A property count cap with a "Show all" toggle — also dropped.** It was the cheap alternative (works
per level, no measurement or scroll container needed), but the need was never demonstrated: no profile
and no user report shows property rendering as a bottleneck, and capping hides documentation content
behind a control. Not worth the accessibility and discoverability cost for an unmeasured gain.

Relevant context if either is revisited: collapsed sub-schemas are **already unmounted** today
(verified — `ModelCollapse` at `model-collapse.jsx:95` renders
`{ this.state.expanded && this.props.children }`, and `Collapse` at `layout-utils.jsx:243` returns
`<noscript/>`), so only the expanded level a user is looking at costs anything. Revisit only if a
profile after Phases 1–3 shows otherwise, or a spec appears with a single schema having 200+ direct
properties — note there is **no way to detect that today**, as no schema-shape instrumentation exists.

The affected files, for reference: `json-schema-5/components/object-model.jsx` (Immutable),
`json-schema-2020-12/.../Properties/Properties.jsx` and
`oas32/json-schema-2020-12-extensions/.../Properties.jsx` (both plain JS objects — a different data
shape, so it would have been two implementations across three files).

### Resolved decisions

| Question | Decision | Date |
|---|---|---|
| Rollout: flag vs threshold vs always-on | **Automatic count threshold, no config key** — see [Decision](#decision--rollout-via-automatic-count-threshold) | 2026-08-04 |
| Phase 1 models scroll-container height | **`max-height: min(60vh, 800px)`** with a nested scroll container | 2026-08-04 |
| Release timing | **Single release; nothing ships early** — long-lived feature branch | 2026-08-04 |
| Train scope | **Phases 1 + 2 + 3** (property lists out of scope) | 2026-08-04 |
| Schema property lists | **Out of scope** — virtualization rejected, count cap dropped | 2026-08-04 |

### Open technical questions

Every design decision is resolved. What remains needs a measurement rather than a decision:

- Confirm the threshold constants (100 models / 150 operation items) against a real profile, or
  accept them as-is.
- Replace the `estimateSize` placeholders with measured row heights (see each phase's notes).

## Release Strategy — Single Release, Long-Lived Feature Branch

**Decided 2026-08-04:** nothing ships until the whole train is complete. All phases land on a
long-lived integration branch and merge to `master` once.

```
perf/virtualization          ← integration branch, owns models.jsx + operations.jsx
  ├── perf/virtualization-p1    Phase 1   models (json-schema-5)
  ├── perf/virtualization-p2    Phase 2   models (oas31)
  └── perf/virtualization-p3    Phase 3   operations
```

**Train scope: Phases 1 + 2 + 3.** Nothing releases early, including Phase 1.
Schema property lists are **out of scope** (see above).

### Why a branch is required here

This repo releases off `master` continuously — 11 patch releases in 5.32.x, with 5.32.9/.10/.11
landing on 17/21/22 July 2026. Anything merged to `master` ships within days. The count-threshold
rollout has **no off switch**: once merged, specs above the threshold get the virtualized path on the
next patch release. So incremental merging to `master` is incompatible with a single release, and the
branch is the mechanism that holds it.

### Known cost of this choice

The branch owns `models.jsx` and `operations.jsx` for the epic's full duration, while `master`
continues to receive dependency bumps and OAS 3.2 work. Every phase in this repo's history has used a
short-lived branch; there is no precedent for one this long. Mitigations:

- **Rebase onto `master` on a fixed cadence** (weekly), not at the end. A single end-of-epic rebase
  across two heavily-edited components is where this goes wrong.
- **Land each phase's sub-branch into the integration branch as it passes review**, so conflicts
  surface between phases rather than all at once.
- Keep the threshold constants at their final values on the branch — there is no need to hold them
  inert, since the branch itself is the gate.

### Release-gate criteria (once, at the end — not per phase)

These ACs move out of the individual phase tickets, because they are only meaningful for the
integrated result:

- [ ] `npm run deps-size` before/after for the whole train (`@tanstack/react-virtual`, ~5KB min+gzip)
- [ ] `swagger-ui-react` smoke-tested — separately published, not covered by Cypress
- [ ] Combined React Profiler benchmark, all phases active, against the perf fixtures
- [ ] Full `npm test` (lint + unit + Cypress) green on the integration branch
- [ ] `npm run test:artifact` passes
- [ ] Release note drafted covering the above-threshold behavior changes (find-in-page, print, DOM)
- [ ] Threshold constants confirmed against a real profile, or accepted as-is (100 / 150)

## Implementation Order

Sequential on the integration branch:

1. **Phase 1** — adds `@tanstack/react-virtual`, establishes the threshold/`getItemKey`/measurement
   pattern, adds the `ResizeObserver` polyfill. Lowest risk of the virtualization work, so it goes
   first and everything else copies it.
2. **Phase 2** — mechanical port of Phase 1 to the `oas31` copy. Cheap (already a functional
   component). Can run in parallel with Phase 3 once Phase 1's pattern is settled.
3. **Phase 3** — operations. Largest and riskiest: flattening, the greenfield deep-link bridge, and
   dual-mode `OperationTag`.

## Dependency

```
@tanstack/react-virtual   ~5KB min+gzip   Added in Phase 1
```

Verify with `npm run deps-size` after adding.

## Test Fixtures (created 2026-08-04)

```
test/e2e-cypress/static/documents/perf/
├── many-schemas.swagger.yaml    240 definitions            ← Phase 1 (Swagger 2.0)
├── many-schemas.openapi.yaml    240 components/schemas     ← Phase 1 (OAS 3.0.0)
├── many-schemas.openapi31.yaml  240 components/schemas     ← Phase 2 (OAS 3.1.0 → oas31 component)
└── many-operations.yaml         529 ops / 24 tags          ← Phase 3 (incl. multiTagged, 2 tags)
```

All generated, all validated as parseable. Counts are deliberately well above the thresholds so the
virtualized path is unambiguously exercised — see the cost note above about fixtures that
accidentally fall below.

## Key Files

```
src/core/components/operations.jsx                                  ← Phase 3
src/core/components/operation-tag.jsx                               ← Phase 3 (structural)
src/core/plugins/deep-linking/layout.js                             ← Phase 3 (scroll bridge); Phase 1 only for the explicit-container fix to scrollToElement
test/unit/jest-shim.js                                              ← Phase 1 (ResizeObserver polyfill — blocks unit tests in both phases)
src/core/plugins/json-schema-5/components/models.jsx                ← Phase 1
src/core/plugins/oas31/components/models/models.jsx                 ← Phase 1 follow-up (OAS 3.1 copy)
```

## Decision — Rollout via Automatic Count Threshold

**Decided (2026-08-04): virtualize only above an item-count threshold. No config key.**

Below the threshold, each phase renders **today's markup unchanged**; above it, the windowed path
takes over. Rationale: small and medium specs — the large majority — keep today's exact DOM,
find-in-page, print and CSS behavior, so there is no breaking change and no new public config
surface to support forever. The perf work targets only the specs that actually suffer.

Recommended constants (implementer may tune with measurements):

```js
// suggested home: src/core/utils/index.js, alongside DEFAULT_RESPONSE_KEY
export const VIRTUALIZE_MODELS_THRESHOLD = 100      // Phase 1
export const VIRTUALIZE_OPERATIONS_THRESHOLD = 150  // Phase 3 (counted on flatItems.length)
```

### What this decision buys

- **No public API break.** `OperationTag` keeps accepting `children`;
  `.opblock-tag-section`, `.operation-tag-content` and `.model-container` nesting all survive on
  the legacy path.
- **Every existing Cypress and Selenium test keeps passing untouched**, because every current
  fixture is far below either threshold: `features/models.swagger.yaml` has **3** definitions,
  `features/deep-linking.swagger.yaml` **5** operations, `oas32/component-only.yaml` **0** paths.
- Find-in-page / print loss applies **only** to specs above the threshold — where the content was
  already unusably long to scan by eye.

### What it costs

- **Two code paths per phase**, both needing maintenance and review.
- **The virtualized path is exercised by nothing that exists today.** Its only E2E coverage comes
  from the new perf fixtures, which therefore *must* exceed the thresholds — see each phase's
  fixture spec. A fixture accidentally below threshold silently tests the legacy path and the
  virtualization ships unverified. This is the single most important consequence of this decision.
- A behavior discontinuity at the boundary; test just above and just below it.

## Cross-Cutting Blocker — Phase 3 Only

Deep-link scrolling is **ref-based**: `layoutActions.readyToScroll(key, ref)` fires from mounted
DOM nodes and is resolved in `src/core/plugins/deep-linking/layout.js:110`. Virtualization
unmounts off-screen items, so their refs never fire and deep links silently no-op. **Phase 3**
therefore needs a `scrollToIndex` → mount → existing-ref bridge, keyed on the derived
`operationId` (`src/core/containers/OperationContainer.jsx:62`) — not on path+method.

**This does not affect Phase 1.** Model/schema deep-linking does not exist on `master`:
`isShownKeyFromUrlHashArray` (`layout.js:175-184`) only ever emits `["operations", …]` or
`["operations-tag", …]` — its own comment reads *"We only put operations in the URL"* — and the
sole caller of `scrollTo` is `parseDeepLinkHash` (`:106`). The `readyToScroll` calls in
`models.jsx:36`/`:43`, `model-collapse.jsx:72` and `oas31/.../models.jsx:54`/`:59` are dead code.
Phase 1's real navigation regression is the plain `#model-<Name>` browser anchor instead.
