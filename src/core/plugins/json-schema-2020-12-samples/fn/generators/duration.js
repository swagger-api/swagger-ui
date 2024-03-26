/**
 * @prettier
 */
const durationGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `P${idx}D` : "P3D" // expresses a duration of 3 days

export default durationGenerator
