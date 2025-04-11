/**
 * @prettier
 */
import { boolean as randomBoolean } from "../core/random"

const booleanType = (schema) => {
  return typeof schema.default === "boolean" ? schema.default : randomBoolean()
}

export default booleanType
