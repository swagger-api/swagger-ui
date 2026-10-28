/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { fromJS, Map } from "immutable"

import JSONSchemaDocument from "core/plugins/json-schema-document/components/JSONSchemaDocument"
import JSONSchemaDocumentDefinitions from "core/plugins/json-schema-document/components/JSONSchemaDocumentDefinitions"
import type { OverridesSystem } from "core/plugins/json-schema-document/overrides"

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

const JSONSchema = ({
  schema,
  name,
}: {
  schema?: { title?: string } | boolean
  name?: string
}) => (
  <div
    className="json-schema-stub"
    data-name={name}
    data-keys={
      schema && typeof schema === "object"
        ? Object.keys(schema).join()
        : undefined
    }
  >
    {typeof schema === "object" ? schema?.title : String(schema)}
  </div>
)
const Collapse = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
)
const Keyword$defs = () => null
const Row = ({ children }: { children?: React.ReactNode }) => (
  <div className="row-stub">{children}</div>
)

const makeProps = (
  resolvedSubtree: unknown,
  config: Record<string, unknown> = {
    defaultModelExpandDepth: 2,
    showExtensions: true,
  }
) => {
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
    JSONSchema202012Keyword$defs: Keyword$defs,
    JSONSchema202012Keyword$dynamicAnchor: Keyword$defs,
    JSONSchema202012Keyword$dynamicRef: Keyword$defs,
    JSONSchema202012KeywordDependentSchemas: Keyword$defs,
    JSONSchema202012KeywordDependentRequired: Keyword$defs,
    withJSONSchema202012SystemContext: withContext,
    JSONSchemaDocumentInfo: () => <div className="info-stub" />,
    JSONSchemaDocumentDefinitions,
    Collapse,
    ArrowUpIcon: () => null,
    ArrowDownIcon: () => null,
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
      getConfigs: () => config,
      getSystem: () =>
        ({
          fn: {
            jsonSchema202012: {
              getSchemaKeywords: () => ["$schema", "$ref"],
              useFn: () => ({}),
              getTitle: (schema: unknown) =>
                (schema as { title?: string } | boolean) === true ||
                (schema as { title?: string })?.title
                  ? "t"
                  : "",
            },
          },
          getComponent: (name: string) => components[name],
        }) as unknown as OverridesSystem,
    },
  }
}

describe("<JSONSchemaDocument />", () => {
  it("requests the root resolution and renders the document until it arrives", () => {
    const { props } = makeProps(Map())
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(props.specActions.requestResolvedSubtree).toHaveBeenCalledWith([])
    expect(props.specSelectors.specResolvedSubtree).toHaveBeenCalledWith([])
    expect(wrapper.find(".json-schema-stub").first().text()).toBe("Raw")
  })

  it("renders the resolved document without requesting it again", () => {
    const { props } = makeProps(fromJS(resolved))
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(props.specActions.requestResolvedSubtree).not.toHaveBeenCalled()
    expect(wrapper.find(".json-schema-stub").first().text()).toBe("Resolved")
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
    // the dialect's keywords and components, none of the OpenAPI fn
    expect(Object.keys(overrides.fn as object).sort()).toEqual([
      "getDependentRequired",
      "getSchemaKeywords",
      "getType",
      "isExpandable",
    ])
    expect(
      (
        overrides.fn as { getSchemaKeywords: () => string[] }
      ).getSchemaKeywords()
    ).toEqual([
      "$schema",
      "$ref",
      "definitions",
      "dependencies",
      "$recursiveAnchor",
      "$recursiveRef",
      "$$ref",
    ])
    expect(Object.keys(overrides.components as object)).toEqual([
      "Keyword$dynamicAnchor",
      "Keyword$dynamicRef",
      "Keyword$defs",
      "KeywordDependentSchemas",
      "KeywordDependentRequired",
    ])
  })

  it("keeps the renderer instance across re-renders", () => {
    const { props, withContext } = makeProps(fromJS(resolved))
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    wrapper.setProps({})

    expect(withContext).toHaveBeenCalledTimes(1)
  })

  it("renders a boolean root schema resolved from a $ref", () => {
    const { props } = makeProps(false)
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(props.specActions.requestResolvedSubtree).not.toHaveBeenCalled()
    expect(wrapper.find(".json-schema-stub").text()).toBe("false")
  })

  it("renders the document in a labelled, focusable main landmark", () => {
    const { props } = makeProps(fromJS(resolved))
    const wrapper = mount(<JSONSchemaDocument {...props} />)
    const main = wrapper.find("main")

    expect(main.prop("id")).toBe("json-schema-document")
    expect(main.prop("aria-label")).toBe("JSON Schema")
    expect(main.prop("tabIndex")).toBe(-1)
  })

  it("names a root schema that has no title, $anchor or $id", () => {
    const { props } = makeProps(fromJS({ $schema: dialect, type: "object" }))
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(wrapper.find(".json-schema-stub").prop("data-name")).toBe("Schema")
  })

  it("keeps the schema-provided title of the root", () => {
    const { props } = makeProps(fromJS(resolved))
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(
      wrapper.find(".json-schema-stub").first().prop("data-name")
    ).toBeUndefined()
  })

  it("remounts the renderer when the resolved schema replaces the raw one", () => {
    const mounts = jest.fn()
    const Counting = () => {
      React.useEffect(() => mounts(), [])
      return null
    }
    const { props } = makeProps(Map())
    // no $defs: the definitions section would mount the instance as well
    const specJson = fromJS({ $schema: dialect, title: "Raw" }) as Map<
      string,
      unknown
    >
    props.specSelectors.specJson = () => specJson
    const countingProps = {
      ...props,
      getComponent: (name: string) =>
        name === "JSONSchema202012" ? Counting : props.getComponent(name),
    }
    const wrapper = mount(<JSONSchemaDocument {...countingProps} />)
    expect(mounts).toHaveBeenCalledTimes(1)

    props.specSelectors.specResolvedSubtree.mockImplementation(() =>
      fromJS({ $schema: dialect, title: "Resolved" })
    )
    wrapper.setProps({})

    expect(mounts).toHaveBeenCalledTimes(2)
  })

  it("lists the root $defs in their own section, not in the root schema", () => {
    const { props } = makeProps(fromJS(resolved))
    const wrapper = mount(<JSONSchemaDocument {...props} />)
    const stubs = wrapper.find(".json-schema-stub")

    expect(wrapper.find(".info-stub")).toHaveLength(1)
    expect(stubs).toHaveLength(2)
    expect(stubs.at(0).prop("data-keys")).toBe("$schema,title,properties")
    expect(stubs.at(1).prop("data-name")).toBe("A")
    expect(wrapper.find("section.models").hasClass("is-open")).toBe(true)
  })

  it("renders no section for a document without $defs, and keeps an invalid $defs", () => {
    const { props } = makeProps(Map())
    const specJson = fromJS({ $schema: dialect, $defs: "nope" }) as Map<
      string,
      unknown
    >
    props.specSelectors.specJson = () => specJson
    const wrapper = mount(<JSONSchemaDocument {...props} />)

    expect(wrapper.find("section.models")).toHaveLength(0)
    expect(wrapper.find(".json-schema-stub").prop("data-keys")).toBe(
      "$schema,$defs"
    )
  })

  it("starts the section closed when defaultModelsExpandDepth is 0, and hides it below 0", () => {
    const closed = makeProps(fromJS(resolved), { defaultModelsExpandDepth: 0 })
    expect(
      mount(<JSONSchemaDocument {...closed.props} />)
        .find("section.models")
        .hasClass("is-open")
    ).toBe(false)

    const hidden = makeProps(fromJS(resolved), { defaultModelsExpandDepth: -1 })
    expect(
      mount(<JSONSchemaDocument {...hidden.props} />).find("section.models")
    ).toHaveLength(0)
  })
})
