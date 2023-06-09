/**
 * @prettier
 */
import { bytes } from "../../core/random"

const audioMediaTypesGenerators = {
  "audio/*": () => bytes(25).toString("binary"),
}

export default audioMediaTypesGenerators
