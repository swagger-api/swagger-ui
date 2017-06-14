import { fromJS } from "immutable"

import {
	UPDATE_CONFIGS,
} from "./actions"

export default {

  [UPDATE_CONFIGS]: (state, action) => {
    return state.merge(fromJS(action.payload))
  },

}
