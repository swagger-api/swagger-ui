/**
 * @prettier
 */
const emailGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `user${idx}@example.com` : "user@example.com"

export default emailGenerator
