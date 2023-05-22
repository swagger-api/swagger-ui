/**
 * @prettier
 */
export const loaded = (oriAction, system) => (payload) => {
  const { getConfigs, authActions } = system
  const configs = getConfigs()

  oriAction(payload)

  // check if we should restore authorization data from localStorage
  if (configs.persistAuthorization) {
    const authorized = localStorage.getItem("authorized")
    if (authorized) {
      authActions.restoreAuthorization({
        authorized: JSON.parse(authorized),
      })
    }
  }
}
