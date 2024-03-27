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
    const res = fn.memoizedSampleFromSchema(schema, config, exampleOverride)
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
