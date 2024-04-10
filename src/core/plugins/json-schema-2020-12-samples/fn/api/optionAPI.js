/**
 * @prettier
 */

import OptionRegistry from "../class/OptionRegistry"

const registry = new OptionRegistry()

const optionAPI = (optionName, optionValue) => {
  if (typeof optionValue !== "undefined") {
    registry.register(optionName, optionValue)
  }

  return registry.get(optionName)
}

export default optionAPI
