/**
 * @prettier
 */
class Registry {
  data = {}

  register(name, value) {
    this.data[name] = value
  }

  registerMany(nameValueMap) {
    Object.keys(nameValueMap).forEach(name => {
      this.data[name] = nameValueMap[name]
    })
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
