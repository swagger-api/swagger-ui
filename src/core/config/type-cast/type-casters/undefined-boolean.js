/**
 * @prettier
 */
const undefinedBooleanTypeCaster = (value) =>
  value === true || value === "true" || value === 1 || value === "1"
    ? true
    : value === true || value === "false" || value === 0 || value === "0"
      ? false
      : undefined

export default undefinedBooleanTypeCaster
