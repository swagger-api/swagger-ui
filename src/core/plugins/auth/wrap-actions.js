/**
 * @prettier
 */
import { fromJS } from "immutable"

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
    const [{ schema: payloadSchema, value }] = Object.values(payload)
    const schema = fromJS(payloadSchema)
    const isApiKeyAuth = schema.get("type") === "apiKey"
    const isInCookie = schema.get("in") === "cookie"
    const isApiKeyInCookie = isApiKeyAuth && isInCookie

    if (isApiKeyInCookie) {
      document.cookie = `${schema.get("name")}=${value}; SameSite=None; Secure`
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
          document.cookie = `${cookieName}=; Max-Age=-99999999`
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
