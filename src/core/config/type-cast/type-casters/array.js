/**
 * @prettier
 */
import get from "lodash/get"
import defaultOptions from "../../defaults"

const arrayTypeCaster = (optionPath) => (value) =>
  Array.isArray(value) ? value : get(defaultOptions, optionPath)

export default arrayTypeCaster
