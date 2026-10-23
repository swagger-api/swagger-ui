# Design and Delivery

What the "Standalone JSON Schema" design doc (Confluence, SHUB space, page 4687691955) proposes,
what the code shows about it, and the decisions that are left to the user. Read the design doc
itself when you have access to it; this file records its proposals as of 2026-10-22 and the
facts checked against the code since.

## Proposals

1. **Standalone JSON Schema 2020-12 first.** A document is a JSON Schema document when its root
   has `$schema`.
2. **Renderers per draft**: the modern renderer (`json-schema-2020-12`) for Draft 7, 2019-09 and
   2020-12; the legacy renderer (`json-schema-5`) for Draft 4, 5 and 6.
3. **Display** through a new SwaggerEditor@5 plugin, `editor-preview-json-schema`.

## Delivery Plans

| Plan | Order | Validation | Estimate in the doc |
|------|-------|------------|---------------------|
| Full | ApiDOM (JSON Schema parser adapters, reference support, language service), then Swagger UI, then SwaggerEditor | ApiDOM language service | about 3.5-4 sprints |
| MVP | Swagger UI and SwaggerEditor | ajv in SwaggerEditor | about 2 sprints |

ApiDOM already ships the JSON Schema namespaces (`apidom-ns-json-schema-draft-4`, `-draft-6`,
`-draft-7`, `-2019-09`, `-2020-12`) but no JSON Schema parser adapters. The adapters matter for
the Full plan (editor features: completion, hover, linting), not for rendering in Swagger UI.
Each ApiDOM phase is done with that repository's `/add-spec-version` skill.

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
| `swagger-api/swagger-ui` | rendering a JSON Schema document per dialect: detection of the root `$schema`, the document component, dialect-specific keyword lists and components, the layout branch for `SwaggerUI({ url })` if in scope |
| `swagger-api/swagger-editor` (`main` is v5) | content-type detection per draft (`src/plugins/editor-content-type/`), the `editor-preview-json-schema` plugin, the `swagger-ui-adapter` BaseLayout wrap short-circuiting JSON Schema, a fixture and "Load Example" entry per draft (2020-12 has both: `editor-content-fixtures/selectors/selectJSONSchema202012YAML.js`, `top-bar/.../JSONSchema202012MenuItem.jsx`), ajv validation in the MVP |
| `swagger-api/apidom` | parser adapters and reference support per draft (Full plan) |

Keeping the dialect logic in Swagger UI, which owns the renderer, means the editor preview only
picks a component: `getComponent("{the document component}")`. The SwaggerEditor preview to
model is `editor-preview-asyncapi`: an `EditorPreview` wrap that switches on the content type
(`extensions/editor-preview/wrap-components/EditorPreviewWrapper.jsx`), a
`detectContentTypeSuccess` wrap-action (`extensions/editor-content-type/wrap-actions.js`), and
a preview component that switches on the parse status (`components/EditorPreviewAsyncAPI/`).

## Decisions for the User

Ask these at the first checkpoint, each with your recommendation. Running as a subagent, record
them as open in the tracking doc, plan with the recommendation, and stop before code.

1. **Delivery plan**: Full or MVP. Recommendation: start with the Swagger UI part, which both
   plans need, and keep the ApiDOM work separate.
2. **Drafts and order**: which drafts after 2020-12. Draft 4/5/6 depend on decision 3.
3. **Renderer for Draft 4/5/6**: the doc's legacy renderer (needs decoupling from OAS
   selectors) or a 2020-12 instance with dialect overrides (needs components for keywords whose
   shape differs). Present the cost of each from the keyword map, don't pick silently.
4. **Where it displays**: SwaggerEditor preview only (the doc), or also `SwaggerUI({ url })`
   with a JSON Schema document, and if so whether the new plugin joins the `apis` preset (a
   behaviour change for every user) or is only exported through `SwaggerUI.plugins`.
5. **`$ref` resolution**: what the matching swagger-client strategy does with JSON Schema
   documents (`$id` base URIs, `$anchor`, `$dynamicRef`), and whether the MVP accepts that.
6. **Unrecognised `$schema` values** (custom meta-schemas, OAS dialect ids, scheme variants):
   render as 2020-12, render with a notice, or refuse.
7. **Plugin name** for the Swagger UI side.
