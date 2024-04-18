/**
 * @prettier
 *
 * Receives options at runtime.
 */

/* eslint-disable no-undef */
const optionsFromRuntime = () => () => {
  const options = {}

  if (globalThis.location) {
    options.oauth2RedirectUrl = `${globalThis.location.protocol}//${globalThis.location.host}${globalThis.location.pathname.substring(0, globalThis.location.pathname.lastIndexOf("/"))}/oauth2-redirect.html`
  }

  return options
}

export default optionsFromRuntime
