/**
 * @prettier
 */
const jsonPointerGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `/a${idx}/b/c` : "/a/b/c"

export default jsonPointerGenerator
