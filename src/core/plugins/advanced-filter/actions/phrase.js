export const UPDATE_PHRASE = "update_phrase"
export const updatePhrase = (phrase) => {
  return {
    type: UPDATE_PHRASE,
    payload: { phrase },
  }
}
