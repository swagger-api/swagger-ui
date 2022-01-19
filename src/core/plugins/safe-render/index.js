const safeRenderPlugin = () => {
  const criticalComponentList = [
    "App",
    "Topbar",
    "info",
    "OperationContainer",
  ]
  const wrapFactory = (Original, { fn }) => {
    return fn.withErrorBoundary(Original)
  }

  return {
    wrapComponents: criticalComponentList.reduce((previousValue, currentValue) => {
      previousValue[currentValue] = wrapFactory
      return previousValue
    }, {})
  }
}

export default safeRenderPlugin
