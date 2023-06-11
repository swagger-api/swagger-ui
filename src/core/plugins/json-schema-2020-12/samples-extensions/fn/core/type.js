/**
 * @prettier
 */
import { ALL_TYPES } from "./constants"
import { isJSONSchemaObject } from "./predicates"
import { pick as randomPick } from "./random"

const inferringKeywords = {
  array: [
    "items",
    "prefixItems",
    "contains",
    "maxContains",
    "minContains",
    "maxItems",
    "minItems",
    "uniqueItems",
    "unevaluatedItems",
  ],
  object: [
    "properties",
    "additionalProperties",
    "patternProperties",
    "propertyNames",
    "minProperties",
    "maxProperties",
    "required",
    "dependentSchemas",
    "dependentRequired",
    "unevaluatedProperties",
  ],
  string: [
    "pattern",
    "format",
    "minLength",
    "maxLength",
    "contentEncoding",
    "contentMediaType",
    "contentSchema",
  ],
  integer: [
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "multipleOf",
  ],
}
inferringKeywords.number = inferringKeywords.integer

const fallbackType = "string"

export const foldType = (type) => {
  if (Array.isArray(type) && type.length >= 1) {
    if (type.includes("array")) {
      return "array"
    } else if (type.includes("object")) {
      return "object"
    } else {
      const pickedType = randomPick(type)
      if (ALL_TYPES.includes(pickedType)) {
        return pickedType
      }
    }
  }

  if (ALL_TYPES.includes(type)) {
    return type
  }

  return null
}

export const inferType = (schema, processedSchemas = new WeakSet()) => {
  if (!isJSONSchemaObject(schema)) return fallbackType
  if (processedSchemas.has(schema)) return fallbackType

  processedSchemas.add(schema)

  let { type, const: constant } = schema
  type = foldType(type)

  // inferring type from inferring keywords
  if (typeof type !== "string") {
    const inferringTypes = Object.keys(inferringKeywords)

    interrupt: for (let i = 0; i < inferringTypes.length; i += 1) {
      const inferringType = inferringTypes[i]
      const inferringTypeKeywords = inferringKeywords[inferringType]

      for (let j = 0; j < inferringTypeKeywords.length; j += 1) {
        const inferringKeyword = inferringTypeKeywords[j]
        if (Object.hasOwn(schema, inferringKeyword)) {
          type = inferringType
          break interrupt
        }
      }
    }
  }

  // inferring type from const keyword
  if (typeof type !== "string" && typeof constant !== "undefined") {
    if (constant === null) {
      type = "null"
    } else if (typeof constant === "boolean") {
      type = "boolean"
    } else if (typeof constant === "number") {
      type = Number.isInteger(constant) ? "integer" : "number"
    } else if (typeof constant === "string") {
      type = "string"
    } else if (typeof constant === "object") {
      type = "object"
    }
  }

  // inferring type from combining schemas
  if (typeof type !== "string") {
    const combineTypes = (keyword) => {
      if (Array.isArray(schema[keyword])) {
        const combinedTypes = schema[keyword].map((subSchema) =>
          inferType(subSchema, processedSchemas)
        )
        return foldType(combinedTypes)
      }
      return null
    }

    const allOf = combineTypes("allOf")
    const anyOf = combineTypes("anyOf")
    const oneOf = combineTypes("oneOf")
    const not = schema.not ? inferType(schema.not, processedSchemas) : null

    if (allOf || anyOf || oneOf || not) {
      type = foldType([allOf, anyOf, oneOf, not].filter(Boolean))
    }
  }

  processedSchemas.delete(schema)

  return type || fallbackType
}

export const getType = (schema) => {
  return inferType(schema)
}
