/**
 * @prettier
 */
import identity from "lodash/identity"

import { string as randomString, randexp } from "../core/random"
import { isJSONSchema } from "../core/predicates"
import { padZeros } from "../core/utils"
import formatAPI from "../api/formatAPI"
import encoderAPI from "../api/encoderAPI"
import mediaTypeAPI from "../api/mediaTypeAPI"

const generateFormat = (schema, opts = {}) => {
  const { format } = schema

  const formatGenerator = formatAPI(format)
  if (typeof formatGenerator === "function") {
    return formatGenerator(schema, opts)
  }

  return randomString()
}

const generateMediaType = (schema, opts = {}) => {
  const { contentMediaType } = schema

  const mediaTypeGenerator = mediaTypeAPI(contentMediaType)
  if (typeof mediaTypeGenerator === "function") {
    return mediaTypeGenerator(schema, opts)
  }

  return randomString()
}

const generateConstrainedIndexedString = (idx, isPropertyName, constraints = {}) => {
  const { maxLength, minLength } = constraints
  let generatedString = isPropertyName ? "additionalProp" : "string"
  let num = "" + idx
  if (Number.isInteger(minLength) && minLength > 0 && minLength > generatedString.length + num.length) {
    num = padZeros(idx, minLength - generatedString.length)
  }
  if (Number.isInteger(maxLength) && maxLength > 0 && maxLength < generatedString.length + num.length) {
    generatedString = ""
  }
  return generatedString + num
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

const stringType = (schema, { sample, idx, isPropertyName } = {}) => {
  const { contentEncoding, contentMediaType, contentSchema } = schema
  const { pattern, format } = schema
  const encode = encoderAPI(contentEncoding) || identity
  let generatedString

  if (typeof pattern === "string") {
    generatedString = randexp(pattern)
  } else if (typeof format === "string") {
    generatedString = generateFormat(schema, {idx: idx})
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
    generatedString = generateMediaType(schema, {idx: idx})
  } else if (Number.isInteger(idx) && idx >= 0) {
    generatedString = generateConstrainedIndexedString(idx, isPropertyName, schema)
  } else {
    generatedString = randomString()
  }

  return encode(applyStringConstraints(generatedString, schema))
}

export default stringType
