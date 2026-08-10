# [PERF] Virtualize Models/Schemas List with TanStack Virtual

## Summary

Large OpenAPI specs with 200+ schemas/models mount one `.model-container` row per schema
simultaneously (a connected `JumpToPath` plus a `ModelCollapse` each; there is no `ModelContainer`
component — `model-container` is a CSS class), causing significant initial render cost and memory
overhead. This ticket virtualizes the Models section using TanStack Virtual so only visible models
are mounted.

## Background

`src/core/plugins/json-schema-5/components/models.jsx:77` currently maps over all schema
definitions unconditionally inside a `<Collapse>` component. A spec like the Kubernetes API
(~800 schemas) mounts 800 model rows at once.

**Calibration — what is actually mounted (verified):** `ModelCollapse`
(`json-schema-5/components/model-collapse.jsx:95`) renders
`{ this.state.expanded && this.props.children }`, so a *collapsed* model does **not** mount its
`ModelWrapper` schema subtree. The per-model cost while collapsed is the `.model-container` div,
a `JumpToPath` (a connected component), the `ModelCollapse` button, and the three
`specSelectors.specResolvedSubtree` / `specJson().getIn()` / `layoutSelectors.isShown` selector
calls in the map body (lines 82–89).

So the win here is 800 lightweight rows → ~15, not 800 full schema trees → 15. That is still
worth doing (800 connected components + 800 DOM subtrees + 2400 selector calls per render), but
size the expected gain against this, and record the real baseline rather than assuming an
order-of-magnitude improvement.

**Why start here:** Flat list, single scroll axis, contained within an existing collapsible wrapper — lowest complexity virtualization target.

## Scope

- Package: `swagger-ui` (core)
- Files affected:
  - `src/core/plugins/json-schema-5/components/models.jsx` (primary — class → functional)
  - `src/style/_models.scss` (scroll container `max-height` / `overflow-y`)
  - `test/unit/core/plugins/json-schema-5/components/models.jsx` (existing test file — update;
    currently uses Enzyme `shallow`, which will not survive the hook conversion)
  - `test/unit/jest-shim.js` (add a `ResizeObserver` polyfill — see "Unit-test infrastructure")
  - `test/e2e-cypress/static/documents/` (new large-schema fixture, see below)
  - `test/e2e-cypress/e2e/features/` (new spec)
  - `test/e2e-selenium/pages/main.js:506-539` — holds **all 12 `.model-container` references under
    `test/`**. (Production code has its own ~10 refs; those are covered by the CSS audit below.)
    These are **positional descendant selectors** — e.g.
    `section.models div.model-container:nth-child(2)` — so wrapping each model in its own virtual
    item div makes every `.model-container` a `:nth-child(1)`, and every `:nth-child(2..6)` selector
    matches nothing. They are **definitely broken by this change, not merely affected.** Mitigating
    factor only: there are **zero** Cypress references to that class and the Selenium suite is not
    run in CI (`.github/workflows/nodejs.yml` runs Cypress only), so this does not turn CI red —
    fix or delete them deliberately rather than discovering it later. The Cypress-side exposure is
    the `#model-<Name>` id selectors instead — covered by the `model-collapse.cy.js` AC above.
- New dependency: `@tanstack/react-virtual` (~5KB min+gzip)
- **Dominant unknown when sizing this:** the `Collapse`-unmount / measurement-cache interaction.
  (The deep-link bridge was ruled out once model deep-linking was found not to exist; the threshold
  decision removed the CSS/selector fallout.) Factor in the cost of maintaining two render paths.

### Test fixtures (CREATED — committed 2026-08-04)

Both variants exist, because `models.jsx` branches on `isOAS3()` for the base path
(`getSchemaBasePath()`, lines 17–20) and `model-collapse.cy.js` runs its scenarios twice (Swagger 2
at `:2-6`, OpenAPI 3 at `:7-10`):

| Fixture | Schemas | Notes |
|---|---|---|
| `test/e2e-cypress/static/documents/perf/many-schemas.swagger.yaml` | 240 `definitions` | Swagger 2.0 |
| `test/e2e-cypress/static/documents/perf/many-schemas.openapi.yaml` | 240 `components/schemas` | `openapi: 3.0.0` |

240 is deliberately well above the 100 threshold, so the virtualized path is unambiguously
exercised. Both are generated files with a regenerate-don't-hand-edit header; both parse and each
carries one trivial `/ping` operation so the document is valid.

A third fixture, `many-schemas.openapi31.yaml` (`openapi: 3.1.0`, 240 schemas), exists for
[phase-1b](./phase-2-oas31-models.md) — **not** for this ticket. On a 3.1 document the `oas31`
component renders instead of this one.

## Acceptance Criteria

- [ ] A spec **below** the 100-schema threshold renders today's markup unchanged (legacy path) —
      verify `model-collapse.cy.js` passes with no edits
- [ ] A spec **above** the threshold uses the windowed path, and only visible models in the viewport
      are mounted (verify in React DevTools)
- [ ] Boundary tested both sides — one fixture just under the threshold, one just over
- [ ] Scrolling through the models list renders/unmounts items correctly
- [ ] Collapsing and expanding the "Schemas/Models" section works as before
- [ ] Existing `model-collapse.cy.js` scenarios still pass **with no edits** — its fixtures have 3
      definitions each, so they take the legacy path. If any of its selectors needed changing
      (`.models h4 .models-control`, `#model-User .model-box .model-box-control` at `:40`/`:44`,
      `#model-Pet` / `#model-Order` at `:18`/`:28`/`:34`), that means the legacy path was altered —
      treat it as a regression, not a test to update
- [ ] `defaultModelsExpandDepth < 0` still short-circuits the whole section to `null`
      (`models.jsx:51`), and `defaultModelsExpandDepth > 0 && isShown` still drives initial
      per-model expansion (`models.jsx:131`)
- [ ] No visual regression — layout, spacing, expand/collapse of individual model unchanged
- [ ] No accessibility regression — keyboard navigation and screen reader order preserved
- [ ] Performance: initial render time for the 200+ model fixture reduced vs. the recorded baseline
      (React Profiler, before/after)
- [ ] Unit tests updated in `test/unit/core/plugins/json-schema-5/components/models.jsx`
- [ ] `ResizeObserver` polyfill added to `test/unit/jest-shim.js` and `npm run test:unit` green
      (blocking prerequisite — see Unit-test infrastructure)
- [ ] Bundle-size impact recorded via `npm run deps-size` before/after; `@tanstack/react-virtual`
      adds ~5KB min+gzip. Flag it in the PR if the measured delta is materially larger
- [ ] `swagger-ui-react` still renders models correctly — the flavor re-exports core, so it
      inherits this change with no code edit, but it is a separately published package and is not
      covered by the Cypress suite
- [ ] E2E test: models section scrolls and renders correctly with the new fixture
- [ ] `#model-<Name>` browser-anchor navigation still works below the threshold, and its
      above-threshold breakage is accepted per
      [Accepted Behavior Changes](#accepted-behavior-changes-confirm-with-maintainers-before-building).
      Note this is the plain browser anchor — model *deep linking* does not exist (see Technical Notes)
- [ ] Expanding model A, scrolling it out of view, and scrolling back shows A still expanded and
      no *other* model wrongly expanded (guards the `getItemKey` requirement below)

## Technical Notes

### Approach

Convert models rendering from a full map to a windowed list:

```jsx
import { useVirtualizer } from "@tanstack/react-virtual"

// Inside component (convert class → functional component first)
const parentRef = useRef(null)
const definitionEntries = useMemo(
  () => definitions.entrySeq().toArray(),
  [definitions]
)

const virtualizer = useVirtualizer({
  count: definitionEntries.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 72, // PLACEHOLDER — measure a collapsed .model-container first
  overscan: 5,
  // REQUIRED — see "Stable item keys" below. Without this, vItem.key is the index.
  getItemKey: (index) => `models-section-${definitionEntries[index][0]}`,
})
```

#### DOM contract to preserve inside the item wrapper

The virtual wrapper is an **extra** div around today's markup, not a replacement. Everything inside
`.model-container` must be reproduced verbatim — all of it is test or embedder surface:

- `id={`model-${name}`}` (`models.jsx:117`) — the anchor and the handle every
  `model-collapse.cy.js` assertion uses.
- `className="model-container"` (`:117`) — 12 references across `test/`.
- `data-name={name}` (`:118`) — read back by `onLoadModel` via `ref.getAttribute("data-name")`
  (`:42`), so dropping it breaks that callback even though the callback is otherwise dead.
- `<span className="models-jump-to-path">` wrapping `<JumpToPath path={specPath} />` (`:119`) —
  note the prop is `path`, **not** `specPath`.

Do not move `id` or `className` onto the virtual wrapper — CSS and `ModelCollapse.onLoad`'s
`ref.parentElement` (`model-collapse.jsx:72`) both assume the current nesting.

#### CSS audit (REQUIRED — the change inserts two new divs into the `.models` subtree)

Virtualization puts a `.models-scroll` wrapper *and* a per-item positioned div between `.models`
and `.model-container`. Any descendant rule that assumes the old depth — a `>` child combinator, or
a positional/`:first-child`-style selector — silently breaks. Run **before** editing:

```bash
grep -rn "model-container" src/style/ src/core/plugins/*/components/**/*.scss
grep -rn "\.models\b" src/style/
```

Known production references to `.model-container` (~10 lines, 8 files): `_models.scss` (×3),
`_layout.scss`, `_dark-mode.scss`, `_variables.scss`, two `json-schema-2020-12` stylesheets,
plus `models.jsx:117` and `model-example.jsx:123`.

**`model-example.jsx:123` matters most:** it renders a *second* `.model-container` that is **not**
inside the virtualized list (it's the request/response example view). So `.model-container` styles
must **not** be re-scoped onto the new virtual wrapper — doing so silently restyles or breaks the
example panes. Any new selector must be additive and scoped to `.models-scroll`.

Add an AC: visual diff of the Models section *and* an operation's request/response example panes.

#### Stable item keys (REQUIRED — silent state-corruption bug otherwise)

`vItem.key` **defaults to the item index**. Today the key is content-derived and stable:
`models-section-${name}` (`models.jsx:117`). If the render loop uses `key={vItem.key}` with the
default, React reconciles by position rather than identity, so a mounted `ModelCollapse` instance
can be reused for a *different* model — carrying its `state.expanded` (and its
`collapsedContent`) with it. Symptom: scroll away and back, and the wrong model appears expanded.

Pass `getItemKey` so `vItem.key` reproduces today's key exactly. `definitions` is an `OrderedMap`,
so indexes are stable for a given spec — but `getItemKey` is still required, because index reuse
across *scroll* windows is the failure mode, not reordering.

Dynamic heights come from attaching `virtualizer.measureElement` as a **ref** on each
item wrapper — not from the `measureElement` *option*. (The option exists but its real
signature is `(element, entry, instance) => number`; the default implementation is
correct here, so do not pass it.)

### Render Loop

```jsx
<div ref={parentRef} className="models-scroll">
  <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
    {virtualizer.getVirtualItems().map((vItem) => {
      const [name] = definitionEntries[vItem.index]
      return (
        <div
          key={vItem.key}
          data-index={vItem.index}
          ref={virtualizer.measureElement}
          style={{ position: "absolute", top: 0, left: 0, width: "100%",
                   transform: `translateY(${vItem.start}px)` }}
        >
          {/* existing .model-container markup for `name` — see DOM contract below */}
        </div>
      )
    })}
  </div>
</div>
```

### Key Constraints

- **Scroll container**: the virtualized path needs a bounded scroll container on a new
  `.models-scroll` wrapper. Add to `src/style/_models.scss` — **decided 2026-08-04:**

  ```scss
  .models-scroll {
    max-height: min(60vh, 800px);
    overflow-y: auto;
  }
  ```

  Apply it only on the virtualized branch; the legacy branch keeps today's unbounded layout.

- **Scroll container unmounts on section collapse (BLOCKING)**: the models list lives inside
  `<Collapse isOpened={showModels}>` (`models.jsx:75`), and `Collapse` returns `<noscript/>`
  when closed (`src/core/components/layout-utils.jsx:243`, in `renderNotAnimated()` 241-249) — a real
  unmount. So collapsing
  the Schemas/Models section destroys `.models-scroll`, leaving `parentRef.current === null`,
  and the virtualizer's measurement cache is discarded on every collapse/expand cycle.
  Consequences to handle:
  - `getScrollElement: () => parentRef.current` returns `null` while collapsed — verify the
    virtualizer tolerates that rather than throwing.
  - Re-expanding re-measures from `estimateSize` scratch, so previously-expanded model heights
    are forgotten and scroll position is lost.
  - Options: keep the virtualizer mounted and move the collapse to CSS for this wrapper only,
    or persist `virtualizer.measurementsCache` across unmounts via
    `initialMeasurementsCache`. Pick one deliberately — this directly conflicts with the AC
    "Collapsing and expanding the Schemas/Models section works as before".

- **`getScrollParent` behavior change**: `scrollToElement`
  (`src/core/plugins/deep-linking/layout.js:120-127`) resolves its container via
  `system.fn.getScrollParent(ref)` (defined at `layout.js:138`). Today the nearest scroll parent
  for a model is the **window**. Introducing a bounded `.models-scroll` makes *that* the scroll
  parent, so zenscroll scrolls the inner container instead of the page — the section itself may
  stay off-screen. Additionally `ModelCollapse.onLoad` passes `ref.parentElement`
  (`model-collapse.jsx:72`), which after this change is the absolutely-positioned virtual item
  wrapper rather than `.model-container`. Both need explicit handling; consider passing an
  explicit `container` argument to `scrollToElement` instead of relying on inference.
- **Dynamic heights**: Individual models expand inline → `ref={virtualizer.measureElement}`
  (ResizeObserver). Without it, expanded models overflow their virtual slot. Set
  `min-height` equal to `estimateSize` on the wrapper to limit shift on first correction.
- **The `72` is an unmeasured placeholder.** Measure a real collapsed `.model-container` in the
  browser (default theme, default font) and use that number in both `estimateSize` and the
  `min-height`. A wrong estimate does not break correctness — `measureElement` corrects it — but a
  bad guess causes visible scrollbar jump on first paint, which is the main UX complaint about
  virtualized lists.
- **Class → functional**: `models.jsx` **is** a class component
  (`export default class Models extends Component`, line 7). Convert to functional to use
  `useVirtualizer`. Seven behaviors are easy to lose and must survive:
  - `getCollapsedContent` (lines 22–24) supplies `collapsedContent` to each `ModelCollapse`
    (`:122`). Note the quirk: it is **called with `name`** but declared with no parameters and
    always returns a single space `" "`, overriding `ModelCollapse`'s own `"{...}"` default
    (`model-collapse.jsx:22`). Port it as-is — "simplifying" it to the default changes the
    collapsed rendering of every model.
  - `getSchemaBasePath()` (lines 17–20) returns
    `isOAS3() ? ["components", "schemas"] : ["definitions"]`. It feeds `specPathBase`,
    `handleToggle`, and both ref callbacks — so the OAS2-vs-OAS3 branch must be preserved as a
    single source of truth (memoize on `specSelectors.isOAS3()`), not inlined in several places.
  - `specActions.requestResolvedSubtree` is dispatched **inline during render** (line 94).
    Preserve the behavior, ideally moving it into an effect during the conversion.
  - Line 51 early-returns `null` for the entire section when
    `!definitions.size || defaultModelsExpandDepth < 0`.
  - Line 131 gates each model's initial expanded state on
    `defaultModelsExpandDepth > 0 && isShown`.
  - Line 54: the section's default open state is
    `layoutSelectors.isShown(specPathBase, defaultModelsExpandDepth > 0 && docExpansion !== "none")`.
    `docExpansion` is destructured at line 50 and used **nowhere else in the file**, so it looks
    like an unused variable during conversion and is easy to drop — which silently changes the
    default-open behavior for `docExpansion: "none"`.
  - `handleToggle` (lines 26–32) dispatches `layoutActions.show` **and**
    `specActions.requestResolvedSubtree` on expand. This is the lazy schema-resolution path and is
    separate from the inline dispatch at line 94 — both are needed.
- **Immutable.js**: `definitions.entrySeq().toArray()` converts to plain array before passing
  `count` to virtualizer. Memoize it — recreating the array every render defeats measurement caching.

### Deep-link ref mechanism — NOT a blocker (model deep-linking does not exist)

**Earlier drafts of this ticket treated this as the highest risk. That was wrong.** Model
deep-linking is not a supported feature on `master`, so there is nothing to preserve and no
bridge to build.

`models.jsx` does register per-model refs (`:36` and `:43`, from the `onLoadModels`/`onLoadModel`
declarations at `:34`/`:40`), and `ModelCollapse.onLoad` registers a third
(`model-collapse.jsx:72`) plus an auto-expand on match (`:71`). All of them route into
`readyToScroll` (`deep-linking/layout.js:110`), which fires only when
`Im.is(scrollToKey, fromJS(isShownKey))`.

But `scrollToKey` can never hold a schema path:

- The **only** caller of `layoutActions.scrollTo` in `src/` is `parseDeepLinkHash`
  (`layout.js:106`), which passes `isShownKeyFromUrlHashArray(hashArray)`.
- That selector (`layout.js:175-184`) returns only `["operations", tag, operationId]`,
  `["operations-tag", tag]`, or `[]`. Its own comment at `:177` says
  **"We only put operations in the URL"**. `urlHashArrayFromIsShownKey` (`:185-194`) is symmetric.

So `["definitions", "Pet"]` never matches, and `#/definitions/SomeModel` is not a recognized hash
form. `docs/usage/deep-linking.md` documents no model/schema syntax.

Corroborating evidence: `test/e2e-cypress/e2e/features/model-collapse.cy.js:4` does define
`const urlFragment = "#/definitions/Pet"` and pass it as a second argument — but the receiving
function signature is `function ModelCollapseTest(baseUrl)` (`:13`), a single parameter, so the
fragment is silently discarded and no test ever visits it. Even the one reference in the repo is
dead.

**Consequence:** `models.jsx:43` and `ModelCollapse.onLoad`'s auto-expand are **dead code today.**
Nothing to break, nothing to bridge.

Required work (small):

1. Preserve the `readyToScroll` refs as-is through the class→functional conversion. They are
   unreachable, not harmful, and removing them is out of scope for a perf ticket.
2. Compose them with `virtualizer.measureElement` on the item wrapper rather than choosing one —
   the measurement ref is required and the existing ref must keep its current shape.
3. Do **not** build a `scrollToIndex` bridge. If model deep-linking is ever implemented, it will
   need one; that is a separate feature ticket, and it should be written to account for
   virtualization from the start.

**Real navigation to models** is the plain browser anchor `id={`model-${name}`}`
(`models.jsx:117`), which virtualization *does* break for off-screen models — tracked under
[Accepted Behavior Changes](#accepted-behavior-changes-confirm-with-maintainers-before-building),
not here.

### Unit-test infrastructure (BLOCKING — must be set up before the tests can be written)

Two hard blockers, both applying to Phase 3 as well. Neither is currently in the repo.

**1. No `ResizeObserver` in jsdom.** `virtualizer.measureElement` depends on it.
`test/unit/jest-shim.js` polyfills only `TextDecoder`/`TextEncoder`, `test/unit/setup.js` sets up
jsdom + the Enzyme adapter, and `grep -rn "ResizeObserver" src/ test/` returns **nothing**. Under
Jest the measurement ref will throw or silently no-op. Add a polyfill (or a stub class recording
observed elements) to `test/unit/jest-shim.js` as part of this ticket's scope.

**2. Enzyme `shallow` will not survive the class→functional conversion.** The existing test
(`test/unit/core/plugins/json-schema-5/components/models.jsx:2`) does
`import { shallow } from "enzyme"` against a class component. The repo is `enzyme@=3.11.0` with
`@cfaester/enzyme-adapter-react-18` (`package.json:144` and `:121` respectively), configured in
`setup.js`. Hooks —
`useRef`, `useMemo`, `useVirtualizer` — do not run meaningfully under that adapter's shallow
renderer; `getScrollElement: () => parentRef.current` will see `null` and no items will render.

Pick a strategy and state it in the PR:
- `mount` instead of `shallow` (needs the ResizeObserver polyfill and a real scroll element with a
  non-zero height, which jsdom does not provide by default — heights are all 0, so the virtualizer
  may window nothing); **or**
- mock `@tanstack/react-virtual` in the unit test so `useVirtualizer` returns a deterministic fake
  (fixed `getVirtualItems()`, no-op `measureElement`), and cover real windowing in Cypress only.

The second option is recommended: it keeps the unit test asserting *this component's* logic (the
config gates, `requestResolvedSubtree` dispatch, key/DOM contract) and leaves genuine scroll
behavior to E2E, where a real layout engine exists.

### Measuring Success

Run React Profiler on `http://localhost:3200/` with the new `many-schemas.yaml` fixture (or a
Kubernetes spec):
- Before: render time with N models — **record the actual number; no baseline has been measured yet**
- After: render time with virtualization (should be near-constant regardless of N)

### Accepted Behavior Changes (confirm with maintainers before building)

Virtualization removes off-screen content from the DOM. **All of the following apply only to specs
above the 100-schema threshold** — below it the legacy path runs and behavior is byte-identical to
today. Shared with Phase 3:

- **Browser find-in-page (Ctrl/Cmd-F) no longer finds off-screen models.** This is the classic
  virtualization tradeoff and it is a real, user-visible capability loss for a docs tool whose
  users routinely Ctrl-F for a schema name.
- **Printing / "Save as PDF" captures only the rendered window**, not the full schema list.
- **Browser anchor navigation to `#model-<Name>` stops working for unmounted models**
  (`id={`model-${name}`}`, `models.jsx:117`). Since model *deep-linking* does not exist (see
  Technical Notes), this plain anchor is the only way to link to a schema today — so this is the
  actual navigation regression in Phase 1, not a secondary one.

The count threshold **is** the mitigation, and it covers the large majority of specs. For the
above-threshold case there is no further mitigation available short of not virtualizing: there is no
in-app model filter to fall back on (see Out of Scope), and raising `overscan` only widens the window
by a few rows. Accept it, or raise the threshold.

### Rollout: automatic count threshold (DECIDED — no config flag)

**Decided 2026-08-04:** virtualize only when the schema count exceeds a threshold. No config key.

```js
import { VIRTUALIZE_MODELS_THRESHOLD } from "core/utils"   // suggested = 100

if (definitionEntries.length < VIRTUALIZE_MODELS_THRESHOLD) {
  // legacy path — today's markup, byte-for-byte unchanged
  return renderLegacyModels()
}
// windowed path below
```

This is the most consequential instruction in the ticket, because it inverts most of the risk:

- **Keep the existing render path intact.** Do not delete or "clean up" today's markup while
  converting — extract it into a function/branch that still produces the same DOM. All the DOM
  contract items and the CSS audit below apply to the *virtualized* branch only; the legacy branch
  preserves them by construction.
- **Every existing test keeps passing untouched.** `features/models.swagger.yaml` has **3**
  definitions and `features/models.openapi.yaml` likewise, so `model-collapse.cy.js` and the
  Selenium `:nth-child` selectors in `main.js:506-539` all take the legacy path and are unaffected.
  That removes them from this ticket's risk surface entirely.
- **The virtualized path has zero existing coverage.** The new perf fixtures are its *only* E2E
  exercise, so they **must exceed 100 definitions** (the spec below says ≥200 — keep that margin).
  A fixture below threshold silently tests the legacy path and ships the virtualization unverified.
- Test **both sides of the boundary** — one fixture just under, one just over.

The class→functional conversion still applies to the whole component; both branches live inside the
converted function component. Note the hooks (`useVirtualizer`, `useRef`) must be called
unconditionally, *before* the threshold branch — you cannot put the early return above them.

## Risks

| Risk | Mitigation |
|------|-----------|
| ~~Deep link to an off-screen model no-ops~~ — **not a risk; model deep-linking does not exist on master** (see Technical Notes) | None needed. Preserve the dead `readyToScroll` refs unchanged |
| Browser anchor navigation to `#model-<Name>` breaks for off-screen models — this is the *real* navigation path | Maintainer decision on threshold/flag; see Accepted Behavior Changes |
| Config gates lost in class→functional conversion (`defaultModelsExpandDepth < 0` early return at `:51`, `> 0 && isShown` expansion gate at `:131`) | Unit-test both boundaries explicitly; they are easy to drop when the render body is restructured |
| `Collapse` unmounting `.models-scroll` destroys the scroll element and measurement cache on every section toggle | Decide the persistence strategy up front (see constraints); explicit test: expand section, scroll, collapse, re-expand |
| `getScrollParent` now resolves to `.models-scroll` instead of `window`, changing scroll behavior | Pass an explicit `container` to `scrollToElement`; E2E-verify the section scrolls into view too |
| ~~E2E selectors break on DOM restructure~~ — **neutralized by the count threshold.** All existing fixtures are ≤3 definitions, so every current Cypress and Selenium selector runs the legacy path | None. Do not "clean up" the legacy markup while converting — that is what would reintroduce this |
| **Virtualized path ships untested** because every existing fixture is below threshold | The new perf fixtures are its only coverage and must exceed 100 definitions; add a just-under/just-over boundary pair |
| Two render paths diverge over time — a fix applied to one branch only | Keep the legacy branch as a thin extraction of today's JSX, not a parallel reimplementation; unit-test both branches |
| Find-in-page / print regression (see above) | Maintainer decision on threshold or flag |
| CSS layout shift when `measureElement` corrects an expanded model | `min-height: 72px` on the item wrapper |

## Dependencies

- No dependency on other phases — Phase 1 is the first implementation and adds
  `@tanstack/react-virtual` to `package.json`.
- **Not blocked.** Both previously-open decisions are resolved: rollout is an automatic count
  threshold with no config key, and the scroll container is `max-height: min(60vh, 800px)`. See
  [Rollout](#rollout-automatic-count-threshold-decided--no-config-flag).

## Out of Scope

- Operations list virtualization → Phase 3
- Schema property lists — out of scope for this epic; see the README's "Out of scope" section for why virtualization was rejected there
- OAS 3.1 model rendering (`src/core/plugins/oas31/components/models/models.jsx` — a
  self-contained second copy of this component per the CLAUDE.md cross-plugin rule) →
  **[Phase 2](./phase-2-oas31-models.md)**, which ships in the same release. **Note:** on an OAS 3.1
  document that copy renders instead of this one, so verify which component is live (React DevTools)
  before benchmarking, and use `many-schemas.openapi.yaml` (3.0.0) — not the 3.1 fixture — when
  measuring *this* ticket.
- Model search/filter — none exists. `src/core/plugins/filter/` provides only `opsFilter`,
  which filters operation *tags*; `models.jsx` contains no filter logic.

## References

- TanStack Virtual docs: https://tanstack.com/virtual/latest/docs/introduction
- `measureElement` API: https://tanstack.com/virtual/latest/docs/api/virtualizer
- Investigation: TanStack Virtual feasibility analysis (internal)
- Phase 3 ticket: `phase-3-operations-virtualization.md`
