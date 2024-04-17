/**
 * @prettier
 */
const arrayTypeCaster = (value, defaultValue = []) =>
  Array.isArray(value) ? value : defaultValue

export default arrayTypeCaster
