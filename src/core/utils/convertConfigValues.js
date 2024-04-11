/**
 * @prettier
 */
const booleanConfigs = [
  "deepLinking",
  "displayOperationId",
  "displayRequestDuration",
  "persistAuthorization",
  "requestSnippetsEnabled",
  "showCommonExtensions",
  "showExtensions",
  "showMutatedRequest",
  "syntaxHighlight.activated",
  "tryItOutEnabled",
  "withCredentials",
]
const numberConfigs = [
  "defaultModelExpandDepth",
  "defaultModelsExpandDepth",
  "maxDisplayedTags",
]
const objectConfigs = ["syntaxHighlight", "requestSnippets"]
const arrayConfigs = ["request.curlOptions", "supportedSubmitMethods"]

const convertValue = (key, value) => {
  const isBoolean = booleanConfigs.includes(key)
  const isNumber = numberConfigs.includes(key)
  const isObject = objectConfigs.includes(key)
  const isArray = arrayConfigs.includes(key)

  if (key === "validatorUrl") {
    return value === "null" ? null : value
  }

  if (key === "filter") {
    return value === "false" ? false : value
  }

  if (isBoolean) {
    return value === "true" ? true : value === "false" ? false : value
  }

  if (isNumber) {
    const parsedValue = parseInt(value)
    return isNaN(parsedValue) ? value : parsedValue
  }

  if (isObject) {
    if (key === "syntaxHighlight" && value === "false") return false
    try {
      const parsedValue = JSON.parse(value)
      return typeof parsedValue === "object" && !Array.isArray(parsedValue)
        ? parsedValue
        : value
    } catch (e) {
      return value
    }
  }

  if (isArray) {
    try {
      const parsedValue = JSON.parse(value)
      return Array.isArray(parsedValue) ? parsedValue : value
    } catch (e) {
      return value
    }
  }

  return value
}

export const convertConfigValues = (config) => {
  Object.entries(config).forEach(([key, value]) => {
    config[key] = convertValue(key, value)
  })
  return config
}
