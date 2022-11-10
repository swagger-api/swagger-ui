import { parseYamlConfig } from "./helpers"

export const downloadConfig = (req) => (system) => {
  const {fn: { fetch }} = system

  return fetch(req)
}

export const getConfigByUrl = (req, cb)=> ({ specActions }) => {
  if (req) {
    return specActions.downloadConfig(req).then(next, next)
  }

  function next(res) {
    if (res instanceof Error || res.status >= 400) {
      specActions.updateLoadingStatus("failedConfig")
      specActions.updateLoadingStatus("failedConfig")
      specActions.updateUrl("")
      console.error(res.statusText + " " + req.url)
      cb(null)
    } else {
      cb(parseYamlConfig(res.text))
    }
  }
}
