/**
 * @prettier
 */

const OPERATION_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
  "query",
]

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value)

// Matches the duplicate-detection logic used by swagger-client's
// generic normalizer (`resolver/strategies/generic/normalize.js`)
// so we stay consistent with what the resolver would have produced
// if it had been able to inherit before dereferencing.
const isSameParameter = (a, b) => {
  if (!isPlainObject(a) && !isPlainObject(b)) return false
  if (a === b) return true
  return ["name", "$ref", "$$ref"].some(
    (key) =>
      typeof a[key] === "string" &&
      typeof b[key] === "string" &&
      a[key] === b[key]
  )
}

/**
 * Mutates path items in `paths` so that every operation inherits
 * path-level parameters that are not already declared on the operation.
 *
 * This mirrors the behaviour of swagger-client's generic `normalize` step
 * (`resolver/strategies/generic/normalize.js`), which is skipped when a
 * path item is dereferenced from an external file via `$ref`. Without
 * this inheritance step, operations that do not declare the path-level
 * parameters themselves (for example, an `options` operation with no
 * `parameters` of its own) render with the path-level parameters missing.
 *
 * The merge is idempotent: parameters already present on the operation
 * are left untouched, using the same duplicate-detection logic as
 * swagger-client.
 *
 * @param {Object} paths the `paths` object from a resolved subtree
 * @returns {Object} the same `paths` object, mutated in place
 */
export const inheritPathItemParameters = (paths) => {
  if (!isPlainObject(paths)) {
    return paths
  }

  Object.keys(paths).forEach((pathName) => {
    const pathItem = paths[pathName]
    if (!isPlainObject(pathItem)) return

    const pathParameters = pathItem.parameters
    if (!Array.isArray(pathParameters) || pathParameters.length === 0) return

    OPERATION_METHODS.forEach((method) => {
      const operation = pathItem[method]
      if (!isPlainObject(operation)) return

      if (!Array.isArray(operation.parameters)) {
        operation.parameters = []
      }

      pathParameters.forEach((pathParam) => {
        const alreadyPresent = operation.parameters.some((opParam) =>
          isSameParameter(opParam, pathParam)
        )
        if (!alreadyPresent) {
          operation.parameters.push(pathParam)
        }
      })
    })
  })

  return paths
}

export default inheritPathItemParameters
