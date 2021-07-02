import { UPDATE_FILTERED_SPEC, UPDATE_MATCHER_ACTIVE, UPDATE_MATCHER_OPTION, UPDATE_PHRASE } from "./actions"


export default (system) => ({
  [UPDATE_MATCHER_OPTION]: (state, { payload: { key, newOption } }) => {
    return state.setIn(["matcherOptions", key], newOption)
  },
  [UPDATE_PHRASE]: (state, { payload: { phrase } }) => {
    const filteredSpec = system.fn.applyMatchersToSpec(phrase, system)
    return state
      .set("phrase", phrase)
      .set("filteredSpec", filteredSpec)
  },
  [UPDATE_FILTERED_SPEC]: (state) => {
    const phrase = system.getSystem().advancedFilterSelectors.getPhrase()
    const filteredSpec = system.fn.applyMatchersToSpec(phrase, system)
    return state
      .set("filteredSpec", filteredSpec)
  },
  [UPDATE_MATCHER_ACTIVE]: (state, { payload: { key, isActive } }) => {
    return state.setIn(["matchers", key, "isActive"], isActive)
  },
})
