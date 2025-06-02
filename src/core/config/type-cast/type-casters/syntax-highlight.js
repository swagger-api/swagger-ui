/**
 * @prettier
 */
import isPlainObject from "lodash/isPlainObject"

const syntaxHighlightTypeCaster = (value, defaultValue) => {
  return isPlainObject(value)
    ? value
    : value === false || value === "false" || value === 0 || value === "0"
      ? { activated: false }
      : defaultValue
}

export default syntaxHighlightTypeCaster
