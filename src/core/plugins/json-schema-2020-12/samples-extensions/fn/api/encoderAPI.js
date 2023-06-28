/**
 * @prettier
 */

import EncoderRegistry from "core/plugins/json-schema-2020-12/samples-extensions/fn/class/EncoderRegistry"

const registry = new EncoderRegistry()

const encoderAPI = (encodingName, encoder) => {
  if (typeof encoder === "function") {
    return registry.register(encodingName, encoder)
  } else if (encoder === null) {
    return registry.unregister(encodingName)
  }

  return registry.get(encodingName)
}
encoderAPI.getDefaults = () => registry.defaults

export default encoderAPI
