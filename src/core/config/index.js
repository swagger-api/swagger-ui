/**
 * @prettier
 */
import deepExtend from "deep-extend"

import ApisPreset from "core/presets/apis"
import { parseSearch } from "core/utils"

const defaultConfig = {
  // eslint-disable-next-line camelcase
  domNode: null,
  spec: {},
  url: "",
  urls: null,
  layout: "BaseLayout",
  docExpansion: "list",
  maxDisplayedTags: null,
  filter: null,
  validatorUrl: "https://validator.swagger.io/validator",
  oauth2RedirectUrl: `${window.location.protocol}//${window.location.host}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))}/oauth2-redirect.html`,
  persistAuthorization: false,
  configs: {},
  custom: {},
  displayOperationId: false,
  displayRequestDuration: false,
  deepLinking: false,
  tryItOutEnabled: false,
  requestInterceptor: (a) => a,
  responseInterceptor: (a) => a,
  showMutatedRequest: true,
  defaultModelRendering: "example",
  defaultModelExpandDepth: 1,
  defaultModelsExpandDepth: 1,
  showExtensions: false,
  showCommonExtensions: false,
  withCredentials: undefined,
  requestSnippetsEnabled: false,
  requestSnippets: {
    generators: {
      // eslint-disable-next-line camelcase
      curl_bash: {
        title: "cURL (bash)",
        syntax: "bash",
      },
      // eslint-disable-next-line camelcase
      curl_powershell: {
        title: "cURL (PowerShell)",
        syntax: "powershell",
      },
      // eslint-disable-next-line camelcase
      curl_cmd: {
        title: "cURL (CMD)",
        syntax: "bash",
      },
    },
    defaultExpanded: true,
    languages: null, // e.g. only show curl bash = ["curl_bash"]
  },
  supportedSubmitMethods: [
    "get",
    "put",
    "post",
    "delete",
    "options",
    "head",
    "patch",
    "trace",
  ],
  queryConfigEnabled: false,

  // Initial set of plugins ( TODO rename this, or refactor - we don't need presets _and_ plugins. Its just there for performance.
  // Instead, we can compile the first plugin ( it can be a collection of plugins ), then batch the rest.
  presets: [ApisPreset],

  // Plugins; ( loaded after presets )
  plugins: [],

  pluginsOptions: {
    // Behavior during plugin registration. Can be :
    // - legacy (default) : the current behavior for backward compatibility – last plugin takes precedence over the others
    // - chain : chain wrapComponents when targeting the same core component
    pluginLoadType: "legacy",
  },

  // Initial state
  initialState: {},

  // Inline Plugin
  fn: {},
  components: {},

  syntaxHighlight: {
    activated: true,
    theme: "agate",
  },
}

export const getConfigs = (opts) => {
  const queryConfig = opts.queryConfigEnabled ? parseSearch() : {}

  const combinedConfig = deepExtend({}, defaultConfig, opts, queryConfig)

  const storeConfig = {
    system: {
      configs: combinedConfig.configs,
    },
    plugins: combinedConfig.presets,
    pluginsOptions: combinedConfig.pluginsOptions,
    state: deepExtend(
      {
        layout: {
          layout: combinedConfig.layout,
          filter: combinedConfig.filter,
        },
        spec: {
          spec: "",
          // support Relative References
          url: combinedConfig.url,
        },
        requestSnippets: combinedConfig.requestSnippets,
      },
      combinedConfig.initialState
    ),
  }

  if (combinedConfig.initialState) {
    // if the user sets a key as `undefined`, that signals to us that we
    // should delete the key entirely.
    // known usage: Swagger-Editor validate plugin tests
    for (var key in combinedConfig.initialState) {
      if (
        Object.prototype.hasOwnProperty.call(
          combinedConfig.initialState,
          key
        ) &&
        combinedConfig.initialState[key] === undefined
      ) {
        delete storeConfig.state[key]
      }
    }
  }

  return { queryConfig, combinedConfig, storeConfig }
}
