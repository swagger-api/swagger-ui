/**
 * @prettier
 */
const numberTypeCaster = (value, defaultValue = -1) => {
  const parsedValue = parseInt(value, 10)
  return Number.isNaN(parsedValue) ? defaultValue : parsedValue
}

export default numberTypeCaster
