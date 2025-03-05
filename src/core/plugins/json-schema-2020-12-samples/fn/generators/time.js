/**
 * @prettier
 */
import { date as randomDate } from "../core/random"

const timeGenerator = () => randomDate().toISOString().substring(11)

export default timeGenerator
