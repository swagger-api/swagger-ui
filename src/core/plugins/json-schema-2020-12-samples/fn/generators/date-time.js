/**
 * @prettier
 */
import { date as randomDate } from "../core/random"

const dateTimeGenerator = () => randomDate().toISOString()

export default dateTimeGenerator
