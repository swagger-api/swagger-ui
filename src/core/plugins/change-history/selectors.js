export function history(state) {
  return state.get("history")
}

export function isPanelOpen(state) {
  return state.get("isPanelOpen")
}

export function hasUnseenChanges(state) {
  return state.get("hasUnseenChanges")
}

export function storageKey(state) {
  return state.get("storageKey")
}

export function latestEntry(state) {
  const entries = history(state)
  if (!entries || !entries.size) {
    return null
  }

  return entries.get(0)
}

export function hasHistory(state) {
  const entries = history(state)
  return Boolean(entries && entries.size)
}
