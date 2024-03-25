/**
 * @prettier
 */
const hostnameGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `example${idx}.com` : "example.com"

export default hostnameGenerator
