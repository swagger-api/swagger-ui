import deepExtend from "deep-extend"

import System from "core/system"
import win from "core/window"
import ApisPreset from "core/presets/apis"
import * as AllPlugins from "core/plugins/all"
import { parseSeach, filterConfigs } from "core/utils"

const CONFIGS = [ "url", "spec", "validatorUrl", "onComplete", "onFailure", "authorizations", "docExpansion",
    "apisSorter", "operationsSorter", "supportedSubmitMethods", "dom_id", "defaultModelRendering", "oauth2RedirectUrl",
    "showRequestHeaders", "custom", "modelPropertyMacro", "parameterMacro" ]

// eslint-disable-next-line no-undef
const { GIT_DIRTY, GIT_COMMIT, PACKAGE_VERSION } = buildInfo

module.exports = function SwaggerUI(opts) {

  win.versions = win.versions || {}
  win.versions.swaggerUi = `${PACKAGE_VERSION}/${GIT_COMMIT || "unknown"}${GIT_DIRTY ? "-dirty" : ""}`

  const defaults = {
    // Some general settings, that we floated to the top
    dom_id: null,
    spec: {},
    url: "",
    layout: "BaseLayout",
    validatorUrl: "https://online.swagger.io/validator",
    configs: {},
    custom: {},

    // Initial set of plugins ( TODO rename this, or refactor - we don't need presets _and_ plugins. Its just there for performance.
    // Instead, we can compile the first plugin ( it can be a collection of plugins ), then batch the rest.
    presets: [
    ],

    // Plugins; ( loaded after presets )
    plugins: [
    ],

    // Inline Plugin
    fn: { },
    components: { },
    state: { },

    // Override some core configs... at your own risk
    store: { },
  }

  const constructorConfig = deepExtend({}, defaults, opts)

  const storeConfigs = deepExtend({}, constructorConfig.store, {
    system: {
      configs: constructorConfig.configs
    },
    plugins: constructorConfig.presets,
    state: {
      layout: {
        layout: constructorConfig.layout
      },
      spec: {
        spec: "",
        url: constructorConfig.url
      }
    }
  })

  let inlinePlugin = ()=> {
    return {
      fn: constructorConfig.fn,
      components: constructorConfig.components,
      state: constructorConfig.state,
    }
  }

  var store = new System(storeConfigs)
  store.register([constructorConfig.plugins, inlinePlugin])

  var system = store.getSystem()
  let queryConfig = parseSeach()

  system.initOAuth = system.authActions.configureAuth

  const downloadSpec = (fetchedConfig) => {
    if(typeof constructorConfig !== "object") {
      return system
    }

    let localConfig = system.specSelectors.getLocalConfig ? system.specSelectors.getLocalConfig() : {}
    let mergedConfig = deepExtend({}, localConfig, constructorConfig, fetchedConfig || {}, queryConfig)
    store.setConfigs(filterConfigs(mergedConfig, CONFIGS))

    if (fetchedConfig !== null) {
      if (!queryConfig.url && typeof mergedConfig.spec === "object" && Object.keys(mergedConfig.spec).length) {
        system.specActions.updateUrl("")
        system.specActions.updateLoadingStatus("success")
        system.specActions.updateSpec(JSON.stringify(mergedConfig.spec))
      } else if (system.specActions.download && mergedConfig.url) {
        system.specActions.updateUrl(mergedConfig.url)
        system.specActions.download(mergedConfig.url)
      }
    }

    if(mergedConfig.dom_id) {
      system.render(mergedConfig.dom_id, "App")
    } else {
      console.error("Skipped rendering: no `dom_id` was specified")
    }

    return system
  }

  let configUrl = queryConfig.config || constructorConfig.configUrl

  if (!configUrl || !system.specActions.getConfigByUrl || system.specActions.getConfigByUrl && !system.specActions.getConfigByUrl(configUrl, downloadSpec)) {
    return downloadSpec()
  }

}

// Add presets
module.exports.presets = {
  apis: ApisPreset,
}

// All Plugins
module.exports.plugins = AllPlugins
