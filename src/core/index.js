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
  systemOptionsFactorization,
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
  const storeOptions = systemOptionsFactorization(mergedOptions)
  const InlinePlugin = inlinePluginOptionsFactorization(mergedOptions)

  const system = new System(storeOptions)
  system.register([mergedOptions.plugins, InlinePlugin])

  const boundSystem = system.getSystem()

  optionsFromURL({ url: mergedOptions.configUrl, system: boundSystem })(
    mergedOptions
  ).then((urlOptions) => {
    const urlOptionsFailedToFetch = urlOptions === null

    mergedOptions = SwaggerUI.config.merge(
      {},
      mergedOptions,
      urlOptions,
      queryOptions
    )
    system.setConfigs(mergedOptions)
    boundSystem.configsActions.loaded()

    if (!urlOptionsFailedToFetch) {
      if (
        !queryOptions.url &&
        typeof mergedOptions.spec === "object" &&
        Object.keys(mergedOptions.spec).length > 0
      ) {
        boundSystem.specActions.updateUrl("")
        boundSystem.specActions.updateLoadingStatus("success")
        boundSystem.specActions.updateSpec(JSON.stringify(mergedOptions.spec))
      } else if (
        typeof boundSystem.specActions.download === "function" &&
        mergedOptions.url &&
        !mergedOptions.urls
      ) {
        boundSystem.specActions.updateUrl(mergedOptions.url)
        boundSystem.specActions.download(mergedOptions.url)
      }
    }

    if (mergedOptions.domNode) {
      boundSystem.render(mergedOptions.domNode, "App")
    } else if (mergedOptions.dom_id) {
      const domNode = document.querySelector(mergedOptions.dom_id)
      boundSystem.render(domNode, "App")
    } else if (
      mergedOptions.dom_id === null ||
      mergedOptions.domNode === null
    ) {
      /**
       * noop
       *
       * SwaggerUI instance can be created without any rendering involved.
       * This is also useful for lazy rendering or testing.
       */
    } else {
      console.error("Skipped rendering: no `dom_id` or `domNode` was specified")
    }
  })

  return boundSystem
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
