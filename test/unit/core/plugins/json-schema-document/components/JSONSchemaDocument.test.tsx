/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { fromJS, Map } from "immutable"

import JSONSchemaDocument from "core/plugins/json-schema-document/components/JSONSchemaDocument"

type Component = React.ComponentType<Record<string, unknown>>

const dialect = "https://json-schema.org/draft/2020-12/schema"
const json = {
  $schema: dialect,
  title: "Raw",
  properties: { a: { $ref: "#/$defs/A" } },
  $defs: { A: { type: "string" } },
}
const resolved = {
  ...json,
  title: "Resolved",
  properties: { a: { type: "string", $$ref: "#/$defs/A" } },
}

const JSONSchema = ({ schema }: { schema?: { title?: string } }) => (
  <div className="json-schema-stub">{schema?.title}</div>
)
const Row = ({ children }: { children?: React.ReactNode }) => (
  <div className="row-stub">{children}</div>
)

const makeProps = (resolvedSubtree: unknown) => {
  const withContext = jest.fn(
    (component: Component, overrides: Record<string, unknown>) => {
      const Instance = (props: Record<string, unknown>) =>
        React.createElement(component, props)
      Instance.overrides = overrides
      return Instance
    }
  )
  const components: Record<string, unknown> = {
    JSONSchema202012: JSONSchema,
    withJSONSchema202012SystemContext: withContext,
    Row,
    Col: Row,
  }

  return {
    withContext,
    props: {
      specSelectors: {
        specJson: () => fromJS(json) as Map<string, unknown>,
        specResolvedSubtree: jest.fn(() => resolvedSubtree),
        jsonSchemaDialect: () => dialect,
      },
      specActions: { requestResolvedSubtree: jest.fn() },
      getComponent: (name: string) => components[name],
      getConfigs: () => ({ defaultModelExpandDepth: 2, showExtensions: true }),
      fn: {
        jsonSchema202012: { getSchemaKeywords: () => ["$schema", "$ref"] },
      },
    },
  }
}

describe("<JSONSchemaDocument />", () => {
  it("requests the root resolution and renders the document until it arrives", () => {
    const { props } = makeProps(Map())
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(props.specActions.requestResolvedSubtree).toHaveBeenCalledWith([])
    expect(props.specSelectors.specResolvedSubtree).toHaveBeenCalledWith([])
    expect(wrapper.find(".json-schema-stub").text()).toBe("Raw")
  })

  it("renders the resolved document without requesting it again", () => {
    const { props } = makeProps(fromJS(resolved))
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(props.specActions.requestResolvedSubtree).not.toHaveBeenCalled()
    expect(wrapper.find(".json-schema-stub").text()).toBe("Resolved")
  })

  it("configures a renderer instance for the dialect, without OpenAPI fn", () => {
    const { props, withContext } = makeProps(fromJS(resolved))
    mount(<JSONSchemaDocument {...props} />)

    expect(withContext).toHaveBeenCalledTimes(1)
    const [component, overrides] = withContext.mock.calls[0]
    expect(component).toBe(JSONSchema)
    expect(overrides.config).toEqual({
      default$schema: dialect,
      defaultExpandedLevels: 2,
    })
    expect(Object.keys(overrides.fn as object)).toEqual(["getSchemaKeywords"])
    expect(
      (
        overrides.fn as { getSchemaKeywords: () => string[] }
      ).getSchemaKeywords()
    ).toEqual(["$schema", "$ref", "$$ref"])
  })

  it("keeps the renderer instance across re-renders", () => {
    const { props, withContext } = makeProps(fromJS(resolved))
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    wrapper.setProps({})

    expect(withContext).toHaveBeenCalledTimes(1)
  })
})
