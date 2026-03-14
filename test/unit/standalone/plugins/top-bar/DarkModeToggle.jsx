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
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it("toggles the dark class on the html element and switches icons on click", () => {
    const wrapper = mount(<DarkModeToggle />)
    const htmlElement = document.documentElement

    expect(htmlElement.classList.contains("dark-mode")).toBe(false)

    wrapper.find(".dark-mode-toggle button").simulate("click")

    expect(htmlElement.classList.contains("dark-mode")).toBe(true)

    wrapper.find(".dark-mode-toggle button").simulate("click")

    expect(htmlElement.classList.contains("dark-mode")).toBe(false)
  })
})
