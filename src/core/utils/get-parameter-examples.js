/**
 * @prettier
 */

import Im from "immutable"

const getCurrentExample = (examples, activeExampleKey) => {
  if (!Im.Map.isMap(examples) || !examples.size) {
    return undefined
  }

  if (
    activeExampleKey !== undefined &&
    activeExampleKey !== null &&
    examples.has(activeExampleKey)
  ) {
    return examples.get(activeExampleKey)
  }

  return examples.first()
}

const getExampleValue = (example) => {
  if (Im.Map.isMap(example)) {
    return example.get("value")
  }

  return example
}

const getParameterMediaType = (parameter, parameterMediaType) => {
  if (parameterMediaType) {
    return parameterMediaType
  }

  return parameter.get("content", Im.Map()).keySeq().first()
}

export const getParameterExamples = (
  parameter,
  { parameterMediaType } = {}
) => {
  if (!Im.Map.isMap(parameter)) {
    return undefined
  }

  const examples = parameter.get("examples")

  if (Im.Map.isMap(examples) && examples.size) {
    return examples
  }

  const mediaType = getParameterMediaType(parameter, parameterMediaType)
  const contentExamples = mediaType
    ? parameter.getIn(["content", mediaType, "examples"])
    : undefined

  if (Im.Map.isMap(contentExamples) && contentExamples.size) {
    return contentExamples
  }

  return undefined
}

export const getParameterExample = (
  parameter,
  { parameterMediaType, activeExampleKey } = {}
) => {
  const examples = getParameterExamples(parameter, { parameterMediaType })

  if (!examples) {
    return undefined
  }

  return getCurrentExample(examples, activeExampleKey)
}

export const getParameterExampleValue = (
  parameter,
  { parameterMediaType, activeExampleKey } = {}
) => {
  if (!Im.Map.isMap(parameter)) {
    return undefined
  }

  const exampleValue = getExampleValue(
    getParameterExample(parameter, { parameterMediaType, activeExampleKey })
  )

  if (exampleValue !== undefined) {
    return exampleValue
  }

  const mediaType = getParameterMediaType(parameter, parameterMediaType)
  const contentExample = mediaType
    ? parameter.getIn(["content", mediaType, "example"])
    : undefined

  if (contentExample !== undefined) {
    return contentExample
  }

  if (parameter.get("example") !== undefined) {
    return parameter.get("example")
  }

  const schemaExamples = parameter.getIn(["schema", "examples"])
  const firstSchemaExample = Im.Iterable.isIndexed(schemaExamples)
    ? schemaExamples.first()
    : undefined

  if (firstSchemaExample !== undefined) {
    return firstSchemaExample
  }

  return parameter.getIn(["schema", "example"])
}
