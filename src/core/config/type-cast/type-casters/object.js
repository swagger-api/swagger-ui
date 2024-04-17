/**
 * @prettier
 */
import isPlainObject from "lodash/isPlainObject"
import get from "lodash/get"
import defaultOptions from "../../defaults"

const objectTypeCaster = (optionPath) => (value) =>
  isPlainObject(value) ? value : get(defaultOptions, optionPath)

export default objectTypeCaster
