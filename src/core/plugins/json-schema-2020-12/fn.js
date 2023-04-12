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
  if (schema.title) return upperFirst(schema.title)
  if (schema.$anchor) return upperFirst(schema.$anchor)
  if (schema.$id) return schema.$id

  return ""
}

export const isBooleanJSONSchema = (schema) => typeof schema === "boolean"
