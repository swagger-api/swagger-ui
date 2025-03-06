/**
 * @prettier
 */
export const upperFirst = (value) => {
  if (typeof value === "string") {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
  }
  return value
}

/**
 * Lookup can be `basic` or `extended`. By default the lookup is `extended`.
 */
export const makeGetTitle = (fnAccessor) => {
  const getTitle = (schema, { lookup = "extended" } = {}) => {
    const fn = fnAccessor()

    if (schema?.title != null) return fn.upperFirst(String(schema.title))
    if (lookup === "extended") {
      if (schema?.$anchor != null) return fn.upperFirst(String(schema.$anchor))
      if (schema?.$id != null) return String(schema.$id)
    }

    return ""
  }

  return getTitle
}

export const makeGetType = (fnAccessor) => {
  const getType = (schema, processedSchemas = new WeakSet()) => {
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
        Object.hasOwn(schema, "maxLength")
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

  return getType
}

export const isBooleanJSONSchema = (schema) => typeof schema === "boolean"

export const hasKeyword = (schema, keyword) =>
  schema !== null &&
  typeof schema === "object" &&
  Object.hasOwn(schema, keyword)

export const makeIsExpandable = (fnAccessor) => {
  const isExpandable = (schema) => {
    const fn = fnAccessor()

    return (
      schema?.$schema ||
      schema?.$vocabulary ||
      schema?.$id ||
      schema?.$anchor ||
      schema?.$dynamicAnchor ||
      schema?.$ref ||
      schema?.$dynamicRef ||
      schema?.$defs ||
      schema?.$comment ||
      schema?.allOf ||
      schema?.anyOf ||
      schema?.oneOf ||
      fn.hasKeyword(schema, "not") ||
      fn.hasKeyword(schema, "if") ||
      fn.hasKeyword(schema, "then") ||
      fn.hasKeyword(schema, "else") ||
      schema?.dependentSchemas ||
      schema?.prefixItems ||
      fn.hasKeyword(schema, "items") ||
      fn.hasKeyword(schema, "contains") ||
      schema?.properties ||
      schema?.patternProperties ||
      fn.hasKeyword(schema, "additionalProperties") ||
      fn.hasKeyword(schema, "propertyNames") ||
      fn.hasKeyword(schema, "unevaluatedItems") ||
      fn.hasKeyword(schema, "unevaluatedProperties") ||
      schema?.description ||
      schema?.enum ||
      fn.hasKeyword(schema, "const") ||
      fn.hasKeyword(schema, "contentSchema") ||
      fn.hasKeyword(schema, "default") ||
      schema?.examples ||
      fn.getExtensionKeywords(schema).length > 0
    )
  }

  return isExpandable
}

export const stringify = (value) => {
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

const stringifyConstraintMultipleOf = (schema) => {
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

const stringifyConstraintNumberRange = (schema) => {
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

const stringifyConstraintRange = (label, min, max) => {
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
    return `>= ${min} ${label}`
  }
  if (hasMax) {
    return `<= ${max} ${label}`
  }

  return null
}

export const stringifyConstraints = (schema) => {
  const constraints = []

  // validation Keywords for Numeric Instances (number and integer)
  const multipleOf = stringifyConstraintMultipleOf(schema)
  if (multipleOf !== null) {
    constraints.push({ scope: "number", value: multipleOf })
  }
  const numberRange = stringifyConstraintNumberRange(schema)
  if (numberRange !== null) {
    constraints.push({ scope: "number", value: numberRange })
  }

  // vocabularies for Semantic Content With "format"
  if (schema?.format) {
    constraints.push({ scope: "string", value: schema.format })
  }

  // validation Keywords for Strings
  const stringRange = stringifyConstraintRange(
    "characters",
    schema?.minLength,
    schema?.maxLength
  )
  if (stringRange !== null) {
    constraints.push({ scope: "string", value: stringRange })
  }
  if (schema?.pattern) {
    constraints.push({ scope: "string", value: `matches ${schema?.pattern}` })
  }

  // vocabulary for the Contents of String-Encoded Data
  if (schema?.contentMediaType) {
    constraints.push({
      scope: "string",
      value: `media type: ${schema.contentMediaType}`,
    })
  }
  if (schema?.contentEncoding) {
    constraints.push({
      scope: "string",
      value: `encoding: ${schema.contentEncoding}`,
    })
  }

  // validation Keywords for Arrays
  const arrayRange = stringifyConstraintRange(
    schema?.uniqueItems ? "unique items" : "items",
    schema?.minItems,
    schema?.maxItems
  )
  if (arrayRange !== null) {
    constraints.push({ scope: "array", value: arrayRange })
  }
  if (schema?.uniqueItems && !arrayRange) {
    constraints.push({ scope: "array", value: "unique" })
  }
  const containsRange = stringifyConstraintRange(
    "contained items",
    schema?.minContains,
    schema?.maxContains
  )
  if (containsRange !== null) {
    constraints.push({ scope: "array", value: containsRange })
  }

  // validation Keywords for Objects
  const objectRange = stringifyConstraintRange(
    "properties",
    schema?.minProperties,
    schema?.maxProperties
  )
  if (objectRange !== null) {
    constraints.push({ scope: "object", value: objectRange })
  }

  return constraints
}

export const getDependentRequired = (propertyName, schema) => {
  if (!schema?.dependentRequired) return []

  return Array.from(
    Object.entries(schema.dependentRequired).reduce((acc, [prop, list]) => {
      if (!Array.isArray(list)) return acc
      if (!list.includes(propertyName)) return acc

      acc.add(prop)

      return acc
    }, new Set())
  )
}

export const isPlainObject = (value) =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  (Object.getPrototypeOf(value) === null ||
    Object.getPrototypeOf(value) === Object.prototype)

export const isEmptyObject = (value) =>
  isPlainObject(value) && Object.keys(value).length === 0

export const isEmptyArray = (value) =>
  Array.isArray(value) && value.length === 0

export const difference = (value, comparisonValue) => {
  const comparisonSet = new Set(comparisonValue)
  return value.filter((item) => !comparisonSet.has(item))
}

export const getSchemaKeywords = () => {
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

export const makeGetExtensionKeywords = (fnAccessor) => {
  const getExtensionKeywords = (schema) => {
    const fn = fnAccessor()
    const keywords = fn.getSchemaKeywords()

    return isPlainObject(schema)
      ? difference(Object.keys(schema), keywords)
      : []
  }

  return getExtensionKeywords
}
