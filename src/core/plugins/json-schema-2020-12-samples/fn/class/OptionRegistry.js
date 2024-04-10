/**
 * @prettier
 */
import Registry from "./Registry"

class OptionRegistry extends Registry {
  #defaults = {}

  data = { ...this.#defaults }

  get defaults() {
    return { ...this.#defaults }
  }
}

export default OptionRegistry
