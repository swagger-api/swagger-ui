import genericResolveStrategy from "swagger-client/es/resolver/strategies/generic"
import openApi2ResolveStrategy from "swagger-client/es/resolver/strategies/openapi-2"
import openApi30ResolveStrategy from "swagger-client/es/resolver/strategies/openapi-3-0"
import openApi31ApiDOMResolveStrategy from "swagger-client/es/resolver/strategies/openapi-3-1-apidom"
import { makeResolve } from "swagger-client/es/resolver"
import { execute, buildRequest } from "swagger-client/es/execute"
import Http, { makeHttp, serializeRes } from "swagger-client/es/http"
import { makeResolveSubtree } from "swagger-client/es/subtree-resolver"
import { opId } from "swagger-client/es/helpers"
import refs from "swagger-client/es/resolver/specmap/lib/refs"
import cloneDeep from "lodash/cloneDeep"
import { loaded } from "./configs-wrap-actions"

const resolveStrategies = [
  openApi31ApiDOMResolveStrategy,
  openApi30ResolveStrategy,
  openApi2ResolveStrategy,
  genericResolveStrategy,
]

const strictResolveStrategies = resolveStrategies.map((strategy) => ({
  ...strategy,
  resolve: (options) => strategy.resolve({ ...options, mode: "strict" }),
}))

const isArrayItemResolverError = (error) =>
  error?.message === "Cannot read properties of undefined (reading 'items')"

const hasArrayItemResolverError = (errors) =>
  errors?.some(isArrayItemResolverError)

const hasOtherResolverError = (errors) =>
  errors?.some((error) => !isArrayItemResolverError(error))

const hasResolverRef = (value, seen = new WeakSet()) => {
  if (!value || typeof value !== "object" || seen.has(value)) {
    return false
  }

  seen.add(value)

  return Object.entries(value).some(
    ([key, child]) =>
      key === "$ref" ||
      key === "$$ref" ||
      key === "allOf" ||
      hasResolverRef(child, seen)
  )
}

export default function({ configs, getConfigs }) {
  return {
    fn: {
      fetch: makeHttp(Http, configs.preFetch, configs.postFetch),
      buildRequest,
      execute,
      resolve: makeResolve({ strategies: resolveStrategies }),
      resolveSubtree: async (obj, path, options = {}) => {
        const freshConfigs = getConfigs()
        const defaultOptions = {
          modelPropertyMacro: freshConfigs.modelPropertyMacro,
          parameterMacro: freshConfigs.parameterMacro,
          requestInterceptor: freshConfigs.requestInterceptor,
          responseInterceptor: freshConfigs.responseInterceptor,
          strategies: resolveStrategies,
        }

        const subtree = path.reduce(
          (value, pathSegment) => value?.[pathSegment],
          obj
        )
        const shouldCloneInput = hasResolverRef(subtree)
        const resolverInput = shouldCloneInput ? cloneDeep(obj) : obj
        const result = await makeResolveSubtree(defaultOptions)(
          resolverInput,
          path,
          options
        )

        if (hasArrayItemResolverError(result.errors)) {
          refs.clearCache()
        }

        if (
          !hasArrayItemResolverError(result.errors) ||
          hasOtherResolverError(result.errors)
        ) {
          return result
        }

        return makeResolveSubtree({
          ...defaultOptions,
          strategies: strictResolveStrategies,
        })(cloneDeep(obj), path, options)
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
