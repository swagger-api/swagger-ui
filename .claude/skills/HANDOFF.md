# Handoff: Rebuilding the Swagger UI AI Workflows (OAS + JSON Schema)

Status as of 2026-10-22. Work was paused partway through. This document has everything needed to
continue without redoing the research.

## Goal

Improve the Claude Code workflows (skills) in this repo, modelled on the ApiDOM skills in
`swagger-api/apidom` (`.claude/skills/`), with two focus areas only:

1. Adding support for a new OpenAPI Specification version (rebuild `add-oas-support`).
2. Delivering standalone JSON Schema rendering in Swagger UI (new skill), as described in the
   Confluence design doc "Standalone JSON Schema" (SHUB space, page 4687691955).

Use the `skill-creator` skill for the authoring and eval format.

## Done

Helper scripts, all tested against `main` and against the PR #10721 state (worktree of `4675ad74`,
base `a398208d`), formatted with the repo's prettier config:

| Script | What it checks |
|--------|----------------|
| `add-oas-support/scripts/check-plugin-conventions.mjs [--base main]` | Branch diff: `DIST` (build output committed), `NOT-TS` (new `.js/.jsx` in src/test; `.cy.ts` that Cypress `specPattern` doesn't run), `PRAGMA` (new file without `@prettier`), `CROSS-IMPORT` (plugin importing another plugin, `core/` alias and relative paths resolved), `HAND-GUARD` (inline `isOAS3x()` instead of the `createOnlyOAS3x*` factories; warning), `CORE-TOUCH` (shared files changed; note). Whole tree: `DIALECT` (`default$schema` pointing at an OAS document schema), `PRESET-ORDER` (newest OpenAPI plugin last in `presets/apis`), `EXPORT` (`oasXY` plugin missing from `SwaggerUI.plugins`). |
| `add-oas-support/scripts/check-field-coverage.mjs <tracking-doc> --plugin <dir>` | Reads the field map (or JSON Schema keyword map) of a tracking doc; every NEW / CHANGED-TYPE row whose Scope isn't "deferred"/"out" must appear in source, a test and a fixture. Comments are stripped. Generic names (`parent`, `kind`) can false-positive. Works for the JSON Schema keyword map too (`Keyword` column). |
| `add-oas-support/scripts/verify-urls.mjs <paths>` or `--diff main` | Ported from ApiDOM: HTTP status and `#anchor` existence. Now scans js/jsx/ts/tsx/mjs too and skips `dist/`. |
| `add-oas-support/scripts/lib/{cli,git}.mjs` | Shared argument parsing and git diff helpers. |

Today, on `main`, `check-plugin-conventions.mjs` reports 2 `DIALECT` errors and 1 `EXPORT` note.
These are real issues (see "Repo issues found" below).

Empty directories have been created locally but are not in git: `add-json-schema-support/{references,evals}`,
`review-spec-support/{references,evals}` and `add-oas-support/{references,evals}`.

The old files are untouched: `add-oas-support.md`, `README.md` and `../SKILL_USAGE_EXAMPLE.md`.
A snapshot of them, for the skill-creator baseline, is in `~/WebstormProjects/swagger-ui-skills-workspace/skill-snapshot/`,
outside the repo.

## Remaining Work

1. **`add-oas-support/SKILL.md`** (under 500 lines, progressive disclosure like ApiDOM's `add-spec-version`).
   Planned flow:
   - **Step 0, prerequisites across repos.**
     - `node_modules/swagger-client/es/resolver/strategies/openapi-3-X-apidom` exists.
     - `@swagger-api/apidom-ns-openapi-3-X` is installed.
     - If either is missing, stop: the work needs ApiDOM (`/add-spec-version` there) and a swagger-client release first.
   - **Preparation.**
     - Pin the latest patch release.
     - Fetch raw spec markdown from `OAI/OpenAPI-Specification` (`versions/X.Y.Z.md`) plus the parent version.
     - Read the "changes" section.
     - Build a field map in an uncommitted `ADD-OAS-{VERSION}.md` at the repo root, with columns Object, Field, Type, Required, Status (NEW / CHANGED-TYPE / REMOVED / INHERITED), UI impact and Scope (PR n / deferred).
     - Checkpoint with the user.
   - **PR 1, "basic support"** (the #10721 shape):
     - `fn` factories and `isOAS3X` detection.
     - `isOAS3` widening wrap-selector.
     - VersionPragmaFilter wrap plus the `layouts/base.jsx` props.
     - OpenAPIVersion badge.
     - JSON Schema 2020-12 wiring: Model/Models wrappers with the **dialect** URL, and the `json-schema-2020-12-extensions` keywords.
     - `after-load` fn routing.
     - Preset LAST.
     - `SwaggerUI.plugins` export.
     - swagger-client resolve strategy in **both** `resolve` and `resolveSubtree` of `swagger-client/index.js`.
     - README compatibility table.
     - Detection tests and an older-version regression test.
   - **PR 2..n, one per feature group** of the field map (the #11090 shape: additionalOperations; #11099: itemSchema).
   - **Gates per PR:**
     - `npm run lint-errors`, `lint-styles` (when scss changes), `test:unit`, the targeted Cypress specs and then `cy:ci`, `build`, `test:artifact`.
     - `check-plugin-conventions` must report 0 errors.
     - `check-field-coverage` on that PR's rows.
     - `verify-urls --diff main`.
     - A fresh-context `/review-spec-support`.
   - Major versions (4.0, Moonwalk) can't wrap 3.x: ask the user how to proceed rather than guessing.
2. **`add-oas-support/references/`**:
   - `field-map-template.md`.
   - `plugin-patterns.md`: real shapes from `src/core/plugins/oas32/{index.js,fn.js}`, and wrap-versus-copy.
   - `integration-points.md`.
   - `testing.md`.
   - `review-lessons.md`: the 14 classes below.
   - Copy every template from a real file and name that file (the ApiDOM README's guidelines 1-2).
3. **`add-json-schema-support/SKILL.md`** plus references:
   - `design-and-delivery.md`
   - `renderer-architecture.md`
   - `keyword-map-template.md`
   - `dialects.md`, with verified meta-schema URLs per draft.

   The facts are in "JSON Schema research" below.
4. **`review-spec-support/SKILL.md`**: a reviewer run in a fresh subagent with only the spec version and branch, the analogue of ApiDOM's `review-ls-changes`. It checks every in-scope field-map row against the spec, the version gating, the regression tests and the integration points, and reports findings with spec citations. Optional: an eval with a planted-defects patch.
5. **Evals.** Use the new case-folder format from skill-creator (`evals/<case>/{prompt.md,case.yaml,graders/}`), with the fixture commit in `case.yaml`. Candidates:
   - OAS 3.2 field map and PR plan at fixture `a398208d`. Assertions come from the review classes, for example "Info.summary is INHERITED from 3.1", "Components.pathItems is INHERITED" and "the dialect URL is `https://spec.openapis.org/oas/3.2/dialect/2025-09-17`".
   - Basic-support plan at `a398208d`.
   - A JSON Schema 2020-12 standalone plan at `main`.
   - An **unseen** case (e.g. OAS 3.3 or JSON Schema Draft 7), so the evals measure generalisation rather than recall.

   Don't run them without asking: they cost a lot of tokens. Record the run plan instead.
6. **Rewrite `README.md`**:
   - Skill layout.
   - The skills.
   - The scripts.
   - The eval table.
   - Development guidelines: TypeScript for new files, not `.jsx`.

   The current README contradicts `CLAUDE.md`.
7. **Remove old files.**
   - Delete `add-oas-support.md` (a flat file, so Claude Code never discovers it as a skill) and `../SKILL_USAGE_EXAMPLE.md` (a fictional OAS 4.0 walkthrough).
   - Update the pointers in `CLAUDE.md`.
   - Before deleting, keep the useful pitfalls 8-14 from the old file's Quick Reference: `originalComponent` versus `Ori`, wrap rather than copy, the `OPERATION_METHODS` rule, and the rule that a new OAS meta-schema doesn't mean a new JSON Schema dialect.
8. Optional: port ApiDOM's `scripts/test/smoke.sh` idea for the three scripts. The `HAND-GUARD` check has only been reasoned about, because the final state of #10721 no longer contains the guards that reviewers flagged.

## Analysis of the ApiDOM Skills (what to carry over)

- **One orchestrator plus focused skills.** Each skill has a short `SKILL.md` with the workflow, rules and checklist, `references/` that are read at named steps, `scripts/` for deterministic gates, and `evals/` that replay real PR reviews.
- **A field map before any code.** Fields come only from the spec's Fixed Fields tables. Every field is classed NEW / CHANGED-TYPE / REMOVED / INHERITED and cross-checked against the parent implementation.
- **Phases gated and stacked.** A phase can't start until the previous one is complete. Every gate combines build, types, lint and tests with the scripts.
- **A review in a fresh subagent** that only knows the spec and the branch, so it doesn't inherit the author's assumptions.
- **README guidelines:**
  - Templates come from real files.
  - Never name a function you haven't checked exists.
  - One rule lives in one place.
  - Prefer a script to a prose check.
  - Every "ask the user" has a fallback.
  - Lessons go into rules, never answers (to keep evals meaningful).

## Review Lessons from the OAS 3.1 / 3.2 PRs

The sources are #10721 (basic OAS 3.2, squash `4675ad74`, before-state `a398208d`), #11090 (additionalOperations, `2f91b75b`, before-state `38ca10e1`) and #10956. OAS 3.1 was about 100 small self-merged PRs on `next` with almost no reviews.

1. **Copying where wrapping would do.** `Info` was copied instead of wrapped. The fix was `wrap-components/info.jsx`, which renders `OAS31Info` through `getComponent`.
2. **Hand-rolled version guards** instead of `createOnlyOAS32SelectorWrapper` / `ComponentWrapper`.
3. **Dead or redundant code:**
   - selectors used only by tests;
   - an `isOAS31` wrap that never runs;
   - a duplicate of `isFixedOperationMethod`.
4. **Parent-version fields listed as new.**
   - `Components.pathItems` was already in 3.1.
   - The oas32 plugin header still calls `info.summary` new in 3.2, but it was added in 3.1.
5. **Global changes leaking into older versions.** `query` was added to the core `validOperationMethods`; it now lives in `src/core/utils/operation-methods.ts` and is version-gated.
6. **Cross-plugin coupling.** The CLAUDE.md rule forbids imports, so modules get copied. Runtime reuse through `getComponent`/`fn`/selectors is fine. Copied bugs must be fixed in every copy (#10764, the stale Model cache).
7. **Wrong dialect/schema URLs.** Not fully fixed yet: see the repo issues below.
8. **The JSON Schema 2020-12 renderer was never wired for 3.2.** The oas31 wrappers are gated on `isOAS31`, so 3.2 fell back to the legacy renderer (fixed in `16f91da1`).
9. **The swagger-client resolve strategy was missing for 3.2.** `$ref` siblings were dropped. Fixed only in #11090.
10. **`dist/` committed.**
11. **Test quality:**
    - Cypress tests should execute Try-it-out, not only check rendering.
    - Use a single `fromJS`.
    - New tests are `.ts`/`.tsx`/`.cy.ts`.
12. **Selector-module hygiene.** Every export of a selectors file gets registered as a selector. Memoize with `createSelector`. Use `Map.isMap`.
13. **Data-source changes for existing paths.** A `$ref`'d requestBody's `required` must be read from `specJsonWithResolvedSubtrees`.
14. **SCSS hex colours must be lowercase**, or `lint-styles` fails.

Also shipped late: VersionPragmaFilter props were missing (so "Unable to render"); `isOAS3` wasn't widened (servers and security hidden); `query` was missing from `supportedSubmitMethods`. That last fix needed `src/core/config/defaults.js`, the PropTypes in `flavors/swagger-ui-react/index.jsx` and `docs/usage/configuration.md`. Path Item `parameters` weren't inherited by additionalOperations.

**flavors/swagger-ui-react** only needs changes for new config values or options. Props are listed explicitly in the destructure, the constructor call and `propTypes`. New plugins, presets or layouts need no change: `presets` always prepends `apis`, and `layout` is already a prop.

## JSON Schema Research

The design doc proposes three things:

- Standalone JSON Schema 2020-12 first. The root schema must have `$schema`.
- The modern renderer (`json-schema-2020-12`) for Draft 7, 2019-09 and 2020-12; the legacy renderer (`json-schema-5`) for Draft 4/5/6.
- Display through a new SwaggerEditor@5 `editor-preview-json-schema` plugin.

There are two delivery plans:

- **Full**: ApiDOM, then SwaggerUI, then SwaggerEditor, about 3.5-4 sprints.
- **MVP**: SwaggerUI plus SwaggerEditor, with ajv validation, about 2 sprints.

Verified facts that correct or sharpen the doc:

- **Unknown keywords already have a catch-all.** `getExtensionKeywords` (`json-schema-2020-12/fn.js:497`) returns every key that isn't in `getSchemaKeywords()` (`fn.js:423`). `ExtensionKeywords` renders them as raw JSON. But the system HOC sets `showExtensionKeywords: configs.showExtensions` (`hoc.jsx:289`), which defaults to `false` (`config/defaults.js:34`), so they're hidden by default. "Arbitrary keyword support" therefore means a per-keyword rendering story, not a catch-all. There is no per-keyword registry: a new keyword needs a component, an entry in `getSchemaKeywords`, and a place in `components/JSONSchema/JSONSchema.jsx`.
- **2020-12 vocabulary coverage.**
  - Core, applicator and unevaluated: all have components.
  - Validation and format keywords mostly appear only as constraint chips (`fn.js:311-388`).
  - `required` only marks listed properties.
- **Gaps for standalone use:**
  - `$ref` is shown as a string, with no resolution.
  - Description is plain text; markdown comes only from the OAS wrapper.
  - Draft 4-7 array-form `items` is probably mishandled (`Items.jsx:26`, not verified at runtime).
  - Draft 7 and 2019-09 keywords (`definitions`, `dependencies`, `additionalItems`, `$recursiveRef`, `$recursiveAnchor`, Draft 4 `id`) would fall into "Extension Keywords".
- **OAS coupling lives in oas31/oas32.**
  - Extra keywords: `discriminator`, `xml`, `externalDocs`, `example`, `$$ref`.
  - Markdown Description.
  - `oas31/after-load.js` replaces `fn.jsonSchema202012.isExpandable` and `getProperties` globally, without an `isOAS31` check. A standalone mode must account for this.
- **The legacy renderer is coupled to OAS selectors.**
  - `specSelectors.findDefinition` and `definitions()`.
  - `object-model.jsx:115-118` renders `allOf`/`anyOf`/`oneOf`/`not` only when `isOAS3()`.
  - Every component needs `specPath` and the layout actions.
  - It knows nothing of Draft 6 keywords (`const`, `contains`, `propertyNames`, `examples`).

  Using it for Draft 6 standalone needs real decoupling. Treat the doc's Draft 6 proposal as an open decision.
- **A `$schema`-only document today** fails every detector. The oas32 VersionPragmaFilter shows "Unable to render this definition". Swagger UI has no JSON Schema detection.
- **SwaggerEditor@5 has no `editor-preview-json-schema` yet.** These already exist:
  - content-type detection for 2020-12 (`editor-content-type/actions.js:197-217`);
  - the selectors `selectIsContentTypeJSONSchema` and `selectIsContentTypeJSONSchema202012`;
  - a fixture and a "Load Example" menu item.

  The AsyncAPI and ADS previews don't use the Swagger UI renderer (the doc is wrong there). They do all run inside one Swagger UI system, so `getComponent("JSONSchema202012")` and `withJSONSchema202012SystemContext` are available. The pattern to copy is `editor-preview-asyncapi`: an `EditorPreview` wrap selected by content type, a `detectContentTypeSuccess` wrap-action, and a preview component switching on parse status. The `swagger-ui-adapter` BaseLayout wrap must also short-circuit JSON Schema.
- **Exports.** `SwaggerUI.plugins` exports JSONSchema202012, JSONSchema202012Samples, JSONSchema5 and JSONSchema5Samples (`src/core/index.js:147-174`). The apis preset already includes JSONSchema202012.
- **Related issues:**
  - #9377 (Draft 4/5 extension rendering as an overridable component)
  - #8513 (decouple the 2020-12 plugin)
  - #8913 (2020-12 keywords in samples)
  - #9380 (JumpToPath)
  - #10584 (self-referential `$ref`)

  None covers standalone JSON Schema itself.
- **ApiDOM already ships the JSON Schema namespaces** (`node_modules/@swagger-api/apidom-ns-json-schema-{draft-4,draft-6,draft-7,2019-09,2020-12}`), but no JSON Schema parser adapters. That matters for the full delivery plan, not for MVP rendering.

## Repo Issues Found (not fixed, outside this task's scope)

1. **The OAS 3.2 `default$schema` is the document schema, not the dialect.**
   - Where: `src/core/plugins/oas32/wrap-components/model.jsx:34` and `models.jsx:32`.
   - Current value: `https://spec.openapis.org/oas/3.2/schema/2025-09-17`.
   - Correct value: the dialect `https://spec.openapis.org/oas/3.2/dialect/2025-09-17`, verified to return HTTP 200.
   - oas31 uses `.../oas/3.1/dialect/base`.
2. **Cypress `.cy.ts` specs never run.** `cypress.config.js` has `specPattern: "test/e2e-cypress/e2e/**/*.cy.{js,jsx}"`, while `CLAUDE.md` requires new specs to be `.cy.ts`.
3. **`OpenAPI32` is missing from `SwaggerUI.plugins`** in `src/core/index.js`. `OpenAPI31` is there.
4. **The `resolve` strategies lack `openApi32ApiDOMResolveStrategy`.** In `src/core/plugins/swagger-client/index.js`, `resolve` (around line 20) doesn't list it; only `resolveSubtree` (line 35) does. This may be intentional; verify before fixing.
5. **Duplicate `oas32-query-operation.cy.js` specs.** They exist in both `test/e2e-cypress/e2e/features/` and `features/oas32/`. OAS 3.2 specs are spread across three directories.
6. **The oas32 plugin header (`index.js`) lists `info.summary` as new in 3.2**, but it was added in OAS 3.1.
7. **Two docs are stale.**
   - `CLAUDE.md` "OpenAPI Specification Compatibility" still says support goes up to 3.1.
   - `.claude/skills/README.md` says new files use `.jsx`.
