# [PERF] Virtualize Operations List with TanStack Virtual

## Summary

Large OpenAPI specs with 500–1000+ operations mount all `OperationContainer` components
simultaneously — one connected component and summary row each, whether or not it is expanded.
(Collapsed operations do *not* mount their parameter/response subtrees; see Calibration below.)
This ticket virtualizes the operations list using `useWindowVirtualizer` (document-level scroll) so
only viewport-visible operations are mounted.

## Background

`src/core/components/operations.jsx` iterates over all tagged operations unconditionally:

```jsx
// Line 33 — renders ALL tags
taggedOps.map(this.renderOperationTag).valueSeq().toArray()

// Line 65 — inside each tag, renders ALL operations for that tag
operations.map(op => <OperationContainer ... />).toArray()
```

A spec with 500 operations across 20 tags mounts 500 `OperationContainer` components.

**Calibration — collapsed operations are NOT heavyweight (verified).** `operation.jsx:120` wraps
parameters, request body, responses and try-it-out in `<Collapse isOpened={isShown}>`, and
`Collapse` (`src/core/components/layout-utils.jsx:243`, in `renderNotAnimated()` 241-249) returns
`<noscript/>` when closed —
a real unmount, not a hide. With the default `docExpansion: "list"`
(`src/core/config/defaults.js:14`) tags are open but individual operations are collapsed, so a
collapsed operation mounts only `OperationContainer` → `Operation` → `OperationSummary`.

The per-operation cost is therefore: one connected `OperationContainer` (its own Redux
subscription and `mapStateToProps` run on every store change), the `OperationSummary` subtree,
and the DOM for the summary row — multiplied by 500. Real, but roughly one order of magnitude
smaller than "500 full parameter/response trees". Also note `docExpansion: "full"` *does* mount
everything; state which mode a benchmark used.

This causes:
- Slow initial parse-to-paint (3–10s on large specs)
- High memory usage
- Sluggish tag expand/collapse (triggers re-renders across all siblings)

The timings above are impressionistic. **Record a real baseline before starting** — see
[Measuring Success](#measuring-success).

## Scope

- Package: `swagger-ui` (core)
- Files affected:
  - `src/core/components/operations.jsx` (primary — class → functional)
  - `src/core/components/operation-tag.jsx` (structural: stops wrapping children)
  - `src/core/plugins/deep-linking/layout.js` + `operation-wrapper.jsx` +
    `operation-tag-wrapper.jsx` (ref-based scroll bridge — see constraint 3)
  - `src/style/_layout.scss` — the `.opblock-tag-section` flex rule (line 14) stays for the legacy
    path; the virtualized item wrapper needs its own `flex-direction: column` equivalent
  - `src/core/utils/index.js` (add `VIRTUALIZE_OPERATIONS_THRESHOLD`)
  - **Not** in scope any more: rewriting the ~14 E2E refs to `.opblock-tag-section` /
    `.operation-tag-content`. The threshold keeps them on the legacy path — they are now a
    regression contract, not a migration task
  - `test/unit/core/components/operations.jsx` (**new file — and `test/unit/core/components/` is a
    new directory**; existing unit tests live under `test/unit/core/plugins/`, `system/`, `config/`,
    `helpers/`. No `testMatch` change needed — `config/jest/jest.unit.config.js:6-9` globs
    `**/test/unit/**/*.js?(x)`, so the new path is picked up automatically)
  - `test/e2e-cypress/static/documents/perf/many-operations.yaml` — **already created and committed
    (2026-08-04)**: 529 operations across 24 tags, `flatItems` ≈ 554 fully expanded, comfortably
    above the 150 threshold. Includes `operationId: multiTagged` at `/perf/multi-tagged` declaring
    **two** tags (`perfTag01`, `perfTag02`) — the duplicate-key case for `getItemKey`. Generated
    file; regenerate rather than hand-edit.
- New dependency: `@tanstack/react-virtual` (added in Phase 1)

## Acceptance Criteria

- [ ] A spec **below** the 150-item threshold renders today's nested markup unchanged — the legacy
      regression contract: `deep-linking.cy.js`, `oas32-component-only.cy.js` and the Selenium
      scenarios all pass **with no edits**
- [ ] A spec **above** the threshold uses the windowed path; only operations within the viewport are
      mounted (verify in React DevTools)
- [ ] Boundary tested both sides, and the path does not flip when tags are collapsed mid-session
- [ ] `OperationTag` works in both modes — wraps children when given, header-only when not
- [ ] Scrolling renders/unmounts operations smoothly without layout shift
- [ ] Tag expand/collapse correctly adds/removes operations from virtual list
- [ ] Deep linking (`/?urls.primaryName=...#/tag/operation`) scrolls to correct operation,
      including an operation far outside the initial viewport and one inside a collapsed tag
- [ ] Filter (search box) still narrows the list — operations under filtered-out **tags** are not
      mounted. Inherited free from the `taggedOperations` wrapSelector; this AC guards against
      regression, not new work
- [ ] `maxDisplayedTags` config still truncates the tag list (also inherited from the same
      wrapSelector — `wrap-selector.js:17-18`)
- [ ] A spec with zero operations still renders `No operations defined in spec!` (`operations.jsx:27-29`)
- [ ] Items are positioned correctly with content above the list (info block, servers, authorize) —
      i.e. `scrollMargin` is applied; verify no constant vertical offset and that it survives the
      info block resizing after spec load
- [ ] Operations whose method is not in `specSelectors.validOperationMethods()` remain unrendered
- [ ] Expanded operations (with try-it-out open) do not collapse/reset on scroll
- [ ] A **multi-tag operation** renders under every tag it declares, with independent state:
      expanding it under tag A does not expand it under tag B, and no duplicate-key warning appears
      in the console (guards the `getItemKey` tag-prefix requirement)
- [ ] Open try-it-out on operation A with a parameter value typed in, collapse an *earlier* tag so
      every downstream index shifts, then scroll A back into view: A retains its state and **no
      other operation** shows A's state (guards the `getItemKey` requirement)
- [ ] No visual regression — tag headers, operation rows, spacing unchanged. **Exception:** loss
      of the tag-content `<Collapse>` animation is accepted (constraint 6) — confirm with UX
- [ ] No accessibility regression — landmark structure, keyboard nav, focus management preserved
- [ ] Performance: initial render time for the 500-op fixture reduced by **≥50% vs. the recorded
      baseline** (React Profiler). The targets in [Measuring Success](#measuring-success) are
      stretch goals, not the pass bar
- [ ] Unit tests created at `test/unit/core/components/operations.jsx` (none exist today)
- [ ] E2E tests pass: operations render, expand, try-it-out works, deep links work

## Technical Notes

### Core Architecture Change: Flatten the List

Operations are currently nested `tag → [operations]`. Virtualizers work on flat arrays. Flatten to a typed item array that reflects current expand state:

```js
// Item types in the flat virtual list
{ type: "tag",       tag: string, tagObj: ImmutableMap }
{ type: "operation", tag: string, op: ImmutableMap, path: string, method: string,
                     specPath: ImmutableList, operationId: string }
```

`operationId` is needed by the deep-link bridge (constraint 3) — it must be on the item, since the
scroll key is `["operations", tag, operationId]`, not path+method.

**Shape of `taggedOps`:** `specSelectors.taggedOperations()`
(`src/core/plugins/spec/selectors.js:260`) returns an `OrderedMap` **keyed by tag name**,
whose values are `Map({ tagDetails, operations })`. There is **no `tagId` field on
`tagObj`** — the tag name only exists as the map key, so iterate with `entrySeq()`:

```js
const flatItems = useMemo(() => {
  const items = []
  taggedOps.entrySeq().forEach(([tag, tagObj]) => {
    items.push({ type: "tag", tag, tagObj })
    // second arg replicates operation-tag.jsx:69 default
    const tagOpen = layoutSelectors.isShown(
      ["operations-tag", tag],
      docExpansion === "full" || docExpansion === "list"
    )
    if (!tagOpen) return
    tagObj.get("operations").forEach((op) => {
      const method = op.get("method")
      // preserve operations.jsx:70 guard — invalid methods must stay unrendered
      if (validOperationMethods.indexOf(method) === -1) return
      const path = op.get("path")
      items.push({
        type: "operation", tag, op, method, path,
        specPath: op.get("specPath"),
        // same 4-way fallback as OperationContainer.jsx:62 — required by the
        // deep-link bridge (constraint 3). Factor into a shared helper.
        operationId:
          op.getIn(["operation", "__originalOperationId"]) ||
          op.getIn(["operation", "operationId"]) ||
          opId(op.get("operation"), path, method) ||
          op.get("id"),
      })
    })
  })
  return items
}, [taggedOps, validOperationMethods, docExpansion, expandedTagsState])
```

`validOperationMethods` comes from `specSelectors.validOperationMethods()`;
`docExpansion` from `getConfigs()`; `opId` from `swagger-client/es/helpers`
(as `OperationContainer.jsx:4`). See constraint 2 for `expandedTagsState`.

### Use `useWindowVirtualizer` (No Scroll Container Needed)

Swagger UI scrolls the full page — wrapping in a bounded div would break existing UX. `useWindowVirtualizer` virtualizes against `window` scroll:

```jsx
import { useWindowVirtualizer } from "@tanstack/react-virtual"

const listRef = useRef(null)

const virtualizer = useWindowVirtualizer({
  count: flatItems.length,
  // PLACEHOLDERS — measure a real .opblock-tag and a collapsed .opblock first
  estimateSize: (i) => flatItems[i].type === "tag" ? 56 : 48,
  overscan: 3,
  // REQUIRED — see scrollMargin note below
  scrollMargin: listRef.current?.offsetTop ?? 0,
  // REQUIRED — see "Stable item keys" below. Without this, vItem.key is the index.
  getItemKey: (index) => {
    const item = flatItems[index]
    return item.type === "tag"
      ? `tag-${item.tag}`
      // tag MUST be in the key — see "Multi-tag operations" below.
      // NOT operations.jsx:76's `${path}-${method}`, which collides once flattened.
      : `op-${item.tag}-${item.path}-${item.method}`
  },
})
```

#### Stable item keys (REQUIRED — silent state-corruption bug, worse here than in Phase 1)

`vItem.key` **defaults to the item index**, and this list's indexes are *not* stable: collapsing
or expanding any tag shifts the index of every item below it. With index keys, React reuses
component instances across different operations, so local state rides along to the wrong row —
an open **try-it-out** panel, entered parameter values, or an expanded response body landing on a
different operation entirely. This directly breaks the AC "expanded operations do not
collapse/reset on scroll", and it will look like a virtualization bug rather than a keying bug.

##### Multi-tag operations — do NOT copy today's operation key

Today's keys are `operation-${tag}` for tag headers (`operations.jsx:54`) and `${path}-${method}`
for operations (`:76`). **Copying the latter verbatim introduces a duplicate-key bug.**

An operation listed under two tags is rendered **twice** — `operationsWithTags`
(`src/core/plugins/spec/selectors.js:245-256`) pushes the *same* op object into every tag it
declares:

```js
return tags.reduce((res, tag) => res.update(tag, List(), (ar) => ar.push(op)), taggedMap)
```

Today those two instances live in **separate sibling scopes** (one `.operation-tag-content` per
tag), so identical `${path}-${method}` keys are perfectly legal. Flattening puts them in **one
list**, where the same key appears twice → React duplicate-key warning plus exactly the
instance-reuse state bleed this section exists to prevent: expanding the operation under tag A
expands it under tag B, and try-it-out state is shared between them.

So the key **must** include the tag: `op-${tag}-${path}-${method}` (or `op-${tag}-${operationId}`).
Prefix tag-header and operation keys distinctly too (`tag-` / `op-`) — they share one namespace now.

This also means the fixture needs multi-tag coverage, which the spec below does not currently
require.

Do **not** pass a `measureElement` option — its real signature is
`(element, entry, instance) => number` and the default is correct here. Dynamic heights come
from attaching `virtualizer.measureElement` as a ref on each item wrapper (below).

#### `scrollMargin` is mandatory here (standard `useWindowVirtualizer` footgun)

The operations list is **not** at the top of the document — the info block, servers dropdown,
authorize row and (in standalone) the topbar all render above it. A window virtualizer measures
offsets from the **document origin**, so without `scrollMargin` every item is displaced downward
by the height of everything above the list, and the virtualizer windows the wrong range.

Two halves, both required:

1. `scrollMargin: listRef.current?.offsetTop ?? 0` on the virtualizer, with `listRef` on the
   list's outer element.
2. Subtract it when positioning each item: `vItem.start - virtualizer.options.scrollMargin`.

Note `offsetTop` is only known after first layout, and it **changes** when the info/servers/auth
block above resizes (spec load, server selection, an error banner appearing, auth expanding). A
stale `scrollMargin` produces a constant offset that looks like "virtualization is just broken".

Concrete mechanism — do not leave this as "re-read on layout changes":

```jsx
const [scrollMargin, setScrollMargin] = useState(0)

useLayoutEffect(() => {
  const el = listRef.current
  if (!el) return
  const measure = () => setScrollMargin(el.offsetTop)
  measure()
  // catches info/servers/auth block resizes, which offsetTop does not notify about
  const ro = new ResizeObserver(measure)
  if (el.parentElement) ro.observe(el.parentElement)
  window.addEventListener("resize", measure)
  return () => { ro.disconnect(); window.removeEventListener("resize", measure) }
}, [])
```

Then pass `scrollMargin` (state, not a live `.offsetTop` read) to the virtualizer. This adds a
second `ResizeObserver` dependency — see the unit-test infrastructure note about the missing jsdom
polyfill.

### Render Virtual Items

Resolve the components exactly as `operations.jsx:49-50` does today — note the
**`true` second argument** on `OperationContainer`, which asks the system for the *connected*
(container) component. Dropping it during the rewrite yields a component with no Redux props and
is easy to miss:

```jsx
const OperationContainer = getComponent("OperationContainer", true)  // container — keep `true`
const OperationTag = getComponent("OperationTag")                    // presentational
```

Preserve the empty-spec guard from `operations.jsx:27-29` **before** the virtual list — it is easy
to drop when the render body collapses into a virtualizer. (The duplicate check at
`operations.jsx:34`, `taggedOps.size < 1 ? <h3>…` inside the returned tree, is unreachable dead
code behind the `:27` early return and should simply be deleted rather than ported.)

```jsx
if (taggedOps.size === 0) {
  return <h3> No operations defined in spec!</h3>   // keep verbatim, incl. leading space
}
```

```jsx
<div ref={listRef}>
  <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
    {virtualizer.getVirtualItems().map(vItem => {
      const item = flatItems[vItem.index]
      return (
        <div
          key={vItem.key}
          data-index={vItem.index}
          ref={virtualizer.measureElement}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            // subtract scrollMargin — see note above
            transform: `translateY(${vItem.start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          {item.type === "tag"
            ? <OperationTag
                tagObj={item.tagObj}
                tag={item.tag}
                oas3Selectors={oas3Selectors}
                layoutSelectors={layoutSelectors}
                layoutActions={layoutActions}
                getConfigs={getConfigs}
                getComponent={getComponent}
                specUrl={specSelectors.url()} />
            : <OperationContainer
                specPath={item.specPath}   /* REQUIRED — op.get("specPath"), operations.jsx:68 */
                op={item.op}
                path={item.path}
                method={item.method}
                tag={item.tag} />
          }
        </div>
      )
    })}
  </div>
</div>
```

### Key Constraints

**1. Class → Functional component**
`Operations` is a class component. `useWindowVirtualizer` is a hook. Must convert to functional.
Mostly mechanical — but not purely, given the flattening below.

Fold in this existing wart while converting: `Operations` declares propTypes **twice** — a
`static propTypes` block (`operations.jsx:6-18`) and an `Operations.propTypes = {...}` assignment
(`:92-99`) that **overwrites** it. Collapse to one correct declaration; do not port both.

Two things to get right in the union:

- **Both blocks have wrong types.** The static block declares `oas3Selectors: PropTypes.func`
  (`:11`) and `fn: PropTypes.func` (`:17`) — both are **objects** (namespaces), not functions. The
  `:92-99` block gets `fn: PropTypes.object` right but is otherwise a subset.
- **The overwrite silently dropped five props** that are still passed and used:
  `oas3Actions`, `oas3Selectors`, `authActions`, `authSelectors`, `getConfigs`. The merged
  declaration must reinstate them, with `oas3Selectors` typed as `object`.

Net: one `propTypes` covering all props from the static block, with `oas3Selectors` and `fn` as
`PropTypes.object`.

Also preserve the empty-spec guard at `:27-29` and drop the unreachable duplicate at `:34` — see
[Render Virtual Items](#render-virtual-items).

**2. Expand state reactivity**
When a tag is toggled, `flatItems` length changes. The virtualizer must re-measure. `useMemo`
deps must include the expand state — but `layoutSelectors` is a stable object, so listing it
as a dep does **nothing**. Derive a primitive/Immutable value that actually changes:

```js
const tagDefaultOpen = docExpansion === "full" || docExpansion === "list"
const expandedTagsState = taggedOps
  .keySeq()
  .map((tag) => layoutSelectors.isShown(["operations-tag", tag], tagDefaultOpen))
  .join(",")
```

**Pass the same default as the flattening logic.** `isShown(state, thing, def)`
(`src/core/plugins/layout/selectors.js:11`) returns `def` when the key is absent from state, and
`def` is `undefined` if omitted — so a bare `isShown(["operations-tag", tag])` yields `undefined`
for never-toggled tags while the flatten step and `operation-tag.jsx:69` both use
`docExpansion === "full" || "list"`. Toggle *detection* still works either way, but the derived
string must agree with the list it invalidates or the two can disagree on initial state.

**3. Deep linking — existing ref mechanism breaks (BLOCKING)**

Deep-link scrolling today is **ref-driven, not index-driven**:

- `src/core/plugins/deep-linking/operation-wrapper.jsx:15` and
  `operation-tag-wrapper.jsx:13` call `layoutActions.readyToScroll(isShownKey, ref)` when an
  operation/tag DOM node mounts.
- `readyToScroll` (`deep-linking/layout.js:110`) compares that key against
  `layoutSelectors.getScrollToKey()` and calls `scrollToElement(ref)` only on a match.

An operation outside the viewport never mounts, so its ref never fires and the deep link
silently does nothing. `scrollToIndex` alone does not fix this — both paths must cooperate:

1. Map the deep-link target to its index in `flatItems`. **The key shape matters and is not
   path+method.** `getScrollToKey()` holds exactly what `isShownKeyFromUrlHashArray`
   (`layout.js:175-184`) produced: `["operations", tag, operationId]` for an operation, or
   `["operations-tag", tag]` for a tag.

   `operationId` is **derived**, not a raw spec field — `OperationContainer.jsx:62`:

   ```js
   const operationId =
     op.getIn(["operation", "__originalOperationId"]) ||
     op.getIn(["operation", "operationId"]) ||
     opId(op.get("operation"), props.path, props.method) ||   // "swagger-client/es/helpers"
     op.get("id")
   ```

   So each flat operation item must carry `operationId` computed with that **exact 4-way fallback
   chain** (import `opId` from `swagger-client/es/helpers` as `OperationContainer.jsx:4` does, or
   factor the chain into a shared helper called from both places). A `path`+`method` lookup will
   never match the key and the bridge will silently no-op.

   Compare with `Im.is(scrollToKey, fromJS(key))` — `scrollToKey` is stored via `Im.fromJS`
   (`layout.js:198`) and `readyToScroll` re-`fromJS`es the incoming key (`:113`), so `===` or a
   plain-array compare never matches. (Phase 1 states this requirement too; it applies identically
   here.)

   If the target op is inside a collapsed tag, the tag must be expanded first or the item won't be
   in `flatItems` at all.
2. `virtualizer.scrollToIndex(idx, { align: "start" })` to force the item to mount.
3. The now-mounted wrapper's existing `readyToScroll` ref fires and completes the current
   flow unchanged.
4. `virtualizer.measureElement` and the deep-linking wrapper ref both target the item
   wrapper — compose them into a single callback ref rather than choosing one.

Note this also affects **initial page load** with a deep link present, where measurement is
still estimate-based and `scrollToIndex` may need a second pass after measurement settles.

**4. Expanded operation height**
A collapsed operation row is ~48px. An expanded one with try-it-out open can be 1000px+. `measureElement` handles this via ResizeObserver — the virtualizer auto-corrects after first render. Expect minor scroll jitter on first expand; this is inherent to dynamic virtualization.

**5. Filter integration — already handled upstream; NO work required**

The filter is a **wrapped selector**, not a component wrapper and not part of `Operations`.
`src/core/plugins/layout/spec-extensions/wrap-selector.js` wraps `taggedOperations`:

```js
export const taggedOperations = (oriSelector, system) => (state, ...args) => {
  let taggedOps = oriSelector(state, ...args)
  const { fn, layoutSelectors, getConfigs } = system.getSystem()
  const { maxDisplayedTags } = getConfigs()

  let filter = layoutSelectors.currentFilter()          // layout/selectors.js:9
  if (filter) {
    if (filter !== true) {
      taggedOps = fn.opsFilter(taggedOps, filter)       // line 13
    }
  }
  if (maxDisplayedTags >= 0) {
    taggedOps = taggedOps.slice(0, maxDisplayedTags)    // lines 17-18
  }
  return taggedOps
}
```

`opsFilter` itself (`src/core/plugins/filter/opsFilter.js`) is a 3-line file with a one-line body —
`taggedOps.filter((tagObj, tag) => tag.indexOf(phrase) !== -1)` — so it drops whole **tags** by
name and never inspects individual operations.

Consequences:

- **`specSelectors.taggedOperations()` already returns filtered, truncated results.** Building
  `flatItems` from it inherits both the filter **and** the `maxDisplayedTags` limit for free.
  Write no filtering code and no tag-limit code.
- Do **not** add per-operation filtering — that would be a behavior change, not a port.
- Nothing to locate or restructure here; this constraint exists only so the work isn't
  reimplemented. The corresponding AC just asserts the inherited behavior still holds.

**6. OperationTag structural change + CSS**

`operation-tag.jsx:72–118` does more than render a header — it renders a
`.opblock-tag-section` wrapper div (gaining `is-open` when expanded) containing the `<h3>`
header **and** `<Collapse isOpened={showTag}>{children}</Collapse>`.

Flattening makes header and operations siblings — **but only on the virtualized path.** Because the
legacy path (below threshold) still nests, `OperationTag` becomes **dual-mode** rather than
header-only:

- When `children` are supplied (legacy path) it must behave exactly as today.
- When they are not (virtualized path) it renders the `<h3>` header alone, with no
  `.opblock-tag-section` wrapper and no `<Collapse>`.
- Simplest shape: keep the current render for the children case, and add an early
  header-only return when `children == null`. Do **not** remove the `children` propType (`:30`) or
  the `getComponent("Collapse")` call (`:51`) — both are still needed.
- On the virtualized path the `.opblock-tag-section` / `.is-open` wrapper and the inner
  `.operation-tag-content` div (`operations.jsx:63`) are absent. **On the legacy path they must
  remain**, which is what keeps every existing test and embedder stylesheet working.
- **CSS impact is small — verified.** `.opblock-tag-section` has exactly one rule,
  `src/style/_layout.scss:14`: `display: flex; flex-direction: column`. No descendant selectors,
  and no `.is-open` variant in the stylesheets. `.operation-tag-content` has **zero** style rules.
  So this is a "reproduce `flex-direction: column` on the virtual wrapper" job, not a CSS
  refactor. Confirm with `grep -rn "opblock-tag-section\|operation-tag-content" src/style/`.
- **The real fallout is in tests, not styles.** `test/` references these class names in ~14
  places — `test/e2e-cypress/e2e/features/deep-linking.cy.js` (×2),
  `test/e2e-cypress/e2e/features/oas32/oas32-component-only.cy.js`, and ~9
  `test/e2e-selenium/scenarios/` files (`bugs/4445.js`, `bugs/4485.js`, `bugs/4756.js`,
  `bugs/4374.js`, `bugs/4587.js`, `bugs/4409.js`, `bugs/4196.js`,
  `features/parameter-example-rendering.js`, `features/parameter-enum-rendering.js`).
  Audit and update these before touching JSX:
  `grep -rn "opblock-tag-section\|operation-tag-content" test/`
- The `<Collapse>` open/close **animation for tag content is lost** — collapse becomes an
  instant `flatItems` change. Flag this to UX as an accepted, intentional behavior change; it
  is not a regression to fix.
- `operation-tag.jsx` declares `children: PropTypes.element` (`:30`) — remove it once children are
  no longer passed, along with the now-unused `const Collapse = getComponent("Collapse")` at `:51`.

**DOM contract on the tag header — do not drop these.** The `<h3>` must keep, verbatim:

- `id={isShownKey.map(v => escapeDeepLinkPath(v)).join("-")}` (`:77`) — the tag anchor.
- `data-tag={tag}` (`:78`) and `data-is-open={showTag}` (`:79`).

`deep-linking.cy.js` targets tags through exactly these, e.g.
`.opblock-tag[data-tag="myTag"][data-is-open="true"]` (`:78`,`:89`,`:173`,`:184`). They survive the
header-only restructure unchanged — but they are attributes on an element whose parent is being
deleted, so they are easy to lose in the edit.

**Under the count-threshold decision these tests are no longer at risk** — all of them use fixtures
far below 150 items, so they exercise the legacy path where these classes still exist:

- `deep-linking.cy.js:237`/`:289` assert `.opblock-tag-section.is-open` positively —
  `deep-linking.swagger.yaml` has **5** operations → legacy path → passes untouched.
- `oas32-component-only.cy.js:18` asserts `.opblock-tag-section` does **not** exist —
  `component-only.yaml` has **0** paths → legacy path → still a meaningful assertion, not a
  vacuous one.
- The 9 Selenium scenarios likewise (and Selenium is not in CI anyway).

Treat this list as the **regression contract for the legacy path**: if any of these start failing,
the legacy branch was altered and that is a bug in this ticket, not a test to update. Only if the
threshold is later removed do these become the breaking changes previously described.

### Unit-test infrastructure

Same two blockers as Phase 1 — see
[Phase 1 → Unit-test infrastructure](./phase-1-models-virtualization.md#unit-test-infrastructure-blocking--must-be-set-up-before-the-tests-can-be-written).
If Phase 1 shipped the `ResizeObserver` polyfill in `test/unit/jest-shim.js`, this phase inherits
it; verify rather than assume. The new `Operations` test is greenfield, so choose the same strategy
Phase 1 settled on (recommended: mock `@tanstack/react-virtual`, and cover real windowing in
Cypress).

### Measuring Success

Benchmark with the Kubernetes OpenAPI spec (~800 operations).

**First task of this ticket: record the actual baseline.** The "Before" column below is an
unmeasured estimate — replace every value with a measured one before implementation starts, and
recompute the targets from it.

Record `docExpansion` for every run — `"list"` (default, operations collapsed) and `"full"`
(everything mounted) give wildly different numbers.

| Metric | Before (ESTIMATE — measure) | Stretch target |
|--------|-----------------------------|----------------|
| Time to interactive | ~8s | <2s |
| Mounted components | ~800 OperationContainer + OperationSummary (collapsed bodies already unmounted) | ~15 |
| Memory (heap) | ~400MB | ~80MB |
| Tag expand time | ~500ms | <50ms |

The pass bar in the AC is ≥50% off measured baseline; this table is the aspiration.

### Accepted Behavior Changes (confirm with maintainers before building)

Same tradeoffs as Phase 1, and more acute here because operations are what users search for.
**All of these apply only above the 150-item threshold** — below it the legacy path runs and behavior
is identical to today:

- **Browser find-in-page (Ctrl/Cmd-F) no longer finds off-screen operations** — no path,
  summary, parameter name, or description outside the rendered window is findable. For a large
  API this is the single most visible regression in the epic.
- **Printing / "Save as PDF" captures only the rendered window.**
- **Loss of the tag-content `<Collapse>` animation** (constraint 6).
- **DOM restructure** — on above-threshold specs only, `.opblock-tag-section` and
  `.operation-tag-content` are absent, which affects embedders with custom CSS or scripts targeting
  them *on large specs*.
- **`OperationTag` stays backward-compatible — no public API break.** It is resolved via
  `getComponent("OperationTag")`, so embedders can override it (`docs/customization/plugin-api.md`).
  Because the legacy path still passes `children`, overrides that render `this.props.children`
  continue to work. The dual-mode requirement (constraint 6) exists precisely to preserve this. An
  override that renders children *unconditionally* will render nothing extra on the virtualized
  path — worth a release note, but not a break.

Note the in-app filter only matches **tag names** (constraint 5), so it is not a substitute for
Ctrl-F over operation paths.

The count threshold **is** the mitigation and it covers most specs. Above it, no further mitigation
exists: the in-app filter matches tag names only, and `overscan` widens the window by a few rows.

### Rollout: automatic count threshold (DECIDED — no config flag)

**Decided 2026-08-04:** virtualize only when the flattened item count exceeds a threshold. No config
key.

```js
import { VIRTUALIZE_OPERATIONS_THRESHOLD } from "core/utils"   // suggested = 150

if (flatItems.length < VIRTUALIZE_OPERATIONS_THRESHOLD) {
  // legacy path — today's nested tag → operations markup, unchanged
  return renderLegacyOperations()
}
// windowed path below
```

This decision **substantially changes this ticket's risk profile — read before starting:**

- **`OperationTag` must keep supporting `children` and its `<Collapse>`.** The legacy path still
  passes children, so constraint 6's restructure becomes *additive*: `OperationTag` needs to render
  header-only **when used by the virtualized path** (e.g. children simply absent) while continuing
  to wrap children when they are supplied. Do **not** delete the `.opblock-tag-section` wrapper,
  `.operation-tag-content`, the `<Collapse>`, or the `children` propType. This also means it is
  **no longer a public plugin-API break** (see Accepted Behavior Changes).
- **All the E2E fallout in constraint 6 evaporates.** `deep-linking.swagger.yaml` has **5**
  operations and `oas32/component-only.yaml` has **0** paths, so `deep-linking.cy.js:237`/`:289`,
  `oas32-component-only.cy.js:18` and the 9 Selenium scenarios all take the legacy path and pass
  untouched. Keep constraint 6's DOM-contract list as the definition of what the legacy path must
  keep producing.
- **The virtualized path has zero existing coverage.** `many-operations.yaml` (529 ops / 24 tags,
  `flatItems` ≈ 554 expanded) is its only E2E exercise. Note `flatItems` counts tag headers *plus*
  operations of **expanded** tags only — with `docExpansion: "none"` the count collapses to 24 and
  would fall *under* the threshold. Assert in the test that the virtualized path is actually taken,
  and be deliberate about which `docExpansion` the perf spec runs with.
- Test **both sides of the boundary**, and remember `flatItems.length` changes as tags expand and
  collapse — decide deliberately whether the path can flip mid-session (recommended: evaluate the
  threshold once on the un-collapsed total, so it cannot).

Hooks must be called unconditionally before the branch; the early return goes after them.

## Dependencies

- Phase 1 must be complete — **for the dependency and the general windowing pattern only**
  (`@tanstack/react-virtual` in `package.json`, `getItemKey` / `measureElement` / measurement-cache
  conventions). Phase 1 explicitly does **not** build a `scrollToIndex` → `readyToScroll` bridge,
  because model deep-linking does not exist (see Phase 1 Technical Notes). **This phase's deep-link
  bridge is greenfield** — nothing to inherit, and it is the largest single unknown in the estimate.
- Rollout question is **resolved** (automatic count threshold, no config key) — no longer blocking
- **Larger than Phase 1 when sizing:** adds the tag/operation flattening, the greenfield deep-link
  bridge, and a dual-mode `OperationTag`. The E2E selector audit is no longer in scope (threshold
  decision), but maintaining two render paths is.

## Out of Scope

- Schema property lists — out of scope for this epic; see the README's "Out of scope" section for why virtualization was rejected there
- `src/core/components/overview.jsx` tag list — typically <100 tags, low ROI
- `swagger-ui-react` flavor — inherits the change automatically (it re-exports core), so no code
  work. But it is a separately published package not covered by the Cypress suite, so smoke-test
  it once before release, same as Phase 1.

## Risks

| Risk | Mitigation |
|------|-----------|
| Deep link scroll silently breaks — unmounted ops never fire `readyToScroll` (constraint 3) | Highest-risk item. Build the `scrollToIndex` → mount → ref bridge *first*, before the perf work; dedicated E2E suite for `/#/tag/op` patterns incl. off-screen and collapsed-tag targets |
| `useMemo` on `flatItems` never invalidates because `layoutSelectors` is referentially stable | Derive a changing primitive for expand state (constraint 2); unit-test that toggling a tag changes `flatItems.length` |
| ~~E2E selectors break on DOM restructure~~ — **neutralized by the count threshold**; all affected fixtures are ≤5 operations and take the legacy path | Keep the legacy branch producing identical DOM; treat any failure in those specs as a regression |
| **Virtualized path ships untested** — no existing fixture reaches 150 items | `many-operations.yaml` is its only coverage; assert in the test that the virtualized path is actually taken |
| `OperationTag` dual-mode branch handled incorrectly, breaking embedder overrides that render `children` | Explicit unit tests for both modes; keep the `children` propType and the `Collapse` import |
| Two render paths diverge over time | Extract the legacy branch from today's JSX rather than reimplementing it |
| Find-in-page / print regression | See [Accepted Behavior Changes](#accepted-behavior-changes-confirm-with-maintainers-before-building); needs a maintainer decision |
| Missing `scrollMargin` silently offsets every item by the height of the info/servers/auth block | Mandatory `scrollMargin` + `translateY(start - scrollMargin)`; re-read `offsetTop` on layout change |
| Deep-link index lookup built on `path`+`method` never matches the `operationId`-based key | Carry `operationId` on flat items using `OperationContainer.jsx:62`'s exact 4-way fallback |
| Expand state desync | Integration test: expand tag, scroll away, scroll back — ops still expanded |
| CSS layout shift on measureElement correction | Set `min-height: estimateSize` on item wrapper |
| Screen reader DOM order | Verify with axe-core; flat DOM order matches visual order |

## References

- TanStack Virtual `useWindowVirtualizer`: https://tanstack.com/virtual/latest/docs/framework/react/api/useWindowVirtualizer
- Phase 1 ticket: `phase-1-models-virtualization.md`

- `src/core/components/operations.jsx`
- `src/core/components/operation-tag.jsx`
