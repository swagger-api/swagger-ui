import React from "react"
import { fromJS } from "immutable"
import { render } from "enzyme"

import Headers from "core/components/headers"
import Property from "core/components/property"

describe("<Headers />", function () {
  const components = {
    Property,
    Markdown: ({ source }) => <span>{source}</span>,
  }

  const getComponent = componentName => components[componentName]

  it("renders the first OpenAPI 3 `examples` value for headers", function () {
    const headers = fromJS({
      "X-Rate-Limit": {
        description: "Rate limit header",
        schema: {
          type: "integer",
          example: 999,
        },
        example: 777,
        examples: {
          primary: {
            summary: "Preferred",
            value: 123,
          },
          secondary: {
            value: 456,
          },
        },
      },
    })

    const wrapper = render(<Headers headers={headers} getComponent={getComponent} />)
    expect(wrapper.text()).toContain("Example: 123")
    expect(wrapper.text()).not.toContain("Example: 777")
    expect(wrapper.text()).not.toContain("Example: 999")
  })

  it("falls back to schema.examples when header.examples is absent", function () {
    const headers = fromJS({
      "X-Request-ID": {
        description: "Request id",
        schema: {
          type: "string",
          examples: ["abc123", "def456"],
        },
      },
    })

    const wrapper = render(<Headers headers={headers} getComponent={getComponent} />)
    expect(wrapper.text()).toContain("Example: abc123")
  })

  it("falls back to content.examples when a header uses content", function () {
    const headers = fromJS({
      "X-Trace": {
        description: "Trace header",
        content: {
          "text/plain": {
            examples: {
              primary: {
                value: "trace-123",
              },
            },
          },
        },
      },
    })

    const wrapper = render(<Headers headers={headers} getComponent={getComponent} />)
    expect(wrapper.text()).toContain("Example: trace-123")
  })

  it("falls back to deprecated singular example and supports falsy values", function () {
    const headers = fromJS({
      "X-Deprecated": {
        description: "Deprecated example usage",
        schema: {
          type: "integer",
        },
        example: 0,
      },
    })

    const wrapper = render(<Headers headers={headers} getComponent={getComponent} />)
    expect(wrapper.text()).toContain("Example: 0")
  })
})
