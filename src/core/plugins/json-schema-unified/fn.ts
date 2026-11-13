/**
 * @prettier
 */
import { List, Map } from "immutable"

import type {
  Constraint,
  FnAccessor,
  GetTitle,
  GetType,
  Schema,
  SchemaObject,
} from "./types"

export const upperFirst = <T>(value: T): T | string => {
  if (typeof value === "string") {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
  }
  return value
}

const EMPTY_SCHEMA_OBJECT: SchemaObject = Object.freeze({})

/**
 * Returns the schema itself when it is an object, otherwise an empty object.
 * Reading a keyword from the result is the typed equivalent of `schema?.keyword`:
 * a boolean (or missing) schema reads as "keyword absent".
 */
export const toSchemaObject = (schema: unknown): SchemaObject =>
  schema !== null && typeof schema === "object"
    ? (schema as SchemaObject)
    : EMPTY_SCHEMA_OBJECT

/**
 * Lookup can be `basic` or `extended`. By default the lookup is `extended`.
 */
export const makeGetTitle = (fnAccessor: FnAccessor): GetTitle => {
  const getTitle: GetTitle = (schema, { lookup = "extended" } = {}) => {
    const fn = fnAccessor()
    const schemaObject = toSchemaObject(schema)

    if (schemaObject.title != null)
      return fn.upperFirst(String(schemaObject.title))
    if (lookup === "extended") {
      if (schemaObject.$anchor != null)
        return fn.upperFirst(String(schemaObject.$anchor))
      if (schemaObject.$id != null) return String(schemaObject.$id)
    }

    return ""
  }

  return getTitle
}

export const makeGetType = (fnAccessor: FnAccessor): GetType => {
  const getType: GetType = (schema, processedSchemas = new WeakSet()) => {
    const fn = fnAccessor()

    if (schema == null) {
      return "any"
    }

    if (fn.isBooleanJSONSchema(schema)) {
      return schema ? "any" : "never"
    }

    if (typeof schema !== "object") {
      return "any"
    }

    if (processedSchemas.has(schema)) {
      return "any" // detect a cycle
    }
    processedSchemas.add(schema)

    const { type, prefixItems, items } = schema

    const getArrayType = () => {
      if (Array.isArray(prefixItems)) {
        const prefixItemsTypes = prefixItems.map((itemSchema) =>
          getType(itemSchema, processedSchemas)
        )
        const itemsType = items ? getType(items, processedSchemas) : "any"
        return `array<[${prefixItemsTypes.join(", ")}], ${itemsType}>`
      } else if (items) {
        const itemsType = getType(items, processedSchemas)
        return `array<${itemsType}>`
      } else {
        return "array<any>"
      }
    }

    const inferType = () => {
      if (
        Object.hasOwn(schema, "prefixItems") ||
        Object.hasOwn(schema, "items") ||
        Object.hasOwn(schema, "contains")
      ) {
        return getArrayType()
      } else if (
        Object.hasOwn(schema, "properties") ||
        Object.hasOwn(schema, "additionalProperties") ||
        Object.hasOwn(schema, "patternProperties")
      ) {
        return "object"
      } else if (["int32", "int64"].includes(schema.format)) {
        // OpenAPI 3.1.0 integer custom formats
        return "integer"
      } else if (["float", "double"].includes(schema.format)) {
        // OpenAPI 3.1.0 number custom formats
        return "number"
      } else if (
        Object.hasOwn(schema, "minimum") ||
        Object.hasOwn(schema, "maximum") ||
        Object.hasOwn(schema, "exclusiveMinimum") ||
        Object.hasOwn(schema, "exclusiveMaximum") ||
        Object.hasOwn(schema, "multipleOf")
      ) {
        return "number | integer"
      } else if (
        Object.hasOwn(schema, "pattern") ||
        Object.hasOwn(schema, "format") ||
        Object.hasOwn(schema, "minLength") ||
        Object.hasOwn(schema, "maxLength") ||
        Object.hasOwn(schema, "contentEncoding") ||
        Object.hasOwn(schema, "contentMediaType")
      ) {
        return "string"
      } else if (typeof schema.const !== "undefined") {
        if (schema.const === null) {
          return "null"
        } else if (typeof schema.const === "boolean") {
          return "boolean"
        } else if (typeof schema.const === "number") {
          return Number.isInteger(schema.const) ? "integer" : "number"
        } else if (typeof schema.const === "string") {
          return "string"
        } else if (Array.isArray(schema.const)) {
          return "array<any>"
        } else if (typeof schema.const === "object") {
          return "object"
        }
      }
      return null
    }

    if (schema.not && getType(schema.not) === "any") {
      return "never"
    }

    const typeString = Array.isArray(type)
      ? type.map((t) => (t === "array" ? getArrayType() : t)).join(" | ")
      : type === "array"
        ? getArrayType()
        : [
              "null",
              "boolean",
              "object",
              "array",
              "number",
              "integer",
              "string",
            ].includes(type)
          ? type
          : inferType()

    const handleCombiningKeywords = (
      keyword: "oneOf" | "anyOf" | "allOf",
      separator: string
    ) => {
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

  return getType
}

export const isBooleanJSONSchema = (schema: unknown): schema is boolean =>
  typeof schema === "boolean"

export const hasKeyword = (
  schema: unknown,
  keyword: string
): schema is SchemaObject =>
  schema !== null &&
  typeof schema === "object" &&
  Object.hasOwn(schema, keyword)

export const makeIsExpandable = (fnAccessor: FnAccessor) => {
  /**
   * Returns a boolean; the original returns the first truthy keyword value.
   * Only the truthiness is ever used.
   */
  const isExpandable = (schema: Schema): boolean => {
    const fn = fnAccessor()
    const schemaObject = toSchemaObject(schema)

    return Boolean(
      schemaObject.$schema ||
        schemaObject.$vocabulary ||
        schemaObject.$id ||
        schemaObject.$anchor ||
        schemaObject.$dynamicAnchor ||
        schemaObject.$ref ||
        schemaObject.$dynamicRef ||
        schemaObject.$defs ||
        schemaObject.$comment ||
        schemaObject.allOf ||
        schemaObject.anyOf ||
        schemaObject.oneOf ||
        fn.hasKeyword(schema, "not") ||
        fn.hasKeyword(schema, "if") ||
        fn.hasKeyword(schema, "then") ||
        fn.hasKeyword(schema, "else") ||
        schemaObject.dependentSchemas ||
        schemaObject.prefixItems ||
        fn.hasKeyword(schema, "items") ||
        fn.hasKeyword(schema, "contains") ||
        schemaObject.properties ||
        schemaObject.patternProperties ||
        fn.hasKeyword(schema, "additionalProperties") ||
        fn.hasKeyword(schema, "propertyNames") ||
        fn.hasKeyword(schema, "unevaluatedItems") ||
        fn.hasKeyword(schema, "unevaluatedProperties") ||
        schemaObject.description ||
        schemaObject.enum ||
        fn.hasKeyword(schema, "const") ||
        fn.hasKeyword(schema, "contentSchema") ||
        fn.hasKeyword(schema, "default") ||
        schemaObject.examples ||
        fn.getExtensionKeywords(schema).length > 0
    )
  }

  return isExpandable
}

export const stringify = (value: unknown): string => {
  if (
    value === null ||
    ["number", "bigint", "boolean"].includes(typeof value)
  ) {
    return String(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(stringify).join(", ")}]`
  }

  return JSON.stringify(value)
}

const stringifyConstraintMultipleOf = (schema: SchemaObject) => {
  if (typeof schema?.multipleOf !== "number") return null
  if (schema.multipleOf <= 0) return null
  if (schema.multipleOf === 1) return null

  const { multipleOf } = schema

  if (Number.isInteger(multipleOf)) {
    return `multiple of ${multipleOf}`
  }

  const decimalPlaces = multipleOf.toString().split(".")[1].length
  const factor = 10 ** decimalPlaces
  const numerator = multipleOf * factor
  const denominator = factor
  return `multiple of ${numerator}/${denominator}`
}

const stringifyConstraintNumberRange = (schema: SchemaObject) => {
  const minimum = schema?.minimum
  const maximum = schema?.maximum
  const exclusiveMinimum = schema?.exclusiveMinimum
  const exclusiveMaximum = schema?.exclusiveMaximum
  const hasMinimum = typeof minimum === "number"
  const hasMaximum = typeof maximum === "number"
  const hasExclusiveMinimum = typeof exclusiveMinimum === "number"
  const hasExclusiveMaximum = typeof exclusiveMaximum === "number"
  const isMinExclusive = hasExclusiveMinimum && (!hasMinimum || minimum < exclusiveMinimum) // prettier-ignore
  const isMaxExclusive = hasExclusiveMaximum && (!hasMaximum || maximum > exclusiveMaximum) // prettier-ignore

  if (
    (hasMinimum || hasExclusiveMinimum) &&
    (hasMaximum || hasExclusiveMaximum)
  ) {
    const minSymbol = isMinExclusive ? "(" : "["
    const maxSymbol = isMaxExclusive ? ")" : "]"
    const minValue = isMinExclusive ? exclusiveMinimum : minimum
    const maxValue = isMaxExclusive ? exclusiveMaximum : maximum
    return `${minSymbol}${minValue}, ${maxValue}${maxSymbol}`
  }
  if (hasMinimum || hasExclusiveMinimum) {
    const minSymbol = isMinExclusive ? ">" : "≥"
    const minValue = isMinExclusive ? exclusiveMinimum : minimum
    return `${minSymbol} ${minValue}`
  }
  if (hasMaximum || hasExclusiveMaximum) {
    const maxSymbol = isMaxExclusive ? "<" : "≤"
    const maxValue = isMaxExclusive ? exclusiveMaximum : maximum
    return `${maxSymbol} ${maxValue}`
  }

  return null
}

const stringifyConstraintRange = (
  label: string,
  min: unknown,
  max: unknown
) => {
  const hasMin = typeof min === "number"
  const hasMax = typeof max === "number"

  if (hasMin && hasMax) {
    if (min === max) {
      return `${min} ${label}`
    } else {
      return `[${min}, ${max}] ${label}`
    }
  }
  if (hasMin) {
    return `≥ ${min} ${label}`
  }
  if (hasMax) {
    return `≤ ${max} ${label}`
  }

  return null
}

export const stringifyConstraints = (schema: Schema): Constraint[] => {
  const constraints: Constraint[] = []
  const schemaObject = toSchemaObject(schema)

  // validation Keywords for Numeric Instances (number and integer)
  const multipleOf = stringifyConstraintMultipleOf(schemaObject)
  if (multipleOf !== null) {
    constraints.push({ scope: "number", value: multipleOf })
  }
  const numberRange = stringifyConstraintNumberRange(schemaObject)
  if (numberRange !== null) {
    constraints.push({ scope: "number", value: numberRange })
  }

  // vocabularies for Semantic Content With "format"
  if (schemaObject.format) {
    constraints.push({ scope: "string", value: schemaObject.format })
  }

  // validation Keywords for Strings
  const stringRange = stringifyConstraintRange(
    "characters",
    schemaObject.minLength,
    schemaObject.maxLength
  )
  if (stringRange !== null) {
    constraints.push({ scope: "string", value: stringRange })
  }
  if (schemaObject.pattern) {
    constraints.push({
      scope: "string",
      value: `matches ${schemaObject.pattern}`,
    })
  }

  // vocabulary for the Contents of String-Encoded Data
  if (schemaObject.contentMediaType) {
    constraints.push({
      scope: "string",
      value: `media type: ${schemaObject.contentMediaType}`,
    })
  }
  if (schemaObject.contentEncoding) {
    constraints.push({
      scope: "string",
      value: `encoding: ${schemaObject.contentEncoding}`,
    })
  }

  // validation Keywords for Arrays
  const arrayRange = stringifyConstraintRange(
    schemaObject.uniqueItems ? "unique items" : "items",
    schemaObject.minItems,
    schemaObject.maxItems
  )
  if (arrayRange !== null) {
    constraints.push({ scope: "array", value: arrayRange })
  }
  if (schemaObject.uniqueItems && !arrayRange) {
    constraints.push({ scope: "array", value: "unique" })
  }
  const containsRange = stringifyConstraintRange(
    "contained items",
    schemaObject.minContains,
    schemaObject.maxContains
  )
  if (containsRange !== null) {
    constraints.push({ scope: "array", value: containsRange })
  }

  // validation Keywords for Objects
  const objectRange = stringifyConstraintRange(
    "properties",
    schemaObject.minProperties,
    schemaObject.maxProperties
  )
  if (objectRange !== null) {
    constraints.push({ scope: "object", value: objectRange })
  }

  return constraints
}

export const getDependentRequired = (
  propertyName: string,
  schema: Schema
): string[] => {
  const { dependentRequired } = toSchemaObject(schema)
  if (!dependentRequired) return []

  return Array.from(
    Object.entries(dependentRequired).reduce((acc, [prop, list]) => {
      if (!Array.isArray(list)) return acc
      if (!list.includes(propertyName)) return acc

      acc.add(prop)

      return acc
    }, new Set<string>())
  )
}

export const isPlainObject = (
  value: unknown
): value is Record<string, unknown> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  (Object.getPrototypeOf(value) === null ||
    Object.getPrototypeOf(value) === Object.prototype)

/**
 * Returns `value` when it is a plain object, otherwise an empty object; for
 * reading OpenAPI objects (`xml`, `discriminator`, `externalDocs`) of a schema.
 */
export const toPlainObject = <T extends object = Record<string, unknown>>(
  value: unknown
): T => (isPlainObject(value) ? (value as T) : ({} as T))

/**
 * The OpenAPI Specification Extensions (`x-*` fields) of an OpenAPI object.
 */
export const getOpenAPIExtensions = (value: unknown): string[] =>
  isPlainObject(value)
    ? Object.keys(value).filter((key) => key.startsWith("x-"))
    : []

export const isEmptyObject = (value: unknown): boolean =>
  isPlainObject(value) && Object.keys(value).length === 0

export const isEmptyArray = (value: unknown): boolean =>
  Array.isArray(value) && value.length === 0

export const difference = <T>(value: T[], comparisonValue: T[]): T[] => {
  const comparisonSet = new Set(comparisonValue)
  return value.filter((item) => !comparisonSet.has(item))
}

export const getSchemaKeywords = (): string[] => {
  return [
    // core vocabulary
    "$schema",
    "$vocabulary",
    "$id",
    "$anchor",
    "$dynamicAnchor",
    "$dynamicRef",
    "$ref",
    "$defs",
    "$comment",
    // applicator vocabulary
    "allOf",
    "anyOf",
    "oneOf",
    "not",
    "if",
    "then",
    "else",
    "dependentSchemas",
    "prefixItems",
    "items",
    "contains",
    "properties",
    "patternProperties",
    "additionalProperties",
    "propertyNames",
    // unevaluated Locations vocabulary
    "unevaluatedItems",
    "unevaluatedProperties",
    // validation vocabulary
    // validation Keywords for Any Instance Type
    "type",
    "enum",
    "const",
    // validation Keywords for Numeric Instances (number and integer)
    "multipleOf",
    "maximum",
    "exclusiveMaximum",
    "minimum",
    "exclusiveMinimum",
    // validation Keywords for Strings
    "maxLength",
    "minLength",
    "pattern",
    // validation Keywords for Arrays
    "maxItems",
    "minItems",
    "uniqueItems",
    "maxContains",
    "minContains",
    // validation Keywords for Objects
    "maxProperties",
    "minProperties",
    "required",
    "dependentRequired",
    // basic Meta-Data Annotations vocabulary
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples",
    // semantic Content With "format" vocabulary
    "format",
    // contents of String-Encoded Data vocabulary
    "contentEncoding",
    "contentMediaType",
    "contentSchema",
  ]
}

export const makeGetExtensionKeywords = (fnAccessor: FnAccessor) => {
  const getExtensionKeywords = (schema: Schema): string[] => {
    const fn = fnAccessor()
    const keywords = fn.getSchemaKeywords()

    return isPlainObject(schema)
      ? difference(Object.keys(schema), keywords)
      : []
  }

  return getExtensionKeywords
}

export const hasSchemaType = (
  schema: unknown,
  type: string | string[]
): boolean => {
  const isSchemaImmutable = Map.isMap(schema)

  if (!isSchemaImmutable && !isPlainObject(schema)) {
    return false
  }

  const hasType = (schemaType: unknown) =>
    type === schemaType ||
    (Array.isArray(type) && type.includes(schemaType as string))

  const schemaType = isSchemaImmutable
    ? (schema as Map<string, unknown>).get("type")
    : (schema as SchemaObject).type

  if (List.isList(schemaType) || Array.isArray(schemaType)) {
    return (
      schemaType as { some: (fn: (t: unknown) => boolean) => boolean }
    ).some((t) => hasType(t))
  }

  return hasType(schemaType)
}
