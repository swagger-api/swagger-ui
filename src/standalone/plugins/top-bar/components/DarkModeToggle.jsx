/**
 * @prettier
 */
import React, { Component } from "react"

import LightBulb from "../assets/lightbulb.svg"
import LightBulbOff from "../assets/lightbulb-off.svg"

class DarkModeToggle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDarkMode: false,
    }
    this.toggleIsDarkMode = this.toggleIsDarkMode.bind(this)
  }

  componentDidMount() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark-mode")
      this.setState({ isDarkMode: true })
    }
  }

  toggleIsDarkMode() {
    document.documentElement.classList.toggle("dark-mode")
    this.setState((prevState) => ({ isDarkMode: !prevState.isDarkMode }))
  }

  render() {
    const { isDarkMode } = this.state

    return (
      <div className="dark-mode-toggle">
        <button
          aria-label="Dark mode"
          aria-pressed={isDarkMode}
          onClick={this.toggleIsDarkMode}
        >
          {!isDarkMode ? (
            <LightBulbOff aria-hidden="true" height="24" />
          ) : (
            <LightBulb aria-hidden="true" height="24" />
          )}
        </button>
      </div>
    )
  }
}

export default DarkModeToggle
