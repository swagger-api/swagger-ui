/**
 * @prettier
 */
const domNodeTypeCaster = (value) =>
  value === null || value === "null" ? null : value

export default domNodeTypeCaster
