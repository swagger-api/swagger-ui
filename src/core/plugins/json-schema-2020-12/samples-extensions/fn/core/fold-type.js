/**
 * @prettier
 */
import { ALL_TYPES } from "./constants"

const foldType = (type) => {
  if (Array.isArray(type) && type.length >= 1) {
    if (type.includes("array")) {
      return "array"
    } else if (type.includes("object")) {
      return "object"
    } else if (ALL_TYPES.includes(type.at(0))) {
      return type.at(0)
    }
  }

  if (typeof type === "string" && ALL_TYPES.includes(type)) {
    return type
  }

  return null
}

export default foldType
