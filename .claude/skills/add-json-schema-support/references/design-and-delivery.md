# Design and Delivery

What the "Standalone JSON Schema" design doc (Confluence, SHUB space, page 4687691955) proposes,
what the code shows about it, and the decisions that are left to the user. Read the design doc
itself when you have access to it; this file records its proposals as of 2026-10-22 and the
facts checked against the code since.

## Proposals

1. **Standalone JSON Schema 2020-12 first.** A document is a JSON Schema document when its root
   has `$schema`.
2. **Renderers per draft**: the modern renderer (`json-schema-2020-12`) for Draft 7, 2019-09 and
   2020-12; the legacy renderer (`json-schema-5`) for Draft 4, 5 and 6. Superseded on
   2026-10-25 (decision 3): the 2020-12 renderer for every draft.
3. **Display** through a new SwaggerEditor@5 plugin, `editor-preview-json-schema`. Superseded
   on 2026-10-23 (decision 4): Swagger UI renders standalone JSON Schema natively, and
   SwaggerEditor routes JSON Schema content to the Swagger UI preview it already has.

## Delivery Plans

| Plan | Order | Validation | Estimate in the doc |
|------|-------|------------|---------------------|
| Full | ApiDOM (JSON Schema parser adapters, reference support, language service), then Swagger UI, then SwaggerEditor | ApiDOM language service | about 3.5-4 sprints |
| MVP | Swagger UI and SwaggerEditor | ajv in SwaggerEditor | about 2 sprints |

ApiDOM already ships the JSON Schema namespaces (`apidom-ns-json-schema-draft-4`, `-draft-6`,
`-draft-7`, `-2019-09`, `-2020-12`) and JSON and YAML parser adapters for 2020-12
(`apidom-parser-adapter-json-schema-{json,yaml}-2020-12`). apidom-ls and apidom-reference don't
handle standalone schemas yet. That ApiDOM work matters for the Full plan (editor features:
completion, hover, linting, reference validation), not for rendering in Swagger UI. Each ApiDOM
phase is done with that repository's `/add-spec-version` skill
(`--spec json-schema --version 2020-12`).

## Corrections From the Code

| The doc assumes | The code shows | Where |
|-----------------|----------------|-------|
| unknown keywords need support | a catch-all exists, hidden by default (`showExtensions: false`) | `renderer-architecture.md` section 3 |
| the legacy renderer can render Draft 4/5/6 documents | it depends on OAS selectors and only knows OAS subsets | `renderer-architecture.md` section 5 |
| AsyncAPI and API Design Systems previews use the Swagger UI renderer | they don't; but every SwaggerEditor preview runs in one Swagger UI system, so `getComponent("JSONSchema202012")` and `withJSONSchema202012SystemContext` are available | SwaggerEditor `src/plugins/editor-preview-asyncapi/` |
| detection exists | SwaggerEditor detects 2020-12 only; Swagger UI detects nothing | `dialects.md` |

## Ownership

| Repository | Owns |
|------------|------|
| `swagger-api/swagger-ui` | rendering a JSON Schema document per dialect: detection of the root `$schema`, the document component, dialect-specific keyword lists and components, the layout branch for `SwaggerUI({ url })`, registration in the `apis` preset |
| `swagger-api/swagger-editor` (`main` is v5) | content-type detection per draft (`src/plugins/editor-content-type/`), routing JSON Schema content to its existing Swagger UI preview (`editor-preview-swagger-ui`) and the swagger-ui-react bump, a fixture and "Load Example" entry per draft (2020-12 has both: `editor-content-fixtures/selectors/selectJSONSchema202012YAML.js`, `top-bar/.../JSONSchema202012MenuItem.jsx`) |
| `swagger-api/apidom` | parser adapters, language service and reference support per draft (Full plan) |

Keeping detection and rendering in Swagger UI means SwaggerEditor adds no preview plugin: today
its Swagger UI preview handles OpenAPI only and a JSON Schema document gets the editor's
fallback ("Unable to render editor content"). SwaggerEditor's `/add-json-schema-support` routes
the content once a swagger-ui-react release renders it, and its `spec-status.mjs` finds that
release by the registration key and the release version from decision 7.

## Decisions for the User

Decisions 1 and 4 were answered on 2026-10-23, decisions 3 and 7 on 2026-10-25; record them in
the tracking doc as given. Ask the others at the first checkpoint, each with your recommendation.
Running as a subagent, record them as open in the tracking doc, plan with the recommendation,
and stop before code.

1. **Delivery plan**: answered: the Full plan, ApiDOM first; the MVP (ajv in SwaggerEditor) is
   not pursued.
2. **Drafts and order**: which drafts after the current one, and when. Each draft is its own
   delivery (the 2020-12 one excludes the others), so this doesn't block the current draft:
   record it as open unless the user is planning the next one.
3. **Renderer per draft**: answered: a 2020-12 instance with per-dialect overrides for every
   draft, Draft 4/5/6 included, not the doc's legacy renderer, which reads OAS selectors or
   `specPath` in 10 of its 13 components and renders only OAS keyword subsets
   (`renderer-architecture.md` section 5). Measured against the 2020-12 vocabularies, a draft
   needs few components of its own, mostly shared between drafts: array-form `items`,
   `additionalItems`, `definitions` and `dependencies` (Draft 4-7), `$recursiveRef` and
   `$recursiveAnchor` (2019-09), `id` and boolean `exclusiveMinimum`/`exclusiveMaximum` (Draft
   4/5). The rest is hiding the 2020-12 keywords the draft lacks, and, for Draft 4-7, the
   keywords beside a `$ref`, which those drafts ignore. The keyword map gives the exact rows.
4. **Where it displays**: answered: natively, in `SwaggerUI({ url })`, with the new plugin in
   the `apis` preset and in `SwaggerUI.plugins`. That changes behaviour for every Swagger UI
   user by design: a JSON Schema document renders instead of "Unable to render this
   definition". SwaggerEditor shows it through its Swagger UI preview.
5. **`$ref` resolution**: what the matching swagger-client strategy does with JSON Schema
   documents (`$id` base URIs, `$anchor`, `$dynamicRef`), and whether the first release accepts
   that.
6. **Unrecognised `$schema` values** (custom meta-schemas, OAS dialect ids, scheme variants):
   render as 2020-12, render with a notice, or refuse.
7. **Plugin name and registration key**: answered: one plugin for every dialect,
   `src/core/plugins/json-schema-document/`, exported as `SwaggerUI.plugins.JSONSchemaDocument`
   and loaded in the `apis` preset after `OpenAPI32Plugin`. It registers the document component
   `JSONSchemaDocument` and the spec selectors `isJSONSchemaDocument()` and `jsonSchemaDialect()`
   (the detected dialect, which picks that dialect's renderer overrides). No name carries a
   dialect: a later dialect adds its detection entry and overrides to this plugin. The renderer
   keeps its names (`JSONSchema202012`, `withJSONSchema202012Context`): they are public, and a
   2019-09 or Draft 7 document renders through a 2020-12 instance with its own overrides.
   - **Why not `json-schema-2020-12`**: the oas31 and oas32 `VersionPragmaFilter` wrappers
     don't render the component they wrap, and the preset loads `json-schema-2020-12` before
     them, so a layout wrapper there would be discarded. Loaded after `OpenAPI32Plugin`, this
     plugin's wrapper renders the document or else what oas32 rendered, without changing the
     OAS plugins. `json-schema-2020-12` stays a renderer that OAS-only builds load without
     document detection.
   - **What SwaggerEditor's gate gets, per dialect**: the key `JSONSchemaDocument`, which
     survives bundling (plugin function names are minified), and the swagger-ui release that
     first renders the dialect (`spec-status.mjs --swagger-ui-plugin --swagger-ui-version`). The
     key alone doesn't tell dialects apart, and a dialect's `$schema` identifier can't either:
     the 2020-12 one is already in the bundle as the renderer's `default$schema`. Record the
     release in the tracking doc and give both to SwaggerEditor.
