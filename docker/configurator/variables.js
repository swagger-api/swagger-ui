const standardVariables = {
  CONFIG_URL: {
    type: "string",
    name: "configUrl"
  },
  DOM_ID: {
    type: "string",
    name: "dom_id"
  },
  SPEC: {
    type: "object",
    name: "spec"
  },
  URL: {
    type: "string",
    name: "url"
  },
  URLS: {
    type: "array",
    name: "urls"
  },
  URLS_PRIMARY_NAME: {
    type: "string",
    name: "urls.primaryName"
  },
  QUERY_CONFIG_ENABLED: {
    type: "boolean",
    name: "queryConfigEnabled"
  },
  LAYOUT: {
    type: "string",
    name: "layout"
  },
  DEEP_LINKING: {
    type: "boolean",
    name: "deepLinking"
  },
  DISPLAY_OPERATION_ID: {
    type: "boolean",
    name: "displayOperationId"
  },
  DEFAULT_MODELS_EXPAND_DEPTH: {
    type: "number",
    name: "defaultModelsExpandDepth"
  },
  DEFAULT_MODEL_EXPAND_DEPTH: {
    type: "number",
    name: "defaultModelExpandDepth"
  },
  DEFAULT_MODEL_RENDERING: {
    type: "string",
    name: "defaultModelRendering"
  },
  DISPLAY_REQUEST_DURATION: {
    type: "boolean",
    name: "displayRequestDuration"
  },
  DOC_EXPANSION: {
    type: "string",
    name: "docExpansion"
  },
  FILTER: {
    type: "string",
    name: "filter"
  },
  MAX_DISPLAYED_TAGS: {
    type: "number",
    name: "maxDisplayedTags"
  },
  OPERATIONS_SORTER: {
    type: "string",
    name: "operationsSorter"
  },
  SHOW_EXTENSIONS: {
    type: "boolean",
    name: "showExtensions"
  },
  SHOW_COMMON_EXTENSIONS: {
    type: "boolean",
    name: "showCommonExtensions"
  },
  TAGS_SORTER: {
    type: "string",
    name: "tagsSorter"
  },
  USE_UNSAFE_MARKDOWN: {
    type: "boolean",
    name: "useUnsafeMarkdown"
  },
  OAUTH2_REDIRECT_URL: {
    type: "string",
    name: "oauth2RedirectUrl"
  },
  PERSIST_AUTHORIZATION: {
    type: "boolean",
    name: "persistAuthorization"
  },
  SHOW_MUTATED_REQUEST: {
    type: "boolean",
    name: "showMutatedRequest"
  },
  SUPPORTED_SUBMIT_METHODS: {
    type: "array",
    name: "supportedSubmitMethods"
  },
  TRY_IT_OUT_ENABLED: {
    type: "boolean",
    name: "tryItOutEnabled"
  },
  VALIDATOR_URL: {
    type: "string",
    name: "validatorUrl"
  },
  WITH_CREDENTIALS: {
    type: "boolean",
    name: "withCredentials",
  }
}

const legacyVariables = {
  API_URL: {
    type: "string",
    name: "url",
    legacy: true
  },
  API_URLS: {
    type: "array",
    name: "urls",
    legacy: true
  }
}

module.exports = Object.assign({}, standardVariables, legacyVariables)
