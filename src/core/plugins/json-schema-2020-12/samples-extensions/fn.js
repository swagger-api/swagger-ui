/**
 * @prettier
 */
import XML from "xml"
import RandExp from "randexp"
import isEmpty from "lodash/isEmpty"

import { objectify, isFunc, normalizeArray, deeplyStripKey } from "core/utils"
import memoizeN from "../../../../helpers/memoizeN"

const stringFromRegex = (pattern) => {
  try {
    const randexp = new RandExp(pattern)
    return randexp.gen()
  } catch {
    // invalid regex should not cause a crash (regex syntax varies across languages)
    return "string"
  }
}

const contentEncodings = {
  "7bit": (content) => Buffer.from(content).toString("ascii"),
  "8bit": (content) => Buffer.from(content).toString("utf8"),
  binary: (content) => Buffer.from(content).toString("binary"),
  "quoted-printable": (content) => {
    let quotedPrintable = ""

    for (let i = 0; i < content.length; i++) {
      const charCode = content.charCodeAt(i)

      if (charCode === 61) {
        // ASCII content of "="
        quotedPrintable += "=3D"
      } else if (
        (charCode >= 33 && charCode <= 60) ||
        (charCode >= 62 && charCode <= 126) ||
        charCode === 9 ||
        charCode === 32
      ) {
        quotedPrintable += content.charAt(i)
      } else if (charCode === 13 || charCode === 10) {
        quotedPrintable += "\r\n"
      } else if (charCode > 126) {
        // convert non-ASCII characters to UTF-8 and encode each byte
        const utf8 = unescape(encodeURIComponent(content.charAt(i)))
        for (let j = 0; j < utf8.length; j++) {
          quotedPrintable +=
            "=" +
            ("0" + utf8.charCodeAt(j).toString(16)).slice(-2).toUpperCase()
        }
      } else {
        quotedPrintable +=
          "=" + ("0" + charCode.toString(16)).slice(-2).toUpperCase()
      }
    }

    return quotedPrintable
  },
  base16: (content) => Buffer.from(content).toString("hex"),
  base32: (content) => {
    const utf8Value = Buffer.from(content).toString("utf8")
    const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    let paddingCount = 0
    let base32Str = ""
    let buffer = 0
    let bufferLength = 0

    for (let i = 0; i < utf8Value.length; i++) {
      buffer = (buffer << 8) | utf8Value.charCodeAt(i)
      bufferLength += 8

      while (bufferLength >= 5) {
        base32Str += base32Alphabet.charAt((buffer >>> (bufferLength - 5)) & 31)
        bufferLength -= 5
      }
    }

    if (bufferLength > 0) {
      base32Str += base32Alphabet.charAt((buffer << (5 - bufferLength)) & 31)
      paddingCount = (8 - ((utf8Value.length * 8) % 5)) % 5
    }

    for (let i = 0; i < paddingCount; i++) {
      base32Str += "="
    }

    return base32Str
  },
  base64: (content) => Buffer.from(content).toString("base64"),
}

const encodeContent = (content, encoding) => {
  if (typeof contentEncodings[encoding] === "function") {
    return contentEncodings[encoding](content)
  }
  return content
}

/* eslint-disable camelcase */
const primitives = {
  string: (schema) => {
    const { pattern, contentEncoding } = schema
    const content = pattern ? stringFromRegex(pattern) : "string"
    return encodeContent(content, contentEncoding)
  },
  string_email: (schema) => {
    const { contentEncoding } = schema
    const content = "user@example.com"
    return encodeContent(content, contentEncoding)
  },
  "string_idn-email": (schema) => {
    const { contentEncoding } = schema
    const content = "실례@example.com"
    return encodeContent(content, contentEncoding)
  },
  string_hostname: (schema) => {
    const { contentEncoding } = schema
    const content = "example.com"
    return encodeContent(content, contentEncoding)
  },
  "string_idn-hostname": (schema) => {
    const { contentEncoding } = schema
    const content = "실례.com"
    return encodeContent(content, contentEncoding)
  },
  string_ipv4: (schema) => {
    const { contentEncoding } = schema
    const content = "198.51.100.42"
    return encodeContent(content, contentEncoding)
  },
  string_ipv6: (schema) => {
    const { contentEncoding } = schema
    const content = "2001:0db8:5b96:0000:0000:426f:8e17:642a"
    return encodeContent(content, contentEncoding)
  },
  string_uri: (schema) => {
    const { contentEncoding } = schema
    const content = "https://example.com/"
    return encodeContent(content, contentEncoding)
  },
  "string_uri-reference": (schema) => {
    const { contentEncoding } = schema
    const content = "path/index.html"
    return encodeContent(content, contentEncoding)
  },
  string_iri: (schema) => {
    const { contentEncoding } = schema
    const content = "https://실례.com/"
    return encodeContent(content, contentEncoding)
  },
  "string_iri-reference": (schema) => {
    const { contentEncoding } = schema
    const content = "path/실례.html"
    return encodeContent(content, contentEncoding)
  },
  string_uuid: (schema) => {
    const { contentEncoding } = schema
    const content = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    return encodeContent(content, contentEncoding)
  },
  "string_uri-template": (schema) => {
    const { contentEncoding } = schema
    const content = "https://example.com/dictionary/{term:1}/{term}"
    return encodeContent(content, contentEncoding)
  },
  "string_json-pointer": (schema) => {
    const { contentEncoding } = schema
    const content = "/a/b/c"
    return encodeContent(content, contentEncoding)
  },
  "string_relative-json-pointer": (schema) => {
    const { contentEncoding } = schema
    const content = "1/0"
    return encodeContent(content, contentEncoding)
  },
  "string_date-time": (schema) => {
    const { contentEncoding } = schema
    const content = new Date().toISOString()
    return encodeContent(content, contentEncoding)
  },
  string_date: (schema) => {
    const { contentEncoding } = schema
    const content = new Date().toISOString().substring(0, 10)
    return encodeContent(content, contentEncoding)
  },
  string_time: (schema) => {
    const { contentEncoding } = schema
    const content = new Date().toISOString().substring(11)
    return encodeContent(content, contentEncoding)
  },
  string_duration: (schema) => {
    const { contentEncoding } = schema
    const content = "P3D" // expresses a duration of 3 days
    return encodeContent(content, contentEncoding)
  },
  string_password: (schema) => {
    const { contentEncoding } = schema
    const content = "********"
    return encodeContent(content, contentEncoding)
  },
  string_regex: (schema) => {
    const { contentEncoding } = schema
    const content = "^[a-z]+$"
    return encodeContent(content, contentEncoding)
  },
  number: () => 0,
  number_float: () => 0.1,
  number_double: () => 0.1,
  integer: () => 0,
  integer_int32: () => (2 ** 30) >>> 0,
  integer_int64: () => 2 ** 53 - 1,
  boolean: (schema) =>
    typeof schema.default === "boolean" ? schema.default : true,
  null: () => null,
}
/* eslint-enable camelcase */

const primitive = (schema) => {
  schema = objectify(schema)
  const { type: typeList, format } = schema
  const type = Array.isArray(typeList) ? typeList.at(0) : typeList

  const fn = primitives[`${type}_${format}`] || primitives[type]

  return typeof fn === "function" ? fn(schema) : `Unknown Type: ${schema.type}`
}

const isURI = (uri) => {
  try {
    return new URL(uri) && true
  } catch {
    return false
  }
}

const applyArrayConstraints = (array, constraints = {}) => {
  const { minItems, maxItems, uniqueItems } = constraints
  const { contains, minContains, maxContains } = constraints
  let constrainedArray = [...array]

  if (contains != null && typeof contains === "object") {
    if (Number.isInteger(minContains) && minContains > 1) {
      const containsItem = constrainedArray.at(0)
      for (let i = 1; i < minContains; i += 1) {
        constrainedArray.unshift(containsItem)
      }
    }
    if (Number.isInteger(maxContains) && maxContains > 0) {
      /**
       * This is noop. `minContains` already generate minimum required
       * number of items that satisfies `contains`. `maxContains` would
       * have no effect.
       */
    }
  }

  if (Number.isInteger(maxItems) && maxItems > 0) {
    constrainedArray = array.slice(0, maxItems)
  }
  if (Number.isInteger(minItems) && minItems > 0) {
    for (let i = 0; constrainedArray.length < minItems; i += 1) {
      constrainedArray.push(constrainedArray[i % constrainedArray.length])
    }
  }

  if (uniqueItems === true) {
    /**
     *  If uniqueItems is true, it implies that every item in the array must be unique.
     *  This overrides any minItems constraint that cannot be satisfied with unique items.
     *  So if minItems is greater than the number of unique items,
     *  it should be reduced to the number of unique items.
     */
    constrainedArray = Array.from(new Set(constrainedArray))
  }

  return constrainedArray
}

/**
 * Do a couple of quick sanity tests to ensure the value
 * looks like a $$ref that swagger-client generates.
 */
const sanitizeRef = (value) =>
  deeplyStripKey(value, "$$ref", (val) => typeof val === "string" && isURI(val))

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
const stringConstraints = ["minLength", "maxLength", "pattern"]

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
  if (schema && isFunc(schema.toJS)) schema = schema.toJS()
  let usePlainValue =
    exampleOverride !== undefined ||
    (schema && schema.example !== undefined) ||
    (schema && schema.default !== undefined)
  // first check if there is the need of combining this schema with others required by allOf
  const hasOneOf =
    !usePlainValue && schema && schema.oneOf && schema.oneOf.length > 0
  const hasAnyOf =
    !usePlainValue && schema && schema.anyOf && schema.anyOf.length > 0
  if (!usePlainValue && (hasOneOf || hasAnyOf)) {
    const schemaToAdd = objectify(hasOneOf ? schema.oneOf[0] : schema.anyOf[0])
    liftSampleHelper(schemaToAdd, schema, config)
    if (!schema.xml && schemaToAdd.xml) {
      schema.xml = schemaToAdd.xml
    }
    if (schema.example !== undefined && schemaToAdd.example !== undefined) {
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
  let {
    xml,
    type,
    example,
    properties,
    additionalProperties,
    items,
    contains,
  } = schema || {}
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
            ? props[propName].enum[0]
            : undefined
          const attrExample = props[propName].example
          const attrDefault = props[propName].default

          if (attrExample !== undefined) {
            _attr[props[propName].xml.name || propName] = attrExample
          } else if (attrDefault !== undefined) {
            _attr[props[propName].xml.name || propName] = attrDefault
          } else if (enumAttrVal !== undefined) {
            _attr[props[propName].xml.name || propName] = enumAttrVal
          } else {
            _attr[props[propName].xml.name || propName] = primitive(
              props[propName]
            )
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
      sample = sanitizeRef(exampleOverride)
    } else if (example !== undefined) {
      sample = sanitizeRef(example)
    } else {
      sample = sanitizeRef(schema.default)
    }

    // if json just return
    if (!respectXML) {
      // spacial case yaml parser can not know about
      if (typeof sample === "number" && type?.includes("string")) {
        return `${sample}`
      }
      // return if sample does not need any parsing
      if (typeof sample !== "string" || type?.includes("string")) {
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
    if (type?.includes("array")) {
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

      itemSamples = applyArrayConstraints(itemSamples, schema)
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
    if (type?.includes("object")) {
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
  if (type?.includes("array")) {
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

    sampleArray = applyArrayConstraints(sampleArray, schema)
    if (respectXML && xml.wrapped) {
      res[displayName] = sampleArray
      if (!isEmpty(_attr)) {
        res[displayName].push({ _attr: _attr })
      }
      return res
    }

    return sampleArray
  }

  if (type?.includes("object")) {
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
      const additionalProps = objectify(additionalProperties)
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
    value = normalizeArray(schema.enum)[0]
  } else if (schema) {
    // display schema default
    value = primitive(schema)
    if (typeof value === "number") {
      const { minimum, maximum, exclusiveMinimum, exclusiveMaximum } = schema
      const { multipleOf } = schema
      const epsilon = Number.isInteger(value) ? 1 : Number.EPSILON
      let minValue = typeof minimum === "number" ? minimum : null
      let maxValue = typeof maximum === "number" ? maximum : null

      if (typeof exclusiveMinimum === "number") {
        minValue =
          minValue !== null
            ? Math.max(minValue, exclusiveMinimum + epsilon)
            : exclusiveMinimum + epsilon
      }
      if (typeof exclusiveMaximum === "number") {
        maxValue =
          maxValue !== null
            ? Math.min(maxValue, exclusiveMaximum - epsilon)
            : exclusiveMaximum - epsilon
      }
      value = (minValue > maxValue && value) || minValue || maxValue || value

      if (typeof multipleOf === "number" && multipleOf > 0) {
        const remainder = value % multipleOf
        value = remainder === 0 ? value : value + multipleOf - remainder
      }
    }
    if (typeof value === "string") {
      if (Number.isInteger(schema.maxLength) && schema.maxLength > 0) {
        value = value.slice(0, schema.maxLength)
      }
      if (Number.isInteger(schema.minLength) && schema.minLength > 0) {
        let i = 0
        while (value.length < schema.minLength) {
          value += value[i++ % value.length]
        }
      }
    }
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
