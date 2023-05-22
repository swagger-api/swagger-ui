// Add security to the final `execute` call ( via `extras` )
export const execute = ( oriAction, { authSelectors, specSelectors }) => ({ path, method, operation, extras }) => {
  let securities = {
    authorized: authSelectors.authorized() && authSelectors.authorized().toJS(),
    definitions: specSelectors.securityDefinitions() && specSelectors.securityDefinitions().toJS(),
    specSecurity:  specSelectors.security() && specSelectors.security().toJS()
  }

  return oriAction({ path, method, operation, securities, ...extras })
}
