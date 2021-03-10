import { SET_ENABLED, TOGGLE_DEFAULT_EXPANDED } from "./actions"

export default {
  [TOGGLE_DEFAULT_EXPANDED]: (state) => {
    return state
      .update("defaultExpanded", expanded => !expanded)
  },
  [SET_ENABLED]: (state) => {
    return state
      .update("enabled", enabled => !enabled)
  },
}
