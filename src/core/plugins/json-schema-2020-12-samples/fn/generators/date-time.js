/**
 * @prettier
 */
import { padZeros } from "../core/utils"

const dateTimeGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `2${padZeros(idx, 3)}-10-04T20:20:39Z` : new Date().toISOString()

export default dateTimeGenerator
