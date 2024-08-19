/**
 * @prettier
 */
const functionTypeCaster = (value, defaultValue) =>
  typeof value === "function" ? value : defaultValue

export default functionTypeCaster
