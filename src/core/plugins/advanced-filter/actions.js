export const UPDATE_FILTERED_SPEC = "update_filtered_spec"
export const updateFilteredSpec = () => {
  return {
    type: UPDATE_FILTERED_SPEC,
  }
}

export const UPDATE_MATCHER_ACTIVE = "update_matcher_active"
export const setMatcherIsActive = (key, isActive) => {
  return {
    type: UPDATE_MATCHER_ACTIVE,
    payload: { key, isActive },
  }
}

export const UPDATE_MATCHER_OPTION = "update_matcher_option"
export const updateMatcherOption = (key, newOption) => {
  return {
    type: UPDATE_MATCHER_OPTION,
    payload: { key, newOption },
  }
}

export const UPDATE_PHRASE = "update_phrase"
export const updatePhrase = (phrase) => {
  return {
    type: UPDATE_PHRASE,
    payload: { phrase },
  }
}

