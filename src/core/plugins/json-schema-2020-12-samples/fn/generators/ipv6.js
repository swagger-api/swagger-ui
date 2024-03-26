/**
 * @prettier
 */
import { padZeros } from "../core/utils"

const ipv6Generator = (_, {idx} = {}) =>
  Number.isInteger(idx) ? `2${padZeros(idx, 3)}:0db8:5b96:0000:0000:426f:8e17:642a` : "2001:0db8:5b96:0000:0000:426f:8e17:642a"

export default ipv6Generator
