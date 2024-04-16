/**
 * @prettier
 */
import has from "lodash/has"
import get from "lodash/get"
import set from "lodash/set"

import typeCasters from "./type-casters"

const typeCast = (options) => {
  return Object.entries(typeCasters).reduce(
    (acc, [option, typeCaster]) => {
      if (has(acc, option)) {
        acc = set(acc, option, typeCaster(get(acc, option)))
      }
      return acc
    },
    { ...options }
  )
}

export default typeCast
