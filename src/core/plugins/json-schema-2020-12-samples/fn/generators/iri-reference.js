/**
 * @prettier
 */
const iriReferenceGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `path${idx}/실례.html` : "path/실례.html"

export default iriReferenceGenerator
