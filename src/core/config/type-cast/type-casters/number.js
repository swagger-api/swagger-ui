/**
 * @prettier
 */
const numberTypeCaster = (value) => {
  const parsedValue = parseInt(value)
  return isNaN(parsedValue) ? value : parsedValue
}

export default numberTypeCaster
