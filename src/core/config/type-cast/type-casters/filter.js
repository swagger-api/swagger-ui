/**
 * @prettier
 */
import booleanTypeCaster from "./boolean"

const filterTypeCaster = (value) => {
  const defaultValue = String(value)
  return booleanTypeCaster(value, defaultValue)
}

export default filterTypeCaster
