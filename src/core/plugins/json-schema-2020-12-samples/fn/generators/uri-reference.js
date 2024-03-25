/**
 * @prettier
 */
const uriReferenceGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `path${idx}/index.html` : "path/index.html"

export default uriReferenceGenerator
