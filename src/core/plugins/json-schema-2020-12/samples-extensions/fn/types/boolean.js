/**
 * @prettier
 */

const booleanType = (schema) => {
  return typeof schema.default === "boolean" ? schema.default : true
}

export default booleanType
