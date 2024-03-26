/**
 * @prettier
 */
const relativeJsonPointerGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? idx + "/0" : "1/0"

export default relativeJsonPointerGenerator
