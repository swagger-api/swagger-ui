import memoizee from "memoizee"

/**
 * Convert OAS3 "Examples" (in requestBody) section and convert to array
 * @param examplesInSpec
 * @returns {Array} array of {name, summary, description, value, externalValue}
 */
export const getExamples = (examplesInSpec) => {
  let result = []
  if (examplesInSpec !== undefined) {
    examplesInSpec = examplesInSpec.toJS()
  } else {
    return result
  }

  for (let exampleName in examplesInSpec) {
    result.push(Object.assign({}, {name: exampleName}, examplesInSpec[exampleName]))
  }

  return result
}

export const memoizedGetExamples = memoizee(getExamples)
