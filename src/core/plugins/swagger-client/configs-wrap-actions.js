export const loaded = (ori, system) => (...args) => {
  ori(...args)
  const value = system.getConfigs().withCredentials
  
  if(value !== undefined) {
    system.fn.fetch.withCredentials = typeof value === "string" ? (value === "true") : !!value
  }
}
