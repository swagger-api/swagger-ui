import { NOOP_FEATURES, TOGGLE_FEATURE, UPDATE_FEATURES } from "./actions"

export default {
  [TOGGLE_FEATURE]: (state, action) => {
    return state
      .updateIn([action.payload, "enabled"], enabled => !enabled)
  },
  [UPDATE_FEATURES]: (state, action) => {
    return action.payload
  },
  [NOOP_FEATURES]: (state) => state
}
