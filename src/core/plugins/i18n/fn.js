/**
 * @prettier
 */
import en from "./locales/en"

/**
 * Pure translation helper.
 * Looks up `key` in `localeMsgs` (a plain JS object), then falls back to
 * `fallbackMsgs`.  Interpolates `{{varName}}` placeholders with values from
 * `vars`.  Returns the key itself when no match is found.
 *
 * @param {object} localeMsgs  - Key→value map for the active locale (may be null/undefined)
 * @param {object} fallbackMsgs - Key→value map for the fallback locale (usually "en")
 * @param {string} key          - Message key, e.g. "button.cancel"
 * @param {object} [vars]       - Interpolation variables, e.g. { line: 42 }
 * @returns {string}
 */
export function translate(localeMsgs, fallbackMsgs, key, vars) {
  const own = Object.prototype.hasOwnProperty
  const raw =
    localeMsgs && own.call(localeMsgs, key)
      ? localeMsgs[key]
      : fallbackMsgs && own.call(fallbackMsgs, key)
        ? fallbackMsgs[key]
        : key

  if (!vars) return String(raw)
  return String(raw).replace(/\{\{(\w+)\}\}/g, (_, k) =>
    own.call(vars, k) ? String(vars[k]) : `{{${k}}}`
  )
}

/**
 * Default translation function that uses the built-in English locale.
 * Used as a fallback in components when no `t` prop is injected (e.g. in
 * unit tests that do not go through the Redux system).
 */
export function fallbackT(key, vars) {
  return translate(null, en, key, vars)
}
