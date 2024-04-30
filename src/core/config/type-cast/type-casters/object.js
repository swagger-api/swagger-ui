/**
 * @prettier
 */
import isPlainObject from "lodash/isPlainObject"

const objectTypeCaster = (value, defaultValue = {}) =>
  isPlainObject(value) ? value : defaultValue

export default objectTypeCaster
