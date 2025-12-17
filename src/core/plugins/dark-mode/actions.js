/**
 * @prettier
 */

export const DARK_MODE_SET = "dark_mode_set"
export const DARK_MODE_TOGGLE = "dark_mode_toggle"

/**
 * Set dark mode state
 * @param {boolean} isDarkMode - Whether dark mode should be enabled
 */
export function setDarkMode(isDarkMode) {
  return {
    type: DARK_MODE_SET,
    payload: isDarkMode,
  }
}

/**
 * Toggle dark mode on/off
 */
export function toggleDarkMode() {
  return {
    type: DARK_MODE_TOGGLE,
  }
}

/**
 * Initialize dark mode based on configuration and system preferences
 */
export function initializeDarkMode() {
  return (system) => {
    const { getConfigs, darkModeActions } = system

    // Get configs - this should be called after configs are loaded
    const configs = getConfigs()

    const theme = configs?.theme || {}
    const defaultMode = theme.defaultMode || "system"

    let shouldEnableDarkMode = false

    if (defaultMode === "dark") {
      // Explicitly set to dark mode
      shouldEnableDarkMode = true
    } else if (defaultMode === "light") {
      // Explicitly set to light mode
      shouldEnableDarkMode = false
    } else if (defaultMode === "system") {
      // Check system preference
      if (typeof window !== "undefined") {
        const prefersDarkMode =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        shouldEnableDarkMode = prefersDarkMode
      }
    }

    // Apply dark mode if needed
    if (shouldEnableDarkMode) {
      darkModeActions.setDarkMode(true)
    }
  }
}
