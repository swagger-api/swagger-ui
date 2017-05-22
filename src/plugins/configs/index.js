import YAML from "js-yaml"
import yamlConfig from "../../../swagger-config.yaml"

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


export default function configPlugin (toolbox) {
    let { fn } = toolbox

    const actions = {
        downloadConfig: (url) => () => {
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

    const selectors = {
        getLocalConfig: () => {
            return parseYamlConfig(yamlConfig)
        }
    }

    return {
        statePlugins: {
            spec: { actions, selectors }
        }
    }
}
