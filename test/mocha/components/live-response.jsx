/* eslint-env mocha */
import React from "react"
import { fromJSOrdered } from "core/utils"
import sinon from "sinon"
import expect from "expect"
import { shallow } from "enzyme"
import LiveResponse from "core/components/live-response"
import ResponseBody from "core/components/response-body"
import RequestSnippets from "core/plugins/request-snippets/request-snippets"

describe("<LiveResponse/>", function () {
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
    url: "http://mutated.petstore.swagger.io/v2/pet/1"
  })

  let requests = {
    request: request,
    mutatedRequest: mutatedRequest
  }

  const tests = [
    { showMutatedRequest: true, expected: { request: "mutatedRequest", requestForCalls: 0, mutatedRequestForCalls: 1 } },
    { showMutatedRequest: false, expected: { request: "request", requestForCalls: 1, mutatedRequestForCalls: 0 } }
  ]

  tests.forEach(function (test) {
    it("passes " + test.expected.request + " to RequestSnippets when showMutatedRequest = " + test.showMutatedRequest, function () {

      // Given

      let response = fromJSOrdered({
        status: 200,
        url: "http://petstore.swagger.io/v2/pet/1",
        headers: {
          "content-type": "application/xml"
        },
        text: "<response/>",
        duration: 50
      })

      let mutatedRequestForSpy = sinon.stub().returns(mutatedRequest)
      let requestForSpy = sinon.stub().returns(request)

      let components = {
        RequestSnippets: RequestSnippets,
        responseBody: ResponseBody
      }

      let props = {
        response: response,
        specSelectors: {
          mutatedRequestFor: mutatedRequestForSpy,
          requestFor: requestForSpy,
        },
        pathMethod: ["/one", "get"],
        getComponent: (c) => {
          return components[c]
        },
        displayRequestDuration: true,
        getConfigs: () => ({ showMutatedRequest: test.showMutatedRequest, requestSnippetsEnabled: true })
      }

      // When
      let wrapper = shallow(<LiveResponse {...props} />)

      // Then
      expect(mutatedRequestForSpy.callCount).toEqual(test.expected.mutatedRequestForCalls)
      expect(requestForSpy.callCount).toEqual(test.expected.requestForCalls)

      const snippets = wrapper.find("RequestSnippets")
      expect(snippets.length).toEqual(1)
      expect(snippets.props().request).toBe(requests[test.expected.request])

      const expectedUrl = requests[test.expected.request].get("url")
      expect(wrapper.find("div.request-url pre.microlight").text()).toEqual(expectedUrl)

      let duration = wrapper.find("Duration")
      expect(duration.length).toEqual(1)
      expect(duration.props().duration).toEqual(50)
      expect(duration.html())
        .toEqual("<div><h5>Request duration</h5><pre class=\"microlight\">50 ms</pre></div>")

      let responseHeaders = wrapper.find("Headers")
      expect(duration.length).toEqual(1)
      expect(responseHeaders.props().headers.length).toEqual(1)
      expect(responseHeaders.props().headers[0].key).toEqual("content-type")
      expect(responseHeaders.html())
        .toEqual("<div><h5>Response headers</h5><pre class=\"microlight\"><span class=\"headerline\"> content-type: application/xml </span></pre></div>")
    })
  })
})
