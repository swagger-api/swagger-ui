import Swagger from "swagger-client"

module.exports = function({ configs, getConfigs }) {
  const fetch = Swagger.makeHttp(configs.preFetch, configs.postFetch)

  return {
    fn: {
      fetch: fetch,
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
        wrapActions: {
          loaded: (ori, system) => (...args) => {
            ori(...args)
            fetch.withCredentials = !!system.getConfigs().withCredentials
          }
        }
      }
    },
  }
}
