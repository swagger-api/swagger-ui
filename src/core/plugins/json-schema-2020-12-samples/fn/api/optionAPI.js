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
optionAPI.getDefaults = () => registry.defaults
optionAPI.setDefaults = () => registry.registerMany(registry.defaults)

export default optionAPI
