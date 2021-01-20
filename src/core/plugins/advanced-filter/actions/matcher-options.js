export const UPDATE_MATCHER_OPTION = "update_matcher_option"
export const updateMatcherOption = (key, newOption) => {
  return {
    type: UPDATE_MATCHER_OPTION,
    payload: { key, newOption },
  }
}
