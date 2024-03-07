/**
 * @prettier
 */
import { normalizeArray as ensureArray } from "core/utils"
import { isBooleanJSONSchema, isJSONSchema } from "./predicates"

const merge = (target, source, config = {}) => {
  if (isBooleanJSONSchema(target) && target === true) return true
  if (isBooleanJSONSchema(target) && target === false) return false
  if (isBooleanJSONSchema(source) && source === true) return true
  if (isBooleanJSONSchema(source) && source === false) return false

  if (!isJSONSchema(target)) return source
  if (!isJSONSchema(source)) return target

  /**
   * Merging properties from the source object into the target object
   * only if they do not already exist in the target object.
   */
  const merged = { ...source, ...target }

  // merging the type keyword
  if (source.type && target.type) {
    if (Array.isArray(source.type) && typeof source.type === "string") {
      const mergedType = ensureArray(source.type).concat(target.type)
      merged.type = Array.from(new Set(mergedType))
    }
  }

  // merging required keyword
  if (Array.isArray(source.required) && Array.isArray(target.required)) {
    merged.required = [...new Set([...target.required, ...source.required])]
  }

  // merging properties keyword
  if (source.properties && target.properties) {
    const allPropertyNames = new Set([
      ...Object.keys(source.properties),
      ...Object.keys(target.properties),
    ])

    merged.properties = {}
    for (const name of allPropertyNames) {
      const sourceProperty = source.properties[name] || {}
      const targetProperty = target.properties[name] || {}

      if (
        (sourceProperty.readOnly && !config.includeReadOnly) ||
        (sourceProperty.writeOnly && !config.includeWriteOnly)
      ) {
        merged.required = (merged.required || []).filter((p) => p !== name)
      } else {
        merged.properties[name] = merge(targetProperty, sourceProperty, config)
      }
    }
  }

  // merging items keyword
  if (isJSONSchema(source.items) && isJSONSchema(target.items)) {
    merged.items = merge(target.items, source.items, config)
  }

  // merging contains keyword
  if (isJSONSchema(source.contains) && isJSONSchema(target.contains)) {
    merged.contains = merge(target.contains, source.contains, config)
  }

  // merging contentSchema keyword
  if (
    isJSONSchema(source.contentSchema) &&
    isJSONSchema(target.contentSchema)
  ) {
    merged.contentSchema = merge(
      target.contentSchema,
      source.contentSchema,
      config
    )
  }

  return merged
}

export default merge
