export const loaded = (ori, system) => (...args) => {
  ori(...args)
  const withCredentialsSetting = system.getConfigs().withCredentials
  
  if(withCredentialsSetting) {
    system.fn.fetch.withCredentials = true
  }
}
