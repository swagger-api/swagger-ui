/**
 * @prettier
 */
const nullableFunctionTypeCaster = (value) =>
  typeof value === "function" ? value : null

export default nullableFunctionTypeCaster
