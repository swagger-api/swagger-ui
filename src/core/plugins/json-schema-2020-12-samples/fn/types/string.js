/**
 * @prettier
 */
import identity from "lodash/identity"

import { string as randomString, randexp } from "../core/random"
import { isJSONSchema } from "../core/predicates"
import formatAPI from "../api/formatAPI"
import encoderAPI from "../api/encoderAPI"
import mediaTypeAPI from "../api/mediaTypeAPI"

const generateFormat = (schema) => {
  const { format } = schema

  const formatGenerator = formatAPI(format)
  if (typeof formatGenerator === "function") {
    return formatGenerator(schema)
  }

  return randomString()
}

const generateMediaType = (schema) => {
  const { contentMediaType } = schema

  const mediaTypeGenerator = mediaTypeAPI(contentMediaType)
  if (typeof mediaTypeGenerator === "function") {
    return mediaTypeGenerator(schema)
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
    generatedString = applyStringConstraints(randexp(pattern), schema)
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
      generatedString = applyStringConstraints(String(sample), schema)
    }
  } else if (typeof contentMediaType === "string") {
    generatedString = generateMediaType(schema)
  } else {
    generatedString = applyStringConstraints(randomString(), schema)
  }

  return encode(generatedString)
}

export default stringType
