# Tracking Document and Keyword Map Template

Copy into `ADD-JSON-SCHEMA-{DRAFT}.md` at the repo root (not committed). It is the JSON Schema
counterpart of the OAS field map. `check-field-coverage.mjs` (in `add-oas-support/scripts/`)
reads every table with a `Keyword` and a `Status` column, takes `Vocabulary` as the group, and
skips rows whose Scope contains `deferred` or `out`.

The baseline is what the renderer instance for this dialect would do without changes: for a new
draft, the 2020-12 renderer as it is; for 2020-12 standalone, the 2020-12 renderer as configured
by the OAS 3.1 wrappers minus the OAS additions.

```markdown
# Add JSON Schema {Draft} (standalone)

- Draft: {draft}; meta-schema `$schema`: {identifier from dialects.md}
- Specifications: {core URL}, {validation URL}; meta-schema(s): {URLs}
- Baseline renderer: json-schema-2020-12 (instance: {how it's configured})
- Design doc: SHUB page 4687691955, read on {date} / not accessible
- Decisions (design-and-delivery.md): 1 {answer or "open, planned with: ..."}, 2 ..., 7 ...

## PRs

| PR | Branch | Scope | State | Gate result |
|----|--------|-------|-------|-------------|
| Keyword map | - | - | user confirmed on {date} | |
| 1 | feat/json-schema-{draft}-detection | detection, document component, dialect instance | | |
| 2 | feat/json-schema-{draft}-{group} | rows marked PR 2 | | |

## Keyword map

| Vocabulary | Keyword | Value shape | Status | Baseline behaviour | Target behaviour | Scope |
|------------|---------|-------------|--------|--------------------|------------------|-------|
| {vocabulary or section} | {keyword} | {shape per this draft's spec} | SAME | rendered by Keyword{Name} | unchanged | - |
| {vocabulary} | {keyword} | {shape} | NEW | extension keyword (hidden by default) | own component | PR 2 |
| {vocabulary} | {keyword} | {this draft's shape} (2020-12: {shape}) | CHANGED-SHAPE | Keyword{Name} assumes the 2020-12 shape: {what goes wrong} | dialect component | PR 2 |
| {vocabulary} | {keyword} | {shape} | RENAMED → {2020-12 keyword} | extension keyword | rendered like {2020-12 keyword} | PR 2 |
| {vocabulary} | {keyword} | - | NOT-IN-DRAFT | rendered by Keyword{Name} | must not be treated as a keyword | PR 1 |
| {vocabulary} | {keyword} | {shape} | NEW | extension keyword | {reason it isn't rendered} | out ({reason}) |
```

Status values, relative to the 2020-12 renderer:

- `SAME`: same name, same value shape and meaning; the existing component is correct.
- `NEW`: keyword of this draft the renderer doesn't know.
- `CHANGED-SHAPE`: same name, different value shape or meaning (the case that renders wrongly
  without any visible error).
- `RENAMED`: a keyword whose role a differently named 2020-12 keyword took over.
- `NOT-IN-DRAFT`: a 2020-12 keyword this draft doesn't have. A schema of this draft that uses the
  name uses it as an unknown keyword; the renderer must not give it 2020-12 meaning.

The coverage script checks `NEW`, `CHANGED-SHAPE` and `RENAMED` rows (the draft's keyword name
must appear in source, a test and a fixture). `SAME` rows need no change, and `NOT-IN-DRAFT`
rows are an absence that a text search can't prove: assert in a test that the fixture's
2020-12-only keywords render as extension keywords.

## Behaviour columns

Describe what a user sees, so the rows turn into components and tests: "hidden" (extension
keyword with `showExtensions: false`), "raw JSON under Extension Keywords", "constraint chip",
"rendered as a subschema", "rendered as a list of subschemas", "plain-text description".

## Tips for Building the Map

- From 2019-09 on, list each vocabulary meta-schema's `properties`; that's the keyword checklist.
  Up to Draft 7, list the properties of the single meta-schema and confirm each against the
  keyword sections of the core and validation specs.
- Read value shapes from the spec text, not the meta-schema alone: a meta-schema can allow
  several shapes for one keyword, and the text gives each its own meaning.
- Look at the draft's "changes from previous draft" appendix for renamed and split keywords.
- Note annotations that the renderer shows as text (`title`, `description`, `$comment`, `examples`)
  separately from assertions shown as constraints, and applicators shown as nested schemas.
- `format` values differ per draft too; list them only if the renderer shows format-specific
  behaviour.
