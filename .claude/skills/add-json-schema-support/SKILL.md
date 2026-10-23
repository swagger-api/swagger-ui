---
name: add-json-schema-support
description: Plans and delivers rendering of standalone JSON Schema documents in Swagger UI (a document whose root has `$schema` and no `openapi`/`swagger` field), starting with JSON Schema 2020-12 and extending to 2019-09, Draft 7, Draft 6 and Draft 4/5, as in the "Standalone JSON Schema" design doc. Builds a per-draft keyword map against the existing json-schema-2020-12 renderer, settles the design decisions (delivery plan, renderer per draft, where it displays, $ref resolution) with the user, then implements detection, a dialect-configured renderer instance and keyword components in version-gated PRs with lint, unit, Cypress, build and coverage gates. Use whenever someone wants Swagger UI or SwaggerEditor to show, preview, detect or render a JSON Schema document or a specific draft, asks what standalone JSON Schema support would take, or asks to support a JSON Schema keyword outside an OpenAPI document - even if they don't name this skill. Not for Schema Objects inside OpenAPI documents (that is add-oas-support).
---

# Add Standalone JSON Schema Support

Swagger UI renders JSON Schema only as part of OpenAPI documents today: the
`json-schema-2020-12` renderer for OAS 3.1/3.2 Schema Objects, the legacy `json-schema-5`
renderer for OAS 2.0/3.0. Nothing detects a JSON Schema document; one with just `$schema` gets
"Unable to render this definition". This skill delivers standalone rendering per draft. The
design doc, its two delivery plans and the corrections the code forces on it are in
`references/design-and-delivery.md`.

The work spans repositories. This skill owns the Swagger UI part and plans the rest:

| Repository | Part |
|------------|------|
| swagger-ui | detection, document component, dialect-configured renderer, keyword components |
| swagger-editor (`main`, v5) | content-type detection per draft, `editor-preview-json-schema` |
| apidom | parser adapters and reference support per draft (Full plan only), via its `/add-spec-version` |

## Bundled Tools

| Tool | Use |
|------|-----|
| `references/design-and-delivery.md` | Design doc proposals, delivery plans, ownership, and the decisions to put to the user. Read at Step 1. |
| `references/dialects.md` | Verified meta-schema identifiers, specification URLs per draft, OAS dialect ids, SwaggerEditor detection. Read at Step 2. |
| `references/renderer-architecture.md` | How the 2020-12 renderer is built and configured per instance, the steps to add a keyword, where OpenAPI is coupled in, the legacy renderer, gaps for standalone documents. Read before Step 3 and before writing code. |
| `references/keyword-map-template.md` | Tracking document and keyword map. Read at Step 3. |
| `../add-oas-support/scripts/check-field-coverage.mjs <doc> --plugin <dir>` | Every in-scope `NEW` / `CHANGED-SHAPE` / `RENAMED` keyword appears in source, a test and a fixture. |
| `../add-oas-support/scripts/check-plugin-conventions.mjs` | TypeScript, pragma, cross-plugin imports, committed `dist/`. The OAS-specific checks don't apply. |
| `../add-oas-support/scripts/verify-urls.mjs` | URLs and anchors. |

Run scripts from the repository root: `node .claude/skills/add-oas-support/scripts/<script>`.
Project conventions are in `CLAUDE.md` (TypeScript for new files, `@prettier`, no cross-plugin
imports); they apply throughout.

## Step 0: Where to Start

1. Identify the draft (or drafts) requested. With none named, the first is 2020-12: the
   renderer exists for it, and SwaggerEditor already detects it.
2. If `ADD-JSON-SCHEMA-{DRAFT}.md` exists at the repo root, read it and continue from its PR
   table. Earlier drafts are done when their PRs are merged; a later draft builds on the
   detection and document component of the first, so do drafts in order.
3. A request about a JSON Schema keyword inside an OpenAPI Schema Object is OAS work: use
   `/add-oas-support` (or a plain bug fix) instead.

## Step 1: Decisions

Read `references/design-and-delivery.md`. Its "Decisions for the User" change what gets built
(a legacy-renderer route and a 2020-12-instance route share almost no code), so put them to the
user, each with your recommendation and the facts behind it, before planning PRs or writing
code. When the request is research only (a keyword map, an assessment), record them as open in
the tracking doc and continue; the research usually sharpens the recommendations. As a subagent,
record them as open, plan with your recommendations, say so, and stop before code. Don't answer
them silently: they include public behaviour (the `apis` preset) and multi-sprint scope.

## Step 2: Research the Draft

1. From `references/dialects.md`, take the draft's meta-schema identifier, its specification
   documents and its meta-schema(s). Fetch the meta-schema JSON and the specification text. For
   a draft not in that file, find the identifier in the meta-schema's own `$id`, verify it with
   `verify-urls.mjs`, and add a row.
2. List the draft's keywords: from 2019-09 on, the `properties` of each vocabulary meta-schema;
   before that, the single meta-schema's `properties`, confirmed against the keyword sections of
   the specifications. The specification text decides value shape and meaning.
3. Read the draft's change appendix relative to its neighbours for renames, splits and removals.
4. Check the reference strategies: which swagger-client strategy would resolve a document of
   this draft (`src/core/plugins/swagger-client/index.js`), and what it does with `$id`,
   `$anchor` and the draft's dynamic references.

## Step 3: Keyword Map and PR Plan

1. Build the keyword map in `ADD-JSON-SCHEMA-{DRAFT}.md` per
   `references/keyword-map-template.md`: every keyword of the draft, plus every 2020-12 keyword
   the draft lacks (`NOT-IN-DRAFT`), each with its baseline behaviour in the current renderer.
   Determine the baseline from the code (`getSchemaKeywords()` in
   `src/core/plugins/json-schema-2020-12/fn.js`, the keyword components, `JSONSchema.jsx`), and
   say where you inferred rather than ran it.
2. Pay most attention to `CHANGED-SHAPE` rows: a keyword with the same name and a different
   shape or meaning renders wrong without any error, because every 2020-12 component assumes
   the 2020-12 shape. Compare each `SAME` candidate's definition text in both specifications,
   not just its name.
3. Plan PRs: PR 1 is detection plus the document component plus the dialect instance with
   `SAME` keywords only; then one PR per group of `NEW`/`CHANGED-SHAPE`/`RENAMED` rows that share
   components. SwaggerEditor and ApiDOM work gets its own entries, marked with the repository.
4. **Checkpoint**: show the user the non-`SAME` rows, the decisions and the PR plan, and get
   confirmation before code. As a subagent, stop here with the tracking doc written.

## Step 4: PR 1, Detection and Document

Read `references/renderer-architecture.md` sections 1, 4 and 6 first.

- [ ] A new plugin under `src/core/plugins/` (name per decision 7), TypeScript.
- [ ] Detection of the root `$schema` per `dialects.md` (empty-fragment normalisation, Draft 4/5
      as one dialect, no `openapi`/`swagger` field), as an exported pure function with unit
      tests for every identifier variant and for OAS documents (which must not match).
- [ ] A document component that renders the root schema through `withJSONSchema202012Context`
      (or the system HOC) with this dialect's `overrides`: its keyword list, its components and
      `default$schema` = the meta-schema identifier. It must not take the OAS `fn` overrides
      (`renderer-architecture.md` section 4).
- [ ] Display path per decision 4: the SwaggerEditor preview needs only the component; a
      `SwaggerUI({ url })` path also needs the layout and version pragma filter to let the
      document through.
- [ ] Registration in `SwaggerUI.plugins`, and in the `apis` preset only if decision 4 says so.
- [ ] Tests: detection units; a Cypress spec loading a fixture of this draft that asserts the
      renderer output; a regression spec that OAS 3.0/3.1/3.2 documents (including ones whose
      Schema Objects carry `$schema`) render exactly as before.

## Step 5: Keyword PRs

For each group of rows (`renderer-architecture.md` section 2 lists every place a keyword lives):

1. Implement the rows' components and list entries in the dialect instance (its `overrides`),
   not in `getSchemaKeywords()` or the shared 2020-12 components, unless the change is correct
   for OAS 3.1/3.2 too and the user agreed to change OAS rendering.
2. `CHANGED-SHAPE` rows get dialect components; the 2020-12 component stays untouched.
3. `NOT-IN-DRAFT` rows: dropping the name from the instance's keyword list only makes it
   eligible for `ExtensionKeywords`; `JSONSchema.jsx` still calls every keyword component, and
   e.g. `PrefixItems.jsx` reads `schema.prefixItems` without consulting that list. So also
   override the component (or its `fn`) in the dialect instance with one that renders nothing
   for the keyword, and add a Cypress assertion that the 2020-12 rendering is absent.
4. Fixture keys for every in-scope row; a Cypress assertion for every row whose target
   behaviour is visible.
5. Mark the rows done in the tracking doc.

## Gates (every PR)

1. `npm run lint-errors`, `npm run type-check`, `npm run lint-styles` when `.scss` changed.
2. `npm run test:unit`.
3. The PR's Cypress specs, then `npm run cy:ci` (the regression spec proves OAS rendering is
   unchanged).
4. `npm run build`, `npm run test:artifact`.
5. `check-plugin-conventions.mjs`: 0 errors (DIALECT only inspects files this PR changed, so
   findings already on `main`, such as the oas32 Model/Models URLs, don't count against it). `.cy.ts` specs need `cypress.config.js`'s
   `specPattern` extended in the same PR.
6. `check-field-coverage.mjs ADD-JSON-SCHEMA-{DRAFT}.md --plugin src/core/plugins/{plugin} --scope "PR n"`:
   0 gaps for this PR's rows (a scope with only `SAME` / `NOT-IN-DRAFT` rows, such as the
   detection PR, reports `n/a` and exits 0); generic keyword names (`type`, `items`, `format`) need a manual
   look, because they match unrelated code.
7. `verify-urls.mjs --diff main`: 0 `BROKEN`.
8. A fresh-context review: run `/review-spec-support` in a subagent with only the draft, the
   branch and the PR's rows.
9. No `dist/` or `ADD-*.md` staged.

## Hand-off

Report the PRs (branch, URL, state, gates), the decisions taken and by whom, rows `deferred` or
`out` with reasons, and the SwaggerEditor and ApiDOM work items with their repositories. Pushing
and opening PRs are outward-facing: confirm each with the user.
