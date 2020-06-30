import SwaggerClient from "swagger-client"
import * as configsWrapActions from "./configs-wrap-actions"

export default function({ configs, getConfigs }) {
  return {
    fn: {
      fetch: SwaggerClient.makeHttp(configs.preFetch, configs.postFetch),
      buildRequest: SwaggerClient.buildRequest,
      execute: SwaggerClient.execute,
      resolve: SwaggerClient.resolve,
      resolveSubtree: (obj, path, opts, ...rest) => {
        if(opts === undefined) {
          const freshConfigs = getConfigs()
          opts = {
            modelPropertyMacro: freshConfigs.modelPropertyMacro,
            parameterMacro: freshConfigs.parameterMacro,
            requestInterceptor: freshConfigs.requestInterceptor,
            responseInterceptor: freshConfigs.responseInterceptor
          }
        }

        return SwaggerClient.resolveSubtree(obj, path, opts, ...rest)
      },
      serializeRes: SwaggerClient.serializeRes,
      opId: SwaggerClient.helpers.opId
    },
    statePlugins: {
      configs: {
        wrapActions: configsWrapActions
      }
    },
  }
}
