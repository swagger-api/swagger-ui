/**
 * @prettier
 */
import arrayTypeCaster from "./type-casters/array"
import booleanTypeCaster from "./type-casters/boolean"
import domNodeTypeCaster from "./type-casters/dom-node"
import filterTypeCaster from "./type-casters/filter"
import nullableArrayTypeCaster from "./type-casters/nullable-array"
import nullableStringTypeCaster from "./type-casters/nullable-string"
import numberTypeCaster from "./type-casters/number"
import objectTypeCaster from "./type-casters/object"
import stringTypeCaster from "./type-casters/string"
import syntaxHighlightTypeCaster from "./type-casters/syntax-highlight"
import undefinedBooleanTypeCaster from "./type-casters/undefined-boolean"
import undefinedStringTypeCaster from "./type-casters/undefined-string"

const typeCasters = {
  configUrl: stringTypeCaster,
  deepLinking: booleanTypeCaster("deepLinking"),
  defaultModelExpandDepth: numberTypeCaster,
  defaultModelRendering: stringTypeCaster,
  defaultModelsExpandDepth: numberTypeCaster,
  displayOperationId: booleanTypeCaster("displayOperationId"),
  displayRequestDuration: booleanTypeCaster("displayRequestDuration"),
  docExpansion: stringTypeCaster,
  dom_id: nullableStringTypeCaster,
  domNode: domNodeTypeCaster,
  filter: filterTypeCaster,
  maxDisplayedTags: numberTypeCaster,
  oauth2RedirectUrl: undefinedStringTypeCaster,
  persistAuthorization: booleanTypeCaster("persistAuthorization"),
  plugins: arrayTypeCaster("plugins"),
  pluginsOptions: objectTypeCaster("pluginsOptions"),
  presets: arrayTypeCaster("presets"),
  requestSnippets: objectTypeCaster("requestSnippets"),
  requestSnippetsEnabled: booleanTypeCaster("requestSnippetsEnabled"),
  showCommonExtensions: booleanTypeCaster("showCommonExtensions"),
  showExtensions: booleanTypeCaster("showExtensions"),
  showMutatedRequest: booleanTypeCaster("showMutatedRequest"),
  spec: objectTypeCaster("spec"),
  supportedSubmitMethods: arrayTypeCaster("supportedSubmitMethods"),
  syntaxHighlight: syntaxHighlightTypeCaster,
  "syntaxHighlight.activated": booleanTypeCaster("syntaxHighlight.activated"),
  "syntaxHighlight.theme": stringTypeCaster,
  tryItOutEnabled: booleanTypeCaster("tryItOutEnabled"),
  url: stringTypeCaster,
  urls: nullableArrayTypeCaster,
  "urls.primaryName": stringTypeCaster,
  validatorUrl: nullableStringTypeCaster,
  withCredentials: undefinedBooleanTypeCaster,
}

export default typeCasters
