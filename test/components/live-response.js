/* eslint-env mocha */
import React from "react"
import { fromJSOrdered } from "core/utils"
import expect, { createSpy } from "expect"
import { shallow } from "enzyme"
import Curl from "components/curl"
import LiveResponse from "components/live-response"
import ResponseBody from "components/response-body"

describe("<LiveResponse/>", function(){
  let request = fromJSOrdered({
    credentials: "same-origin",
    headers: {
      accept: "application/xml"
    },
    url: "http://petstore.swagger.io/v2/pet/1"
  })

  let mutatedRequest = fromJSOrdered({
    credentials: "same-origin",
    headers: {
      accept: "application/xml",
      mutated: "header"
    },
    url: "http://petstore.swagger.io/v2/pet/1"
  })

  let requests = {
    request: request,
    mutatedRequest: mutatedRequest
  }

  const tests = [
    { showMutatedRequest: true, expected: { request: "mutatedRequest", requestForCalls: 0, mutatedRequestForCalls: 1 } },
    { showMutatedRequest: false, expected: { request: "request", requestForCalls: 1, mutatedRequestForCalls: 0 } }
  ]

  tests.forEach(function(test) {
    it("passes " + test.expected.request + " to Curl when showMutatedRequest = " + test.showMutatedRequest, function() {

      // Given

      let response = fromJSOrdered({
        status: 200,
        url: "http://petstore.swagger.io/v2/pet/1",
        headers: {},
        text: "<response/>",
      })

      let mutatedRequestForSpy = createSpy().andReturn(mutatedRequest)
      let requestForSpy = createSpy().andReturn(request) 

      let components = {
        curl: Curl,
        responseBody: ResponseBody
      }

      let props = {
        response: response, 
        specSelectors: {
          mutatedRequestFor: mutatedRequestForSpy,
          requestFor: requestForSpy,
        },
        pathMethod: [ "/one", "get" ],
        getComponent: (c) => {
          return components[c]
        },
        displayRequestDuration: true,
        getConfigs: () => ({ showMutatedRequest: test.showMutatedRequest })
      }

      // When
      let wrapper = shallow(<LiveResponse {...props}/>)

      // Then
      expect(mutatedRequestForSpy.calls.length).toEqual(test.expected.mutatedRequestForCalls)
      expect(requestForSpy.calls.length).toEqual(test.expected.requestForCalls)

      const curl = wrapper.find(Curl)
      expect(curl.length).toEqual(1)
      expect(curl.props().request).toBe(requests[test.expected.request])

    })
  })
})
