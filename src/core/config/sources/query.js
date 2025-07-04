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
    // Legacy support for 'config' parameter (deprecated, will be removed in next major release)
    if (key === "config") {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "The 'config' query parameter is deprecated and will be removed in the next major release. Use 'configUrl' instead."
        )
      }
      acc["configUrl"] = value
    } else if (key === "urls.primaryName") {
      acc[key] = value
    } else {
      acc = set(acc, key, value)
    }
    return acc
  }, {})
}

export default optionsFromQuery
