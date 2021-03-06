import spec from "./spec-extension"
import * as selectors from "./selectors"

export default () => ({
  statePlugins: {
    hierarchicalTags: {
      selectors
    },
    spec
  }
})
