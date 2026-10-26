---
name: add-oas-support
description: Adds support for a new OpenAPI Specification version to Swagger UI (patch, minor such as 3.3, or major such as 4.0) in phases that keep every pull request reviewable - an investigation that diffs the new version's Fixed Fields tables against the previous version (bundled script) into a field map with a backward-compatibility classification; a basic-support PR that gives new-version documents everything the previous version had and nothing new; then one PR per new feature and per breaking change. Checks swagger-client/ApiDOM prerequisites first and gates every PR with lint, unit, Playwright, build, coverage, convention and URL checks plus a fresh-context spec review. Use whenever someone wants Swagger UI to support, render or detect an OpenAPI version, plan or continue that work, asks what changed between OAS versions and what it means for Swagger UI, or wants one new field of a recent version implemented (e.g. "render itemSchema"), even if they don't name this skill.
---

# Add OpenAPI Specification Version Support

A new OAS version reaches users through stacked work: ApiDOM namespaces, a swagger-client
resolve strategy, then Swagger UI. This skill covers Swagger UI, in phases sized for review.

| Phase | Output | PR |
|-------|--------|----|
| 0 Prerequisites | the version is released and swagger-client can resolve it | - |
| 1 Investigation | `ADD-OAS-{X.Y}.md`: version diff, field map, compatibility, one PR per feature | - (user checkpoint) |
| 2 Basic support | documents of the new version get everything the previous version had | PR 1 |
| 3 Features | one PR per new feature, per changed field and (major) per breaking change | PR 2..n |

Why phases: the OAS 3.2 "basic support" PR (#10721) was 55 files and 2,858 added lines because it
also shipped the QUERY method, styles and docs, and drew 14 review comments; additionalOperations
(#11090) was 31 files and 2,445 lines, most of them a rewrite of a shared test fixture
(`test/unit/core/plugins/spec/assets/petstore.json`). The single-feature itemSchema PR
(#11099) was 8 files and 305 lines. Reviewers can check a PR against the spec only when it holds
one thing.

**Rules for every phase**

- A phase starts when the previous one is complete. Phase 1 is complete when the user confirmed
  the plan; PR 1 when it's open (feature branches stack on it) or merged.
- **Basic support adds no new feature.** If a new-version document would break without some
  change, that change is part of parity (below); everything else waits for its own PR.
- **One feature per PR.** A feature is one field-map row, or rows the spec defines as one unit
  that can't ship apart (a new object and the field that introduces it, a new OAuth flow and its
  URL field). Record why rows are grouped. A refactor or a shared-fixture rewrite that a feature
  needs is its own PR before the feature.
- The defect classes past reviews kept finding are in `references/review-lessons.md`; the gates
  exist to catch them in the PR that introduces them.

## Bundled Tools

Run from the repository root: `node .claude/skills/add-oas-support/scripts/<script> --help`.

| Tool | Use |
|------|-----|
| `scripts/diff-spec-versions.mjs <old> <new> [--rename "A Object=B Object"]` | Phase 1. Field-level diff of two versions' Fixed/Patterned Fields tables (fetched by version number or read from files): `NEW`, `REMOVED` (with a "moved?" hint), `CHANGED-TYPE`, `CHANGED-REQUIRED`, `REVIEW` (description changed; added and removed value tokens listed), as a draft field map. |
| `scripts/check-field-coverage.mjs <tracking-doc> --plugin <dir> [--scope "PR n"]` | Every in-scope `NEW` / `CHANGED-TYPE` / `MOVED` row appears in source, a test and a fixture; `--scope` limits it to one PR's rows. A hit is not proof of correct rendering; a miss is proof of a gap. Generic names (`in`, `kind`, `parent`) need a manual check. |
| `scripts/check-plugin-conventions.mjs [--base main]` | Branch diff: committed build output (`DIST`), new `.js/.jsx` (`NOT-TS`), missing `@prettier` (`PRAGMA`), plugin importing another plugin (`CROSS-IMPORT`), inline `isOAS3x()` guards (`HAND-GUARD`, warning), shared files touched (`CORE-TOUCH`, note). Whole tree: `DIALECT`, `PRESET-ORDER`, `EXPORT`. Exit 1 on errors. |
| `scripts/verify-urls.mjs <paths>` or `--diff main` | HTTP status and `#anchor` existence of every URL. `BROKEN` fails the gate. |
| `references/field-map-template.md` | Tracking document, field map, compatibility and PR plan. Read at Phase 1 step 3. |
| `references/plugin-patterns.md` | Real shapes of the version plugin and when to wrap versus copy. Read before writing plugin code. |
| `references/integration-points.md` | Files outside the new plugin that a version or feature touches. Read for PR 1 and for any feature that changes shared behaviour. |
| `references/testing.md` | Unit, Playwright and parity tests, fixtures. Read before writing tests. |
| `references/review-lessons.md` | Defect classes from past reviews. Read before the first PR. |

Project conventions (TypeScript for new files, `@prettier` pragma, no semicolons, double quotes,
no cross-plugin imports, Conventional Commits) are in `CLAUDE.md` and apply throughout.

## Phase 0: Where to Start (every invocation)

1. **Version and variant.** Take the requested version line and the previous one Swagger UI
   supports (the parent: the newest 3.x line for a minor, the last line of the previous major for
   a major). Classify it; the variants table under "Variants" says how each phase applies.
2. **Pin the version.** List the released versions
   (`https://api.github.com/repos/OAI/OpenAPI-Specification/contents/versions`; `*-editors.md`
   files are not releases) and target the latest patch of the line. A line can get a patch
   release while work is in progress; the newest patch's text is the reference for the whole
   line. If the line has no release, stop before any PR and say so. Then look for drafts: the
   `v*-dev` branches of `OAI/OpenAPI-Specification` (each has the next version's text in
   `src/oas.md`) and, for a new major, its working-group repository. Report which version is
   actually in development and how settled its draft is (last commits, status notes, whether it
   has Fixed Fields tables yet). A draft with tables can get a **preview** of Phase 1
   (`diff-spec-versions.mjs {latest release} <downloaded src/oas.md>`), so upcoming work is
   visible early; it never becomes a PR until the release, because drafts change.
3. **Prerequisites** (minor and major). Swagger UI resolves documents through swagger-client,
   whose resolve strategy for the version is built on ApiDOM's namespace for it:
   ```bash
   # installed (needs node_modules; otherwise use the pinned version from package-lock.json)
   ls node_modules/swagger-client/es/resolver/strategies/ | grep openapi-X-Y-apidom
   # released: does the latest swagger-client ship it?
   curl -sL "$(npm view swagger-client@latest dist.tarball)" | tar -tz | grep -c "es/resolver/strategies/openapi-X-Y-apidom/"
   # is the ApiDOM namespace published at all?
   npm view @swagger-api/apidom-ns-openapi-X-Y version
   ```
   - Installed: nothing to do.
   - Not installed, but released: PR 1 bumps `swagger-client` to the first release that ships
     the strategy (`references/integration-points.md`); find it by listing earlier versions'
     tarballs.
   - Not released: **stop** before PR 1. The version first needs ApiDOM support
     (`/add-spec-version` in `swagger-api/apidom`) when the namespace isn't published, then a
     swagger-client release with the strategy. Report what is missing and which repository owns
     it; don't stub the strategy in Swagger UI. Phase 1 can still run; offer it.

   Say which way you checked (installed tree, lockfile, registry).
4. **Resume or start.** If `ADD-OAS-{X.Y}.md` exists at the repo root, read it: it holds the field
   map, the PR plan and the gate log. Check which of its PRs are merged
   (`git log main --oneline -- src/core/plugins/oas3Y`) or open (`gh pr list --search "oas3Y"`,
   or the GitHub API when `gh` is absent), and continue with the first PR that isn't. Without a
   tracking doc, do Phase 1 before any code, even when the user asks for one feature: the field
   map tells you whether the feature is really new and what else it touches.

## Variants

| Variant | Phase 1 | Phase 2: basic support | Phase 3 |
|---------|---------|------------------------|---------|
| Patch (`3.Y.0` → `3.Y.1`) | diff against the previous patch; expect no `NEW` / `CHANGED-*` rows (patches clarify text), and raise any with the user | one small PR: README compatibility table, a detection test or fixture with the new patch version, URLs (the dialect id named in the text and the published ids can change) | none expected |
| Minor (`3.2` → `3.3`) | diff against the parent's latest patch | a new `oas3Y` plugin that wraps the parent's: every feature the parent version offers works for 3.Y documents | one PR per `NEW` feature and per `CHANGED-*` field |
| Major (`3.x` → `4.0`) | diff against the last 3.x patch (`--rename` for renamed objects) plus the compatibility classification (Phase 1 step 6) | a new plugin that renders the **backward-compatible** part with the previous major's components; breaking parts are left out (not rendered with the old meaning) until their PR | one PR per breaking change, then one per new feature |

For a major, the plugin's structure (wrap the 3.x plugin for the compatible part, or a new base
it borrows from at runtime through `getComponent`) follows from how much is compatible; put the
choice and your recommendation to the user at the Phase 1 checkpoint. Two things are different
from a minor:

- The 3.x code is wired through `isOAS3()` (servers, callbacks, request bodies, responses, OAuth2
  flows; `references/plugin-patterns.md` section 4). Widening it for the new major makes all of
  that render the new documents with 3.x meaning, so widen it only if every object it gates is
  compatible, and otherwise give the compatible parts their own version-gated wrappers.
- A major may change the document format itself. If `diff-spec-versions.mjs` exits 2 ("no Fixed
  Fields tables found"), the spec defines its objects differently: build the field map by hand
  from its object definitions, and expect the compatibility table to be mostly "no".

## Phase 1: Investigation and Version Diff

Done once per version line, before any code. The tracking doc stays uncommitted.

1. **Diff the tables.**
   ```bash
   node .claude/skills/add-oas-support/scripts/diff-spec-versions.mjs {parent x.y.z} {new x.y.z} > /tmp/oas-diff.md
   ```
   For a major, add `--rename "{Old} Object={New} Object"` for every object that was renamed
   (find them in the objects table: a `REMOVED` and a `NEW` object with the same role), and rerun.
   The diff covers the tables only; prose changes need step 2.
2. **Read what changed** in the raw markdown of both versions
   (`https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/{x.y.z}.md`) and the
   release notes (`https://github.com/OAI/OpenAPI-Specification/releases`): removals, renames,
   new MUSTs, changed defaults, and value sets described outside the tables. Summaries and blog
   posts miss or invent fields; the Fixed Fields tables and the spec text are the source.
3. **Build the field map** in `ADD-OAS-{X.Y}.md` per `references/field-map-template.md`, starting
   from the diff's draft:
   - Triage every `REVIEW` row: a wording change is `INHERITED`; a changed meaning or a widened or
     narrowed value set (the diff lists added and removed tokens) is `CHANGED-TYPE`.
   - Pair `REMOVED` rows with the `NEW` rows that replace them as `MOVED` (the "moved?" hint and
     step 2 point at candidates).
   - Add rows for the prose changes of step 2.
4. **Cross-check every `NEW` row against Swagger UI**
   (`grep -rn "{field}" src/core/plugins/oas3{P} src/core/plugins/oas3 src/core/components`): a
   field the parent version already had is `INHERITED`, even if a changelog or an old code comment
   calls it new.
5. **UI impact** for every non-`INHERITED` row: the component that renders it, or the request part
   it changes (method, URL, parameters, body, headers, security). A row with no UI impact gets
   Scope `out` with the reason.
6. **Compatibility** (Breaking column, every non-`INHERITED` row): would a document written for
   the parent version still be valid, and render with the same meaning? `NEW` rows and widened
   value sets are compatible extensions; `REMOVED`, `MOVED`, narrowed value sets and changed
   meanings are breaking. In a minor or a patch every row should be compatible; a breaking row
   there is a finding to raise with the user. For a major, also list the compatible objects: they
   are what basic support renders.
7. **JSON Schema.** Note the Schema Object's base JSON Schema draft for both versions. A new OAS
   document schema doesn't mean a new JSON Schema dialect. Only a changed draft needs renderer
   work (`/add-json-schema-support`), and this version then waits for it.
8. **URLs.** Record every external URL the code or docs will contain: the Schema Object dialect id
   (the plugin's `default$schema`), the OAS document schema id, the spec's HTML anchor base. Take
   the dialect id from the spec text (`#dialect-schema-id`) **and** the published list at
   `https://spec.openapis.org/oas/`; they can disagree (errata get fixed in later patches), and
   then you record both and let the user decide. Never derive a URL from a pattern. Run
   `verify-urls.mjs ADD-OAS-{X.Y}.md`.
9. **PR plan.** PR 1 is basic support. Then one PR per feature (rules above), each with its
   field-map rows in the Scope column (`PR 2`, `PR 3`...). Order: refactors a feature needs,
   breaking changes (major), then features, each after the ones it depends on (a new operation
   method before features that list operations).
10. **Checkpoint.** Show the user the non-`INHERITED` rows with their Breaking value, the
    `INHERITED` rows you demoted from "new", the URLs, the PR plan and (major) the plugin
    structure question, and get confirmation before writing code. As a subagent, write it all
    into the tracking doc and stop there.

## Phase 2: Basic Support (PR 1)

Parity: a document of the new version gets every feature a document of the parent version gets,
through the parent's code. Nothing in this PR implements a `NEW` row; the plan's feature PRs do.
Read `references/plugin-patterns.md` and `references/integration-points.md` first; every item has
a template there, copied from the oas32 plugin, and every new file is TypeScript.

- [ ] `src/core/plugins/oas3Y/fn.tsx`: `isOAS3Y` (any patch number, no leading zeros, nothing
      else), `createOnlyOAS3YSelector`, `createOnlyOAS3YSelectorWrapper`,
      `createOnlyOAS3YComponentWrapper`, `wrapOAS3YFn`, `createSystemSelector`.
- [ ] Detection selector `isOAS3Y` registered through `createSystemSelector`.
- [ ] `isOAS3` wrap-selector widened for 3.Y (servers, callbacks, request bodies, responses and
      OAuth2 flows render only when it's true).
- [ ] Version pragma filter: a component that knows `isOAS3Y`, a wrapper, and in
      `src/core/components/layouts/base.jsx` the `isOAS3Y` prop (without it: "Unable to render
      this definition") and the webhooks condition.
- [ ] Every parent wrapper gated on the parent version gets a 3.Y counterpart that reuses the
      parent's component: `OpenAPIVersion` badge, Info, Contact, License
      (`getComponent("OAS3{P}Info", true)` etc., not copies). List the parent's `wrapComponents`
      and `wrapSelectors` in its `index.js` and account for each.
- [ ] JSON Schema 2020-12 renderer for 3.Y: `Model` and `Models` wrappers with
      `withJSONSchema202012SystemContext` and `default$schema` = the dialect id from Phase 1 step
      8, plus the plugin's own `json-schema-2020-12-extensions`. Without it 3.Y schemas fall back
      to the legacy renderer.
- [ ] `after-load`: route sample generation, `isFileUploadIntended` and `hasSchemaType` through
      `wrapOAS3YFn`.
- [ ] Plugin registered **last** in `src/core/presets/apis/index.js`, exported as `OpenAPI3Y` in
      `SwaggerUI.plugins` (`src/core/index.js`).
- [ ] swagger-client resolve strategy `openApi3YApiDOMResolveStrategy` in **both** `resolve` and
      `resolveSubtree` of `src/core/plugins/swagger-client/index.js`, newest first (plus the
      `swagger-client` bump when Phase 0 needed one).
- [ ] README compatibility table and the supported-versions text in the version pragma messages.
- [ ] Tests (`references/testing.md`): detection unit tests, and **parity specs**: the parent's
      feature fixtures with the new version number render as they do for the parent version.

For a major, the checklist is the same for the compatible part; each breaking object stays out of
the UI (or behind a notice) until its PR, and a test shows it isn't rendered with the old meaning.

## Phase 3: Feature PRs (PR 2..n)

One PR per feature in plan order.

1. Re-read the feature's rows in the spec (not only in the tracking doc): types, value sets,
   defaults, MUST/SHOULD wording, interactions with existing fields (e.g. Path Item `parameters`
   apply to every operation of the Path Item, including new kinds of operation).
2. Implement inside `src/core/plugins/oas3Y/` with the version-gated factories. When shared code
   must change (a core util, a `spec` selector, a component in `src/core/components/`), gate the
   new behaviour at the call site and prove older versions are unaffected with a test
   (`CORE-TOUCH` lists these files).
3. Read data that may come from a `$ref` through `specJsonWithResolvedSubtrees`, not `specJson`.
4. A new configuration value (e.g. a new method in `supportedSubmitMethods`) changes
   `src/core/config/defaults.js`, `docs/usage/configuration.md` and the explicitly listed props and
   PropTypes in `flavors/swagger-ui-react/index.jsx`.
5. A breaking change (major): render the new structure for the new version only, and test that
   both a parent-version document and a new-version document render with their own meaning.
6. Tests: unit tests for selectors and fns, and a Playwright spec that **executes** Try-it-out for
   anything that changes a request, asserting the request with `page.route`.
7. If the PR grows a second feature, split it. Mark the rows done in the tracking doc.

## Gates (every PR, in order)

1. `npm run lint-errors`; `npm run type-check`; `npm run lint-styles` when `.scss` changed (hex
   colours lowercase).
2. `npm run test:unit`.
3. Targeted Playwright specs, then the full suite (both start the dev server themselves):
   ```bash
   npm run e2e -- <spec>
   npm run e2e
   npm run e2e:typecheck
   ```
4. `npm run build` and `npm run test:artifact`.
5. `check-plugin-conventions.mjs`: 0 errors; every `HAND-GUARD` warning fixed or justified, every
   `CORE-TOUCH` file covered by an older-version test. `DIALECT`/`EXPORT` findings that predate the
   branch are reported to the user, not silently fixed in an unrelated PR.
6. `check-field-coverage.mjs ADD-OAS-{X.Y}.md --plugin src/core/plugins/oas3Y --scope "PR n"`:
   0 gaps for this PR's rows (PR 1 has none: parity only); check generic field names by hand.
7. **Scope**: the diff implements this PR's rows and nothing else (`git diff --stat main...HEAD`
   names only files the rows need, plus tests); PR 1 implements no `NEW` row.
8. `verify-urls.mjs --diff main`: 0 `BROKEN`.
9. Run `/review-spec-support` in a **fresh subagent** that gets only the spec version, the branch
   and this PR's rows, so it reviews against the spec rather than against what was just written.
   Fix every finding or record why it doesn't apply.
10. `git status` shows no `dist/` or `ADD-OAS-*.md` staged.

Record each gate's result in the tracking doc's gate log.

## Hand-off

Report per PR: branch, URL and state, gate results, and the field-map rows that are `deferred` or
`out` with their reasons. List any `UNVERIFIED` URLs and pre-existing problems the scripts
reported. Pushing, opening PRs and force-pushing are outward-facing: confirm each with the user.

## Working Notes

- Branches: `feat/oas3Y-basic-support`, then `feat/oas3Y-{feature}` from `main`, or from PR 1's
  branch while it's open (rebase onto `main` after it merges). When a gate fails, fix it on the
  branch that introduced the problem; stacked branches copy its mistakes.
- Independent features can be implemented by parallel subagents, each given its rows of the field
  map and this skill.
- Fixing a bug in code that was copied between plugins means fixing every copy (#10764 fixed the
  stale Model cache in both oas31 and oas32).
