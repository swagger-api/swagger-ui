/**
 * @prettier
 */
const numberTypeCaster = (value) => {
  const parsedValue = parseInt(value, 10)
  return Number.isNaN(parsedValue) ? NaN : parsedValue
}

export default numberTypeCaster
