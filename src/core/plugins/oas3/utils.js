import memoizee from "memoizee"
import { OrderedMap } from "immutable"

/**
 * Convert OAS3 "Examples" (in requestBody) section and convert to Map
 * @param examplesInSpec {object} "examples" in OAS3 spec
 * @returns {Map} Map {name: {summary, description, value, externalValue}}
 */
export const getExamples = (examplesInSpec) => {
  let result = null
  if (examplesInSpec !== undefined) {
    examplesInSpec = examplesInSpec.toJS()
  } else {
    return result
  }

  result = new OrderedMap()
  for (let exampleName in examplesInSpec) {
    result = result.set(exampleName, examplesInSpec[exampleName])
  }

  return result
}

export const memoizedGetExamples = memoizee(getExamples)
