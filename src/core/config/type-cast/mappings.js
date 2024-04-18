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
import undefinedStringTypeCaster from "./type-casters/undefined-string"
import defaultOptions from "../defaults"

const typeCasters = {
  configUrl: { typeCaster: nullableStringTypeCaster },
  deepLinking: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.deepLinking,
  },
  defaultModelExpandDepth: {
    typeCaster: numberTypeCaster,
    defaultValue: defaultOptions.defaultModelExpandDepth,
  },
  defaultModelRendering: { typeCaster: stringTypeCaster },
  defaultModelsExpandDepth: {
    typeCaster: numberTypeCaster,
    defaultValue: defaultOptions.defaultModelsExpandDepth,
  },
  displayOperationId: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.displayOperationId,
  },
  displayRequestDuration: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.displayRequestDuration,
  },
  docExpansion: { typeCaster: stringTypeCaster },
  dom_id: { typeCaster: nullableStringTypeCaster },
  domNode: { typeCaster: domNodeTypeCaster },
  filter: { typeCaster: filterTypeCaster },
  layout: { typeCaster: stringTypeCaster },
  maxDisplayedTags: {
    typeCaster: numberTypeCaster,
    defaultValue: defaultOptions.maxDisplayedTags,
  },
  oauth2RedirectUrl: { typeCaster: undefinedStringTypeCaster },
  persistAuthorization: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.persistAuthorization,
  },
  plugins: {
    typeCaster: arrayTypeCaster,
    defaultValue: defaultOptions.plugins,
  },
  pluginsOptions: {
    typeCaster: objectTypeCaster,
    pluginsOptions: defaultOptions.pluginsOptions,
  },
  "pluginsOptions.pluginsLoadType": { typeCaster: stringTypeCaster },
  presets: {
    typeCaster: arrayTypeCaster,
    defaultValue: defaultOptions.presets,
  },
  requestSnippets: {
    typeCaster: objectTypeCaster,
    defaultValue: defaultOptions.requestSnippets,
  },
  requestSnippetsEnabled: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.requestSnippetsEnabled,
  },
  showCommonExtensions: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.showCommonExtensions,
  },
  showExtensions: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.showExtensions,
  },
  showMutatedRequest: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.showMutatedRequest,
  },
  spec: { typeCaster: objectTypeCaster, defaultValue: defaultOptions.spec },
  supportedSubmitMethods: {
    typeCaster: arrayTypeCaster,
    defaultValue: defaultOptions.supportedSubmitMethods,
  },
  syntaxHighlight: {
    typeCaster: syntaxHighlightTypeCaster,
    defaultValue: defaultOptions.syntaxHighlight,
  },
  "syntaxHighlight.activated": {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.syntaxHighlight.activated,
  },
  "syntaxHighlight.theme": { typeCaster: stringTypeCaster },
  tryItOutEnabled: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.tryItOutEnabled,
  },
  url: { typeCaster: stringTypeCaster },
  urls: { typeCaster: nullableArrayTypeCaster },
  "urls.primaryName": { typeCaster: stringTypeCaster },
  validatorUrl: { typeCaster: nullableStringTypeCaster },
  withCredentials: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.withCredentials,
  },
}

export default typeCasters
