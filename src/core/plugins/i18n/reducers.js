/**
 * @prettier
 */
import { Map } from "immutable"
import { SET_LOCALE, LOAD_MESSAGES } from "./actions"

export default {
  [SET_LOCALE]: (state, { payload: locale }) => state.set("locale", locale),

  [LOAD_MESSAGES]: (state, { payload: { locale, messages } }) =>
    state.updateIn(["messages", locale], (existing = Map()) =>
      existing.merge(Map(messages))
    ),
}
