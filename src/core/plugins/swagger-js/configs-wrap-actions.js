export const loaded = (ori, system) => (...args) => {
  ori(...args)
  system.fn.fetch.withCredentials = !!system.getConfigs().withCredentials
}
