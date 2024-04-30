/**
 * @prettier
 * Receives options from a remote URL.
 */

const optionsFromURL =
  ({ url, system }) =>
  async (options) => {
    if (!url) return {}
    if (typeof system.configsActions?.getConfigByUrl !== "function") return {}
    let resolve
    const deferred = new Promise((res) => {
      resolve = res
    })
    const callback = (fetchedOptions) => {
      // receives null on remote URL fetch failure
      resolve(fetchedOptions)
    }

    system.configsActions.getConfigByUrl(
      {
        url,
        loadRemoteConfig: true,
        requestInterceptor: options.requestInterceptor,
        responseInterceptor: options.responseInterceptor,
      },
      callback
    )

    return deferred
  }

export default optionsFromURL
