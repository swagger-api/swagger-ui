/**
 * @prettier
 */
import has from "lodash/has"
import get from "lodash/get"
import set from "lodash/fp/set"

import mappings from "./mappings"

const typeCast = (options) => {
  return Object.entries(mappings).reduce(
    (acc, [optionPath, { typeCaster, defaultValue }]) => {
      if (has(acc, optionPath)) {
        const uncasted = get(acc, optionPath)
        const casted = typeCaster(uncasted, defaultValue)
        acc = set(optionPath, casted, acc)
      }
      return acc
    },
    { ...options }
  )
}

export default typeCast
