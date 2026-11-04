/**
 * @prettier
 */
import some from "lodash/some"

const shouldStringifyTypesConfig = [
  {
    when: /json/,
    shouldStringifyTypes: ["string"],
  },
]
const defaultStringifyTypes = ["object"]
const makeGetJsonSampleSchema =
  (getSystem) => (schema, config, contentType, exampleOverride) => {
    const { fn } = getSystem()

    // Deep-resolve any local $ref nodes inside the schema
    const deepResolveRefs = (s, seen = new Set()) => {
      try {
        if (s == null || typeof s !== "object") return s

        if (Array.isArray(s)) {
          return s.map((it) => deepResolveRefs(it, seen))
        }

        if (typeof s.$ref === "string") {
          const ref = s.$ref
          if (seen.has(ref)) {
            // keep as-is to avoid infinite recursion
            return s
          }
          seen.add(ref)

          const sys = getSystem()
          const specSelectors = sys?.getSystem?.().specSelectors

          if (fn && typeof fn.getRefSchemaByRef === "function") {
            const resolved = fn.getRefSchemaByRef(ref)
            if (resolved) return deepResolveRefs(resolved, seen)
          }

          if (
            specSelectors &&
            typeof specSelectors.findDefinition === "function"
          ) {
            // model name extraction heuristic (shared with other codepaths)
            const getModelNameFromRef = (refStr) => {
              if (typeof refStr !== "string") return null
              if (refStr.indexOf("#/definitions/") !== -1) {
                return decodeURIComponent(
                  refStr.replace(/^.*#\/definitions\//, "")
                )
              }
              if (refStr.indexOf("#/components/schemas/") !== -1) {
                return decodeURIComponent(
                  refStr.replace(/^.*#\/components\/schemas\//, "")
                )
              }
              const hashIdx = refStr.indexOf("#")
              if (hashIdx !== -1) {
                const frag = refStr.slice(hashIdx + 1)
                if (frag.indexOf("/components/schemas/") !== -1) {
                  return decodeURIComponent(
                    frag.replace(/^.*\/components\/schemas\//, "")
                  )
                }
                if (frag.indexOf("/definitions/") !== -1) {
                  return decodeURIComponent(
                    frag.replace(/^.*\/definitions\//, "")
                  )
                }
              }
              return null
            }

            const modelName = getModelNameFromRef(ref)
            if (modelName) {
              const def = specSelectors.findDefinition(modelName)
              if (def) {
                const defJS = typeof def.toJS === "function" ? def.toJS() : def
                // recursively resolve refs inside the referenced definition
                return deepResolveRefs(defJS, seen)
              }
            }
          }
          return s
        }

        const out = {}
        for (const key in s) {
          if (!Object.prototype.hasOwnProperty.call(s, key)) continue
          out[key] = deepResolveRefs(s[key], seen)
        }
        return out
      } catch (e) {
        return s
      }
    }

    const schemaToSample = deepResolveRefs(schema)

    const res = fn.jsonSchema202012.memoizedSampleFromSchema(
      schemaToSample,
      config,
      exampleOverride
    )
    const resType = typeof res

    const typesToStringify = shouldStringifyTypesConfig.reduce(
      (types, nextConfig) =>
        nextConfig.when.test(contentType)
          ? [...types, ...nextConfig.shouldStringifyTypes]
          : types,
      defaultStringifyTypes
    )

    return some(typesToStringify, (x) => x === resType)
      ? JSON.stringify(res, null, 2)
      : res
  }

export default makeGetJsonSampleSchema
