import YAML from "js-yaml"
import { parseSeach } from "core/utils"
import yamlConfig from "../../../swagger-config.yaml"

const CONFIGS = [ "url", "spec", "validatorUrl", "onComplete", "onFailure", "authorizations", "docExpansion",
    "apisSorter", "operationsSorter", "supportedSubmitMethods", "highlightSizeThreshold", "dom_id",
    "defaultModelRendering", "oauth2RedirectUrl", "showRequestHeaders" ]

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

        getConfigByUrl: (callback)=> ({ specActions }) => {
            let config = parseSeach()
            let configUrl = config.config
            if (configUrl) {
                return specActions.downloadConfig(configUrl).then(next, next)
            }

            function next(res) {
                if (res instanceof Error || res.status >= 400) {
                    specActions.updateLoadingStatus("failedConfig")
                    console.log(res.statusText + " " + configUrl)
                } else {
                    callback(parseYamlConfig(res.text))
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


export function filterConfigs (configs) {
    let i, filteredConfigs = {}

    for (i in configs) {
        if (CONFIGS.indexOf(i) !== -1) {
            filteredConfigs[i] = configs[i]
        }
    }

    return filteredConfigs
}