/**
 * @prettier
 */
import set from "lodash/set"
import { parseSearch } from "core/utils"

/**
 * Receives options from the query string of the URL where SwaggerUI
 * is being served.
 */

const optionsFromQuery = () => (options) => {
  const urlSearchParams = options.queryConfigEnabled ? parseSearch() : {}

  return Object.entries(urlSearchParams).reduce((acc, [key, value]) => {
    if (key === "urls.primaryName") {
      acc[key] = value
    } else {
      acc = set(acc, key, value)
    }
    return acc
  }, {})
}

export default optionsFromQuery
