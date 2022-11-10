import XML from "xml"
import RandExp from "randexp"
import isEmpty from "lodash/isEmpty"
import { objectify, isFunc, normalizeArray, deeplyStripKey } from "core/utils"

import memoizeN from "../../../helpers/memoizeN"

const generateStringFromRegex = (pattern) => {
  try {
    const randexp = new RandExp(pattern)
    return randexp.gen()
  } catch (e) {
    // Invalid regex should not cause a crash (regex syntax varies across languages)
    return "string"
  }
}

const primitives = {
  "string": (schema) => schema.pattern ? generateStringFromRegex(schema.pattern) : "string",
  "string_email": () => "user@example.com",
  "string_date-time": () => new Date().toISOString(),
  "string_date": () => new Date().toISOString().substring(0, 10),
  "string_uuid": () => "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "string_hostname": () => "example.com",
  "string_ipv4": () => "198.51.100.42",
  "string_ipv6": () => "2001:0db8:5b96:0000:0000:426f:8e17:642a",
  "number": () => 0,
  "number_float": () => 0.0,
  "integer": () => 0,
  "boolean": (schema) => typeof schema.default === "boolean" ? schema.default : true
}

const primitive = (schema) => {
  schema = objectify(schema)
  let { type, format } = schema

  let fn = primitives[`${type}_${format}`] || primitives[type]

  if(isFunc(fn))
    return fn(schema)

  return "Unknown Type: " + schema.type
}

// do a couple of quick sanity tests to ensure the value
// looks like a $$ref that swagger-client generates.
const sanitizeRef = (value) => deeplyStripKey(value, "$$ref", (val) =>
  typeof val === "string" && val.indexOf("#") > -1)

const objectContracts = ["maxProperties", "minProperties"]
const arrayContracts = ["minItems", "maxItems"]
const numberContracts = [
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum"
]
const stringContracts = ["minLength", "maxLength"]

const liftSampleHelper = (oldSchema, target, config = {}) => {
  const setIfNotDefinedInTarget = (key) => {
    if(target[key] === undefined && oldSchema[key] !== undefined) {
      target[key] = oldSchema[key]
    }
  }

  [
    "example",
    "default",
    "enum",
    "xml",
    "type",
    ...objectContracts,
    ...arrayContracts,
    ...numberContracts,
    ...stringContracts,
  ].forEach(key => setIfNotDefinedInTarget(key))

  if(oldSchema.required !== undefined && Array.isArray(oldSchema.required)) {
    if(target.required === undefined || !target.required.length) {
      target.required = []
    }
    oldSchema.required.forEach(key => {
      if(target.required.includes(key)) {
        return
      }
      target.required.push(key)
    })
  }
  if(oldSchema.properties) {
    if(!target.properties) {
      target.properties = {}
    }
    let props = objectify(oldSchema.properties)
    for (let propName in props) {
      if (!Object.prototype.hasOwnProperty.call(props, propName)) {
        continue
      }
      if ( props[propName] && props[propName].deprecated ) {
        continue
      }
      if ( props[propName] && props[propName].readOnly && !config.includeReadOnly ) {
        continue
      }
      if ( props[propName] && props[propName].writeOnly && !config.includeWriteOnly ) {
        continue
      }
      if(!target.properties[propName]) {
        target.properties[propName] = props[propName]
        if(!oldSchema.required && Array.isArray(oldSchema.required) && oldSchema.required.indexOf(propName) !== -1) {
          if(!target.required) {
            target.required = [propName]
          } else {
            target.required.push(propName)
          }
        }
      }
    }
  }
  if(oldSchema.items) {
    if(!target.items) {
      target.items = {}
    }
    target.items = liftSampleHelper(oldSchema.items, target.items, config)
  }

  return target
}

export const sampleFromSchemaGeneric = (schema, config={}, exampleOverride = undefined, respectXML = false) => {
  if(schema && isFunc(schema.toJS))
    schema = schema.toJS()
  let usePlainValue = exampleOverride !== undefined || schema && schema.example !== undefined || schema && schema.default !== undefined
  // first check if there is the need of combining this schema with others required by allOf
  const hasOneOf = !usePlainValue && schema && schema.oneOf && schema.oneOf.length > 0
  const hasAnyOf = !usePlainValue && schema && schema.anyOf && schema.anyOf.length > 0
  if(!usePlainValue && (hasOneOf || hasAnyOf)) {
    const schemaToAdd = objectify(hasOneOf
      ? schema.oneOf[0]
      : schema.anyOf[0]
    )
    liftSampleHelper(schemaToAdd, schema, config)
    if(!schema.xml && schemaToAdd.xml) {
      schema.xml = schemaToAdd.xml
    }
    if(schema.example !== undefined && schemaToAdd.example !== undefined) {
      usePlainValue = true
    } else if(schemaToAdd.properties) {
      if(!schema.properties) {
        schema.properties = {}
      }
      let props = objectify(schemaToAdd.properties)
      for (let propName in props) {
        if (!Object.prototype.hasOwnProperty.call(props, propName)) {
          continue
        }
        if ( props[propName] && props[propName].deprecated ) {
          continue
        }
        if ( props[propName] && props[propName].readOnly && !config.includeReadOnly ) {
          continue
        }
        if ( props[propName] && props[propName].writeOnly && !config.includeWriteOnly ) {
          continue
        }
        if(!schema.properties[propName]) {
          schema.properties[propName] = props[propName]
          if(!schemaToAdd.required && Array.isArray(schemaToAdd.required) && schemaToAdd.required.indexOf(propName) !== -1) {
            if(!schema.required) {
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
  let { xml, type, example, properties, additionalProperties, items } = schema || {}
  let { includeReadOnly, includeWriteOnly } = config
  xml = xml || {}
  let { name, prefix, namespace } = xml
  let displayName
  let res = {}

  // set xml naming and attributes
  if(respectXML) {
    name = name || "notagname"
    // add prefix to name if exists
    displayName = (prefix ? prefix + ":" : "") + name
    if ( namespace ) {
      //add prefix to namespace if exists
      let namespacePrefix = prefix ? ( "xmlns:" + prefix ) : "xmlns"
      _attr[namespacePrefix] = namespace
    }
  }

  // init xml default response sample obj
  if(respectXML) {
    res[displayName] = []
  }

  const schemaHasAny = (keys) => keys.some(key => Object.prototype.hasOwnProperty.call(schema, key))
  // try recover missing type
  if(schema && !type) {
    if(properties || additionalProperties || schemaHasAny(objectContracts)) {
      type = "object"
    } else if(items || schemaHasAny(arrayContracts)) {
      type = "array"
    } else if(schemaHasAny(numberContracts)) {
      type = "number"
      schema.type = "number"
    } else if(!usePlainValue && !schema.enum){
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

  const handleMinMaxItems = (sampleArray) => {
    if (schema?.maxItems !== null && schema?.maxItems !== undefined) {
      sampleArray = sampleArray.slice(0, schema?.maxItems)
    }
    if (schema?.minItems !== null && schema?.minItems !== undefined) {
      let i = 0
      while (sampleArray.length < schema?.minItems) {
        sampleArray.push(sampleArray[i++ % sampleArray.length])
      }
    }
    return sampleArray
  }

  // add to result helper init for xml or json
  const props = objectify(properties)
  let addPropertyToResult
  let propertyAddedCounter = 0

  const hasExceededMaxProperties = () => schema
    && schema.maxProperties !== null && schema.maxProperties !== undefined
    && propertyAddedCounter >= schema.maxProperties

  const requiredPropertiesToAdd = () => {
    if(!schema || !schema.required) {
      return 0
    }
    let addedCount = 0
    if(respectXML) {
      schema.required.forEach(key => addedCount +=
        res[key] === undefined
          ? 0
          : 1
      )
    } else {
      schema.required.forEach(key => addedCount +=
        res[displayName]?.find(x => x[key] !== undefined) === undefined
          ? 0
          : 1
      )
    }
    return schema.required.length - addedCount
  }

  const isOptionalProperty = (propName) => {
    if(!schema || !schema.required || !schema.required.length) {
      return true
    }
    return !schema.required.includes(propName)
  }

  const canAddProperty = (propName) => {
    if(!schema || schema.maxProperties === null || schema.maxProperties === undefined) {
      return true
    }
    if(hasExceededMaxProperties()) {
      return false
    }
    if(!isOptionalProperty(propName)) {
      return true
    }
    return (schema.maxProperties - propertyAddedCounter - requiredPropertiesToAdd()) > 0
  }

  if(respectXML) {
    addPropertyToResult = (propName, overrideE = undefined) => {
      if(schema && props[propName]) {
        // case it is an xml attribute
        props[propName].xml = props[propName].xml || {}

        if (props[propName].xml.attribute) {
          const enumAttrVal = Array.isArray(props[propName].enum)
            ? props[propName].enum[0]
            : undefined
          const attrExample = props[propName].example
          const attrDefault = props[propName].default

          if(attrExample !== undefined) {
            _attr[props[propName].xml.name || propName] = attrExample
          } else if(attrDefault !== undefined) {
            _attr[props[propName].xml.name || propName] = attrDefault
          } else if(enumAttrVal !== undefined) {
            _attr[props[propName].xml.name || propName] = enumAttrVal
          } else {
            _attr[props[propName].xml.name || propName] = primitive(props[propName])
          }

          return
        }
        props[propName].xml.name = props[propName].xml.name || propName
      } else if(!props[propName] && additionalProperties !== false) {
        // case only additionalProperty that is not defined in schema
        props[propName] = {
          xml: {
            name: propName
          }
        }
      }

      let t = sampleFromSchemaGeneric(schema && props[propName] || undefined, config, overrideE, respectXML)
      if(!canAddProperty(propName)) {
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
      if(!canAddProperty(propName)) {
        return
      }
      if(Object.prototype.hasOwnProperty.call(schema, "discriminator") &&
        schema.discriminator &&
        Object.prototype.hasOwnProperty.call(schema.discriminator, "mapping") &&
        schema.discriminator.mapping &&
        Object.prototype.hasOwnProperty.call(schema, "$$ref") &&
        schema.$$ref &&
        schema.discriminator.propertyName === propName) {
        for (let pair in schema.discriminator.mapping){
          if (schema.$$ref.search(schema.discriminator.mapping[pair]) !== -1) {
            res[propName] = pair
            break
          }
        }
      } else {
        res[propName] = sampleFromSchemaGeneric(props[propName], config, overrideE, respectXML)
      }
      propertyAddedCounter++
    }
  }

  // check for plain value and if found use it to generate sample from it
  if(usePlainValue) {
    let sample
    if(exampleOverride !== undefined) {
      sample = sanitizeRef(exampleOverride)
    } else if(example !== undefined) {
      sample = sanitizeRef(example)
    } else {
      sample = sanitizeRef(schema.default)
    }

    // if json just return
    if(!respectXML) {
      // spacial case yaml parser can not know about
      if(typeof sample === "number" && type === "string") {
        return `${sample}`
      }
      // return if sample does not need any parsing
      if(typeof sample !== "string" || type === "string") {
        return sample
      }
      // check if sample is parsable or just a plain string
      try {
        return JSON.parse(sample)
      } catch(e) {
        // sample is just plain string return it
        return sample
      }
    }

    // recover missing type
    if(!schema) {
      type = Array.isArray(sample) ? "array" : typeof sample
    }

    // generate xml sample recursively for array case
    if(type === "array") {
      if (!Array.isArray(sample)) {
        if(typeof sample === "string") {
          return sample
        }
        sample = [sample]
      }
      const itemSchema = schema
        ? schema.items
        : undefined
      if(itemSchema) {
        itemSchema.xml = itemSchema.xml || xml || {}
        itemSchema.xml.name = itemSchema.xml.name || xml.name
      }
      let itemSamples = sample
        .map(s => sampleFromSchemaGeneric(itemSchema, config, s, respectXML))
      itemSamples = handleMinMaxItems(itemSamples)
      if(xml.wrapped) {
        res[displayName] = itemSamples
        if (!isEmpty(_attr)) {
          res[displayName].push({_attr: _attr})
        }
      }
      else {
        res = itemSamples
      }
      return res
    }

    // generate xml sample recursively for object case
    if(type === "object") {
      // case literal example
      if(typeof sample === "string") {
        return sample
      }
      for (let propName in sample) {
        if (!Object.prototype.hasOwnProperty.call(sample, propName)) {
          continue
        }
        if (schema && props[propName] && props[propName].readOnly && !includeReadOnly) {
          continue
        }
        if (schema && props[propName] && props[propName].writeOnly && !includeWriteOnly) {
          continue
        }
        if (schema && props[propName] && props[propName].xml && props[propName].xml.attribute) {
          _attr[props[propName].xml.name || propName] = sample[propName]
          continue
        }
        addPropertyToResult(propName, sample[propName])
      }
      if (!isEmpty(_attr)) {
        res[displayName].push({_attr: _attr})
      }

      return res
    }

    res[displayName] = !isEmpty(_attr) ? [{_attr: _attr}, sample] : sample
    return res
  }

  // use schema to generate sample

  if(type === "object") {
    for (let propName in props) {
      if (!Object.prototype.hasOwnProperty.call(props, propName)) {
        continue
      }
      if ( props[propName] && props[propName].deprecated ) {
        continue
      }
      if ( props[propName] && props[propName].readOnly && !includeReadOnly ) {
        continue
      }
      if ( props[propName] && props[propName].writeOnly && !includeWriteOnly ) {
        continue
      }
      addPropertyToResult(propName)
    }
    if (respectXML && _attr) {
      res[displayName].push({_attr: _attr})
    }

    if(hasExceededMaxProperties()) {
      return res
    }

    if ( additionalProperties === true ) {
      if(respectXML) {
        res[displayName].push({additionalProp: "Anything can be here"})
      } else {
        res.additionalProp1 = {}
      }
      propertyAddedCounter++
    } else if ( additionalProperties ) {
      const additionalProps = objectify(additionalProperties)
      const additionalPropSample = sampleFromSchemaGeneric(additionalProps, config, undefined, respectXML)

      if(respectXML && additionalProps.xml && additionalProps.xml.name && additionalProps.xml.name !== "notagname")
      {
        res[displayName].push(additionalPropSample)
      } else {
        const toGenerateCount = schema.minProperties !== null && schema.minProperties !== undefined && propertyAddedCounter < schema.minProperties
          ? schema.minProperties - propertyAddedCounter
          : 3
        for (let i = 1; i <= toGenerateCount; i++) {
          if(hasExceededMaxProperties()) {
            return res
          }
          if(respectXML) {
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

  if(type === "array") {
    if (!items) {
      return
    }

    let sampleArray
    if(respectXML) {
      items.xml = items.xml || schema?.xml || {}
      items.xml.name = items.xml.name || xml.name
    }

    if(Array.isArray(items.anyOf)) {
      sampleArray = items.anyOf.map(i => sampleFromSchemaGeneric(liftSampleHelper(items, i, config), config, undefined, respectXML))
    } else if(Array.isArray(items.oneOf)) {
      sampleArray = items.oneOf.map(i => sampleFromSchemaGeneric(liftSampleHelper(items, i, config), config, undefined, respectXML))
    } else if(!respectXML || respectXML && xml.wrapped) {
      sampleArray = [sampleFromSchemaGeneric(items, config, undefined, respectXML)]
    } else {
      return sampleFromSchemaGeneric(items, config, undefined, respectXML)
    }
    sampleArray = handleMinMaxItems(sampleArray)
    if(respectXML && xml.wrapped) {
      res[displayName] = sampleArray
      if (!isEmpty(_attr)) {
        res[displayName].push({_attr: _attr})
      }
      return res
    }
    return sampleArray
  }

  let value
  if (schema && Array.isArray(schema.enum)) {
    //display enum first value
    value = normalizeArray(schema.enum)[0]
  } else if(schema) {
    // display schema default
    value = primitive(schema)
    if(typeof value === "number") {
      let min = schema.minimum
      if(min !== undefined && min !== null) {
        if(schema.exclusiveMinimum) {
          min++
        }
        value = min
      }
      let max = schema.maximum
      if(max !== undefined && max !== null) {
        if(schema.exclusiveMaximum) {
          max--
        }
        value = max
      }
    }
    if(typeof value === "string") {
      if (schema.maxLength !== null && schema.maxLength !== undefined) {
        value = value.slice(0, schema.maxLength)
      }
      if (schema.minLength !== null && schema.minLength !== undefined) {
        let i = 0
        while (value.length < schema.minLength) {
          value += value[i++ % value.length]
        }
      }
    }
  } else {
    return
  }
  if (type === "file") {
    return
  }

  if(respectXML) {
    res[displayName] = !isEmpty(_attr) ? [{_attr: _attr}, value] : value
    return res
  }

  return value
}

export const inferSchema = (thing) => {
  if(thing.schema)
    thing = thing.schema

  if(thing.properties) {
    thing.type = "object"
  }

  return thing // Hopefully this will have something schema like in it... `type` for example
}

export const createXMLExample = (schema, config, o) => {
  const json = sampleFromSchemaGeneric(schema, config, o, true)
  if (!json) { return }
  if(typeof json === "string") {
    return json
  }
  return XML(json, { declaration: true, indent: "\t" })
}

export const sampleFromSchema = (schema, config, o) =>
  sampleFromSchemaGeneric(schema, config, o, false)

const resolver = (arg1, arg2, arg3) => [arg1, JSON.stringify(arg2), JSON.stringify(arg3)]

export const memoizedCreateXMLExample = memoizeN(createXMLExample, resolver)

export const memoizedSampleFromSchema = memoizeN(sampleFromSchema, resolver)
