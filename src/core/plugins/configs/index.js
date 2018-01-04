import YAML from "js-yaml"
import yamlConfig from "root/swagger-config.yaml"
import * as actions from "./actions"
import * as selectors from "./selectors"
import reducers from "./reducers"

const parseYamlConfig = (yaml, system) => {
  try {
    return YAML.safeLoad(yaml)
  } catch(e) {
    if (system) {
      system.errActions.newThrownErr( new Error(e) )
    }
    return {}
  }
}


const specActions = {
  downloadConfig: (url) => ({fn}) => {
    let {fetch} = fn
    return fetch(url)
  },

  getConfigByUrl: (configUrl, cb)=> ({ specActions }) => {
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
}

const specSelectors = {
  getLocalConfig: () => {
    return parseYamlConfig(yamlConfig)
  }
}


export default function configsPlugin() {

  return {
    statePlugins: {
      spec: {
        actions: specActions,
        selectors: specSelectors,
      },
      configs: {
        reducers,
        actions,
        selectors,
      }
    }
  }
}
