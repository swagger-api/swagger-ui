/**
 * @prettier
 */
import { integer as randomInteger } from "../core/random"
import formatAPI from "../api/formatAPI"
import int32Generator from "../generators/int32"
import int64Generator from "../generators/int64"
import { applyNumberConstraints } from "./number"

const generateFormat = (schema) => {
  const { format } = schema

  const formatGenerator = formatAPI(format)
  if (typeof formatGenerator === "function") {
    return formatGenerator(schema)
  }

  switch (format) {
    case "int32": {
      return int32Generator()
    }
    case "int64": {
      return int64Generator()
    }
  }

  return randomInteger()
}

const integerType = (schema) => {
  const { format } = schema
  let generatedInteger

  if (typeof format === "string") {
    generatedInteger = generateFormat(schema)
  } else {
    generatedInteger = randomInteger()
  }

  return applyNumberConstraints(generatedInteger, schema)
}

export default integerType
