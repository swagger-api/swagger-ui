/**
 * @prettier
 */
class Registry {
  data = {}

  register(name, value) {
    this.data[name] = value
  }

  unregister(name) {
    if (typeof name === "undefined") {
      this.data = {}
    } else {
      delete this.data[name]
    }
  }

  get(name) {
    return this.data[name]
  }
}

export default Registry
