/**
 * @prettier
 */
import isPlainObject from "lodash/isPlainObject"
import defaultOptions from "../../defaults"

const syntaxHighlightTypeCaster = (value) => {
  return isPlainObject(value)
    ? value
    : value === false || value === "false" || value === 0 || value === "0"
      ? { activated: false }
      : defaultOptions.syntaxHighlight
}

export default syntaxHighlightTypeCaster
