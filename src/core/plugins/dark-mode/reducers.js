/**
 * @prettier
 */
import { Map } from "immutable"
import { DARK_MODE_SET, DARK_MODE_TOGGLE } from "./actions"

const initialState = Map({
  isDarkMode: false,
})

export default {
  [DARK_MODE_SET]: (state, action) => {
    const isDarkMode = action.payload

    // Apply or remove the dark-mode class on the HTML element
    if (typeof document !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode")
      } else {
        document.documentElement.classList.remove("dark-mode")
      }
    }

    return state.set("isDarkMode", isDarkMode)
  },

  [DARK_MODE_TOGGLE]: (state) => {
    const currentMode = state.get("isDarkMode")
    const newMode = !currentMode

    // Apply or remove the dark-mode class on the HTML element
    if (typeof document !== "undefined") {
      if (newMode) {
        document.documentElement.classList.add("dark-mode")
      } else {
        document.documentElement.classList.remove("dark-mode")
      }
    }

    return state.set("isDarkMode", newMode)
  },
}

export { initialState }
