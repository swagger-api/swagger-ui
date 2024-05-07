/**
 * @prettier
 * Receives options from a remote URL.
 */
const makeDeferred = () => {
  const deferred = {}
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}

const optionsFromURL =
  ({ url, system }) =>
  async (options) => {
    if (!url) return {}
    if (typeof system.configsActions?.getConfigByUrl !== "function") return {}
    const deferred = makeDeferred()
    const callback = (fetchedOptions) => {
      // receives null on remote URL fetch failure
      deferred.resolve(fetchedOptions)
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

    return deferred.promise
  }

export default optionsFromURL
