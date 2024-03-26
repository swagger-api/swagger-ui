/**
 * @prettier
 */
const uriGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `https://example${idx}.com/` : "https://example.com/"

export default uriGenerator
