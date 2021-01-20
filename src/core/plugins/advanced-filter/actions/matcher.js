export const UPDATE_MATCHER_ACTIVE = "update_matcher_active"

export const setMatcherIsActive = (key, isActive) => {
  return {
    type: UPDATE_MATCHER_ACTIVE,
    payload: { key, isActive },
  }
}
