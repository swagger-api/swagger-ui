/**
 * @prettier
 */
import { padZeros } from "../core/utils"

const timeGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `20:20:${padZeros(idx, 2)}Z` : new Date().toISOString().substring(11)

export default timeGenerator
