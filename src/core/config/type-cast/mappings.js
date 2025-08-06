/**
 * @prettier
 */
import arrayTypeCaster from "./type-casters/array"
import booleanTypeCaster from "./type-casters/boolean"
import domNodeTypeCaster from "./type-casters/dom-node"
import filterTypeCaster from "./type-casters/filter"
import functionTypeCaster from "./type-casters/function"
import nullableArrayTypeCaster from "./type-casters/nullable-array"
import nullableFunctionTypeCaster from "./type-casters/nullable-function"
import nullableStringTypeCaster from "./type-casters/nullable-string"
import numberTypeCaster from "./type-casters/number"
import objectTypeCaster from "./type-casters/object"
import sorterTypeCaster from "./type-casters/sorter"
import stringTypeCaster from "./type-casters/string"
import syntaxHighlightTypeCaster from "./type-casters/syntax-highlight"
import undefinedStringTypeCaster from "./type-casters/undefined-string"
import defaultOptions from "../defaults"

const mappings = {
  components: { typeCaster: objectTypeCaster },
  configs: { typeCaster: objectTypeCaster },
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
  fileUploadMediaTypes: {
    typeCaster: arrayTypeCaster,
    defaultValue: defaultOptions.fileUploadMediaTypes,
  },
  filter: { typeCaster: filterTypeCaster },
  fn: { typeCaster: objectTypeCaster },
  initialState: { typeCaster: objectTypeCaster },
  layout: { typeCaster: stringTypeCaster },
  maxDisplayedTags: {
    typeCaster: numberTypeCaster,
    defaultValue: defaultOptions.maxDisplayedTags,
  },
  modelPropertyMacro: { typeCaster: nullableFunctionTypeCaster },
  oauth2RedirectUrl: { typeCaster: undefinedStringTypeCaster },
  onComplete: { typeCaster: nullableFunctionTypeCaster },
  operationsSorter: {
    typeCaster: sorterTypeCaster,
  },
  paramaterMacro: { typeCaster: nullableFunctionTypeCaster },
  persistAuthorization: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.persistAuthorization,
  },
  plugins: {
    typeCaster: arrayTypeCaster,
    defaultValue: defaultOptions.plugins,
  },
  presets: {
    typeCaster: arrayTypeCaster,
    defaultValue: defaultOptions.presets,
  },
  requestInterceptor: {
    typeCaster: functionTypeCaster,
    defaultValue: defaultOptions.requestInterceptor,
  },
  requestSnippets: {
    typeCaster: objectTypeCaster,
    defaultValue: defaultOptions.requestSnippets,
  },
  requestSnippetsEnabled: {
    typeCaster: booleanTypeCaster,
    defaultValue: defaultOptions.requestSnippetsEnabled,
  },
  responseInterceptor: {
    typeCaster: functionTypeCaster,
    defaultValue: defaultOptions.responseInterceptor,
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
  tagsSorter: {
    typeCaster: sorterTypeCaster,
  },
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
  uncaughtExceptionHandler: { typeCaster: nullableFunctionTypeCaster },
}

export default mappings
