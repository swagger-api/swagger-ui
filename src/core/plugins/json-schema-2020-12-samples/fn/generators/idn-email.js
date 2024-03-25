/**
 * @prettier
 */
const idnEmailGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `실례${idx}@example.com` : "실례@example.com"

export default idnEmailGenerator
