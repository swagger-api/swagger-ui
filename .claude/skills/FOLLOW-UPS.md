# Follow-ups

Problems found in the repository while building the skills (not fixed: each needs its own PR),
and open work on the skills. Checked against `main` at `ee02195f` on 2026-10-22.

## Repository Problems

1. **`SwaggerUI.plugins.OpenAPI31` is the OAS 3.0 plugin.** `src/core/index.js:22` reads
   `import OpenAPI31Plugin from "./plugins/oas3"`; it should import `./plugins/oas31`. Users who
   build their own preset from `SwaggerUI.plugins.OpenAPI31` get the 3.0 plugin twice.
2. **`OpenAPI32` is missing from `SwaggerUI.plugins`** (`src/core/index.js`). `EXPORT` note in
   `check-plugin-conventions.mjs`.
3. **The oas32 `default$schema` is the OAS 3.2 document schema, not a dialect.**
   `src/core/plugins/oas32/wrap-components/model.jsx:34` and `models.jsx:32` use
   `https://spec.openapis.org/oas/3.2/schema/2025-09-17`. The published Schema Object dialects
   are listed in `add-json-schema-support/references/dialects.md`; which one to use is a decision,
   because the 3.2.0 spec text names a different id. Nothing reads `default$schema` yet, so there
   is no visible effect today. `DIALECT` errors.
4. **`resolve` lacks the OAS 3.2 strategy.** `src/core/plugins/swagger-client/index.js` lists
   `openApi32ApiDOMResolveStrategy` only in `resolveSubtree`. `fn.resolve` is used by the
   deprecated `specActions.resolveSpec` and by plugins calling `system.fn.resolve`, so the impact
   is limited, but 3.1's strategy is in both lists.
5. **The oas32 plugin header lists `info.summary` as new in 3.2**
   (`src/core/plugins/oas32/index.js`); it came with OAS 3.1.
6. **OAS 3.2 parity copies can drift.** `test/e2e-playwright/features/plugins/oas32/oas32-schema-expansion.spec.ts`
   mirrors the oas31 spec; check that it has the oas31 "re-expand a collapsed nested property" test.
7. **`CLAUDE.md` is stale on versions**: "OpenAPI Specification Compatibility" says support goes up
   to 3.1.x and v5.31.0, and the plugin count and file counts are out of date.
8. **`dependentRequired` names without a `properties` entry are not rendered.** The
   json-schema-2020-12 renderer shows "Required when defined" only on declared properties
   (`components/keywords/Properties/Properties.jsx` calls `fn.getDependentRequired` per entry of
   `properties`). With `properties: { creditCard }` and `dependentRequired: { creditCard: ["billingAddress"] }`
   and no `billingAddress` property, nothing shows `billingAddress`. The spec requires each listed
   name to be a property of the instance, not to have a schema
   (https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01.html#section-6.5.4).
   It affects OAS 3.1 and 3.2 Schema Objects too, so the fix is a change to the core renderer with
   an OAS regression check. The json-schema-document plugin copies `getDependentRequired` (and
   renders `dependencies` array entries the same way), so it follows once core changes. The core
   `DependentRequired` component also renders a trigger property named `""` (or only whitespace) as an
   empty list item; the json-schema-document plugin lists such a name as `(empty name)` or
   `(blank name)` instead.
9. **`required` names without a `properties` entry are not rendered.** `Properties.jsx` returns
   `null` when a schema has no `properties`, and `required` only marks declared properties. A schema
   like `{ type: "object", required: ["carrier"] }` (for example as a `dependentSchemas` or legacy
   `dependencies` entry) shows no trace of `carrier`. The spec requires every item of `required` to
   name an instance property, independently of `properties`
   (https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01.html#section-6.5.3).
   Same scope as item 8: core renderer, OAS 3.1/3.2 affected, needs its own PR.
10. **`getDependentRequired` scans `dependentRequired` once per property.**
    `src/core/plugins/json-schema-2020-12/fn.js` is called by `Properties.jsx` for every declared
    property, so rendering costs properties × `dependentRequired` entries (about 6 ms for 200 × 200,
    about 0.6 s for 2000 × 2000). Build a reverse index once per schema object, as
    `getDependentRequired` of the json-schema-document plugin does. Low priority; it changes OAS
    3.1/3.2 rendering code, so it needs its own PR.
11. **`usePath` matches sibling paths by string prefix.** `pathMutator` in
    `src/core/plugins/json-schema-2020-12/hooks.js` selects the paths below the one it changes with
    `key.startsWith(startPath)`, without a path separator, so "Collapse all" or "Expand all" on
    `properties.a` also changes the saved expansion state of `properties.ab`. Compare whole segments
    (`key === startPath || key.startsWith(startPath + ",")`) in both branches and add a regression
    test for sibling names where one is a prefix of the other. It changes OAS 3.1/3.2 behavior, so it
    needs its own PR. The json-schema-document `definitions` list meets it for definitions named `""`
    and `"(empty name)"` in one document, which get the path tokens `(empty name)_` and `(empty name)`,
    and the `dependencies` list for keys such as `card` and `cardNumber`.

## Open Work on the Skills

1. **The major-version branch of `/add-oas-support` has no eval with a real target.** OAS 4.0
   (Moonwalk) has no release and only a non-consensus draft without Fixed Fields tables; the
   2.0 → 3.0 dry run was dropped because the answers are in the repository (the oas3 plugin) and
   don't carry over to 4.0. When a 4.0 draft with object tables appears, add a preview case
   against it (`diff-spec-versions.mjs 3.x.y <draft>`), and revisit the "Variants" rules for a
   major with its actual structure.
