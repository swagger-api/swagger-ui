/**
 * @prettier
 */
import get from "lodash/get"
import defaultOptions from "../../defaults"

const booleanTypeCaster = (optionPath) => (value) =>
  value === true || value === "true" || value === 1 || value === "1"
    ? true
    : value === false || value === "false" || value === 0 || value === "0"
      ? false
      : get(defaultOptions, optionPath)

export default booleanTypeCaster
