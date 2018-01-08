import { fromJS } from "immutable"

import {
	UPDATE_CONFIGS,
	TOGGLE_CONFIGS,
} from "./actions"

export default {

  [UPDATE_CONFIGS]: (state, action) => {
    return state.merge(fromJS(action.payload))
  },

  [TOGGLE_CONFIGS]: (state, action) => {
    const configName = action.payload
    const oriVal = state.get(configName)
    return state.set(configName, !oriVal)
  },

}
