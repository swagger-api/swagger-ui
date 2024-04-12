/**
 * @prettier
 * Receives options from a local YAML file.
 */

const optionsFromYAMLFile =
  ({ system }) =>
  () => {
    if (typeof system.specSelectors?.getLocalConfig !== "function") return {}

    return system.specSelectors.getLocalConfig()
  }

export default optionsFromYAMLFile
