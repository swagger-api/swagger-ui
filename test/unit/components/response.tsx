/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { fromJS, List } from "immutable"

import Response from "core/components/response"
import ContentType from "core/components/content-type"

describe("<Response/> (OAS3)", function () {
  const dummyComponent = () => null

  const makeProps = (storedContentType: string | null, content: object) => {
    const components: Record<string, React.ComponentType<unknown>> = {
      contentType: ContentType as React.ComponentType<unknown>,
    }

    return {
      path: "/ping",
      method: "get",
      code: "200",
      specPath: List(["paths", "/ping", "get", "responses", "200"]),
      response: fromJS({ description: "OK", content }),
      contentType: "application/json",
      controlsAcceptHeader: true,
      onContentTypeChange: jest.fn(),
      getComponent: (name: string) => components[name] || dummyComponent,
      getConfigs: () => ({}),
      specSelectors: {
        isOAS3: () => true,
      },
      oas3Actions: {
        setResponseCodeContentType: jest.fn(),
        setActiveExamplesMember: jest.fn(),
      },
      oas3Selectors: {
        responseCodeContentType: () => storedContentType,
      },
      fn: {
        inferSchema: (schema: unknown) => schema,
        getSampleSchema: () => "{}",
      },
    }
  }

  const render = (props: ReturnType<typeof makeProps>) =>
    mount(
      <table>
        <tbody>
          <Response {...props} />
        </tbody>
      </table>
    )

  it("sets the Accept media type on mount for a single application/json response", function () {
    const props = makeProps(null, {
      "application/json": { schema: { type: "object" } },
    })

    const wrapper = render(props)

    expect(props.oas3Actions.setResponseCodeContentType).toHaveBeenCalledWith({
      value: "application/json",
      path: "/ping",
      method: "get",
      code: "200",
    })
    expect(props.onContentTypeChange).toHaveBeenCalledWith({
      value: "application/json",
      controlsAcceptHeader: true,
    })

    wrapper.unmount()
  })

  it("sets the first media type on mount when application/json is not first", function () {
    const props = makeProps(null, {
      "application/xml": {},
      "application/json": {},
    })

    const wrapper = render(props)

    expect(props.onContentTypeChange).toHaveBeenCalledWith({
      value: "application/xml",
      controlsAcceptHeader: true,
    })

    wrapper.unmount()
  })

  it("keeps a stored media type on mount", function () {
    const props = makeProps("text/plain", {
      "application/json": {},
      "text/plain": {},
    })

    const wrapper = render(props)

    expect(props.onContentTypeChange).not.toHaveBeenCalled()
    expect(props.oas3Actions.setResponseCodeContentType).not.toHaveBeenCalled()
    expect(wrapper.find("select.content-type").prop("value")).toEqual(
      "text/plain"
    )

    wrapper.unmount()
  })
})
