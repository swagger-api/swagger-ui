/**
 * @prettier
 */
import { number as randomNumber } from "../core/random"
import formatAPI from "../api/formatAPI"

const generateFormat = (schema) => {
  const { format } = schema

  const formatGenerator = formatAPI(format)
  if (typeof formatGenerator === "function") {
    return formatGenerator(schema)
  }

  return randomNumber()
}

export const applyNumberConstraints = (number, constraints = {}) => {
  const { minimum, maximum, exclusiveMinimum, exclusiveMaximum } = constraints
  const { multipleOf } = constraints
  const epsilon = Number.isInteger(number) ? 1 : Number.EPSILON
  let minValue = typeof minimum === "number" ? minimum : null
  let maxValue = typeof maximum === "number" ? maximum : null
  let constrainedNumber = number

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
  constrainedNumber =
    (minValue > maxValue && number) || minValue || maxValue || constrainedNumber

  if (typeof multipleOf === "number" && multipleOf > 0) {
    const remainder = constrainedNumber % multipleOf
    constrainedNumber =
      remainder === 0
        ? constrainedNumber
        : constrainedNumber + multipleOf - remainder
  }

  return constrainedNumber
}

const numberType = (schema) => {
  const { format } = schema
  let generatedNumber

  if (typeof format === "string") {
    generatedNumber = generateFormat(schema)
  } else {
    generatedNumber = randomNumber()
  }

  return applyNumberConstraints(generatedNumber, schema)
}

export default numberType
