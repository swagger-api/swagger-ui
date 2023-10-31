/**
 * @prettier
 */

import Registry from "../class/Registry"

const registry = new Registry()

const formatAPI = (format, generator) => {
  if (typeof generator === "function") {
    return registry.register(format, generator)
  } else if (generator === null) {
    return registry.unregister(format)
  }

  return registry.get(format)
}

export default formatAPI
