import deepExtend from "deep-extend"

import System from "core/system"
import ApisPreset from "core/presets/apis"
import * as AllPlugins from "core/plugins/all"
import { filterConfigs } from "plugins/configs"
import { parseSeach } from "core/utils"

module.exports = function SwaggerUI(opts) {

  const defaults = {
    // Some general settings, that we floated to the top
    dom_id: null,
    spec: {},
    url: "",
    layout: "Layout",
    configs: {
      validatorUrl: "https://online.swagger.io/validator"
    },

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

  const config = deepExtend({}, defaults, opts)

  const storeConfigs = deepExtend({}, config.store, {
    system: {
      configs: config.configs
    },
    plugins: config.presets,
    state: {
      layout: {
        layout: config.layout
      },
      spec: {
        spec: "",
        url: config.url
      }
    }
  })

  let inlinePlugin = ()=> {
    return {
      fn: config.fn,
      components: config.components,
      state: config.state,
    }
  }

  var store = new System(storeConfigs)
  store.register([config.plugins, inlinePlugin])

  var system = store.getSystem()

  const downloadSpec = (configs) => {
    if(typeof config !== "object") {
      return system
    }

    let localConfig = system.specSelectors.getLocalConfig ? system.specSelectors.getLocalConfig() : {}
    let mergedConfig = deepExtend({}, config, configs, localConfig)
    let search = parseSeach()
    if (search.url) {
      mergedConfig.url = search.url
    }
    store.setConfigs(filterConfigs(mergedConfig))

    if(!search.url && typeof mergedConfig.spec === "object" && Object.keys(mergedConfig.spec).length) {
      system.specActions.updateUrl("")
      system.specActions.updateLoadingStatus("success");
      system.specActions.updateSpec(JSON.stringify(mergedConfig.spec))
    } else if(mergedConfig.url) {
      system.specActions.updateUrl(mergedConfig.url)
      system.specActions.download(mergedConfig.url)
    }

    if(mergedConfig.dom_id)
      system.render(mergedConfig.dom_id, "App")

    return system
  }

  if (system.specActions.getConfigByUrl && !system.specActions.getConfigByUrl(downloadSpec)) {
    return downloadSpec(config)
  }

  if (system.specActions.download && config.url) {
    system.specActions.download(config.url)
  }

  if(config.spec && typeof config.spec === "string")
    system.specActions.updateSpec(config.spec)

  if(config.dom_id) {
    system.render(config.dom_id, "App")
  } else {
    console.error("Skipped rendering: no `dom_id` was specified")
  }

  return system
}

// Add presets
module.exports.presets = {
  apis: ApisPreset,
}

// All Plugins
module.exports.plugins = AllPlugins
