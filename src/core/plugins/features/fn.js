const makeGetSettingsComponent = system => featureKey => {
  const { getComponent } = system.getSystem()
  const getComponentSilently = (name) => getComponent(name, true, { failSilently: true })
  return getComponentSilently(`settings_${featureKey}`)
}

export default (system) => ({
  getSettingsComponent: makeGetSettingsComponent(system)
})
