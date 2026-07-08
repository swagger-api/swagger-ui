import { fromJS } from "immutable"

import {
  SET_HISTORY,
  SET_PANEL_OPEN,
  SET_UNSEEN_CHANGES,
  SET_STORAGE_KEY,
} from "./actions"

const defaultState = fromJS({
  history: [],
  isPanelOpen: false,
  hasUnseenChanges: false,
  storageKey: null,
})

export default {
  [SET_HISTORY]: (state, action) =>
    state.set("history", fromJS(action.payload)),

  [SET_PANEL_OPEN]: (state, action) => state.set("isPanelOpen", action.payload),

  [SET_UNSEEN_CHANGES]: (state, action) =>
    state.set("hasUnseenChanges", action.payload),

  [SET_STORAGE_KEY]: (state, action) => state.set("storageKey", action.payload),
}

export { defaultState }
