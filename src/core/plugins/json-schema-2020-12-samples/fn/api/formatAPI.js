/**
 * @prettier
 */

import FormatRegistry from "../class/FormatRegistry"

const registry = new FormatRegistry()

const formatAPI = (format, generator) => {
  if (typeof generator === "function") {
    return registry.register(format, generator)
  } else if (generator === null) {
    return registry.unregister(format)
  }

  return registry.get(format)
}
formatAPI.getDefaults = () => registry.defaults

export default formatAPI
