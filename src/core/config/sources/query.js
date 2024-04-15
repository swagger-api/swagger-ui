/**
 * @prettier
 */
import { parseSearch } from "core/utils"

/**
 * Receives options from the query string of the URL where SwaggerUI
 * is being served.
 */

const optionsFromQuery = () => (options) => {
  return options.queryConfigEnabled ? parseSearch() : {}
}

export default optionsFromQuery
