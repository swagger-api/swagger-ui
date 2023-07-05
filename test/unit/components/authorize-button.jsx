import React from "react"
import expect from "expect"
import {mount, render} from "enzyme"
import AuthorizeButton from "components/authorize-button"
import { Button } from "components/layout-utils"

describe("<AuthorizeButton />", () => {

  const mockedProperties = {
    authKey: "authid-009",
    caption: "Authorize",
    validAuthorizationData: true,
    description: "Some explanation about what authorize does do",
    getComponent: () => { return Button },
  }

  it("renders the authorize button with hidden label", function () {

    // Given a caption, description and key
    let props = { ...mockedProperties}
    props.authorizationDataProvided = false

    // When
    let element = render(<AuthorizeButton {...props}/>)

    // Then
    expect(element.prop("outerHTML")).toEqual(`<div class=\"auth-btn-wrapper\"><label for=\"authid-009-submit\" class=\"hidden\">Some explanation about what authorize does do</label><button id=\"authid-009-submit\" type=\"submit\" class=\"btn modal-btn auth authorize button\">Authorize</button><button id=\"authid-009-close\" class=\"btn modal-btn auth btn-done button\">Close</button></div>`)
  })

  it("renders the authorize button with applyAuthorization function with hidden label", function () {

    // Given a caption, description and key
    let props = { ...mockedProperties}
    props.authorizationDataProvided = false
    props.applyAuthorization = jest.fn()

    // When
    let wrapper = mount(<AuthorizeButton {...props}/>)

    // Then
    wrapper.find("button#authid-009-submit").simulate("click")
    expect(props.applyAuthorization).toHaveBeenCalled()
  })

  it("renders only the close button as no valid authorization data is provided", function () {

    // Given a caption, description and key
    let props = { ...mockedProperties}
    props.validAuthorizationData = false

    // When
    let element = render(<AuthorizeButton {...props}/>)

    // Then
    expect(element.prop("outerHTML")).toEqual(`<div class=\"auth-btn-wrapper\"><button id=\"authid-009-close\" class=\"btn modal-btn auth btn-done button\">Close</button></div>`)
  })

  it("renders the remove authorization button with hidden label", function () {

    // Given a caption, description and key
    let props = { ...mockedProperties}
    props.authorizationDataProvided = true

    // When
    let element = render(<AuthorizeButton {...props}/>)

    // Then
    expect(element.prop("outerHTML")).toEqual(`<div class=\"auth-btn-wrapper\"><label for=\"authid-009-remove-auth\" class=\"hidden\">Remove authorization</label><button id=\"authid-009-remove-auth\" class=\"btn modal-btn auth authorize button\">Logout</button><button id=\"authid-009-close\" class=\"btn modal-btn auth btn-done button\">Close</button></div>`)
  })

  it("close is called when close button is clicked", function () {

    // Given a caption, description and key
    let props = { ...mockedProperties}
    props.authorizationDataProvided = true
    props.close = jest.fn()

    // When
    let wrapper = mount(<AuthorizeButton {...props}/>)

    // Then
    wrapper.find("button#authid-009-close").simulate("click")
    expect(props.close).toHaveBeenCalled()
  })

  it("remove authorization is called when remove authorization button is clicked", function () {

    // Given a caption, description and key
    let props = { ...mockedProperties}
    props.authorizationDataProvided = true
    props.removeAuthorization = jest.fn()

    // When
    let wrapper = mount(<AuthorizeButton {...props}/>)

    // Then
    wrapper.find("button#authid-009-remove-auth").simulate("click")
    expect(props.removeAuthorization).toHaveBeenCalled()
  })
})
