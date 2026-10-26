# Tracking Document and Field Map Template

Copy into `ADD-OAS-{X.Y}.md` at the repo root (not committed). Every later PR reads the field map
instead of re-deriving fields from memory. Start from the draft that
`scripts/diff-spec-versions.mjs` prints: its field map table has the columns below, with UI
impact, Breaking and Scope left for you.

`scripts/check-field-coverage.mjs` reads the tables: a table is parsed when it has a `Field` and a
`Status` column; `Object` and `Scope` are read when present. Rows whose Field starts with `{` or
`<` (placeholders) are skipped, and so are rows whose Scope says `deferred` or `out`.

```markdown
# Add OpenAPI {X.Y}

- Spec version: {x.y.z} (latest patch release on {date}; list: https://api.github.com/repos/OAI/OpenAPI-Specification/contents/versions)
- Spec source: https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/{x.y.z}.md
- Parent: {x.y.z}, same source pattern; parent plugin: src/core/plugins/oas3{P}
- Release notes read: https://github.com/OAI/OpenAPI-Specification/releases/tag/{tag}
- Variant: patch / minor / major
- Diff: `diff-spec-versions.mjs {parent} {new} [--rename ...]` → {n} NEW, {n} REMOVED, {n} CHANGED-TYPE,
  {n} CHANGED-REQUIRED, {n} REVIEW (all triaged)
- JSON Schema draft of the Schema Object: {draft} (parent: {draft}) → renderer change: yes / no
- Prerequisites: swagger-client {version} ships strategies/openapi-3-{Y}-apidom: yes / no;
  @swagger-api/apidom-ns-openapi-3-{Y} {version} published: yes / no

## Field map

| Object | Field | Type | Required | Status | Breaking | UI impact | Scope |
|--------|-------|------|----------|--------|----------|-----------|-------|
| {Object} | {field} | {type, incl. allowed values / format} | no | NEW | no | {component, or "Try it out request"} | PR 2 |
| {Object} | {field} | {old type} → {new type} | no | CHANGED-TYPE | no (widened) | {what changes} | PR 3 |
| {Object} | {field} | string, adds value `{value}` | yes | CHANGED-TYPE | no (widened) | {where the value matters} | PR 4 |
| {Object} | {field} | {type} | yes → no | CHANGED-REQUIRED | no | {e.g. a "required" marker} | PR 5 |
| {New Object} | {field} | {type} (was {Old Object}.{old field}) | no | MOVED | yes | {component reading it} | PR 6 |
| {Object} | {field} | {type} | - | REMOVED | yes | must not render for 3.Y | PR 7 |
| {Object} | {field} | {type} | no | NEW | no | none: read by swagger-client only | out (resolution, no UI) |
| {Object} | {field} | {type} | no | NEW | no | {component} | deferred ({reason}, issue #{n}) |
| {Object} | {field} | {type} | no | INHERITED ({parent version}) | no | already rendered by {file} | PR 1 (parity) |
```

Status values:

- `NEW`: not in the parent version's tables.
- `CHANGED-TYPE`: in the parent, but the type, the allowed values or the meaning changed. A widened
  value set (a new `in` location, a new flow) is a `CHANGED-TYPE` row of the field that holds the
  value; write the new value into the Type column. The diff marks these `REVIEW` and lists the
  added tokens.
- `CHANGED-REQUIRED`: the field became required or optional.
- `MOVED`: the concept still exists, under another name or object (2.0 `host` / `basePath` /
  `schemes` → 3.0 `servers`). Pair the diff's `REMOVED` and `NEW` rows into one `MOVED` row named
  after the new location, with the old one in the Type column (the coverage script looks for the
  new field name).
- `REMOVED`: in the parent, gone now, nothing replaces it.
- `INHERITED`: unchanged. The diff omits these unless run with `--all`; list one only when someone
  might think it's new (a changelog or an old comment says so), naming the version that introduced
  it. Basic support covers them all.

Breaking: `no` when a document written for the parent version stays valid and renders with the
same meaning (new fields, widened value sets, a field becoming optional); `yes` otherwise
(`REMOVED`, `MOVED`, narrowed value sets, changed meaning, a field becoming required). Expected
`no` everywhere in a minor or a patch.

Scope values: `PR n`, `PR 1 (parity)`, `deferred ({reason})`, `out ({reason})`. The coverage
script's `--scope "PR n"` checks one PR's rows; the reason is the only record of why a field isn't
rendered.

## Compatibility (major versions)

| Object | Compatible | Breaking rows | Basic support |
|--------|------------|---------------|---------------|
| {Object} | yes | - | rendered with the {previous major} component |
| {Object} | partly | {field} (MOVED), {field} (REMOVED) | compatible fields rendered; {fields} left out until PR {n} |
| {Object} | no | all | not rendered until PR {n} |

Plugin structure: {wrap the previous major's plugin for the compatible part / new base} -
recommendation and the user's decision.

## PR plan

One feature per PR. Group rows only when they can't ship apart, and say why.

| PR | Branch | Feature | Rows | Breaking | Depends on | State | Gate result |
|----|--------|---------|------|----------|------------|-------|-------------|
| Field map | - | - | - | - | - | user confirmed on {date} | |
| 1 | feat/oas3Y-basic-support | basic support (parity with {parent}) | INHERITED, plus Phase 0 bump | - | - | | |
| 2 | feat/oas3Y-{feature} | {feature} | {Object}.{field} | no | 1 | | |
| 3 | feat/oas3Y-{feature} | {feature} | {Object}.{field}, {Object}.{field} (one unit: {why}) | no | 1, 2 | | |

## Objects

| Object | Status | UI impact |
|--------|--------|-----------|
| {New Object} | NEW | {where it appears} |
| {Removed Object} | REMOVED | {what must disappear for 3.Y} |

## URLs

| Purpose | URL | Source | verify-urls |
|---------|-----|--------|-------------|
| Schema Object dialect (`default$schema`) | | spec text `#dialect-schema-id` and https://spec.openapis.org/oas/ | |
| OAS document schema (not the dialect) | | https://spec.openapis.org/oas/ | |
| Spec HTML (anchors in code comments) | https://spec.openapis.org/oas/v{x.y.z}.html | | |

## Gate log

- {date} PR 1: lint ✓, type-check ✓, unit ✓, cypress (targeted) ✓, cy:ci ✓, build ✓, artifact ✓,
  conventions 0 errors, coverage n/a (parity), scope ✓, verify-urls 0 broken, review: {n} findings fixed
```

## Tips for Building the Map

- Triage the diff's `REVIEW` rows by reading both descriptions: most are wording, but a new or
  missing token (an allowed value, a flow name, a location) is a `CHANGED-TYPE` row.
- The diff reads tables only. Search the new text for "added in", "new in", "deprecated",
  "removed", "MUST NOT" to find changes outside the tables, and read the release notes.
- For every candidate `NEW` row, grep the parent plugin, `oas3` and `src/core/components`. If
  Swagger UI already renders the field for the parent version, it's `INHERITED` for 3.Y, and the
  work is making sure basic support reuses the parent's component.
- Note the exact value shape: an array of objects, a single object and a map of objects need
  different rendering and different selectors.
- UI impact is the column that turns the field map into the PR plan. Be specific about the
  component (`Operation`, `Parameters`, `Responses`, `ModelCollapse`...) or the request part
  (method, URL, headers, body) so that the features fall out of it.
