# JSON Schema Dialects

Identifiers and sources per draft, checked on 2026-10-22 against
https://json-schema.org/specification-links, the `$id` of each meta-schema, and the ApiDOM
namespaces installed in `node_modules/@swagger-api/`. Run `verify-urls.mjs` on this file after
editing it.

## Meta-Schema Identifiers

These are the values a root `$schema` carries, and what detection compares against.

| Draft | Meta-schema `$schema` value | ApiDOM namespace | Swagger UI renderer today |
|-------|-----------------------------|------------------|---------------------------|
| 2020-12 | `https://json-schema.org/draft/2020-12/schema` | `apidom-ns-json-schema-2020-12` | `json-schema-2020-12` (via OAS 3.1/3.2 only) |
| 2019-09 | `https://json-schema.org/draft/2019-09/schema` | `apidom-ns-json-schema-2019-09` | none |
| Draft 7 | `http://json-schema.org/draft-07/schema#` | `apidom-ns-json-schema-draft-7` | none |
| Draft 6 | `http://json-schema.org/draft-06/schema#` | `apidom-ns-json-schema-draft-6` | none |
| Draft 5 | none of its own: Draft 5 kept the Draft 4 meta-schema | - | - |
| Draft 4 | `http://json-schema.org/draft-04/schema#` | `apidom-ns-json-schema-draft-4` | `json-schema-5` (via OAS 2.0/3.0 only) |

Detection rules:

- Draft 4 and Draft 5 documents carry the same `$schema`, so they can't be told apart, and don't
  need to be: Draft 5 changed wording, not keywords. Treat them as one dialect.
- Up to Draft 7 the identifiers are `http://` with an empty fragment `#`; from 2019-09 they are
  `https://` without a fragment. Documents in the wild drop the `#` or switch the scheme.
  Normalise the empty fragment; the other scheme is refused (decision 6 in
  `design-and-delivery.md`), and SwaggerEditor, which matches the 2020-12 identifier exactly,
  doesn't detect it either.
- A `$schema` naming any other URI (a custom meta-schema or a vocabulary dialect such as the OAS
  dialects below) is not one of these drafts, and neither is a draft whose support isn't
  delivered yet. Decision 6 refuses them with a message; they never render as another draft.
- Detection happens at the document root only, and only when the root has none of the API
  description fields `openapi`, `swagger`, `asyncapi` and `arazzo` (decision 8 in
  `design-and-delivery.md`; the presence of the key counts, whatever its value). Schema Objects
  inside OAS documents may carry `$schema` too, and so may the root of an OpenAPI, AsyncAPI or
  Arazzo document; swagger-client's `isJSONSchema202012` predicate applies the same rule.

## Specification Documents

Keywords are defined in prose sections of the core and validation specifications; there are no
Fixed Fields tables. From 2019-09 on, the vocabulary meta-schemas list the keywords per
vocabulary: use their `properties` as the checklist, and the specification text for value shapes
and semantics.

| Draft | Core | Validation | Vocabulary meta-schemas |
|-------|------|------------|-------------------------|
| 2020-12 | https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01.html | https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01.html | https://json-schema.org/draft/2020-12/meta/core, `.../meta/applicator`, `.../meta/unevaluated`, `.../meta/validation`, `.../meta/meta-data`, `.../meta/format-annotation`, `.../meta/content` |
| 2019-09 | https://json-schema.org/draft/2019-09/draft-handrews-json-schema-02.html | https://json-schema.org/draft/2019-09/draft-handrews-json-schema-validation-02.html | https://json-schema.org/draft/2019-09/meta/core, `.../meta/applicator`, `.../meta/validation`, `.../meta/meta-data`, `.../meta/format`, `.../meta/content` |
| Draft 7 | https://json-schema.org/draft-07/draft-handrews-json-schema-01.html | https://json-schema.org/draft-07/draft-handrews-json-schema-validation-01.html | single meta-schema: https://json-schema.org/draft-07/schema |
| Draft 6 | https://json-schema.org/draft-06/draft-wright-json-schema-01.html | https://json-schema.org/draft-06/draft-wright-json-schema-validation-01.html | single meta-schema: https://json-schema.org/draft-06/schema |
| Draft 5 | https://json-schema.org/draft-05/draft-wright-json-schema-00.pdf | https://json-schema.org/draft-05/draft-wright-json-schema-validation-00.pdf | Draft 4's |
| Draft 4 | https://json-schema.org/draft-04/draft-zyp-json-schema-04.html | https://json-schema.org/draft-04/draft-fge-json-schema-validation-00.html | single meta-schema: https://json-schema.org/draft-04/schema |

Each specification ends with an appendix of changes from the previous draft. Read it, but build
the keyword map from the keyword sections and the meta-schema, because change appendices
summarise.

## Dialects Used by OpenAPI

| OAS | Schema Object | Dialect id in Swagger UI (`default$schema`) | Renderer |
|-----|---------------|---------------------------------------------|----------|
| 2.0 | subset of Draft 4 | - | `json-schema-5` |
| 3.0.x | extended subset of Draft 5 (Wright Draft 00) | - | `json-schema-5` |
| 3.1.x | 2020-12 with the OAS base vocabulary | `https://spec.openapis.org/oas/3.1/dialect/base` | `json-schema-2020-12` |
| 3.2.x | 2020-12 with the OAS base vocabulary | `https://spec.openapis.org/oas/3.2/schema/2025-09-17` on `main`: the document schema, not a dialect (`DIALECT`). Published 3.2 dialects: `https://spec.openapis.org/oas/3.2/dialect/2025-09-17`, `https://spec.openapis.org/oas/3.2/dialect/2026-02-26`. The spec text (`#dialect-schema-id`) and the published list can disagree; check both. | `json-schema-2020-12` |

`default$schema` is set by the OAS wrappers and by `withJSONSchemaContext` (default
`https://json-schema.org/draft/2020-12/schema`), but no component reads it today. A standalone
renderer is the first consumer; once it reads it, the values above start to matter.

## SwaggerEditor Detection

SwaggerEditor@5 (`swagger-api/swagger-editor`, branch `main`) detects only 2020-12:
`src/plugins/editor-content-type/actions.js` matches `$schema` against
`https://json-schema.org/draft/2020-12/schema` in JSON and YAML, and
`src/plugins/editor-content-type/selectors.js` exports `selectIsContentTypeJSONSchema` and
`selectIsContentTypeJSONSchema202012`. Every other draft needs detection added there too.
