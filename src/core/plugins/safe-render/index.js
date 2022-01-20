const safeRenderPlugin = ({componentList = [], fullOverride = false} = {}) => () => {
  const defaultComponentList = [
    "App",
    "Topbar",
    "VersionPragmaFilter",
    "InfoContainer",
    "SchemesContainer",
    "AuthorizeBtnContainer",
    "FilterContainer",
    "Operations",
    "OperationContainer",
    "parameters",
    "responses",
    "OperationServers",
    "Models",
    "ModelWrapper",
    "onlineValidatorBadge"
  ]

  const mergedComponentList = fullOverride ? componentList : [...defaultComponentList, ...componentList]
  const wrapFactory = (Original, { fn }) => fn.withErrorBoundary(Original)

  return {
    wrapComponents: mergedComponentList.reduce((previousValue, currentValue) => {
      previousValue[currentValue] = wrapFactory
      return previousValue
    }, {})
  }
}

export default safeRenderPlugin
