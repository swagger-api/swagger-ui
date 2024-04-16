/**
 * @prettier
 */
const falseTypeCaster = (value) =>
  value === "false" || value === "0" || value === 0 ? false : value

export default falseTypeCaster
