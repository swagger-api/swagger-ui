export const SET_HISTORY = "change_history_set_history"
export const SET_PANEL_OPEN = "change_history_set_panel_open"
export const SET_UNSEEN_CHANGES = "change_history_set_unseen_changes"
export const SET_STORAGE_KEY = "change_history_set_storage_key"

export function setHistory(history) {
  return {
    type: SET_HISTORY,
    payload: history,
  }
}

export function setPanelOpen(isOpen) {
  return {
    type: SET_PANEL_OPEN,
    payload: isOpen,
  }
}

export function setUnseenChanges(hasUnseenChanges) {
  return {
    type: SET_UNSEEN_CHANGES,
    payload: hasUnseenChanges,
  }
}

export function setStorageKey(storageKey) {
  return {
    type: SET_STORAGE_KEY,
    payload: storageKey,
  }
}
