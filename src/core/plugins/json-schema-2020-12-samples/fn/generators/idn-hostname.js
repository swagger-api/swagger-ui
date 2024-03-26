/**
 * @prettier
 */
const idnHostnameGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `실례${idx}.com` : "실례.com"

export default idnHostnameGenerator
