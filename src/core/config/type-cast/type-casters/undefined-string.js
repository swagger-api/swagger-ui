/**
 * @prettier
 */
const undefinedStringTypeCaster = (value) =>
  value === undefined || value === "undefined" ? undefined : String(value)

export default undefinedStringTypeCaster
