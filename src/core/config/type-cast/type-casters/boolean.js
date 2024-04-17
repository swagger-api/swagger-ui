/**
 * @prettier
 */
const booleanTypeCaster = (value, defaultValue = false) =>
  value === true || value === "true" || value === 1 || value === "1"
    ? true
    : value === false || value === "false" || value === 0 || value === "0"
      ? false
      : defaultValue

export default booleanTypeCaster
