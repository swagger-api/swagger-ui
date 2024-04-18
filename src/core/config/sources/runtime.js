/**
 * @prettier
 *
 * Receives options at runtime.
 */

const optionsFromRuntime = () => () => {
  const options = {
    oauth2RedirectUrl: `${window.location.protocol}//${window.location.host}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))}/oauth2-redirect.html`,
  }

  return options
}

export default optionsFromRuntime
