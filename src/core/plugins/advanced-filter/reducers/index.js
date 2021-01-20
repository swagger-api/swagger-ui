import { UPDATE_PHRASE } from "../actions/phrase"
import { UPDATE_MATCHER_OPTION } from "../actions/matcher-options"
import { UPDATE_FILTERED_SPEC } from "../actions/filtered-spec"
import { UPDATE_MATCHER_ACTIVE } from "../actions/matcher"

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
  }
})
