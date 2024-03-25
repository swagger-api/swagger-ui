/**
 * @prettier
 */
import { padZeros } from "../core/utils"

const uuidGenerator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? padZeros(idx, 8) + "-5717-4562-b3fc-2c963f66afa6" : "3fa85f64-5717-4562-b3fc-2c963f66afa6"

export default uuidGenerator
