import { shallowEqualKeys } from "core/utils"
import { transformPathToArray } from "core/path-translator"

export default function() {
  return {
    fn: { shallowEqualKeys, transformPathToArray }
  }
}
