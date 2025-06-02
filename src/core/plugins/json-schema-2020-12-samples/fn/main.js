/**
 * @prettier
 */
import XML from "xml"
import isEmpty from "lodash/isEmpty"
import isPlainObject from "lodash/isPlainObject"

import { objectify, normalizeArray } from "core/utils"
import memoizeN from "core/utils/memoizeN"
import typeMap from "./types/index"
import { getType } from "./core/type"
import { typeCast } from "./core/utils"
import { hasExample, extractExample } from "./core/example"
import { pick as randomPick } from "./core/random"
import merge from "./core/merge"
import { isBooleanJSONSchema, isJSONSchemaObject } from "./core/predicates"

export const sampleFromSchemaGeneric = (
  schema,
  config = {},
  exampleOverride = undefined,
  respectXML = false
) => {
  // there is nothing to generate schema from
  if (schema == null && exampleOverride === undefined) return undefined

  if (typeof schema?.toJS === "function") schema = schema.toJS()
  schema = typeCast(schema)

  let usePlainValue = exampleOverride !== undefined || hasExample(schema)
  // first check if there is the need of combining this schema with others required by allOf
  const hasOneOf =
    !usePlainValue && Array.isArray(schema.oneOf) && schema.oneOf.length > 0
  const hasAnyOf =
    !usePlainValue && Array.isArray(schema.anyOf) && schema.anyOf.length > 0
  if (!usePlainValue && (hasOneOf || hasAnyOf)) {
    const schemaToAdd = typeCast(
      hasOneOf ? randomPick(schema.oneOf) : randomPick(schema.anyOf)
    )
    schema = merge(schema, schemaToAdd, config)
    if (!schema.xml && schemaToAdd.xml) {
      schema.xml = schemaToAdd.xml
    }
    if (hasExample(schema) && hasExample(schemaToAdd)) {
      usePlainValue = true
    }
  }
  const _attr = {}
  let { xml, properties, additionalProperties, items, contains } = schema || {}
  let type = getType(schema)
  let { includeReadOnly, includeWriteOnly } = config
  xml = xml || {}
  let { name, prefix, namespace } = xml
  let displayName
  let res = {}

  if (!Object.hasOwn(schema, "type")) {
    schema.type = type
  }

  // set xml naming and attributes
  if (respectXML) {
    name = name || "notagname"
    // add prefix to name if exists
    displayName = (prefix ? `${prefix}:` : "") + name
    if (namespace) {
      //add prefix to namespace if exists
      let namespacePrefix = prefix ? `xmlns:${prefix}` : "xmlns"
      _attr[namespacePrefix] = namespace
    }
  }

  // init xml default response sample obj
  if (respectXML) {
    res[displayName] = []
  }

  // add to result helper init for xml or json
  const props = objectify(properties)
  let addPropertyToResult
  let propertyAddedCounter = 0

  const hasExceededMaxProperties = () =>
    Number.isInteger(schema.maxProperties) &&
    schema.maxProperties > 0 &&
    propertyAddedCounter >= schema.maxProperties

  const requiredPropertiesToAdd = () => {
    if (!Array.isArray(schema.required) || schema.required.length === 0) {
      return 0
    }
    let addedCount = 0
    if (respectXML) {
      schema.required.forEach(
        (key) => (addedCount += res[key] === undefined ? 0 : 1)
      )
    } else {
      schema.required.forEach((key) => {
        addedCount +=
          res[displayName]?.find((x) => x[key] !== undefined) === undefined
            ? 0
            : 1
      })
    }
    return schema.required.length - addedCount
  }

  const isOptionalProperty = (propName) => {
    if (!Array.isArray(schema.required)) return true
    if (schema.required.length === 0) return true

    return !schema.required.includes(propName)
  }

  const canAddProperty = (propName) => {
    if (!(Number.isInteger(schema.maxProperties) && schema.maxProperties > 0)) {
      return true
    }
    if (hasExceededMaxProperties()) {
      return false
    }
    if (!isOptionalProperty(propName)) {
      return true
    }
    return (
      schema.maxProperties - propertyAddedCounter - requiredPropertiesToAdd() >
      0
    )
  }

  if (respectXML) {
    addPropertyToResult = (propName, overrideE = undefined) => {
      if (schema && props[propName]) {
        // case it is a xml attribute
        props[propName].xml = props[propName].xml || {}

        if (props[propName].xml.attribute) {
          const enumAttrVal = Array.isArray(props[propName].enum)
            ? randomPick(props[propName].enum)
            : undefined
          if (hasExample(props[propName])) {
            _attr[props[propName].xml.name || propName] = extractExample(
              props[propName]
            )
          } else if (enumAttrVal !== undefined) {
            _attr[props[propName].xml.name || propName] = enumAttrVal
          } else {
            const propSchema = typeCast(props[propName])
            const propSchemaType = getType(propSchema)
            const attrName = props[propName].xml.name || propName

            if (propSchemaType === "array") {
              const arraySample = sampleFromSchemaGeneric(
                props[propName],
                config,
                overrideE,
                false
              )
              _attr[attrName] = arraySample
                .map((item) => {
                  if (isPlainObject(item)) {
                    return "UnknownTypeObject"
                  }
                  if (Array.isArray(item)) {
                    return "UnknownTypeArray"
                  }
                  return item
                })
                .join(" ")
            } else {
              _attr[attrName] =
                propSchemaType === "object"
                  ? "UnknownTypeObject"
                  : typeMap[propSchemaType](propSchema)
            }
          }

          return
        }
        props[propName].xml.name = props[propName].xml.name || propName
      } else if (!props[propName] && additionalProperties !== false) {
        // case only additionalProperty that is not defined in schema
        props[propName] = {
          xml: {
            name: propName,
          },
        }
      }

      let t = sampleFromSchemaGeneric(
        props[propName],
        config,
        overrideE,
        respectXML
      )
      if (!canAddProperty(propName)) {
        return
      }

      propertyAddedCounter++
      if (Array.isArray(t)) {
        res[displayName] = res[displayName].concat(t)
      } else {
        res[displayName].push(t)
      }
    }
  } else {
    addPropertyToResult = (propName, overrideE) => {
      if (!canAddProperty(propName)) {
        return
      }
      if (
        isPlainObject(schema.discriminator?.mapping) &&
        schema.discriminator.propertyName === propName &&
        typeof schema.$$ref === "string"
      ) {
        for (const pair in schema.discriminator.mapping) {
          if (schema.$$ref.search(schema.discriminator.mapping[pair]) !== -1) {
            res[propName] = pair
            break
          }
        }
      } else {
        res[propName] = sampleFromSchemaGeneric(
          props[propName],
          config,
          overrideE,
          respectXML
        )
      }
      propertyAddedCounter++
    }
  }

  // check for plain value and if found use it to generate sample from it
  if (usePlainValue) {
    let sample
    if (exampleOverride !== undefined) {
      sample = exampleOverride
    } else {
      sample = extractExample(schema)
    }

    // if json just return
    if (!respectXML) {
      // special case yaml parser can not know about
      if (typeof sample === "number" && type === "string") {
        return `${sample}`
      }
      // return if sample does not need any parsing
      if (typeof sample !== "string" || type === "string") {
        return sample
      }
      // check if sample is parsable or just a plain string
      try {
        return JSON.parse(sample)
      } catch {
        // sample is just plain string return it
        return sample
      }
    }

    // generate xml sample recursively for array case
    if (type === "array") {
      if (!Array.isArray(sample)) {
        if (typeof sample === "string") {
          return sample
        }
        sample = [sample]
      }

      let itemSamples = []

      if (isJSONSchemaObject(items)) {
        items.xml = items.xml || xml || {}
        items.xml.name = items.xml.name || xml.name
        itemSamples = sample.map((s) =>
          sampleFromSchemaGeneric(items, config, s, respectXML)
        )
      }

      if (isJSONSchemaObject(contains)) {
        contains.xml = contains.xml || xml || {}
        contains.xml.name = contains.xml.name || xml.name
        itemSamples = [
          sampleFromSchemaGeneric(contains, config, undefined, respectXML),
          ...itemSamples,
        ]
      }

      itemSamples = typeMap.array(schema, { sample: itemSamples })
      if (xml.wrapped) {
        res[displayName] = itemSamples
        if (!isEmpty(_attr)) {
          res[displayName].push({ _attr: _attr })
        }
      } else {
        res = itemSamples
      }
      return res
    }

    // generate xml sample recursively for object case
    if (type === "object") {
      // case literal example
      if (typeof sample === "string") {
        return sample
      }
      for (const propName in sample) {
        if (!Object.hasOwn(sample, propName)) {
          continue
        }
        if (props[propName]?.readOnly && !includeReadOnly) {
          continue
        }
        if (props[propName]?.writeOnly && !includeWriteOnly) {
          continue
        }
        if (props[propName]?.xml?.attribute) {
          _attr[props[propName].xml.name || propName] = sample[propName]
          continue
        }
        addPropertyToResult(propName, sample[propName])
      }
      if (!isEmpty(_attr)) {
        res[displayName].push({ _attr: _attr })
      }

      return res
    }

    res[displayName] = !isEmpty(_attr) ? [{ _attr: _attr }, sample] : sample
    return res
  }

  // use schema to generate sample
  if (type === "array") {
    let sampleArray = []

    if (isJSONSchemaObject(contains)) {
      if (respectXML) {
        contains.xml = contains.xml || schema.xml || {}
        contains.xml.name = contains.xml.name || xml.name
      }

      if (Array.isArray(contains.anyOf)) {
        // eslint-disable-next-line no-unused-vars
        const { anyOf, ...containsWithoutAnyOf } = items

        sampleArray.push(
          ...contains.anyOf.map((anyOfSchema) =>
            sampleFromSchemaGeneric(
              merge(anyOfSchema, containsWithoutAnyOf, config),
              config,
              undefined,
              respectXML
            )
          )
        )
      } else if (Array.isArray(contains.oneOf)) {
        // eslint-disable-next-line no-unused-vars
        const { oneOf, ...containsWithoutOneOf } = items

        sampleArray.push(
          ...contains.oneOf.map((oneOfSchema) =>
            sampleFromSchemaGeneric(
              merge(oneOfSchema, containsWithoutOneOf, config),
              config,
              undefined,
              respectXML
            )
          )
        )
      } else if (!respectXML || (respectXML && xml.wrapped)) {
        sampleArray.push(
          sampleFromSchemaGeneric(contains, config, undefined, respectXML)
        )
      } else {
        return sampleFromSchemaGeneric(contains, config, undefined, respectXML)
      }
    }

    if (isJSONSchemaObject(items)) {
      if (respectXML) {
        items.xml = items.xml || schema.xml || {}
        items.xml.name = items.xml.name || xml.name
      }

      if (Array.isArray(items.anyOf)) {
        // eslint-disable-next-line no-unused-vars
        const { anyOf, ...itemsWithoutAnyOf } = items

        sampleArray.push(
          ...items.anyOf.map((i) =>
            sampleFromSchemaGeneric(
              merge(i, itemsWithoutAnyOf, config),
              config,
              undefined,
              respectXML
            )
          )
        )
      } else if (Array.isArray(items.oneOf)) {
        // eslint-disable-next-line no-unused-vars
        const { oneOf, ...itemsWithoutOneOf } = items

        sampleArray.push(
          ...items.oneOf.map((i) =>
            sampleFromSchemaGeneric(
              merge(i, itemsWithoutOneOf, config),
              config,
              undefined,
              respectXML
            )
          )
        )
      } else if (!respectXML || (respectXML && xml.wrapped)) {
        sampleArray.push(
          sampleFromSchemaGeneric(items, config, undefined, respectXML)
        )
      } else {
        return sampleFromSchemaGeneric(items, config, undefined, respectXML)
      }
    }

    sampleArray = typeMap.array(schema, { sample: sampleArray })
    if (respectXML && xml.wrapped) {
      res[displayName] = sampleArray
      if (!isEmpty(_attr)) {
        res[displayName].push({ _attr: _attr })
      }
      return res
    }

    return sampleArray
  }

  if (type === "object") {
    for (let propName in props) {
      if (!Object.hasOwn(props, propName)) {
        continue
      }
      if (props[propName]?.deprecated) {
        continue
      }
      if (props[propName]?.readOnly && !includeReadOnly) {
        continue
      }
      if (props[propName]?.writeOnly && !includeWriteOnly) {
        continue
      }
      addPropertyToResult(propName)
    }
    if (respectXML && _attr) {
      res[displayName].push({ _attr: _attr })
    }

    if (hasExceededMaxProperties()) {
      return res
    }

    if (isBooleanJSONSchema(additionalProperties) && additionalProperties) {
      if (respectXML) {
        res[displayName].push({ additionalProp: "Anything can be here" })
      } else {
        res.additionalProp1 = {}
      }
      propertyAddedCounter++
    } else if (isJSONSchemaObject(additionalProperties)) {
      const additionalProps = additionalProperties
      const additionalPropSample = sampleFromSchemaGeneric(
        additionalProps,
        config,
        undefined,
        respectXML
      )

      if (
        respectXML &&
        typeof additionalProps?.xml?.name === "string" &&
        additionalProps?.xml?.name !== "notagname"
      ) {
        res[displayName].push(additionalPropSample)
      } else {
        const toGenerateCount =
          Number.isInteger(schema.minProperties) &&
          schema.minProperties > 0 &&
          propertyAddedCounter < schema.minProperties
            ? schema.minProperties - propertyAddedCounter
            : 3
        for (let i = 1; i <= toGenerateCount; i++) {
          if (hasExceededMaxProperties()) {
            return res
          }
          if (respectXML) {
            const temp = {}
            temp["additionalProp" + i] = additionalPropSample["notagname"]
            res[displayName].push(temp)
          } else {
            res["additionalProp" + i] = additionalPropSample
          }
          propertyAddedCounter++
        }
      }
    }
    return res
  }

  let value
  if (typeof schema.const !== "undefined") {
    // display const value
    value = schema.const
  } else if (schema && Array.isArray(schema.enum)) {
    //display enum first value
    value = randomPick(normalizeArray(schema.enum))
  } else {
    // display schema default
    const contentSample = isJSONSchemaObject(schema.contentSchema)
      ? sampleFromSchemaGeneric(
          schema.contentSchema,
          config,
          undefined,
          respectXML
        )
      : undefined
    value = typeMap[type](schema, { sample: contentSample })
  }

  if (respectXML) {
    res[displayName] = !isEmpty(_attr) ? [{ _attr: _attr }, value] : value
    return res
  }

  return value
}

export const createXMLExample = (schema, config, o) => {
  const json = sampleFromSchemaGeneric(schema, config, o, true)
  if (!json) {
    return
  }
  if (typeof json === "string") {
    return json
  }
  return XML(json, { declaration: true, indent: "\t" })
}

export const sampleFromSchema = (schema, config, o) => {
  return sampleFromSchemaGeneric(schema, config, o, false)
}

const resolver = (arg1, arg2, arg3) => [
  arg1,
  JSON.stringify(arg2),
  JSON.stringify(arg3),
]

export const memoizedCreateXMLExample = memoizeN(createXMLExample, resolver)

export const memoizedSampleFromSchema = memoizeN(sampleFromSchema, resolver)
