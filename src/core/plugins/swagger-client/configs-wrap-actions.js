export const loaded = (ori, system) => (...args) => {
  ori(...args)
  const value = system.getConfigs().withCredentials
  
  system.fn.fetch.withCredentials = value
}
