import genericResolveStrategy from "swagger-client/es/resolver/strategies/generic"
import openApi2ResolveStrategy from "swagger-client/es/resolver/strategies/openapi-2"
import openApi30ResolveStrategy from "swagger-client/es/resolver/strategies/openapi-3-0"
import openApi31ApiDOMResolveStrategy from "swagger-client/es/resolver/strategies/openapi-3-1-apidom"
import { makeResolve } from "swagger-client/es/resolver"
import { execute, buildRequest } from "swagger-client/es/execute"
import Http, { makeHttp, serializeRes } from "swagger-client/es/http"
import { makeResolveSubtree } from "swagger-client/es/subtree-resolver"
import { opId } from "swagger-client/es/helpers"
import { loaded } from "./configs-wrap-actions"

export default function({ configs, getConfigs }) {
  return {
    fn: {
      fetch: makeHttp(Http, configs.preFetch, configs.postFetch),
      buildRequest,
      execute,
      resolve: makeResolve({
        strategies: [
          openApi31ApiDOMResolveStrategy,
          openApi30ResolveStrategy,
          openApi2ResolveStrategy,
          genericResolveStrategy,
        ],
      }),
      resolveSubtree: async (obj, path, options = {}) => {
        const freshConfigs = getConfigs()
        const defaultOptions = {
          modelPropertyMacro: freshConfigs.modelPropertyMacro,
          parameterMacro: freshConfigs.parameterMacro,
          requestInterceptor: freshConfigs.requestInterceptor,
          responseInterceptor: freshConfigs.responseInterceptor,
          strategies: [
            openApi31ApiDOMResolveStrategy,
            openApi30ResolveStrategy,
            openApi2ResolveStrategy,
            genericResolveStrategy,
          ],
        }

        return makeResolveSubtree(defaultOptions)(obj, path, options)
      },
      serializeRes,
      opId
    },
    statePlugins: {
      configs: {
        wrapActions: {
          loaded,
        }
      }
    },
  }
}
