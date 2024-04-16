/**
 * @prettier
 */
const combinedTypeCaster = (firstTypeCaster, secondTypeCaster) => (value) =>
  secondTypeCaster(firstTypeCaster(value))

export default combinedTypeCaster
