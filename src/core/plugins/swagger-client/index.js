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

const isExternalRef = (ref, baseDoc) => {
  const [urlPart] = ref.split("#")

  if (!urlPart) {
    return false
  }

  if (!baseDoc) {
    return true
  }

  try {
    return new URL(urlPart, baseDoc).href !== new URL(baseDoc).href
  } catch {
    return true
  }
}

const hasExternalRef = (value, baseDoc, seen = new WeakSet()) => {
  if (!value || typeof value !== "object" || seen.has(value)) {
    return false
  }

  seen.add(value)

  return Object.entries(value).some(([key, child]) => {
    if (
      (key === "$ref" || key === "$$ref") &&
      typeof child === "string" &&
      isExternalRef(child, baseDoc)
    ) {
      return true
    }

    return hasExternalRef(child, baseDoc, seen)
  })
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
        const strategies = hasExternalRef(subtree, options.baseDoc)
          ? strictResolveStrategies
          : resolveStrategies

        return makeResolveSubtree({
          ...defaultOptions,
          strategies,
        })(obj, path, options)
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
