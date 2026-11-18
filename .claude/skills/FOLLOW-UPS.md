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
   `(blank name: U+0020)` (the characters of a whitespace-only name spelled out), through the
   registered component.
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
    and the `dependencies` list for keys such as `card` and `cardNumber`. The path is also built by
    joining the segments with commas, so `dependencies.a` with a property `b` and a dependency named
    `a,properties,b` share one key; the segments need an unambiguous encoding, not only a
    whole-segment comparison.
12. **Property names are shown as collapsing HTML text.** The json-schema-2020-12 renderer prints a
    name (the title of a property, an item of `dependentRequired`) as plain inline text, so the browser
    collapses its whitespace: `a b` and `a  b`, or `a` and ` a`, look alike although they are different
    properties. A `white-space: pre-wrap` rule on the name elements (or visible escapes) in
    `src/core/plugins/json-schema-2020-12/` would show them as they are. It changes OAS 3.1/3.2
    rendering, so it needs its own PR; the json-schema-document plugin has the same limit for names that
    are not blank.
13. **`getType` makes any `not` with an `any` type label `never`.** `makeGetType` in
    `src/core/plugins/json-schema-2020-12/fn.js` returns `never` for `schema.not && getType(schema.not) === "any"`,
    but a schema whose type label is `any` can still restrict instances: `{ type: "integer", not: { enum: [0] } }`
    shows `never` although `1` is valid, and `{ type: "object", not: { required: ["a"] } }` although `{}` is
    valid. Only `true` or a schema with no restricting keyword makes its `not` unsatisfiable. The same early
    return skips the `processedSchemas.delete(schema)` at the end of the function, so a schema with such a
    `not` that is used twice (`prefixItems: [s, s]`) is taken for a cycle the second time. It changes OAS
    3.1/3.2 labels, so it needs its own PR; the json-schema-document plugin has its own narrower check
    (`isUnrestricted`) and deletes the schema before it returns. The 2.0/3.0 copy
    (`json-schema-unified/legacy.ts#getType`, 3.0 only, since 2.0 has no `not`) has the same early return.
14. **The unified schema view shows no ref-derived names for nested schemas in OAS 3.1/3.2.** The
    Schema tab names its top-level schema from `$$ref` (`json-schema-unified/components/Model/Model.tsx`),
    but nested property and `items` schemas, and the reference path (`components/keywords/oas/RefPath.tsx`,
    which renders nothing unless `fn.getRefPath` is set), get no ref-derived name. The 2.0/3.0 dialects
    do show them (`json-schema-unified/legacy.ts`: `getTitle`, `getRefPath`). With
    `unifiedJSONSchemaEnabled` on, a nested `$ref`'d schema in a 3.1/3.2 document shows no name.
15. **The unified schema view shows the reference path inline, not as the json-schema-5 hover tooltip.**
    json-schema-5's `Model` shows it in a `.model-hint` tooltip, on object models only. The unified
    view prints it inline for now (`legacy.ts#getRefPath`, rendered by `RefPath.tsx`). Decide whether
    to match the tooltip.
16. **2.0/3.0: an external `$ref` the resolver left in place resolves to the local schema of the same
    name.** `json-schema-unified/legacy.ts#getLocalRefName` ignores the document part of the
    reference, as json-schema-5's `getModelName` does. `other.yaml#/definitions/Foo` (2.0) or
    `other.yaml#/components/schemas/Foo` (3.0) renders the local `Foo` when one exists. It only
    happens when the resolver leaves an external ref in place (failed fetch, cycle, depth limit).
    `getRefPath` compares the document part to the document URL, but only to shorten what it shows.
    Doing it for the lookup needs that URL to match the resolver's base in every setup (`url`, `spec`,
    relative URLs, query strings); where it doesn't, recursive models would stop expanding.
17. **Optional, only on client request: the unified schema view has no `JumpToPath` on nested `$ref`
    schemas.** Only each Schemas-section panel carries it (`json-schema-unified/components/Models/SchemaItem.tsx`).
    json-schema-5 also puts it on every nested `$ref` object (`json-schema-5/components/object-model.jsx`),
    with the usage-site spec path (`properties,<key>`, `additionalProperties`, `allOf,<i>`, ...); the
    3.1/3.2 renderers never had it. Core `JumpToPath` renders nothing, so only plugins that override
    it notice (SwaggerEditor jumps to the line). No community request so far (swagger-ui #9380 is
    maintainer-filed). If a client asks:
    - A plugin can already add it without changes here: wrap `JSONSchemaUnified` and pass its
      `jumpToPath` prop for a schema with a local `$$ref`/`$ref`, pointing at the referenced
      definition. Document that prop as an extension point first.
    - The usage-site path needs per-keyword spec-path tracking in the unified renderer (it only tracks
      an expansion path), shared by all four dialects, plus 3.1/3.2 keywords (`prefixItems`,
      `patternProperties`, `$defs`, ...).
    - The `jumpToPath` slot is styled for the panel's top-right corner; nested schemas may need a
      title-row slot.
18. **Core: `specSelectors.findDefinition` returns `null` for a 2.0 document when the oas3 plugin is
    loaded.** `onlyOAS3` (`oas3/spec-extensions/wrap-selectors.js`) falls back with `ori(...args)`, but
    `args` still starts with the state while `ori` is already bound to it, so the original selector
    receives the state as the schema name. 3.0 works, since it goes through `findSchema`;
    `findDefinition` is the only affected `onlyOAS3`-wrapped selector. The old renderer shows a
    left-in-place `$ref` in a 2.0 document as the raw `$ref` text, or as an empty expandable object when
    `$$ref` is also set. The fix is `ori(...args.slice(1))` in a separate PR (it also makes the old
    renderer expand these refs in 2.0). Until then the unified view keeps its own lookup
    (`json-schema-unified/schemas.ts#findSchemaDefinition`); afterwards it could use `findDefinition`.
19. **2.0/3.0: `nullable` shows a `| null` union even when the schema has no explicit `type`.**
    `json-schema-unified/legacy.ts#getType` appends ` | null` to any composed or inferred type label when
    `nullable` is `true`, so `{ oneOf: [{ type: string }], nullable: true }` reads `(string) | null`.
    OAS 3.0.4 says `nullable` only takes effect when `type` is explicitly defined in the same Schema
    Object. It stays lenient on purpose: json-schema-5 printed `nullable: true` for every schema
    (`primitive-model.jsx`, `array-model.jsx`, `object-model.jsx`), and `allOf` with `nullable` is a
    common idiom. Decide whether to follow the spec strictly, and if so how to show `nullable` on an
    untyped schema.

## Open Work on the Skills

1. **The major-version branch of `/add-oas-support` has no eval with a real target.** OAS 4.0
   (Moonwalk) has no release and only a non-consensus draft without Fixed Fields tables; the
   2.0 → 3.0 dry run was dropped because the answers are in the repository (the oas3 plugin) and
   don't carry over to 4.0. When a 4.0 draft with object tables appears, add a preview case
   against it (`diff-spec-versions.mjs 3.x.y <draft>`), and revisit the "Variants" rules for a
   major with its actual structure.
