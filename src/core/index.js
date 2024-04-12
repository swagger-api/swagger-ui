import deepExtend from "deep-extend"

import System from "./system"
// presets
import BasePreset from "./presets/base"
import ApisPreset from "./presets/apis"
// plugins
import AuthPlugin from "./plugins/auth/"
import ConfigsPlugin from "./plugins/configs"
import DeepLinkingPlugin from "./plugins/deep-linking"
import ErrPlugin from "./plugins/err"
import FilterPlugin from "./plugins/filter"
import IconsPlugin from "./plugins/icons"
import JSONSchema5Plugin from "./plugins/json-schema-5"
import JSONSchema202012Plugin from "./plugins/json-schema-2020-12"
import JSONSchema202012SamplesPlugin from "./plugins/json-schema-2020-12-samples"
import LayoutPlugin from "./plugins/layout"
import LogsPlugin from "./plugins/logs"
import OpenAPI30Plugin from "./plugins/oas3"
import OpenAPI31Plugin from "./plugins/oas3"
import OnCompletePlugin from "./plugins/on-complete"
import RequestSnippetsPlugin from "./plugins/request-snippets"
import JSONSchema5SamplesPlugin from "./plugins/json-schema-5-samples"
import SpecPlugin from "./plugins/spec"
import SwaggerClientPlugin from "./plugins/swagger-client"
import UtilPlugin from "./plugins/util"
import ViewPlugin from "./plugins/view"
import ViewLegacyPlugin from "core/plugins/view-legacy"
import DownloadUrlPlugin from "./plugins/download-url"
import SyntaxHighlightingPlugin from "core/plugins/syntax-highlighting"
import SafeRenderPlugin from "./plugins/safe-render"

import { getConfigs } from "./config"
import win from "./window"

// eslint-disable-next-line no-undef
const { GIT_DIRTY, GIT_COMMIT, PACKAGE_VERSION, BUILD_TIME } = buildInfo

export default function SwaggerUI(opts) {

  win.versions = win.versions || {}
  win.versions.swaggerUi = {
    version: PACKAGE_VERSION,
    gitRevision: GIT_COMMIT,
    gitDirty: GIT_DIRTY,
    buildTimestamp: BUILD_TIME,
  }

  const domNode = opts.domNode
  delete opts.domNode

  const { queryConfig, combinedConfig, storeConfig } = getConfigs(opts)

  const inlinePlugin = ()=> {
    return {
      fn: combinedConfig.fn,
      components: combinedConfig.components,
      state: combinedConfig.state,
    }
  }

  const store = new System(storeConfig)
  store.register([combinedConfig.plugins, inlinePlugin])

  const system = store.getSystem()

  const downloadSpec = (fetchedConfig) => {
    const localConfig = system.specSelectors.getLocalConfig ? system.specSelectors.getLocalConfig() : {}
    const mergedConfig = deepExtend({}, localConfig, combinedConfig, fetchedConfig || {}, queryConfig)

    // deep extend mangles domNode, we need to set it manually
    if(domNode) {
      mergedConfig.domNode = domNode
    }

    store.setConfigs(mergedConfig)
    system.configsActions.loaded()

    if (fetchedConfig !== null) {
      if (!queryConfig.url && typeof mergedConfig.spec === "object" && Object.keys(mergedConfig.spec).length) {
        system.specActions.updateUrl("")
        system.specActions.updateLoadingStatus("success")
        system.specActions.updateSpec(JSON.stringify(mergedConfig.spec))
      } else if (system.specActions.download && mergedConfig.url && !mergedConfig.urls) {
        system.specActions.updateUrl(mergedConfig.url)
        system.specActions.download(mergedConfig.url)
      }
    }

    if(mergedConfig.domNode) {
      system.render(mergedConfig.domNode, "App")
    } else if(mergedConfig.dom_id) {
      let domNode = document.querySelector(mergedConfig.dom_id)
      system.render(domNode, "App")
    } else if(mergedConfig.dom_id === null || mergedConfig.domNode === null) {
      // do nothing
      // this is useful for testing that does not need to do any rendering
    } else {
      console.error("Skipped rendering: no `dom_id` or `domNode` was specified")
    }

    return system
  }

  const configUrl = combinedConfig.configUrl

  if (configUrl && system.specActions && system.specActions.getConfigByUrl) {
    system.specActions.getConfigByUrl({
      url: configUrl,
      loadRemoteConfig: true,
      requestInterceptor: combinedConfig.requestInterceptor,
      responseInterceptor: combinedConfig.responseInterceptor,
    }, downloadSpec)
  } else {
    return downloadSpec()
  }

  return system
}

SwaggerUI.System = System

SwaggerUI.presets = {
  base: BasePreset,
  apis: ApisPreset,
}

SwaggerUI.plugins = {
  Auth: AuthPlugin,
  Configs: ConfigsPlugin,
  DeepLining: DeepLinkingPlugin,
  Err: ErrPlugin,
  Filter: FilterPlugin,
  Icons: IconsPlugin,
  JSONSchema5: JSONSchema5Plugin,
  JSONSchema5Samples: JSONSchema5SamplesPlugin,
  JSONSchema202012: JSONSchema202012Plugin,
  JSONSchema202012Samples: JSONSchema202012SamplesPlugin,
  Layout: LayoutPlugin,
  Logs: LogsPlugin,
  OpenAPI30: OpenAPI30Plugin,
  OpenAPI31: OpenAPI31Plugin,
  OnComplete: OnCompletePlugin,
  RequestSnippets: RequestSnippetsPlugin,
  Spec: SpecPlugin,
  SwaggerClient: SwaggerClientPlugin,
  Util: UtilPlugin,
  View: ViewPlugin,
  ViewLegacy: ViewLegacyPlugin,
  DownloadUrl: DownloadUrlPlugin,
  SyntaxHighlighting: SyntaxHighlightingPlugin,
  SafeRender: SafeRenderPlugin,
}
