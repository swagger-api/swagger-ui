/**
 * @prettier
 */
export const upperFirst = (value) => {
  if (typeof value === "string") {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
  }
  return value
}

export const getTitle = (schema) => {
  if (schema?.title) return upperFirst(schema.title)
  if (schema?.$anchor) return upperFirst(schema.$anchor)
  if (schema?.$id) return schema.$id

  return ""
}

export const getType = (schema, processedSchemas = new WeakSet()) => {
  if (schema == null) {
    return "any"
  }

  if (typeof schema === "boolean") {
    return schema ? "any" : "never"
  }

  if (typeof schema !== "object") {
    return "any"
  }

  if (processedSchemas.has(schema)) {
    return "any" // detect a cycle
  }
  processedSchemas.add(schema)

  const { type, items } = schema

  const getArrayType = () => {
    if (!items) {
      return "array<any>"
    }
    const itemsType = getType(items, processedSchemas)
    return `array<${itemsType}>`
  }

  const inferType = () => {
    if (items) {
      return getArrayType()
    } else if (schema.properties || schema.additionalProperties) {
      return "object"
    } else if (
      schema.pattern ||
      schema.format ||
      schema.minLength ||
      schema.maxLength
    ) {
      return "string"
    } else if (
      schema.minimum ||
      schema.maximum ||
      schema.exclusiveMinimum ||
      schema.exclusiveMaximum ||
      schema.multipleOf
    ) {
      return "number | integer"
    } else if (schema.const !== undefined) {
      if (schema.const === null) {
        return "null"
      } else if (typeof schema.const === "boolean") {
        return "boolean"
      } else if (typeof schema.const === "number") {
        return Number.isInteger(schema.const) ? "integer" : "number"
      } else if (typeof schema.const === "string") {
        return "string"
      } else if (typeof schema.const === "object") {
        return "object"
      }
    }
    return null
  }

  const typeString = Array.isArray(type)
    ? type.map((t) => (t === "array" ? getArrayType() : t)).join(" | ")
    : type && type.includes("array")
    ? getArrayType()
    : type || inferType()

  const handleCombiningKeywords = (keyword, separator) => {
    if (Array.isArray(schema[keyword])) {
      const combinedTypes = schema[keyword].map((subSchema) =>
        getType(subSchema, processedSchemas)
      )
      return `(${combinedTypes.join(separator)})`
    }
    return null
  }

  const oneOfString = handleCombiningKeywords("oneOf", " | ")
  const anyOfString = handleCombiningKeywords("anyOf", " | ")
  const allOfString = handleCombiningKeywords("allOf", " & ")

  const combinedStrings = [typeString, oneOfString, anyOfString, allOfString]
    .filter(Boolean)
    .join(" | ")

  processedSchemas.delete(schema)

  return combinedStrings || "any"
}

export const isBooleanJSONSchema = (schema) => typeof schema === "boolean"

export const isExpandable = (schema) => {
  return (
    schema?.$schema ||
    schema?.$vocabulary ||
    schema?.$id ||
    schema?.$anchor ||
    schema?.$dynamicAnchor ||
    schema?.description ||
    schema?.properties
  )
}
