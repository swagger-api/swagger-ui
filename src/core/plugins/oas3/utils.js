import memoizee from "memoizee"
import { fromJS } from "immutable"

/**
 * Convert OAS3 "Examples" (in requestBody) section and convert to Map
 * @param examplesInSpec {object} "examples" in OAS3 spec
 * @returns {Map} Map {name: {summary, description, value, externalValue}}
 */
export const getExamples = (examplesInSpec) => {
  return fromJS(examplesInSpec)
}

export const memoizedGetExamples = memoizee(getExamples)

/**
 * Convert 'value' to serialized format, so can be handled correctly in <input>
 * @param value value
 * @param parameter {OrderedMap} parameter in spec
 */
export const formatParamValue = (value, parameter) => {
  if (typeof ( value ) === "string") {
    return value
  } else {
    // TODO apply 'style', 'explode', 'allowReserved' in OAS3
    return JSON.stringify(value, null, 2)
  }
}
