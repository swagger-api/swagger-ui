import resolve from "swagger-client/es/resolver"
import { execute, buildRequest } from "swagger-client/es/execute"
import Http, { makeHttp, serializeRes } from "swagger-client/es/http"
import resolveSubtree from "swagger-client/es/subtree-resolver"
import { opId } from "swagger-client/es/helpers"
import * as configsWrapActions from "./configs-wrap-actions"

export default function({ configs, getConfigs }) {
  return {
    fn: {
      fetch: makeHttp(Http, configs.preFetch, configs.postFetch),
      buildRequest,
      execute,
      resolve,
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

        return resolveSubtree(obj, path, opts, ...rest)
      },
      serializeRes,
      opId
    },
    statePlugins: {
      configs: {
        wrapActions: configsWrapActions
      }
    },
  }
}
