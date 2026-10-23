# Review Lessons

Defect classes from the reviews of the OAS 3.2 work: #10721 (basic support, squash `4675ad74`,
before-state `a398208d`), #11090 (additionalOperations, `2f91b75b`, before-state `38ca10e1`),
#10956 and #11099 (both open). OAS 3.1 was about 100 small self-merged PRs on `next` with almost
no review comments, so it taught less. Each class is stated as a rule; the example shows what it
looked like. "Gate" names the check that catches it.

## 1. Copying where wrapping would do

A component was copied into the new plugin although it rendered the new version correctly.
`Info` was copied in #10721; the fix was `oas32/wrap-components/info.jsx`, which renders
`OAS31Info` through `getComponent`. Copy only what must differ (`plugin-patterns.md` section 6).
Gate: review.

## 2. Hand-written version guards

`(Original, system) => (props) => { if (system.specSelectors.isOAS32()) ... }` written inline, or
an existing guard widened to `isOAS31() || isOAS32()` in the parent's file. Use
`createOnlyOAS3YComponentWrapper` / `createOnlyOAS3YSelectorWrapper` / `wrapOAS3YFn` in the new
plugin; when the new version needs the parent's component, add a wrapper in the new plugin
rather than touching the parent's guard. Gate: `HAND-GUARD`.

## 3. Dead or redundant code

Selectors used only by tests; an `isOAS3{P}` wrap-selector that never runs because the parent's
regex already rejects the new line; a second implementation of an existing helper
(`isFixedOperationMethod`). Before adding a helper, grep for one; before adding a selector, name
its production caller. Gate: review.

## 4. Parent-version fields presented as new

A field the parent version already had was listed, implemented or documented as new:
`Components.pathItems` and `Info.summary` both came with OAS 3.1, and the oas32 plugin header
still calls `info.summary` new in 3.2. Every `NEW` row is cross-checked against the parent's spec
table and the parent plugin. Gate: field map (Preparation step 4), review.

## 5. Global changes leaking into older versions

`query` was added to the core `validOperationMethods`, so 3.0 and 3.1 documents rendered QUERY
operations. It moved to `src/core/utils/operation-methods.ts` plus a version-gated wrapper.
Every change to a shared file needs a test that an older version is unaffected. Gate:
`CORE-TOUCH` plus an older-version test.

## 6. Cross-plugin coupling

`import` from another plugin is forbidden (`CLAUDE.md`); copy the module into the new plugin.
Reuse at runtime through `getComponent`, `fn` and selectors is fine. A bug in copied code must be
fixed in every copy: #10764 fixed the stale Model cache in both `oas31` and `oas32`. Gate:
`CROSS-IMPORT`.

## 7. Wrong dialect or schema URLs

`default$schema` for 3.2 is the OAS 3.2 *document* schema (`/oas/3.2/schema/...`) instead of the
Schema Object dialect. Take dialect ids from the spec text (`#dialect-schema-id`) and the
published list at `https://spec.openapis.org/oas/`, record both, and check them with
`verify-urls.mjs`. The spec text can be wrong: a later patch release may correct it. Gate:
`DIALECT`, `verify-urls.mjs`.

## 8. Renderer not wired for the new version

The oas31 `Model`/`Models` wrappers are gated on `isOAS31`, so 3.2 schemas fell back to the
legacy JSON Schema 5 renderer until the oas32 plugin got its own wrappers. Every renderer
wrapper of the parent needs a counterpart (`plugin-patterns.md` section 7). Gate: Cypress spec
asserting `.json-schema-2020-12` elements for a 3.Y model.

## 9. swagger-client resolve strategy missing

Without `openApi3YApiDOMResolveStrategy`, 3.2 documents were resolved by the generic strategy
and `$ref` siblings were dropped; it was added only in #11090, with a swagger-client bump. It
belongs in PR 1, in `resolveSubtree` and (as for 3.1) `resolve`. Gate: Step 0 prerequisites,
integration-points checklist.

## 10. Build output committed

`dist/` files in the diff. Gate: `DIST`.

## 11. Tests that don't test the behaviour

Cypress specs that only checked that something rendered, for a feature that changes requests;
nested `Map(...)` construction instead of one `fromJS`; new tests in `.js`. Execute Try-it-out
and assert the request; write `.test.ts` / `.cy.ts` (and make Cypress run them). Gate: `NOT-TS`,
review.

## 12. Selector-module hygiene

Every export of a selectors module becomes a registered selector. Memoize derived values with
`createSelector`; guard Immutable values with `Map.isMap`. Gate: review.

## 13. Wrong data source for existing paths

A feature read a `$ref`'d value from `specJson()`: `requestBody.required` had to be read from
`specJsonWithResolvedSubtrees()`, and operation paths had to come from `operationSpecPath`
(#11090). Gate: a fixture where the value is behind a `$ref`.

## 14. Stylelint failures

Upper-case hex colours in SCSS fail `npm run lint-styles`. Gate: `lint-styles`.

## 15. PRs that hold more than one thing

"Basic support" for 3.2 (#10721: 55 files, +2,858 lines, 14 review comments) also shipped the
QUERY method with its styles, `CLAUDE.md` changes and a skill file; #11090 (31 files, +2,445)
bundled a rewrite of a shared test fixture with additionalOperations. Reviewers can't check such a
PR against the spec row by row, and several defects above were found only in follow-up PRs. The
single-feature #11099 (itemSchema, 8 files, +305) is the size to aim for. Basic support is parity
only; every feature, changed field and breaking change gets its own PR; refactors and fixture
rewrites go first, on their own. Gate: the PR plan in the tracking doc, `--scope` coverage, the
scope gate.

## Shipped Late in OAS 3.2

Integration points that were found after the first PR, each now in `integration-points.md`:
version pragma filter props in `layouts/base.jsx` ("Unable to render this definition"); `isOAS3`
not widened (servers and security hidden); `query` missing from `supportedSubmitMethods` (needed
`src/core/config/defaults.js`, `flavors/swagger-ui-react/index.jsx` PropTypes and
`docs/usage/configuration.md`); Path Item `parameters` not inherited by additionalOperations.

## Older Pitfalls Worth Keeping

From the previous version of this skill:

- The wrapper prop is `originalComponent`, not `Ori` (`plugin-patterns.md` section 3).
- A minor version's logic lives in its own plugin; no `isOAS3Y` checks in the parent's files.
- A new OAS meta-schema doesn't mean a new JSON Schema dialect: OAS 3.2 still uses JSON
  Schema 2020-12, like 3.1.
- New HTTP methods go into `OPERATION_METHODS` plus the plugin's `validOperationMethods`
  wrapper, never into the core `validOperationMethods` constant.
