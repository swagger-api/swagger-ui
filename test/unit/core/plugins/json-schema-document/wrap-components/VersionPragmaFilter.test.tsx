/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { fromJS, Map } from "immutable"

import VersionPragmaFilterWrapper from "core/plugins/json-schema-document/wrap-components/VersionPragmaFilter"

type Component = React.ComponentType<Record<string, unknown>>

const Original = ({ children }: { children?: React.ReactNode }) => (
  <div className="original">{children}</div>
)
const JSONSchemaDocument = () => <div className="json-schema-document-stub" />
const ErrorBoundary = ({ children }: { children?: React.ReactNode }) => (
  <div className="error-boundary-stub">{children}</div>
)

const makeSystem = (
  json: Record<string, unknown>,
  isJSONSchemaDocument: boolean,
  { withErrorBoundary = true } = {}
) => {
  const components: Record<string, Component | null> = {
    JSONSchemaDocument: JSONSchemaDocument as Component,
    ErrorBoundary: withErrorBoundary ? (ErrorBoundary as Component) : null,
  }
  return {
    specSelectors: {
      specJson: () => fromJS(json) as Map<string, unknown>,
      isJSONSchemaDocument: () => isJSONSchemaDocument,
    },
    getComponent: jest.fn((name: string) => components[name] ?? null),
    fn: {},
  }
}

const render = (
  system: ReturnType<typeof makeSystem>,
  props: Record<string, unknown> = {}
) => {
  const Wrapper = VersionPragmaFilterWrapper(Original as Component, system)
  return mount(
    <Wrapper alsoShow={<div className="errors-stub" />} {...props}>
      <div className="openapi-layout" />
    </Wrapper>
  )
}

describe("json-schema-document VersionPragmaFilter wrapper", () => {
  it("renders JSONSchemaDocument for a JSON Schema document", () => {
    const system = makeSystem(
      { $schema: "https://json-schema.org/draft/2020-12/schema" },
      true
    )
    const wrapper = render(system)

    expect(
      wrapper.find(".error-boundary-stub .json-schema-document-stub")
    ).toHaveLength(1)
    expect(wrapper.find(".errors-stub")).toHaveLength(1)
    expect(wrapper.find(".original")).toHaveLength(0)
    expect(wrapper.find(".openapi-layout")).toHaveLength(0)
    expect(system.getComponent).toHaveBeenCalledWith("JSONSchemaDocument", true)
  })

  it("renders JSONSchemaDocument without the safe-render plugin", () => {
    const system = makeSystem(
      { $schema: "https://json-schema.org/draft/2020-12/schema" },
      true,
      { withErrorBoundary: false }
    )
    const wrapper = render(system)

    expect(wrapper.find(".json-schema-document-stub")).toHaveLength(1)
  })

  it("refuses a root $schema naming an unsupported dialect", () => {
    const $schema = "https://json-schema.org/draft/2019-09/schema"
    const wrapper = render(makeSystem({ $schema, type: "object" }, false))
    const message = wrapper.find(
      ".version-pragma__message--unsupported-dialect"
    )

    expect(message.find("h3").text()).toBe("Unable to render this definition")
    expect(message.text()).toContain($schema)
    expect(message.text()).toContain(
      "https://json-schema.org/draft/2020-12/schema (JSON Schema 2020-12)"
    )
    expect(wrapper.find(".errors-stub")).toHaveLength(1)
    expect(wrapper.find(".original")).toHaveLength(0)
    expect(wrapper.find(".json-schema-document-stub")).toHaveLength(0)
  })

  it.each([
    ["an OpenAPI document with a root $schema", { openapi: "3.1.0" }],
    ["an AsyncAPI document with a root $schema", { asyncapi: "3.0.0" }],
    ["an Arazzo document with a root $schema", { arazzo: "1.0.1" }],
  ])("renders the wrapped filter for %s", (_, fields) => {
    const wrapper = render(
      makeSystem(
        {
          $schema: "https://json-schema.org/draft/2020-12/schema",
          ...fields,
        },
        false
      ),
      { isOAS32: true }
    )

    expect(wrapper.find(Original).props()).toMatchObject({ isOAS32: true })
    expect(wrapper.find(".openapi-layout")).toHaveLength(1)
    expect(wrapper.find(".version-pragma")).toHaveLength(0)
  })

  it("renders the wrapped filter for a document without $schema", () => {
    const wrapper = render(makeSystem({ title: "no version" }, false))

    expect(wrapper.find(".original")).toHaveLength(1)
  })

  it("renders the wrapped filter when it is bypassed", () => {
    const wrapper = render(
      makeSystem(
        { $schema: "https://json-schema.org/draft/2020-12/schema" },
        true
      ),
      { bypass: true }
    )

    expect(wrapper.find(".openapi-layout")).toHaveLength(1)
    expect(wrapper.find(".json-schema-document-stub")).toHaveLength(0)
  })
})
