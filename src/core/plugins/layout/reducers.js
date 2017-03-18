import {
  UPDATE_LAYOUT,
  UPDATE_MODE,
  SHOW
} from "./actions"

export default {

  [UPDATE_LAYOUT]: (state, action) => state.set("layout", action.payload),

  [SHOW]: (state, action) => {
    let thing = action.payload.thing
    let shown = action.payload.shown
    return state.setIn(["shown"].concat(thing), shown)
  },

  [UPDATE_MODE]: (state, action) => {
    let thing = action.payload.thing
    let mode = action.payload.mode
    return state.setIn(["modes"].concat(thing), (mode || "") + "")
  }

}

