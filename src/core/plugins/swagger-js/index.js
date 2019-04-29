import Swagger from "swagger-client"
import * as configsWrapActions from "./configs-wrap-actions"

module.exports = function({ configs, getConfigs }) {
  return {
    fn: {
      fetch: Swagger.makeHttp(configs.preFetch, configs.postFetch),
      buildRequest: Swagger.buildRequest,
      execute: Swagger.execute,
      resolve: Swagger.resolve,
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

        return Swagger.resolveSubtree(obj, path, opts, ...rest)
      },
      serializeRes: Swagger.serializeRes,
      opId: Swagger.helpers.opId
    },
    statePlugins: {
      configs: {
        wrapActions: configsWrapActions
      }
    },
  }
}
