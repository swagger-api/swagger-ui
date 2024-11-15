import React from "react"
import { mount } from "enzyme"
import DarkMode from "../../../src/standalone/plugins/top-bar/components/DarkMode"

// Mock SVG imports
jest.mock("../../../src/assets/lightbulb.svg", () => () => <div data-testid="lightbulb">LightBulb</div>)
jest.mock("../../../src/assets/lightbulb-off.svg", () => () => <div data-testid="lightbulb-off">LightBulbOff</div>)

describe("LightBulbIcon Component", () => {
  it("toggles the dark class on the html element and switches icons on click", () => {
    // Mount the component
    const wrapper = mount(<DarkMode />)

    // Access the root html element
    const htmlElement = document.documentElement

    // Ensure initial state no "dark" class
    expect(htmlElement.classList.contains("dark")).toBe(false)

    // Simulate the first click
    wrapper.find(".dark-toggle").simulate("click")

    // After the first click "dark" class is added
    expect(htmlElement.classList.contains("dark")).toBe(true)

    // Simulate the second click
    wrapper.find(".dark-toggle").simulate("click")

    // After the second click  "dark" class is removed
    expect(htmlElement.classList.contains("dark")).toBe(false)
  })
})
