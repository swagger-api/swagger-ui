/**
 * @prettier
 */

export const isOAS31 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")

  return (
    typeof oasVersion === "string" && /^3\.1\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}

/**
 * Creates selector that returns value of the passed
 * selector when spec is OpenAPI 3.1.0., null otherwise.
 *
 * @param selector
 * @returns {function(*, ...[*]): function(*): (*|null)}
 */
export const createOnlyOAS31Selector =
  (selector) =>
  (state, ...args) =>
  (system) => {
    if (system.getSystem().specSelectors.isOAS31()) {
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(system)
        : selectedValue
    } else {
      return null
    }
  }

/**
 * Creates selector wrapper that returns value of the passed
 * selector when spec is OpenAPI 3.1.0., calls original selector otherwise.
 *
 *
 * @param selector
 * @returns {function(*, *): function(*, ...[*]): (*)}
 */
export const createOnlyOAS31SelectorWrapper =
  (selector) =>
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.getSystem().specSelectors.isOAS31()) {
      const result = selector(state, ...args)
      return typeof result === "function" ? result(system) : result
    } else {
      return oriSelector(...args)
    }
  }

/**
 * Creates selector that provides system as the
 * second argument. This allows to create memoized
 * composed selectors from different plugins.
 *
 * @param selector
 * @returns {function(*, ...[*]): function(*): *}
 */
export const createSystemSelector =
  (selector) =>
  (state, ...args) =>
  (system) => {
    const selectedValue = selector(state, system, ...args)
    return typeof selectedValue === "function"
      ? selectedValue(system)
      : selectedValue
  }
