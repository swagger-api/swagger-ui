/**
 * @prettier
 */
const nullableStringTypeCaster = (value) =>
  value === null || value === "null" ? null : String(value)

export default nullableStringTypeCaster
