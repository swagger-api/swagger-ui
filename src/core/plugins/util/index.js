import { shallowEqualKeys } from "core/utils"
import { sanitizeUrl } from "core/utils/url"

export default function() {
  return {
    fn: {
      shallowEqualKeys,
      sanitizeUrl,
    }
  }
}
