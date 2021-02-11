import { objectify, isFunc, normalizeArray, deeplyStripKey } from "core/utils"
import XML from "@kyleshockey/xml"
import memoizee from "memoizee"
import isEmpty from "lodash/isEmpty"

const primitives = {
  "string": () => "string",
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

const liftSampleHelper = (oldSchema, target) => {
  if(target.example === undefined && oldSchema.example !== undefined) {
    target.example = oldSchema.example
  }
  if(target.default === undefined && oldSchema.default !== undefined) {
    target.default = oldSchema.default
  }
  if(target.enum === undefined && oldSchema.enum !== undefined) {
    target.enum = oldSchema.enum
  }
  if(target.xml === undefined && oldSchema.xml !== undefined) {
    target.xml = oldSchema.xml
  }
  if(target.type === undefined && oldSchema.type !== undefined) {
    target.type = oldSchema.type
  }
  return target
}

export const sampleFromSchemaGeneric = (schema, config={}, exampleOverride = undefined, respectXML = false) => {
  schema = objectify(schema)
  let usePlainValue = exampleOverride !== undefined || schema.example !== undefined || schema && schema.default !== undefined
  // first check if there is the need of combining this schema with others required by allOf
  const hasOneOf = !usePlainValue && schema && schema.oneOf && schema.oneOf.length > 0
  const hasAnyOf = !usePlainValue && schema && schema.anyOf && schema.anyOf.length > 0
  if(!usePlainValue && (hasOneOf || hasAnyOf)) {
    const schemaToAdd = objectify(hasOneOf
      ? schema.oneOf[0]
      : schema.anyOf[0]
    )
    liftSampleHelper(schemaToAdd, schema)
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
        if (!props.hasOwnProperty(propName)) {
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
  let { xml, type, example, properties, additionalProperties, items } = schema
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

  // try recover missing type
  if(schema && !type) {
    if(properties || additionalProperties) {
      type = "object"
    } else if(items) {
      type = "array"
    } else if(!usePlainValue && !schema.enum){
      return
    }
  }

  // add to result helper init for xml or json
  const props = objectify(properties)
  let addPropertyToResult
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
      if (Array.isArray(t)) {
        res[displayName] = res[displayName].concat(t)
      } else {
        res[displayName].push(t)
      }
    }
  } else {
    addPropertyToResult = (propName, overrideE) => {

      res[propName] = sampleFromSchemaGeneric(props[propName], config, overrideE, respectXML)
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
      const itemSamples = sample
        .map(s => sampleFromSchemaGeneric(itemSchema, config, s, respectXML))
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
        if (!sample.hasOwnProperty(propName)) {
          continue
        }
        if (schema && props[propName] && props[propName].readOnly && !includeReadOnly) {
          continue
        }
        if (schema && props[propName] && props[propName].writeOnly && !includeWriteOnly) {
          continue
        }
        if (schema && props[propName] && props[propName].xml && props[propName].xml.attribute && !(example && example[propName])) {
          _attr[props[propName].xml.name || propName] = sample[propName]
          continue
        }
        if (schema && props[propName] && props[propName].xml && props[propName].xml.attribute) {
          _attr[props[propName].xml.name || propName] = example[propName]
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
      if (!props.hasOwnProperty(propName)) {
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

    if ( additionalProperties === true ) {
      if(respectXML) {
        res[displayName].push({additionalProp: "Anything can be here"})
      } else {
        res.additionalProp1 = {}
      }
    } else if ( additionalProperties ) {
      const additionalProps = objectify(additionalProperties)
      const additionalPropSample = sampleFromSchemaGeneric(additionalProps, config, undefined, respectXML)

      if(respectXML && additionalProps.xml && additionalProps.xml.name && additionalProps.xml.name !== "notagname")
      {
        res[displayName].push(additionalPropSample)
      } else {
        for (let i = 1; i < 4; i++) {
          if(respectXML) {
            const temp = {}
            temp["additionalProp" + i] = additionalPropSample["notagname"]
            res[displayName].push(temp)
          } else {
            res["additionalProp" + i] = additionalPropSample
          }
        }
      }
    }
    if (respectXML && _attr) {
      res[displayName].push({_attr: _attr})
    }

    return res
  }

  if(type === "array") {
    let sampleArray
    if(respectXML) {
      items.xml = items.xml || schema.xml || {}
      items.xml.name = items.xml.name || xml.name
    }
    if(Array.isArray(items.anyOf)) {
      sampleArray = items.anyOf.map(i => sampleFromSchemaGeneric(liftSampleHelper(items, i), config, undefined, respectXML))
    } else if(Array.isArray(items.oneOf)) {
      sampleArray = items.oneOf.map(i => sampleFromSchemaGeneric(liftSampleHelper(items, i), config, undefined, respectXML))
    } else if(!respectXML || respectXML && xml.wrapped) {
      sampleArray = [sampleFromSchemaGeneric(items, config, undefined, respectXML)]
    } else {
      return sampleFromSchemaGeneric(items, config, undefined, respectXML)
    }
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

export const memoizedCreateXMLExample = memoizee(createXMLExample)

export const memoizedSampleFromSchema = memoizee(sampleFromSchema)
