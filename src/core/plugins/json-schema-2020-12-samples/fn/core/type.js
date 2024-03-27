/**
 * @prettier
 */
import { ALL_TYPES } from "./constants"
import { isJSONSchemaObject } from "./predicates"
import { pick as randomPick } from "./random"
import { hasExample, extractExample } from "./example"

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

const inferTypeFromValue = (value) => {
  if (typeof value === "undefined") return null
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  if (Number.isInteger(value)) return "integer"

  return typeof value
}

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
    const constType = inferTypeFromValue(constant)
    type = typeof constType === "string" ? constType : type
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

  // inferring type from example
  if (typeof type !== "string" && hasExample(schema)) {
    const example = extractExample(schema)
    const exampleType = inferTypeFromValue(example)
    type = typeof exampleType === "string" ? exampleType : type
  }

  processedSchemas.delete(schema)

  return type || fallbackType
}

export const getType = (schema) => {
  return inferType(schema)
}
