/**
 * @prettier
 */
import Registry from "./Registry"

class OptionRegistry extends Registry {
  #defaults = {
    mode: "constant",
    random: Math.random,
    minInteger: -100000000,
    maxInteger: +100000000,
    minLength: 4,
    maxLength: 10,
    minDateTime: new Date("1970-01-01T00:00:00.000Z"),
    maxDateTime: new Date("2038-01-19T00:00:00.000Z"),
    defaultRandExpMax: 10,
  }

  data = { ...this.#defaults }

  get defaults() {
    return { ...this.#defaults }
  }
}

export default OptionRegistry
