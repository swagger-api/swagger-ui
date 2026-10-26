---
name: review-spec-support
description: Reviews a Swagger UI branch or PR that adds OpenAPI version support or a new OAS field (oas3x plugins) or standalone JSON Schema rendering, against the official specification rather than against the author's intent - checks that the PR holds one thing (basic support with parity only, or one feature or breaking change), that every in-scope field or keyword is implemented with the spec's type and semantics, that fields presented as new really are new, version gating (older versions unaffected), integration points (detection, pragma filter, isOAS3, renderer wiring, resolve strategy, preset, exports, config), dialect and schema URLs, and test quality, then reports findings with a spec citation each. Use for "review my OAS 3.x branch", "check this PR against the spec", "is this field implemented correctly", and as the fresh-context review gate of add-oas-support and add-json-schema-support, even if the user doesn't name this skill.
---

# Review Spec Support

A reviewer that knows only the spec, the version and the branch. It's meant to run in a fresh
subagent so that it doesn't inherit the author's assumptions: the reviews of OAS 3.2 found
fields that were "new" only in the author's head, features wired for the parent version but not
the new one, and tests that passed without exercising the change.

The defect classes this review hunts are listed, with the evidence for each, in
`../add-oas-support/references/review-lessons.md`. Read it before Phase 3.

## Inputs

Infer what you can and state what you inferred at the top of the report. Ask only when running
interactively and something can't be inferred.

| Input | Default source |
|-------|----------------|
| Kind | OAS version (`src/core/plugins/oas3x` in the diff) or JSON Schema draft (a JSON Schema plugin, `ADD-JSON-SCHEMA-*.md`) |
| Version or draft | branch name, plugin name, tracking doc |
| Branch and base | current branch, `main` |
| Scope | the PR's rows of the tracking doc (`ADD-OAS-*.md` / `ADD-JSON-SCHEMA-*.md`) if one exists; otherwise every field the diff touches |

Treat the tracking doc as the author's claim, not as truth: its field map is one of the things
under review.

## Phase 1: The Spec, Independently

Build your own list of what the version requires before reading the implementation.

- **OAS**: diff the version's latest patch against its parent's (list the files with
  `https://api.github.com/repos/OAI/OpenAPI-Specification/contents/versions`):
  ```bash
  node .claude/skills/add-oas-support/scripts/diff-spec-versions.mjs {parent x.y.z} {x.y.z}
  ```
  It reads both versions' Fixed Fields tables and lists `NEW`, `REMOVED`, `CHANGED-TYPE`,
  `CHANGED-REQUIRED` and `REVIEW` rows (a changed description, with added and removed value
  tokens). For each object in scope, read the rows in the raw markdown
  (`https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/{x.y.z}.md`) to
  quote them, and triage the `REVIEW` rows yourself. Record per field: name, type (including
  allowed values and formats), required, status, and whether a parent-version document keeps its
  meaning (breaking or not).
- **JSON Schema**: use `../add-json-schema-support/references/dialects.md` for the draft's
  specification documents and meta-schemas. Keywords come from the vocabulary meta-schemas
  (2019-09 on) or the single meta-schema, and their shape and meaning from the specification
  text.

Every finding later quotes a row or sentence from this phase. A finding without a quote from the
spec is not admissible: drop it or mark it as a question.

## Phase 2: The Implementation Map

1. `git diff --stat {base}...HEAD` and the full diff of `src/`, `test/`, `README.md`, `docs/`,
   `flavors/`.
2. Run the mechanical checks and turn their output into findings:
   ```bash
   node .claude/skills/add-oas-support/scripts/check-plugin-conventions.mjs --base {base}
   node .claude/skills/add-oas-support/scripts/verify-urls.mjs --diff {base}
   node .claude/skills/add-oas-support/scripts/check-field-coverage.mjs {tracking-doc} --plugin {plugin dir} --scope "PR {n}"
   ```
   Without a tracking doc, write a minimal field map of the in-scope rows from Phase 1 into a
   file outside the repository and run the coverage script on it.
3. For each in-scope field, find where it's read (selector or component) and where it renders or
   affects a request.

## Phase 3: Checks

Read `../add-oas-support/references/review-lessons.md` first. For OAS, also keep
`../add-oas-support/references/integration-points.md` open; for JSON Schema,
`../add-json-schema-support/references/renderer-architecture.md`.

- [ ] **3.0 PR scope.** The PR holds one thing: basic support implements no `NEW` row (parity
      with the parent version only, proven by parity specs); a feature PR implements one feature
      (rows grouped only when they can't ship apart) and no unrelated refactor or fixture
      rewrite. Compare the diff with the tracking doc's PR plan; a second feature is a finding
      ("split into its own PR").
- [ ] **3.1 Field set.** Every in-scope NEW / CHANGED-TYPE / MOVED field of Phase 1 is implemented, and
      nothing presented as new (code comments, plugin header, PR text, tracking doc) is
      INHERITED from the parent. Fields the author marked `deferred`/`out` have a reason that
      holds.
- [ ] **3.2 Semantics.** The implementation matches the spec's type and wording: value shape
      (map vs array vs object), allowed values, defaults, case sensitivity, MUST/MUST NOT rules,
      interactions with existing fields (inheritance from the Path Item, `$ref` siblings).
- [ ] **3.3 Version gating.** New behaviour runs only for the new version: factories, not
      hand-written guards; no changes to shared constants that older versions read. An older
      version document has a test proving it's unaffected. For a breaking change (major), both a
      parent-version and a new-version document render with their own meaning.
- [ ] **3.4 Integration points.** Each applicable item of the integration-points list is done,
      for the new version and not only for the parent: detection, `isOAS3` widening, pragma
      filter and layout props, renderer wrappers, after-load routing, resolve strategy in
      `resolve` and `resolveSubtree`, preset order, `SwaggerUI.plugins`, config defaults with
      docs and React props, README. JSON Schema: detection excludes OAS documents, the dialect
      instance doesn't take the OAS `fn` overrides.
- [ ] **3.5 URLs.** Dialect and schema ids match the spec text and `https://spec.openapis.org/oas/`
      (OAS) or the meta-schema `$id` (JSON Schema); anchors exist.
- [ ] **3.6 Tests.** Unit tests for detection and selectors (including the gated-off case);
      Cypress specs that execute Try-it-out for request-changing features and assert the
      request; fixtures containing every in-scope field; new tests in TypeScript and picked up
      by the runner.
- [ ] **3.7 Code shape.** Wrap rather than copy; no cross-plugin imports; no dead selectors or
      wrappers; memoized selectors; data read from `specJsonWithResolvedSubtrees` where it may be
      behind a `$ref`.

## Phase 4: Report

Use this structure; include only sections with findings, and number findings so the author can
reply to each.

```
## Spec Support Review: {OAS x.y.z | JSON Schema {draft}} on {branch}

Inputs: {kind, version, base, scope, tracking doc} ({inferred from ...})

### Verified correct
- {what was checked and holds, with the spec row}

### Findings
| # | Class | File:line | Problem | Spec says | Source |
|---|-------|-----------|---------|-----------|--------|
| 1 | 3.1 field set | src/core/plugins/oas3Y/index.js:42 | header lists Info.summary as new in 3.Y | 3.1.0 Info Object already has `summary` | {URL}#info-object |

### Script results
- check-plugin-conventions: {n} errors, {n} warnings ({codes})
- verify-urls: {n} broken, {n} unverified
- check-field-coverage: {n} rows, {n} with gaps

### Questions
- {things that need the author's intent; no spec quote}

### Summary
| Class | Findings |
|-------|----------|
| 3.0 PR scope | n |
| 3.1 Field set | n |
| ... | |
```

Every finding cites a spec section (URL with anchor) and quotes the row or sentence it relies
on. Findings the scripts produced cite the script code (`DIALECT`, `CROSS-IMPORT`, ...) instead.
