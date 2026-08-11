import React from "react"
import { shallow } from "enzyme"
import SkipToOperations from "core/plugins/accessibility/components/skip-to-operations"

describe("<SkipToOperations />", function () {
  it("moves focus and scrolls to operations in the current Swagger UI instance", function () {
    const target = {
      focus: jest.fn(),
      scrollIntoView: jest.fn(),
    }
    const swaggerUI = {
      querySelector: jest.fn(() => target),
    }
    const event = {
      preventDefault: jest.fn(),
      currentTarget: {
        closest: jest.fn(() => swaggerUI),
      },
    }
    const wrapper = shallow(<SkipToOperations />)

    wrapper.find("a").props().onClick(event)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(event.currentTarget.closest).toHaveBeenCalledWith(".swagger-ui")
    expect(swaggerUI.querySelector).toHaveBeenCalledWith("#operations")
    expect(target.focus).toHaveBeenCalled()
    expect(target.scrollIntoView).toHaveBeenCalled()
  })

  it("does nothing when the current Swagger UI instance has no operations target", function () {
    const event = {
      preventDefault: jest.fn(),
      currentTarget: {
        closest: jest.fn(() => null),
      },
    }
    const wrapper = shallow(<SkipToOperations />)

    wrapper.find("a").props().onClick(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })
})
