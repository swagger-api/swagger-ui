/**
 * @prettier
 */
import { date as randomDate } from "../core/random"

const dateGenerator = () => randomDate().toISOString().substring(0, 10)

export default dateGenerator
