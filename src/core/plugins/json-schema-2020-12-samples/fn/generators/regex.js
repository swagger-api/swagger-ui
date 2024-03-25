/**
 * @prettier
 */
const regexGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `^[a-z]{${idx}}$` : "^[a-z]+$"

export default regexGenerator
