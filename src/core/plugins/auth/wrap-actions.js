/**
 * @prettier
 */

/**
 * `authorize` and `logout` wrapped actions provide capacity
 * to persist cookie based apiKey in document.cookie.
 *
 * `persistAuthorization` SwaggerUI options needs to set to `true`
 * for document.cookie persistence to work.
 */
export const authorize = (oriAction, system) => (payload) => {
  oriAction(payload)

  const configs = system.getConfigs()

  if (!configs.persistAuthorization) return

  // create cookie
  try {
    const [{ schema, value }] = Object.values(payload)
    const isApiKeyAuth = schema.get("type") === "apiKey"
    const isInCookie = schema.get("in") === "cookie"
    const isApiKeyInCookie = isApiKeyAuth && isInCookie

    if (isApiKeyInCookie) {
      const secure = `${configs.url?.split("/")[0] === "https:" ? ";secure" : ""}`
      const urlBasePath = configs.url?.split("/").splice(3).join("/")
      const path = `${urlBasePath === undefined ? ";path=/" : ";path=/".concat(urlBasePath)}`
      let cookieStr = `${schema.get("name")}=${value};samesite=None${secure}${path}`
      document.cookie = cookieStr
    }
  } catch (error) {
    console.error(
      "Error persisting cookie based apiKey in document.cookie.",
      error
    )
  }
}

export const logout = (oriAction, system) => (payload) => {
  const configs = system.getConfigs()
  const authorized = system.authSelectors.authorized()

  // deleting cookie
  try {
    if (configs.persistAuthorization && Array.isArray(payload)) {
      payload.forEach((authorizedName) => {
        const auth = authorized.get(authorizedName, {})
        const isApiKeyAuth = auth.getIn(["schema", "type"]) === "apiKey"
        const isInCookie = auth.getIn(["schema", "in"]) === "cookie"
        const isApiKeyInCookie = isApiKeyAuth && isInCookie

        if (isApiKeyInCookie) {
          const cookieName = auth.getIn(["schema", "name"])
          const urlBasePath = configs.url?.split("/").splice(3).join("/")
          const path = `${urlBasePath === undefined ? ";path=/" : ";path=/".concat(urlBasePath)}`
          document.cookie = `${cookieName}=;max-age=-99999999${path}`
        }
      })
    }
  } catch (error) {
    console.error(
      "Error deleting cookie based apiKey from document.cookie.",
      error
    )
  }

  oriAction(payload)
}
