/**
 * @prettier
 */
import { bytes } from "../../core/random"

const videoMediaTypesGenerators = {
  "video/*": () => bytes(25).toString("binary"),
}

export default videoMediaTypesGenerators
