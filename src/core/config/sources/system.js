/**
 * @prettier
 *
 * Receives options from a System.
 * These options are baked-in to the System during the compile time.
 */

const optionsFromSystem =
  ({ system }) =>
  () => {
    if (typeof system.specSelectors?.getLocalConfig !== "function") return {}

    return system.specSelectors.getLocalConfig()
  }

export default optionsFromSystem
