/**
 * @prettier
 */
import React, { useState, useCallback } from "react"
import LightBulb from "../assets/lightbulb.svg"
import LightBulbOff from "../assets/lightbulb-off.svg"

const LightBulbIcon = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = useCallback(() => {
    document.documentElement.classList.toggle("dark")
    setIsDarkMode((prevState) => !prevState) // Toggle the state
  }, [])

  return (
    <div onClick={toggleDarkMode} style={{ cursor: "pointer" }} className="dark-toggle">
      {!isDarkMode ? (
        <LightBulbOff height="24" data-testid="lightbulb-off" className="on" />
      ) : (
        <LightBulb height="24" data-testid="lightbulb" className="off" />
      )}
    </div>
  )
}

export default LightBulbIcon
