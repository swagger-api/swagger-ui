
/* eslint-env mocha */
import React from "react"
import expect from "expect"
import { mount } from "enzyme"
import { fromJS } from "immutable"
import ServersContainer from "core/plugins/oas3/components/servers-container"
import Servers from "core/plugins/oas3/components/servers"
import { Col } from "components/layout-utils"

describe("<ServersContainer/>", function(){

  const components = {
    Servers,
    Col
  }
  const mockedProps = {
    specSelectors: {
      servers() {}
    },
    oas3Selectors: {
      selectedServer() {},
      serverVariableValue() {},
      serverEffectiveValue() {}
    },
    oas3Actions: {
      setSelectedServer() {},
      setServerVariableValue() {}
    },
    getComponent: c => components[c]
  }

  it("renders Servers inside ServersContainer if servers are provided", function(){

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.servers = function() {return fromJS([{url: "http://server1.com"}])}
    props.oas3Selectors = {...mockedProps.oas3Selectors}
    props.oas3Selectors.selectedServer = function() {return "http://server1.com"}

    // When
    let wrapper = mount(<ServersContainer {...props}/>)

    // Then
    const renderedServers = wrapper.find(Servers)
    expect(renderedServers.length).toEqual(1)
  })

  it("does not render Servers inside ServersContainer if servers are empty", function(){

    // Given
    let props = {...mockedProps}
    props.specSelectors = {...mockedProps.specSelectors}
    props.specSelectors.servers = function() {return fromJS([])}

    // When
    let wrapper = mount(<ServersContainer {...props}/>)

    // Then
    const renderedServers = wrapper.find(Servers)
    expect(renderedServers.length).toEqual(0)
  })

  it("does not render Servers inside ServersContainer if servers are undefined", function(){

    // Given
    let props = {...mockedProps}

    // When
    let wrapper = mount(<ServersContainer {...props}/>)

    // Then
    const renderedServers = wrapper.find(Servers)
    expect(renderedServers.length).toEqual(0)
  })
})
