import { objectify, isFunc, normalizeArray } from "core/utils"
import XML from "xml"
import memoizee from "memoizee"

const primitives = {
  "string": () => "string",
  "string_email": () => "user@example.com",
  "string_date-time": () => new Date().toISOString(),
  "number": () => 0,
  "number_float": () => 0.0,
  "integer": () => 0,
  "boolean": () => true
}

const primitive = (schema) => {
  schema = objectify(schema)
  let { type, format } = schema

  let fn = primitives[`${type}_${format}`] || primitives[type]

  if(isFunc(fn))
    return fn(schema)

  return "Unknown Type: " + schema.type
}


export const sampleFromSchema = (schema, config={}) => {
  let { type, example, properties, additionalProperties, items } = objectify(schema)
  let { includeReadOnly } = config

  if(example !== undefined)
    return example

  if(!type) {
    if(properties) {
      type = "object"
    } else if(items) {
      type = "array"
    } else {
      return
    }
  }

  if(type === "object") {
    let props = objectify(properties)
    let obj = {},
     	isArrayPropertyType = false

    if (props.length) {
        isArrayPropertyType = true
        obj = []
    }

    for (var name in props) {
       if (isArrayPropertyType) {
            let innerObj = {}
            for (let innerName in props[name]) {
                if (!props[name][innerName].readOnly || includeReadOnly) {
                    innerObj[innerName] = sampleFromSchema(props[name][innerName], {
                        includeReadOnly: includeReadOnly
                    })
                }
            }
            obj.push(innerObj)
        } else {
            if (!props[name].readOnly || includeReadOnly) {
                obj[name] = sampleFromSchema(props[name], {
                    includeReadOnly: includeReadOnly
                })
            }
        }
    }

    if ( additionalProperties === true ) {
      obj.additionalProp1 = {}
    } else if ( additionalProperties ) {
      let additionalProps = objectify(additionalProperties)
      let additionalPropVal = sampleFromSchema(additionalProps, { includeReadOnly: includeReadOnly })

      for (let i = 1; i < 4; i++) {
        obj["additionalProp" + i] = additionalPropVal
      }
    }
    return obj
  }

  if(type === "array") {
    return [ sampleFromSchema(items, { includeReadOnly: includeReadOnly }) ]
  }

  if(schema["enum"]) {
    if(schema["default"])
      return schema["default"]
    return normalizeArray(schema["enum"])[0]
  }

  return primitive(schema)
}

export const inferSchema = (thing) => {
  if(thing.schema)
    thing = thing.schema

  if(thing.properties) {
    thing.type = "object"
  }

  return thing // Hopefully this will have something schema like in it... `type` for example
}


export const sampleXmlFromSchema = (schema, config={}) => {
  let objectifySchema = objectify(schema)
  let { type, properties, additionalProperties, items, example } = objectifySchema
  let { includeReadOnly } = config
  let defaultValue = objectifySchema.default
  let res = {}
  let _attr = {}
  let { xml } = schema
  let { name, prefix, namespace } = xml
  let enumValue = objectifySchema.enum
  let displayName, value

  if(!type) {
    if(properties || additionalProperties) {
      type = "object"
    } else if(items) {
      type = "array"
    } else {
      return
    }
  }

  name = name || "notagname"
  // add prefix to name if exists
  displayName = (prefix ? prefix + ":" : "") + name
  if ( namespace ) {
    //add prefix to namespace if exists
    let namespacePrefix = prefix ? ( "xmlns:" + prefix ) : "xmlns"
    _attr[namespacePrefix] = namespace
  }

  if (type === "array") {
    if (items) {
      items.xml = items.xml || xml || {}
      items.xml.name = items.xml.name || xml.name

      if (xml.wrapped) {
        res[displayName] = []
        if (Array.isArray(example)) {
          example.forEach((v)=>{
            items.example = v
            res[displayName].push(sampleXmlFromSchema(items, config))
          })
        } else if (Array.isArray(defaultValue)) {
          defaultValue.forEach((v)=>{
            items.default = v
            res[displayName].push(sampleXmlFromSchema(items, config))
          })
        } else {
          res[displayName] = [sampleXmlFromSchema(items, config)]
        }

        if (_attr) {
          res[displayName].push({_attr: _attr})
        }
        return res
      }

      let _res = []

      if (Array.isArray(example)) {
        example.forEach((v)=>{
          items.example = v
          _res.push(sampleXmlFromSchema(items, config))
        })
        return _res
      } else if (Array.isArray(defaultValue)) {
        defaultValue.forEach((v)=>{
          items.default = v
          _res.push(sampleXmlFromSchema(items, config))
        })
        return _res
      }

      return sampleXmlFromSchema(items, config)
    }
  }

  if (type === "object") {
    let props = objectify(properties)
    res[displayName] = []
    example = example || {}

    for (let propName in props) {
      if ( !props[propName].readOnly || includeReadOnly ) {
        props[propName].xml = props[propName].xml || {}

        if (props[propName].xml.attribute) {
          let enumAttrVal = Array.isArray(props[propName].enum) && props[propName].enum[0]
          let attrExample = props[propName].example
          let attrDefault = props[propName].default
          _attr[props[propName].xml.name || propName] = attrExample!== undefined && attrExample
            || example[propName] !== undefined && example[propName] || attrDefault !== undefined && attrDefault
            || enumAttrVal || primitive(props[propName])
        } else {
          props[propName].xml.name = props[propName].xml.name || propName
          props[propName].example = props[propName].example !== undefined ? props[propName].example : example[propName]
          let t = sampleXmlFromSchema(props[propName])
          if (Array.isArray(t)) {
            res[displayName] = res[displayName].concat(t)
          } else {
            res[displayName].push(t)
          }

        }
      }
    }

    if (additionalProperties === true) {
      res[displayName].push({additionalProp: "Anything can be here"})
    } else if (additionalProperties) {
      res[displayName].push({additionalProp: primitive(additionalProperties)})
    }

    if (_attr) {
      res[displayName].push({_attr: _attr})
    }
    return res
  }

  if (example !== undefined) {
    value = example
  } else if (defaultValue !== undefined) {
    //display example if exists
    value = defaultValue
  } else if (Array.isArray(enumValue)) {
    //display enum first value
    value = enumValue[0]
  } else {
    //set default value
    value = primitive(schema)
  }

  res[displayName] = _attr ? [{_attr: _attr}, value] : value

  return res
}

export function createXMLExample(schema, config) {
  let json = sampleXmlFromSchema(schema, config)
  if (!json) { return }

  return XML(json, { declaration: true, indent: "\t" })
}

export const memoizedCreateXMLExample = memoizee(createXMLExample)

export const memoizedSampleFromSchema = memoizee(sampleFromSchema)
