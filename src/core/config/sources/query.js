/**
 * @prettier
 */
import set from "lodash/fp/set"
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
      return acc
    }
    return set(key, value, acc)
  }, {})
}

export default optionsFromQuery
