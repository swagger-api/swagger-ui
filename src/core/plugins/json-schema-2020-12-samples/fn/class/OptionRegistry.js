/**
 * @prettier
 */
import Registry from "./Registry"

class OptionRegistry extends Registry {
  #defaults = {
    randomEnabled: false,
    random: Math.random,
    minInt: 0,
    maxInt: 2147483647,
    minLen: 4,
    maxLen: 10,
    minDateTime: new Date("1970-01-01T00:00:00.000Z"),
    maxDateTime: new Date("2038-01-19T00:00:00.000Z"),
    maxRandExp: 100,
  }

  data = { ...this.#defaults }

  get defaults() {
    return { ...this.#defaults }
  }
}

export default OptionRegistry
