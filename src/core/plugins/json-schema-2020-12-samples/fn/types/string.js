/**
 * @prettier
 */
import identity from "lodash/identity"

import { string as randomString, randexp } from "../core/random"
import { isJSONSchema } from "../core/predicates"
import emailGenerator from "../generators/email"
import idnEmailGenerator from "../generators/idn-email"
import hostnameGenerator from "../generators/hostname"
import idnHostnameGenerator from "../generators/idn-hostname"
import ipv4Generator from "../generators/ipv4"
import ipv6Generator from "../generators/ipv6"
import uriGenerator from "../generators/uri"
import uriReferenceGenerator from "../generators/uri-reference"
import iriGenerator from "../generators/iri"
import iriReferenceGenerator from "../generators/iri-reference"
import uuidGenerator from "../generators/uuid"
import uriTemplateGenerator from "../generators/uri-template"
import jsonPointerGenerator from "../generators/json-pointer"
import relativeJsonPointerGenerator from "../generators/relative-json-pointer"
import dateTimeGenerator from "../generators/date-time"
import dateGenerator from "../generators/date"
import timeGenerator from "../generators/time"
import durationGenerator from "../generators/duration"
import passwordGenerator from "../generators/password"
import regexGenerator from "../generators/regex"
import formatAPI from "../api/formatAPI"
import encoderAPI from "../api/encoderAPI"
import mediaTypeAPI from "../api/mediaTypeAPI"

const generateFormat = (schema) => {
  const { format } = schema

  const formatGenerator = formatAPI(format)
  if (typeof formatGenerator === "function") {
    return formatGenerator(schema)
  }

  switch (format) {
    case "email": {
      return emailGenerator()
    }
    case "idn-email": {
      return idnEmailGenerator()
    }
    case "hostname": {
      return hostnameGenerator()
    }
    case "idn-hostname": {
      return idnHostnameGenerator()
    }
    case "ipv4": {
      return ipv4Generator()
    }
    case "ipv6": {
      return ipv6Generator()
    }
    case "uri": {
      return uriGenerator()
    }
    case "uri-reference": {
      return uriReferenceGenerator()
    }
    case "iri": {
      return iriGenerator()
    }
    case "iri-reference": {
      return iriReferenceGenerator()
    }
    case "uuid": {
      return uuidGenerator()
    }
    case "uri-template": {
      return uriTemplateGenerator()
    }
    case "json-pointer": {
      return jsonPointerGenerator()
    }
    case "relative-json-pointer": {
      return relativeJsonPointerGenerator()
    }
    case "date-time": {
      return dateTimeGenerator()
    }
    case "date": {
      return dateGenerator()
    }
    case "time": {
      return timeGenerator()
    }
    case "duration": {
      return durationGenerator()
    }
    case "password": {
      return passwordGenerator()
    }
    case "regex": {
      return regexGenerator()
    }
  }

  return randomString()
}

const applyStringConstraints = (string, constraints = {}) => {
  const { maxLength, minLength } = constraints
  let constrainedString = string

  if (Number.isInteger(maxLength) && maxLength > 0) {
    constrainedString = constrainedString.slice(0, maxLength)
  }
  if (Number.isInteger(minLength) && minLength > 0) {
    let i = 0
    while (constrainedString.length < minLength) {
      constrainedString += constrainedString[i++ % constrainedString.length]
    }
  }

  return constrainedString
}
const stringType = (schema, { sample } = {}) => {
  const { contentEncoding, contentMediaType, contentSchema } = schema
  const { pattern, format } = schema
  const encode = encoderAPI(contentEncoding) || identity
  let generatedString

  if (typeof pattern === "string") {
    generatedString = randexp(pattern)
  } else if (typeof format === "string") {
    generatedString = generateFormat(schema)
  } else if (
    isJSONSchema(contentSchema) &&
    typeof contentMediaType === "string" &&
    typeof sample !== "undefined"
  ) {
    if (Array.isArray(sample) || typeof sample === "object") {
      generatedString = JSON.stringify(sample)
    } else {
      generatedString = String(sample)
    }
  } else if (typeof contentMediaType === "string") {
    const mediaTypeGenerator = mediaTypeAPI(contentMediaType)
    if (typeof mediaTypeGenerator === "function") {
      generatedString = mediaTypeGenerator(schema)
    }
  } else {
    generatedString = randomString()
  }

  return encode(applyStringConstraints(generatedString, schema))
}

export default stringType
