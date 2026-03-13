/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import DarkModeToggle from "standalone/plugins/top-bar/components/DarkModeToggle"

jest.mock("standalone/plugins/top-bar/assets/lightbulb.svg", () => () => (
  <div>LightBulb</div>
))
jest.mock("standalone/plugins/top-bar/assets/lightbulb-off.svg", () => () => (
  <div>LightBulbOff</div>
))

describe("DarkModeToggle Component", () => {
  beforeEach(() => {
    // Clear dark mode class before each test
    document.documentElement.classList.remove("dark-mode")
  })

  describe("without dark mode plugin (backwards compatibility)", () => {
    it("toggles the dark class on the html element on click", () => {
      const wrapper = mount(<DarkModeToggle />)
      const htmlElement = document.documentElement

      expect(htmlElement.classList.contains("dark-mode")).toBe(false)

      wrapper.find(".dark-mode-toggle button").simulate("click")
      expect(htmlElement.classList.contains("dark-mode")).toBe(true)

      wrapper.find(".dark-mode-toggle button").simulate("click")
      expect(htmlElement.classList.contains("dark-mode")).toBe(false)
    })
  })

  describe("with dark mode plugin", () => {
    it("uses dark mode plugin actions when available", () => {
      const mockToggleDarkMode = jest.fn()
      const mockIsDarkMode = jest.fn().mockReturnValue(false)

      const wrapper = mount(
        <DarkModeToggle
          darkModeActions={{ toggleDarkMode: mockToggleDarkMode }}
          darkModeSelectors={{ isDarkMode: mockIsDarkMode }}
        />
      )

      wrapper.find(".dark-mode-toggle button").simulate("click")

      expect(mockToggleDarkMode).toHaveBeenCalledTimes(1)
    })

    it("uses dark mode selectors to determine state", () => {
      const mockIsDarkMode = jest.fn().mockReturnValue(false)

      mount(
        <DarkModeToggle
          darkModeActions={{ toggleDarkMode: jest.fn() }}
          darkModeSelectors={{ isDarkMode: mockIsDarkMode }}
        />
      )

      expect(mockIsDarkMode).toHaveBeenCalled()
    })
  })
})
