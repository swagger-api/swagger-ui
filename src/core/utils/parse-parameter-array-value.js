/**
 * @prettier
 */

import { List } from "immutable"

export const parseParameterArrayValue = (value) => {
  if (List.isList(value)) {
    return value
  }

  if (typeof value !== "string") {
    return null
  }

  try {
    const parsed = JSON.parse(value)

    return Array.isArray(parsed) ? List(parsed) : null
  } catch {
    return null
  }
}
