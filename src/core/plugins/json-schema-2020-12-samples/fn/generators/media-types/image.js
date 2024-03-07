/**
 * @prettier
 */
import { bytes } from "../../core/random"

const imageMediaTypesGenerators = {
  "image/*": () => bytes(25).toString("binary"),
}

export default imageMediaTypesGenerators
