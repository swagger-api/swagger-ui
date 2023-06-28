/**
 * @prettier
 */
import React from "react"

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
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(oriSelector, system)
        : selectedValue
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

/* eslint-disable  react/jsx-filename-extension */
/**
 * Creates component wrapper that only wraps the component
 * when spec is OpenAPI 3.1.0. Otherwise, returns original
 * component with passed props.
 *
 * @param Component
 * @returns {function(*, *): function(*): *}
 */
export const createOnlyOAS31ComponentWrapper =
  (Component) => (Original, system) => (props) => {
    if (system.specSelectors.isOAS31()) {
      return (
        <Component
          {...props}
          originalComponent={Original}
          getSystem={system.getSystem}
        />
      )
    }

    return <Original {...props} />
  }
/* eslint-enable  react/jsx-filename-extension */

/**
 * Runs the fn replacement implementation when spec is OpenAPI 3.1.
 * Runs the fn original implementation otherwise.
 *
 * @param fn
 * @param system
 * @returns {{[p: string]: function(...[*]): *}}
 */
export const wrapOAS31Fn = (fn, system) => {
  const { fn: systemFn, specSelectors } = system

  return Object.fromEntries(
    Object.entries(fn).map(([name, newImpl]) => {
      const oriImpl = systemFn[name]
      const impl = (...args) =>
        specSelectors.isOAS31()
          ? newImpl(...args)
          : typeof oriImpl === "function"
          ? oriImpl(...args)
          : undefined

      return [name, impl]
    })
  )
}
