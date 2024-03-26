/**
 * @prettier
 */
const iriGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `https://실례${idx}.com/` : "https://실례.com/"

export default iriGenerator
