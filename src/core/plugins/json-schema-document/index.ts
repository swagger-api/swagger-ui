/**
 * @prettier
 */
import JSONSchemaDocument from "./components/JSONSchemaDocument"
import VersionPragmaFilterWrapper from "./wrap-components/VersionPragmaFilter"
import { isJSONSchemaDocument, jsonSchemaDialect } from "./selectors"
import { requestResolvedSubtree } from "./wrap-actions"

/**
 * JSON Schema Document Plugin
 *
 * Renders standalone JSON Schema documents: a document whose root has a
 * `$schema` keyword and none of the fields `openapi`, `swagger`, `asyncapi`,
 * `arazzo`. One plugin serves every dialect; each delivered dialect adds its
 * identifier to `SUPPORTED_DIALECTS` and its renderer overrides.
 *
 * Delivered: JSON Schema 2020-12 (`https://json-schema.org/draft/2020-12/schema`),
 * rendered by the json-schema-2020-12 renderer with `$ref`s resolved by
 * swagger-client's `json-schema-2020-12-apidom` strategy (every `$dynamicRef`
 * stays as written). A root `$schema` naming any other dialect is refused with
 * a message. Of the keywords the 2020-12 default meta-schema keeps from earlier
 * drafts, `definitions` renders like `$defs`, and `dependencies` like
 * `dependentSchemas` (schema entries) and `dependentRequired` (property name
 * arrays); a `$ref` into them is resolved, a `$ref` inside them stays as
 * written (swagger-client doesn't dereference there). `$recursiveAnchor` and
 * `$recursiveRef` are shown as written, like `$dynamicAnchor` and
 * `$dynamicRef`, and not resolved. The OpenAPI number formats (`int32`,
 * `int64`, `float`, `double`), which JSON Schema doesn't define, imply no type
 * for a schema without `type`.
 * Limitation: an embedded resource (`$id` with its own `$schema`) or an external
 * file that declares another dialect is rendered with the 2020-12 meaning;
 * references that cross dialects are out of scope.
 *
 * Load it AFTER the OpenAPI plugins: it wraps their `VersionPragmaFilter`,
 * whose wrappers don't render the component they wrap.
 */
const JSONSchemaDocumentPlugin = () => ({
  components: {
    JSONSchemaDocument,
  },
  wrapComponents: {
    VersionPragmaFilter: VersionPragmaFilterWrapper,
  },
  statePlugins: {
    spec: {
      selectors: {
        isJSONSchemaDocument,
        jsonSchemaDialect,
      },
      wrapActions: {
        requestResolvedSubtree,
      },
    },
  },
})

export default JSONSchemaDocumentPlugin
