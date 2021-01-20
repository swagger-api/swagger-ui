import components from "./components"
import selectors from "./selectors"
import makeReducers from "./reducers"
import actions from "./actions"
import fn from "./fn"
import { definitions, taggedOperations } from "../spec/selectors"

export default (system) => {
  const t = ({
    components,
    fn,
    statePlugins: {
      advancedFilter: {
        selectors,
        actions,
        reducers: makeReducers(system),
      },
      spec: {
        selectors: {
          taggedOperations: (state) => ({ getSystem }) => {
            const { advancedFilterSelectors } = getSystem()
            if (advancedFilterSelectors.isEnabled() && advancedFilterSelectors.getPhrase() !== "") {
              const filteredSpec = advancedFilterSelectors.getFilteredSpec()
              state = state.set("resolvedSubtrees", filteredSpec)
              state = state.set("json", filteredSpec)
            }
            return taggedOperations(state)(getSystem())
          },
          definitions: (state) => ({ getSystem }) => {
            const { advancedFilterSelectors } = getSystem()
            if (advancedFilterSelectors.isEnabled() && advancedFilterSelectors.getPhrase() !== "") {
              const filteredSpec = advancedFilterSelectors.getFilteredSpec()
              state = state.set("resolvedSubtrees", filteredSpec)
              state = state.set("json", filteredSpec)
            }
            return definitions(state)
          },
        },
      },
    },

  })
  return t
}
