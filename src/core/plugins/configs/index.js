import yamlConfig from "root/swagger-config.yaml"
import { parseYamlConfig } from "./helpers"
import * as actions from "./actions"
import * as specActions from "./spec-actions"
import * as selectors from "./selectors"
import reducers from "./reducers"

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
