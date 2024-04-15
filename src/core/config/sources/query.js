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
  const queryOptions = options.queryConfigEnabled ? parseSearch() : {}

  Object.entries(queryOptions).forEach(([key, value]) => {
    if (key.includes(".") && key !== "urls.primaryName") {
      delete queryOptions[key]
      set(queryOptions, key, value)
    }
  })

  return queryOptions
}

export default optionsFromQuery
