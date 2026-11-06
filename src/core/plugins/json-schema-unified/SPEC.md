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

Gives OpenAPI 3.1 and 3.2 documents one schema UI: the Schemas section and the **Schema** tab
(parameters, request bodies, responses). It is shown only when the config option
`unifiedJSONSchemaEnabled` is `true` (default `false`, also a `swagger-ui-react` prop). With the
option off, nothing changes. The view looks and behaves like the 2020-12 schema view, styled
with Tailwind ([ui-shell](../../components/SPEC.md) → Styling with Tailwind). It is meant to
eventually replace json-schema-5's model views.

Not in scope: example values, which still come from each version's sample generator; parameter
input widgets (`JsonSchemaForm`); and OAS 2.0 and 3.0 documents, which keep the classic
json-schema-5 view with the option on (no dialect, see Gating).

## Gating

- The plugin wraps `Model` and `Models`. It sits in the apis preset **after every OpenAPI plugin**
  (rule in [architecture](../../../../architecture.md)), so its wrappers are outermost.
- Each wrapper decides **at render time**: the option must be `true` and the detected version
  must map to a dialect (`versions.ts#UNIFIED_DIALECTS`, newest first). Otherwise it renders the
  original.
  - Plugin registration can't be the gate, because configs aren't visible at load time
    ([core-runtime](../../SPEC.md)).
  - An undetected version, or one without a dialect (2.0, 3.0), gets the classic view.
- Dialects today, newest first: `oas32` and `oas31`. `dialects.ts#getOASDialectOverrides`
  returns per-instance `{config, fn, components}`: the dialect's keyword list (with the internal
  `$$ref` hidden), readOnly/writeOnly filtering, markdown descriptions, and the OAS keywords.
  - `default$schema` for 3.2 is the published dialect id `…/oas/3.2/dialect/2025-09-17`, not
    oas32's document-schema id.
  - Nothing mutates shared `fn`. oas31's `afterLoad` mutation of `fn.jsonSchema202012` is
    deliberately not copied.

## Contracts

- **Self-contained.** The renderer, keywords, and OAS keyword components are TypeScript copies,
  not imports.
  - Components are registered as `JSONSchemaUnified*` through `registry.ts`, and helpers live
    under `fn.jsonSchemaUnified`.
  - A fix in code copied from json-schema-2020-12, oas31, or oas32 must be applied to every copy.
- **Customization is through plugins only.** Embedders customize via `wrapComponents` on the
  `JSONSchemaUnified*` components, not through CSS: utilities are `!important` and there are no
  semantic classes.
  - In OAS dialects, wrap the `KeywordOAS*` slots. The OAS Examples slot uses the plugin's own
    2020-12 Examples directly.
  - With the option on, existing wrappers of `OAS31Model` and `JSONSchema202012Keyword*` don't
    apply to 3.1/3.2 documents.
- **Automation hooks.** The `data-*` attributes are hooks for tests and automation, not a styling
  API: `data-json-schema-unified[-model|-models|-models-scroll]`, `data-schema-name`,
  `data-expanded`, `data-keyword`, `data-json-schema-title`, `data-json-viewer-*`, and
  `data-constraint-scope`.
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
  - `JumpToPath` on schema titles.
- **Error isolation.** Each view is wrapped in `fn.withErrorBoundary`. Its outermost wrapper
  bypasses safe-render's `Models`/`ModelWrapper` boundary.
- **Parity is proven by tests.** The Playwright project `unified-json-schema` re-runs the schema
  specs listed in `playwright.config.ts` with the option on, for 3.1 and 3.2 documents. Its guard
  fails any test whose page didn't actually render the unified view, or still rendered a classic
  json-schema-2020-12 one.

## Known limitations

- **Tabs can disagree.** The Schema tab follows the dialect's keyword semantics, but Example Value
  still comes from the version's own sample generator.
- **Cost.** The plugin and its CSS ship in every bundle even when the option is off: about
  +12.7 KB gzip in `swagger-ui-bundle.js` and +2.6 KB gzip in `swagger-ui.css`.
- **Browser floor.** Tailwind v4 needs Safari 16.4, Chrome 111, and Firefox 128 for this view.
