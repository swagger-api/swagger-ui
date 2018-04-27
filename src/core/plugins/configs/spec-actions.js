import { parseYamlConfig } from "./helpers"

export const downloadConfig = (url) => ({fn: { fetch }, getConfigs}) => {
  const { requestInterceptor, responseInterceptor } = getConfigs()
  let req = { url }
  if(requestInterceptor) {
    req = requestInterceptor(req)
  }
  return fetch(req)
    .then(res => {
      if(res) {
        return responseInterceptor(res)
      }
      return res
    })
}

export const getConfigByUrl = (configUrl, cb)=> ({ specActions }) => {
  if (configUrl) {
    return specActions.downloadConfig(configUrl).then(next, next)
  }

  function next(res) {
    if (res instanceof Error || res.status >= 400) {
      specActions.updateLoadingStatus("failedConfig")
      specActions.updateLoadingStatus("failedConfig")
      specActions.updateUrl("")
      console.error(res.statusText + " " + configUrl)
      cb(null)
    } else {
      cb(parseYamlConfig(res.text))
    }
  }
}
