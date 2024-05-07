import React from "react"
import { mount } from "enzyme"
import { fromJS } from "immutable"
import SchemesContainer from "core/plugins/json-schema-5/containers/schemes"
import Schemes from "core/plugins/json-schema-5/components/schemes"
import { Col } from "core/components/layout-utils"

describe("<SchemesContainer/>", function(){

  const components = {
    schemes: Schemes,
    Col,
    authorizeBtn: () => <span className="mocked-button" id="mocked-button" />
  }
  const mockedProps = {
    specSelectors: {
      securityDefinitions() {},
      operationScheme() {},
      schemes() {}
    },
    specActions: {
      setScheme() {}
    },
    getComponent: c => components[c]
  }
  const twoSecurityDefinitions = {
    "petstore_auth": {
      "type": "oauth2",
      "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
      "flow": "implicit",
      "scopes": {
        "write:pets": "modify pets in your account",
        "read:pets": "read your pets"
      }
    },
    "api_key": {
      "type": "apiKey",
      "name": "api_key",
      "in": "header"
    }
  }

  it("renders Schemes inside SchemesContainer if schemes are provided", function(){

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.operationScheme = function() {return "http"}
    props.specSelectors.schemes = function() {return fromJS(["http", "https"])}

    // When
    let wrapper = mount(<SchemesContainer {...props}/>)

    // Then
    const renderedSchemes = wrapper.find(Schemes)
    expect(renderedSchemes.length).toEqual(1)
  })

  it("does not render Schemes inside SchemeWrapper if empty array of schemes is provided", function(){

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.schemes = function() {return fromJS([])}

    // When
    let wrapper = mount(<SchemesContainer {...props}/>)

    // Then
    const renderedSchemes = wrapper.find(Schemes)
    expect(renderedSchemes.length).toEqual(0)
  })

  it("does not render Schemes inside SchemeWrapper if provided schemes are undefined", function(){

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.schemes = function() {return undefined}

    // When
    let wrapper = mount(<SchemesContainer {...props}/>)

    // Then
    const renderedSchemes = wrapper.find(Schemes)
    expect(renderedSchemes.length).toEqual(0)
  })
})
