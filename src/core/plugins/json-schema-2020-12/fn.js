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

export const getType = (schema) => {
  if (Array.isArray(schema?.type)) {
    return schema.type.map(String).join(" | ")
  }

  if (schema?.type != null) {
    return String(schema.type)
  }

  return "any"
}

export const isBooleanJSONSchema = (schema) => typeof schema === "boolean"
