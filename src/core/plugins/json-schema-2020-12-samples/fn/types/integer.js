/**
 * @prettier
 */
import { integer as randomInteger } from "../core/random"
import formatAPI from "../api/formatAPI"

const generateFormat = (schema) => {
  const { format } = schema

  const formatGenerator = formatAPI(format)
  if (typeof formatGenerator === "function") {
    return formatGenerator(schema)
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
