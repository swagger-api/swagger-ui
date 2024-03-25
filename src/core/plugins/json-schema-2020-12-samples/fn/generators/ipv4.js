/**
 * @prettier
 */
const ipv4Generator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `198.51.${idx}.42` : "198.51.100.42"

export default ipv4Generator
