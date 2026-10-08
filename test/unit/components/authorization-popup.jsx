import React from "react"
import { mount } from "enzyme"
import AuthorizationPopup from "core/components/auth/authorization-popup"
import Im from "immutable"

describe("<AuthorizationPopup/>", function () {
  const dummyComponent = () => null
  const components = {
    auths: dummyComponent,
    CloseIcon: dummyComponent,
  }

  const mockedProps = {
    fn: {},
    getComponent: (c) => components[c],
    authSelectors: {
      shownDefinitions() {
        return Im.Map()
      },
    },
    specSelectors: {},
    errSelectors: {},
    authActions: {
      showDefinitions: jest.fn(),
    },
  }

  afterEach(() => {
    mockedProps.authActions.showDefinitions.mockClear()
  })

  it("closes the dialog when the Escape key is pressed", function () {
    const wrapper = mount(<AuthorizationPopup {...mockedProps} />)

    const event = new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockedProps.authActions.showDefinitions).toHaveBeenCalledWith(false)

    wrapper.unmount()
  })

  it("does not close the dialog when a different key is pressed", function () {
    const wrapper = mount(<AuthorizationPopup {...mockedProps} />)

    const event = new window.KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockedProps.authActions.showDefinitions).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it("removes the keydown listener when unmounted", function () {
    const wrapper = mount(<AuthorizationPopup {...mockedProps} />)
    wrapper.unmount()

    const event = new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockedProps.authActions.showDefinitions).not.toHaveBeenCalled()
  })

  it("closes the dialog when the backdrop is clicked", function () {
    const wrapper = mount(<AuthorizationPopup {...mockedProps} />)

    wrapper.find(".backdrop-ux").simulate("click")

    expect(mockedProps.authActions.showDefinitions).toHaveBeenCalledWith(false)

    wrapper.unmount()
  })

  it("does not close the dialog when the modal content is clicked", function () {
    const wrapper = mount(<AuthorizationPopup {...mockedProps} />)

    wrapper.find(".modal-ux").simulate("click")

    expect(mockedProps.authActions.showDefinitions).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
