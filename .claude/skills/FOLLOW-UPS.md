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
4. **Cypress never runs `.cy.ts` specs**, while `CLAUDE.md` requires new specs to be `.cy.ts`:
   `cypress.config.js` has `specPattern: "test/e2e-cypress/e2e/**/*.cy.{js,jsx}"`. The first
   TypeScript spec must extend it (and may need a Cypress TypeScript setup). `NOT-TS` reports it.
5. **`resolve` lacks the OAS 3.2 strategy.** `src/core/plugins/swagger-client/index.js` lists
   `openApi32ApiDOMResolveStrategy` only in `resolveSubtree`. `fn.resolve` is used by the
   deprecated `specActions.resolveSpec` and by plugins calling `system.fn.resolve`, so the impact
   is limited, but 3.1's strategy is in both lists.
6. **The oas32 plugin header lists `info.summary` as new in 3.2**
   (`src/core/plugins/oas32/index.js`); it came with OAS 3.1.
7. **OAS 3.2 Cypress specs are spread over three directories** (`e2e/features/`,
   `e2e/features/oas32/`, `e2e/features/plugins/oas32/`), and `oas32-query-operation.cy.js` exists
   in the first two.
8. **OAS 3.2 parity copies drift.** `test/e2e-cypress/e2e/features/plugins/oas32/oas32-schema-expansion.cy.js`
   mirrors the oas31 spec but lacks its "re-expand a collapsed nested property" test.
9. **`CLAUDE.md` is stale on versions**: "OpenAPI Specification Compatibility" says support goes up
   to 3.1.x and v5.31.0, and the plugin count and file counts are out of date.

## Open Work on the Skills

1. **Trigger optimisation** of the three descriptions with skill-creator's `run_loop`. The
   near-misses to include: a bug fix in an OAS 3.1 component (not add-oas-support), a JSON Schema
   keyword inside an OAS Schema Object (add-oas-support or a plain fix, not
   add-json-schema-support), ApiDOM work (the ApiDOM skills).
2. **The major-version branch of `/add-oas-support` has no eval with a real target.** OAS 4.0
   (Moonwalk) has no release and only a non-consensus draft without Fixed Fields tables; the
   2.0 → 3.0 dry run was dropped because the answers are in the repository (the oas3 plugin) and
   don't carry over to 4.0. When a 4.0 draft with object tables appears, add a preview case
   against it (`diff-spec-versions.mjs 3.x.y <draft>`), and revisit the "Variants" rules for a
   major with its actual structure.
