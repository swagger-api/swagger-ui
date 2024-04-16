/**
 * @prettier
 */
const booleanTypeCaster = (value) =>
  value === "true" || value === "1" || value === 1
    ? true
    : value === "false" || value === "0" || value === 0
      ? false
      : value

export default booleanTypeCaster
