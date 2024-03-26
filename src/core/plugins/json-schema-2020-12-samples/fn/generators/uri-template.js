/**
 * @prettier
 */
const uriTemplateGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `https://example${idx}.com/dictionary/{term:1}/{term}` : "https://example.com/dictionary/{term:1}/{term}"

export default uriTemplateGenerator
