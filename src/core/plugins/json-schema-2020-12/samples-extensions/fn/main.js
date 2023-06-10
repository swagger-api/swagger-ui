/**
 * @prettier
 */
import XML from "xml"
import isEmpty from "lodash/isEmpty"

import { objectify, normalizeArray } from "core/utils"
import memoizeN from "../../../../../helpers/memoizeN"
import typeMap from "./types/index"
import foldType from "./core/fold-type"
import { typeCast } from "./core/utils"
import { hasExample, extractExample } from "./core/example"
import { pick as randomPick } from "./core/random"

const objectConstraints = ["maxProperties", "minProperties", "required"]
const arrayConstraints = [
  "minItems",
  "maxItems",
  "uniqueItems",
  "minContains",
  "maxContains",
]
const numberConstraints = [
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
]
const stringConstraints = [
  "minLength",
  "maxLength",
  "pattern",
  "contentEncoding",
  "contentMediaType",
]

const liftSampleHelper = (oldSchema, target, config = {}) => {
  const setIfNotDefinedInTarget = (key) => {
    if (target[key] === undefined && oldSchema[key] !== undefined) {
      target[key] = oldSchema[key]
    }
  }

  ;[
    "example",
    "default",
    "enum",
    "xml",
    "type",
    "const",
    ...objectConstraints,
    ...arrayConstraints,
    ...numberConstraints,
    ...stringConstraints,
  ].forEach((key) => setIfNotDefinedInTarget(key))

  if (oldSchema.required !== undefined && Array.isArray(oldSchema.required)) {
    if (target.required === undefined || !target.required.length) {
      target.required = []
    }
    oldSchema.required.forEach((key) => {
      if (target.required.includes(key)) {
        return
      }
      target.required.push(key)
    })
  }
  if (oldSchema.properties) {
    if (!target.properties) {
      target.properties = {}
    }
    let props = objectify(oldSchema.properties)
    for (let propName in props) {
      if (!Object.hasOwn(props, propName)) {
        continue
      }
      if (props[propName] && props[propName].deprecated) {
        continue
      }
      if (
        props[propName] &&
        props[propName].readOnly &&
        !config.includeReadOnly
      ) {
        continue
      }
      if (
        props[propName] &&
        props[propName].writeOnly &&
        !config.includeWriteOnly
      ) {
        continue
      }
      if (!target.properties[propName]) {
        target.properties[propName] = props[propName]
        if (
          !oldSchema.required &&
          Array.isArray(oldSchema.required) &&
          oldSchema.required.indexOf(propName) !== -1
        ) {
          if (!target.required) {
            target.required = [propName]
          } else {
            target.required.push(propName)
          }
        }
      }
    }
  }
  if (oldSchema.items) {
    if (!target.items) {
      target.items = {}
    }
    target.items = liftSampleHelper(oldSchema.items, target.items, config)
  }

  return target
}

export const sampleFromSchemaGeneric = (
  schema,
  config = {},
  exampleOverride = undefined,
  respectXML = false
) => {
  if (typeof schema?.toJS === "function") schema = schema.toJS()
  schema = typeCast(schema)

  let usePlainValue = exampleOverride !== undefined || hasExample(schema)
  // first check if there is the need of combining this schema with others required by allOf
  const hasOneOf =
    !usePlainValue && schema && schema.oneOf && schema.oneOf.length > 0
  const hasAnyOf =
    !usePlainValue && schema && schema.anyOf && schema.anyOf.length > 0
  if (!usePlainValue && (hasOneOf || hasAnyOf)) {
    const schemaToAdd = typeCast(
      hasOneOf ? randomPick(schema.oneOf) : randomPick(schema.anyOf)
    )
    liftSampleHelper(schemaToAdd, schema, config)
    if (!schema.xml && schemaToAdd.xml) {
      schema.xml = schemaToAdd.xml
    }
    if (hasExample(schema) && hasExample(schemaToAdd)) {
      usePlainValue = true
    } else if (schemaToAdd.properties) {
      if (!schema.properties) {
        schema.properties = {}
      }
      let props = objectify(schemaToAdd.properties)
      for (let propName in props) {
        if (!Object.hasOwn(props, propName)) {
          continue
        }
        if (props[propName] && props[propName].deprecated) {
          continue
        }
        if (
          props[propName] &&
          props[propName].readOnly &&
          !config.includeReadOnly
        ) {
          continue
        }
        if (
          props[propName] &&
          props[propName].writeOnly &&
          !config.includeWriteOnly
        ) {
          continue
        }
        if (!schema.properties[propName]) {
          schema.properties[propName] = props[propName]
          if (
            !schemaToAdd.required &&
            Array.isArray(schemaToAdd.required) &&
            schemaToAdd.required.indexOf(propName) !== -1
          ) {
            if (!schema.required) {
              schema.required = [propName]
            } else {
              schema.required.push(propName)
            }
          }
        }
      }
    }
  }
  const _attr = {}
  let { xml, properties, additionalProperties, items, contains } = schema || {}
  let type = foldType(schema.type)
  let { includeReadOnly, includeWriteOnly } = config
  xml = xml || {}
  let { name, prefix, namespace } = xml
  let displayName
  let res = {}

  // set xml naming and attributes
  if (respectXML) {
    name = name || "notagname"
    // add prefix to name if exists
    displayName = (prefix ? prefix + ":" : "") + name
    if (namespace) {
      //add prefix to namespace if exists
      let namespacePrefix = prefix ? "xmlns:" + prefix : "xmlns"
      _attr[namespacePrefix] = namespace
    }
  }

  // init xml default response sample obj
  if (respectXML) {
    res[displayName] = []
  }

  const schemaHasAny = (keys) => keys.some((key) => Object.hasOwn(schema, key))
  // try recover missing type
  if (schema && typeof type !== "string" && !Array.isArray(type)) {
    if (properties || additionalProperties || schemaHasAny(objectConstraints)) {
      type = "object"
    } else if (items || contains || schemaHasAny(arrayConstraints)) {
      type = "array"
    } else if (schemaHasAny(numberConstraints)) {
      type = "number"
      schema.type = "number"
    } else if (!usePlainValue && !schema.enum) {
      // implicit cover schemaHasAny(stringContracts) or A schema without a type matches any data type is:
      // components:
      //   schemas:
      //     AnyValue:
      //       anyOf:
      //         - type: string
      //         - type: number
      //         - type: integer
      //         - type: boolean
      //         - type: array
      //           items: {}
      //         - type: object
      //
      // which would resolve to type: string
      type = "string"
      schema.type = "string"
    }
  }

  // add to result helper init for xml or json
  const props = objectify(properties)
  let addPropertyToResult
  let propertyAddedCounter = 0

  const hasExceededMaxProperties = () =>
    schema &&
    Number.isInteger(schema.maxProperties) &&
    schema.maxProperties > 0 &&
    propertyAddedCounter >= schema.maxProperties

  const requiredPropertiesToAdd = () => {
    if (!schema || !schema.required) {
      return 0
    }
    let addedCount = 0
    if (respectXML) {
      schema.required.forEach(
        (key) => (addedCount += res[key] === undefined ? 0 : 1)
      )
    } else {
      schema.required.forEach(
        (key) =>
          (addedCount +=
            res[displayName]?.find((x) => x[key] !== undefined) === undefined
              ? 0
              : 1)
      )
    }
    return schema.required.length - addedCount
  }

  const isOptionalProperty = (propName) => {
    if (!schema || !schema.required || !schema.required.length) {
      return true
    }
    return !schema.required.includes(propName)
  }

  const canAddProperty = (propName) => {
    if (!schema || schema.maxProperties == null) {
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
        // case it is an xml attribute
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
            const attrName = props[propName].xml.name || propName
            _attr[attrName] = typeMap[propSchema.type](propSchema)
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
        (schema && props[propName]) || undefined,
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
        Object.hasOwn(schema, "discriminator") &&
        schema.discriminator &&
        Object.hasOwn(schema.discriminator, "mapping") &&
        schema.discriminator.mapping &&
        Object.hasOwn(schema, "$$ref") &&
        schema.$$ref &&
        schema.discriminator.propertyName === propName
      ) {
        for (let pair in schema.discriminator.mapping) {
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
      // spacial case yaml parser can not know about
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
      } catch (e) {
        // sample is just plain string return it
        return sample
      }
    }

    // recover missing type
    if (!schema) {
      type = Array.isArray(sample) ? "array" : typeof sample
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

      if (items != null && typeof items === "object") {
        items.xml = items.xml || xml || {}
        items.xml.name = items.xml.name || xml.name
        itemSamples = sample.map((s) =>
          sampleFromSchemaGeneric(items, config, s, respectXML)
        )
      }

      if (contains != null && typeof contains === "object") {
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
      for (let propName in sample) {
        if (!Object.hasOwn(sample, propName)) {
          continue
        }
        if (
          schema &&
          props[propName] &&
          props[propName].readOnly &&
          !includeReadOnly
        ) {
          continue
        }
        if (
          schema &&
          props[propName] &&
          props[propName].writeOnly &&
          !includeWriteOnly
        ) {
          continue
        }
        if (
          schema &&
          props[propName] &&
          props[propName].xml &&
          props[propName].xml.attribute
        ) {
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

    if (contains != null && typeof contains === "object") {
      if (respectXML) {
        contains.xml = contains.xml || schema?.xml || {}
        contains.xml.name = contains.xml.name || xml.name
      }

      if (Array.isArray(contains.anyOf)) {
        sampleArray.push(
          ...contains.anyOf.map((i) =>
            sampleFromSchemaGeneric(
              liftSampleHelper(contains, i, config),
              config,
              undefined,
              respectXML
            )
          )
        )
      } else if (Array.isArray(contains.oneOf)) {
        sampleArray.push(
          ...contains.oneOf.map((i) =>
            sampleFromSchemaGeneric(
              liftSampleHelper(contains, i, config),
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

    if (items != null && typeof items === "object") {
      if (respectXML) {
        items.xml = items.xml || schema?.xml || {}
        items.xml.name = items.xml.name || xml.name
      }

      if (Array.isArray(items.anyOf)) {
        sampleArray.push(
          ...items.anyOf.map((i) =>
            sampleFromSchemaGeneric(
              liftSampleHelper(items, i, config),
              config,
              undefined,
              respectXML
            )
          )
        )
      } else if (Array.isArray(items.oneOf)) {
        sampleArray.push(
          ...items.oneOf.map((i) =>
            sampleFromSchemaGeneric(
              liftSampleHelper(items, i, config),
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
      if (props[propName] && props[propName].deprecated) {
        continue
      }
      if (props[propName] && props[propName].readOnly && !includeReadOnly) {
        continue
      }
      if (props[propName] && props[propName].writeOnly && !includeWriteOnly) {
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

    if (additionalProperties === true) {
      if (respectXML) {
        res[displayName].push({ additionalProp: "Anything can be here" })
      } else {
        res.additionalProp1 = {}
      }
      propertyAddedCounter++
    } else if (additionalProperties) {
      const additionalProps = typeCast(additionalProperties)
      const additionalPropSample = sampleFromSchemaGeneric(
        additionalProps,
        config,
        undefined,
        respectXML
      )

      if (
        respectXML &&
        additionalProps.xml &&
        additionalProps.xml.name &&
        additionalProps.xml.name !== "notagname"
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
  if (typeof schema?.const !== "undefined") {
    // display const value
    value = schema.const
  } else if (schema && Array.isArray(schema.enum)) {
    //display enum first value
    value = randomPick(normalizeArray(schema.enum))
  } else if (schema) {
    // display schema default
    const contentSample = Object.hasOwn(schema, "contentSchema")
      ? sampleFromSchemaGeneric(
          typeCast(schema.contentSchema),
          config,
          undefined,
          respectXML
        )
      : undefined
    value = typeMap[type](schema, { sample: contentSample })
  } else {
    return
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
