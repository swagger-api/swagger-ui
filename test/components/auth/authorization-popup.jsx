
/* eslint-env mocha */
import React from "react"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import AuthorizationPopup from "components/auth/authorization-popup"
import Auths from "components/auth/auths"

describe("<AuthorizationPopup/>", function(){
  // Given
  const getMockedProps = () => ({
    fn: { AST: {} },
    authActions: {
      showDefinitions: createSpy()
    },
    authSelectors: {
      shownDefinitions: () => ({
        valueSeq: () => [1, 2, 3]
      })
    },
    errSelectors: null,
    getComponent: () => "div",
    specSelectors: null
  })

  it("renders Auth components", function(){
    // When
    const wrapper = shallow(<AuthorizationPopup {...getMockedProps()}/>)

    // Then
    const authContainer = wrapper.find(".modal-ux-content")
    expect(authContainer.getNode().props.children.length).toEqual(3)
  })

  it("closes the modal on click", function() {
    // When
    const props = getMockedProps()
    const wrapper = shallow(<AuthorizationPopup {...props}/>)

    // Then
    wrapper.find(".close-modal").simulate("click")
    expect(props.authActions.showDefinitions).toHaveBeenCalledWith(false)
  })

  it("closes the modal on escape key", function() {
    // When
    const props = getMockedProps()
    const wrapper = shallow(<AuthorizationPopup {...props}/>)

    // Then
    wrapper.find(".modal-ux").simulate("keydown", { key: "Escape", stopPropagation: () => {} })
    expect(props.authActions.showDefinitions).toHaveBeenCalledWith(false)
  })

  it("does not close the modal with other keys", function() {
    // When
    const props = getMockedProps()
    const wrapper = shallow(<AuthorizationPopup {...props}/>)

    // Then
    const modalUX = wrapper.find(".modal-ux")
    modalUX.simulate("keydown", { key: "Enter", stopPropagation: () => {} })
    modalUX.simulate("keydown", { key: " ", stopPropagation: () => {} })
    modalUX.simulate("keydown", { key: "q", stopPropagation: () => {} })
    expect(props.authActions.showDefinitions).toNotHaveBeenCalled()
  })
})
