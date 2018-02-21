import { fromJS } from "immutable"
import {
  UPDATE_LAYOUT,
  UPDATE_FILTER,
  UPDATE_MODE,
  SHOW
} from "./actions"

export default {

  [UPDATE_LAYOUT]: (state, action) => state.set("layout", action.payload),

  [UPDATE_FILTER]: (state, action) => state.set("filter", action.payload),

  [SHOW]: (state, action) => {
    const isShown = action.payload.shown
    // This is one way to serialize an array, another (preferred) is to convert to json-pointer
    // TODO: use json-pointer serilization instead of fromJS(...), for performance
    const thingToShow = fromJS(action.payload.thing)
    // This is a map of paths to bools
    // eg: [one, two] => true
    // eg: [one] => false
    return state.update("shown", fromJS({}), a => a.set(thingToShow, isShown))
  },

  [UPDATE_MODE]: (state, action) => {
    let thing = action.payload.thing
    let mode = action.payload.mode
    return state.setIn(["modes"].concat(thing), (mode || "") + "")
  }

}
