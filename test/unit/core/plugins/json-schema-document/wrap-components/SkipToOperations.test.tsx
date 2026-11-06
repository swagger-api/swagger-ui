/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"

import SkipToOperationsWrapper from "core/plugins/json-schema-document/wrap-components/SkipToOperations"

const Original = () => <a href="#operations">Skip to operations</a>

const render = (isJSONSchemaDocument: boolean) => {
  const Wrapped = SkipToOperationsWrapper(Original, {
    specSelectors: { isJSONSchemaDocument: () => isJSONSchemaDocument },
  })
  return mount(<Wrapped />)
}

describe("SkipToOperations wrapper", () => {
  it("links to the schema region of a JSON Schema document", () => {
    const link = render(true).find("a")

    expect(link.text()).toBe("Skip to JSON Schema")
    expect(link.prop("href")).toBe("#json-schema-document")
  })

  it("renders the original link for every other document", () => {
    expect(render(false).find("a").text()).toBe("Skip to operations")
  })

  it("focuses the schema region of its own Swagger UI instance", () => {
    const root = document.createElement("div")
    root.className = "swagger-ui"
    const main = document.createElement("main")
    main.id = "json-schema-document"
    main.tabIndex = -1
    main.scrollIntoView = jest.fn()
    const mountPoint = document.createElement("div")
    root.appendChild(mountPoint)
    root.appendChild(main)
    document.body.appendChild(root)

    const Wrapped = SkipToOperationsWrapper(Original, {
      specSelectors: { isJSONSchemaDocument: () => true },
    })
    const wrapper = mount(<Wrapped />, { attachTo: mountPoint })
    wrapper.find("a").simulate("click")

    expect(document.activeElement).toBe(main)
    expect(main.scrollIntoView).toHaveBeenCalled()

    wrapper.detach()
    document.body.removeChild(root)
  })
})
