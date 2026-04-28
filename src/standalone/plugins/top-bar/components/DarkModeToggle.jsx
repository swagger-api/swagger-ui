/**
 * @prettier
 */
import React, { Component } from "react"
import PropTypes from "prop-types"

import LightBulb from "../assets/lightbulb.svg"
import LightBulbOff from "../assets/lightbulb-off.svg"

class DarkModeToggle extends Component {
  static propTypes = {
    darkModeSelectors: PropTypes.object,
    darkModeActions: PropTypes.object,
  }

  toggleIsDarkMode = () => {
    const { darkModeActions } = this.props

    if (darkModeActions && darkModeActions.toggleDarkMode) {
      // Use the core dark mode plugin if available
      darkModeActions.toggleDarkMode()
    } else {
      // Fallback to manual DOM manipulation for backwards compatibility
      document.documentElement.classList.toggle("dark-mode")
      this.forceUpdate() // Force re-render to update icon
    }
  }

  isDarkMode() {
    const { darkModeSelectors } = this.props

    if (darkModeSelectors && darkModeSelectors.isDarkMode) {
      // Use the core dark mode plugin state if available
      return darkModeSelectors.isDarkMode()
    } else {
      // Fallback to checking DOM class for backwards compatibility
      return document.documentElement.classList.contains("dark-mode")
    }
  }

  render() {
    const isDarkMode = this.isDarkMode()

    return (
      <div className="dark-mode-toggle">
        <button onClick={this.toggleIsDarkMode}>
          {isDarkMode ? (
            <LightBulb height="24" />
          ) : (
            <LightBulbOff height="24" />
          )}
        </button>
      </div>
    )
  }
}

export default DarkModeToggle
