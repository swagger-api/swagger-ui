/**
 * @prettier
 */
import * as actions from "./actions"
import * as selectors from "./selectors"
import reducers, { initialState } from "./reducers"

export default function darkModePlugin() {
  return {
    statePlugins: {
      darkMode: {
        initialState,
        reducers,
        actions,
        selectors,
      },
      configs: {
        // Hook into the configs loaded action to initialize dark mode
      },
    },
    fn: {
      // This hook is called after the system is fully initialized
      // and configs are loaded, making it the perfect place to initialize dark mode
      opsFilter: (taggedOps, fn) => fn(taggedOps),
    },
    afterLoad(system) {
      // Use requestAnimationFrame to defer until next frame
      // This ensures configs are loaded before initialization
      if (typeof window !== "undefined" && window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          const { darkModeActions } = system
          if (darkModeActions && darkModeActions.initializeDarkMode) {
            darkModeActions.initializeDarkMode()
          }
        })
      } else {
        // Fallback for non-browser environments
        setTimeout(() => {
          const { darkModeActions } = system
          if (darkModeActions && darkModeActions.initializeDarkMode) {
            darkModeActions.initializeDarkMode()
          }
        }, 0)
      }
    },
  }
}
