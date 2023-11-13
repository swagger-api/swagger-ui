/**
 * @prettier
 */
import { integer as randomInteger } from "../core/random"
import formatAPI from "../api/formatAPI"
import int32Generator from "../generators/int32"
import int64Generator from "../generators/int64"

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

  if (typeof format === "string") {
    return generateFormat(schema)
  }

  return randomInteger()
}

export default integerType
