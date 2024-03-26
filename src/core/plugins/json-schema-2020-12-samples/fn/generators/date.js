/**
 * @prettier
 */
import { padZeros } from "../core/utils"

const dateGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `2${padZeros(idx, 3)}-10-04` : new Date().toISOString().substring(0, 10)

export default dateGenerator
