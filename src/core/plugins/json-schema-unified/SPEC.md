---
id: json-schema-unified
type: module-design
status: draft
title: Unified JSON Schema view (opt-in)
parent: architecture
depends-on:
  - core-runtime
  - document-lifecycle
  - ui-shell
  - oas-versions
references:
  - json-schema
---

## Responsibility

Gives every OpenAPI version one schema UI: the Schemas/Models section and the **Schema** tab
(parameters, request bodies, responses). It is shown only when the config option
`unifiedJSONSchemaEnabled` is `true` (default `false`, also a `swagger-ui-react` prop). With the
option off, nothing changes. The view looks and behaves like the 2020-12 schema view, styled
with Tailwind ([ui-shell](../../components/SPEC.md) → Styling with Tailwind). It is meant to
eventually replace json-schema-5's model views.

Not in scope: example values, which still come from each version's sample generator; parameter
input widgets (`JsonSchemaForm`); and the OAS 2.0 scheme picker.

## Gating

- The plugin wraps `Model` and `Models`. It sits in the apis preset **after every OpenAPI plugin**
  (rule in [architecture](../../../../architecture.md)), so its wrappers are outermost.
- Each wrapper decides **at render time**: the option must be `true` and the detected version
  must map to a dialect (`versions.ts#UNIFIED_DIALECTS`, newest first). Otherwise it renders the
  original.
  - Plugin registration can't be the gate, because configs aren't visible at load time
    ([core-runtime](../../SPEC.md)).
  - An undetected version, or one without a dialect, gets the classic view.
- Dialects today, newest first: `oas32`, `oas31`, `oas30` (oas3's `isOAS30`; its `isOAS3` is
  widened to 3.1/3.2) and `swagger2` (`isSwagger2`). `dialects.ts#getOASDialectOverrides`
  returns per-instance `{config, fn, components}`: the dialect's keyword list (with the internal
  `$$ref` hidden), readOnly/writeOnly filtering, markdown descriptions, and the OAS keywords.
  - `default$schema` for 3.2 is the published dialect id `…/oas/3.2/dialect/2025-09-17`, not
    oas32's document-schema id. 2.0 and 3.0 define no dialect id for schemas, so theirs is
    `undefined`; no renderer reads it, and no marker was needed.
  - Nothing mutates shared `fn`. oas31's `afterLoad` mutation of `fn.jsonSchema202012` is
    deliberately not copied.

## 2.0/3.0 dialects

- **Own keyword lists** (`legacy.ts`): the Schema Object fixed fields of each version. 2020-12-only
  keywords (`const`, `$defs`, `prefixItems`, `if`, `examples`, …) are not keywords there: their
  slots render nothing and they show as extension keywords (only with `showExtensions`).
  This is the same rule as for unknown keywords in every version, and was confirmed over
  json-schema-5's plain rows. 2.0 also lacks `oneOf`/`anyOf`/`not`, `nullable`, `writeOnly`, and
  `deprecated`. `writeOnly` still hides properties from 2.0 response schemas, as json-schema-5
  does (confirmed), but it is not rendered as a keyword; its `discriminator` is a property-name string, and `type: file`
  is a type. 3.0's `discriminator` is the object of 3.1.
- **Boolean exclusive bounds.** `maximum: 10, exclusiveMaximum: true` is rewritten to the
  2020-12 numeric form before formatting, so it reads `< 10` (and `(1, 10]`, `> 0`, …) exactly as
  2020-12 bounds do. A numeric `exclusive*` is ignored.
- **Nullable.** 3.0 `nullable: true` appends ` | null` to the type, as a 2020-12
  `type: [X, "null"]` reads.
- **Nested names (2.0/3.0 only).** `getTitle` falls back from `title` to the last token of
  `$$ref` (then `$ref`), percent- and `~1`/`~0`-decoded, empty for an empty pointer, as
  json-schema-5 names models. It applies wherever the renderer titles a schema itself (Schema tab
  root, combiner members). A property or `items` keeps its own label and shows the nested
  schema's name next to it, collapsed or expanded (`data-keyword="schemaName"`, json-schema-5's
  `category: Category`). 3.1/3.2 naming is unchanged.
- **Reference path (2.0/3.0 only).** A dereferenced schema, collapsed or expanded, shows its
  `$$ref` in a tooltip above its title, like json-schema-5's `.model-hint`
  (`role="tooltip"`, `data-keyword="$$ref"`).
  - **Placement:** `-1.8em` above the title, or `-1.15em` for a top-level schema.
  - **Trigger:** it shows while the title toggle is hovered or has keyboard focus
    (`:focus-visible`), not after a mouse click. Hover and focus were confirmed. It is a flat
    sibling of the toggle, styled through Tailwind's `peer/ref-title`, so the head's DOM (and the
    selectors relying on it) is unchanged.
  - **Text:** same-document references show as `#/…`. The relative form was confirmed over
    json-schema-5's absolute URL.
- **Schemas section.** Path and layout/expansion/scroll key `definitions` with the heading
  "Models" for 2.0, `components/schemas` with "Schemas" for 3.0; subtrees are requested on
  expand as for 3.x.
- **Recursive `$ref`s.** swagger-client's 2.0/3.0 strategies leave cyclic `$ref`s unresolved
  (and merge `allOf`, keeping such a `$ref` beside the merged siblings). json-schema-5 resolves
  them by name on render. The dialects do the same (`fn.getLazyRef`): a local
  `#/definitions/X` / `#/components/schemas/X` `$ref` renders definition `X` (resolved subtree,
  else raw) with the `$ref`'s siblings deep-merged over it. Bodies render only when expanded,
  so the recursion is bounded by the user's expansion. Each rendering gets a fresh object, so
  the cycle check does not mark it `[circular]`. "Expand all" stops at the first target already
  resolved on the branch. Other `$ref`s stay visible as `$ref`.

## Contracts

- **Self-contained.** The renderer, keywords, and OAS keyword components are TypeScript copies,
  not imports.
  - Components are registered as `JSONSchemaUnified*` through `registry.ts`, and helpers live
    under `fn.jsonSchemaUnified`.
  - A fix in code copied from json-schema-2020-12, oas31, or oas32 must be applied to every copy.
- **Customization is through plugins only.** Embedders customize via `wrapComponents` on the
  `JSONSchemaUnified*` components, not through CSS: utilities are `!important` and there are no
  semantic classes.
  - In OAS dialects, wrap the `KeywordOAS*` slots (2.0's discriminator:
    `KeywordSwagger2Discriminator`). The OAS Examples slot uses the plugin's own 2020-12 Examples
    directly.
  - With the option on, existing wrappers of `OAS31Model`, `JSONSchema202012Keyword*`, and the
    json-schema-5 model components don't apply.
- **Automation hooks.** The `data-*` attributes are hooks for tests and automation, not a styling
  API: `data-json-schema-unified[-model|-models|-models-scroll]`, `data-schema-name`,
  `data-expanded`, `data-keyword` (including `$$ref` for the 2.0/3.0 reference path),
  `data-json-schema-title`, `data-json-viewer-*`, and `data-constraint-scope`.
- **Instance caching.** HOC instances are cached per System, then per view, dialect,
  `includeReadOnly`/`includeWriteOnly`, expand depth, and `showExtensions`. They are never cached
  on a static field keyed by `location.pathname`. That pattern freezes the first render's flags,
  and oas31/oas32 still use it (tracked separately).
- **Data reads.** Schema names come from `specJson()` and values from `specResolvedSubtree(path)`.
  Immutable data is converted to plain JS once per object (a `WeakMap`).
  `specJsonWithResolvedSubtrees()` was rejected because it rebuilds on every spec change, which
  defeats that cache.
- **Behaviour carried over from the classic views:**
  - the `defaultModelRendering`, `defaultModelExpandDepth`, `defaultModelsExpandDepth`, and
    `showExtensions` configs;
  - virtualization thresholds (`core/utils/virtualization`);
  - deep-link scroll, including into virtualized lists;
  - `JumpToPath` at the top-right of each Schemas-section panel (json-schema-5's
    `.models-jump-to-path`; `data-jump-to-path`). Nested references get none (confirmed).
- **Error isolation.** Each view is wrapped in `fn.withErrorBoundary`. Its outermost wrapper
  bypasses safe-render's `Models`/`ModelWrapper` boundary.
- **Parity is proven by tests.** The Playwright project `unified-json-schema` re-runs the schema
  specs listed in `playwright.config.ts` with the option on, for 2.0, 3.0, 3.1, and 3.2 documents.
  Its guard fails any test whose page didn't actually render the unified view, or still rendered
  a classic json-schema-2020-12 or json-schema-5 one. The project `webkit-unified` runs the
  plugin's own specs in WebKit to check the Safari browser floor.

## Known limitations

- **Tabs can disagree.** The Schema tab follows the dialect's keyword semantics, but Example Value
  still comes from the version's own sample generator.
- **Cost.** The plugin and its CSS ship in every bundle even when the option is off: about
  +12.7 KB gzip in `swagger-ui-bundle.js` and +2.6 KB gzip in `swagger-ui.css`.
- **Browser floor.** Tailwind v4 needs Safari 16.4, Chrome 111, and Firefox 128 for this view.
