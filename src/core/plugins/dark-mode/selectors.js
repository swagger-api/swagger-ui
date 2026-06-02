/**
 * @prettier
 */

/**
 * Get dark mode state
 */
export const isDarkMode = (state) => {
  return state.get("isDarkMode", false)
}
