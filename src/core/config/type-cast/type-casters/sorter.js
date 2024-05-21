/**
 * @prettier
 */
const sorterTypeCaster = (value) =>
  typeof value === "function" || typeof value === "string" ? value : null

export default sorterTypeCaster
