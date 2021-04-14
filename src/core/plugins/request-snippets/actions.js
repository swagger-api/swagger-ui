export const TOGGLE_DEFAULT_EXPANDED = "request_snippets_toggle_default_expanded"
export const SET_ENABLED = "request_snippets_set_enabled"
export const toggleDefaultExpanded = () => {
  return {
    type: TOGGLE_DEFAULT_EXPANDED
  }
}
export const setEnabled = (enabled) => {
  return {
    type: SET_ENABLED,
    payload: enabled
  }
}
