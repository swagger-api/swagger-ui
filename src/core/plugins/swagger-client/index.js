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

        const resolve = makeResolveSubtree(defaultOptions)
        const result = await resolve(obj, path, options)

        // swagger-client only propagates Path Item `parameters` into fixed-field
        // operations; do the same for OAS 3.2 `additionalOperations` entries.
        const isAdditionalOperation =
          Array.isArray(path) &&
          path.length === 4 &&
          path[0] === "paths" &&
          path[2] === "additionalOperations"

        if (
          !isAdditionalOperation ||
          options.returnEntireTree ||
          !String(obj?.openapi).startsWith("3.2") ||
          !obj?.paths?.[path[1]]?.parameters ||
          !result.spec ||
          typeof result.spec !== "object"
        ) {
          return result
        }

        const { spec: pathParameters, errors: pathErrors } = await resolve(
          obj,
          ["paths", path[1], "parameters"],
          options
        )

        if (Array.isArray(pathErrors) && pathErrors.length > 0) {
          result.errors = [...(result.errors || []), ...pathErrors]
        }

        if (!Array.isArray(pathParameters) || pathParameters.length === 0) {
          return result
        }

        const operationParameters = Array.isArray(result.spec.parameters)
          ? result.spec.parameters
          : []
        const isOverridden = (param) =>
          operationParameters.some(
            (opParam) =>
              opParam?.name === param?.name && opParam?.in === param?.in
          )

        result.spec = {
          ...result.spec,
          parameters: [
            ...pathParameters.filter((param) => !isOverridden(param)),
            ...operationParameters,
          ],
        }

        return result
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
