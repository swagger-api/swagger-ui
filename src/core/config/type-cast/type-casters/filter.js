/**
 * @prettier
 */
const filterTypeCaster = (value) =>
  value === null || value === "null"
    ? null
    : value === true || value === "true" || value === 1 || value === "1"
      ? true
      : value === false || value === "false" || value === 0 || value === "0"
        ? false
        : String(value)

export default filterTypeCaster
