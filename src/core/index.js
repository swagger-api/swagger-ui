/**
 * @prettier
 */
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
import VersionsPlugin from "core/plugins/versions"
import SafeRenderPlugin from "./plugins/safe-render"

import {
  defaultOptions,
  optionsFromQuery,
  optionsFromURL,
  optionsFromRuntime,
  mergeOptions,
  inlinePluginOptionsFactorization,
  storeOptionsFactorization,
  typeCastOptions,
  typeCastMappings,
} from "./config"

function SwaggerUI(userOptions) {
  const queryOptions = optionsFromQuery()(userOptions)
  const runtimeOptions = optionsFromRuntime()()
  let mergedOptions = SwaggerUI.config.merge(
    {},
    SwaggerUI.config.defaults,
    runtimeOptions,
    userOptions,
    queryOptions
  )
  const storeOptions = storeOptionsFactorization(mergedOptions)
  const InlinePlugin = inlinePluginOptionsFactorization(mergedOptions)

  const store = new System(storeOptions)
  store.register([mergedOptions.plugins, InlinePlugin])
  const system = store.getSystem()

  optionsFromURL({ url: mergedOptions.configUrl, system })(mergedOptions).then(
    (urlOptions) => {
      const urlOptionsFailedToFetch = urlOptions === null

      mergedOptions = SwaggerUI.config.merge(
        {},
        mergedOptions,
        urlOptions,
        queryOptions
      )
      store.setConfigs(mergedOptions)
      system.configsActions.loaded()

      if (!urlOptionsFailedToFetch) {
        if (
          !queryOptions.url &&
          typeof mergedOptions.spec === "object" &&
          Object.keys(mergedOptions.spec).length > 0
        ) {
          system.specActions.updateUrl("")
          system.specActions.updateLoadingStatus("success")
          system.specActions.updateSpec(JSON.stringify(mergedOptions.spec))
        } else if (
          typeof system.specActions.download === "function" &&
          mergedOptions.url &&
          !mergedOptions.urls
        ) {
          system.specActions.updateUrl(mergedOptions.url)
          system.specActions.download(mergedOptions.url)
        }
      }

      if (mergedOptions.domNode) {
        system.render(mergedOptions.domNode, "App")
      } else if (mergedOptions.dom_id) {
        let domNode = document.querySelector(mergedOptions.dom_id)
        system.render(domNode, "App")
      } else if (
        mergedOptions.dom_id === null ||
        mergedOptions.domNode === null
      ) {
        // do nothing
        // this is useful for testing that does not need to do any rendering
      } else {
        console.error(
          "Skipped rendering: no `dom_id` or `domNode` was specified"
        )
      }
    }
  )

  return system
}

SwaggerUI.System = System

SwaggerUI.config = {
  defaults: defaultOptions,
  merge: mergeOptions,
  typeCast: typeCastOptions,
  typeCastMappings,
}

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
  Versions: VersionsPlugin,
  SafeRender: SafeRenderPlugin,
}

export default SwaggerUI
