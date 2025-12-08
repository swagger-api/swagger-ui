/**
 * @prettier
 */
import React, { useState, useCallback } from "react"
import LightBulb from "../assets/lightbulb.svg"
import LightBulbOff from "../assets/lightbulb-off.svg"

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  const toggleDarkMode = useCallback(() => {
    document.documentElement.classList.toggle("dark-mode")
    setIsDarkMode((prevState) => !prevState)
  }, [])

  return (
    <div className="dark-mode-toggle">
      <button onClick={toggleDarkMode}>
        {!isDarkMode ? <LightBulbOff height="24" /> : <LightBulb height="24" />}
      </button>
    </div>
  )
}

export default DarkModeToggle
