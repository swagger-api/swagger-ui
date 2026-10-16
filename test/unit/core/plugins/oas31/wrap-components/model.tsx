/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import ModelWrapper from "core/plugins/oas31/wrap-components/model"
import { getProperties } from "core/plugins/oas31/json-schema-2020-12-extensions/fn"
import { withJSONSchemaContext } from "core/plugins/json-schema-2020-12/hoc"
import { useConfig, useFn } from "core/plugins/json-schema-2020-12/hooks"

describe("OAS31 Model wrapper", () => {
  const schema = {
    type: "object",
    properties: {
      name: { type: "string" },
      id: { type: "string", readOnly: true },
      password: { type: "string", writeOnly: true },
    },
  }

  const PropertyNames = ({ schema }: { schema: typeof schema }) => {
    const config = useConfig()
    const fn = useFn()
    const names = Object.keys(fn.getProperties(schema, config))
    return <div className="property-names">{names.join(",")}</div>
  }

  const system = {
    getComponent: (name: string) =>
      ({
        OAS31Model: PropertyNames,
        withJSONSchema202012SystemContext: withJSONSchemaContext,
      })[name],
    getConfigs: () => ({ defaultModelExpandDepth: 1 }),
    fn: {
      jsonSchema202012: {
        getProperties,
        isExpandable: () => false,
        getSchemaKeywords: () => [],
      },
    },
  }
  const Original = () => null
  const Model = ModelWrapper(Original, {
    getSystem: () => system,
    specSelectors: { isOAS31: () => true },
  })

  const renderModel = (props: Record<string, boolean>) =>
    mount(<Model schema={schema} {...props} />)
      .find(".property-names")
      .text()

  afterEach(() => {
    ModelWrapper.ModelWithJSONSchemaContext = {}
    ModelWrapper.pathname = null
  })

  it("applies includeReadOnly/includeWriteOnly of each render, not of the first one", () => {
    // request body model
    expect(renderModel({ includeWriteOnly: true })).toEqual("name,password")
    // response model rendered afterwards
    expect(renderModel({ includeReadOnly: true })).toEqual("name,id")
    // request body model rendered again
    expect(renderModel({ includeWriteOnly: true })).toEqual("name,password")
  })

  it("does not depend on which model is rendered first", () => {
    expect(renderModel({ includeReadOnly: true })).toEqual("name,id")
    expect(renderModel({ includeWriteOnly: true })).toEqual("name,password")
  })

  it("reuses the cached HOC until the location changes", () => {
    const getCachedModel = () =>
      ModelWrapper.ModelWithJSONSchemaContext["false:true"]

    renderModel({ includeWriteOnly: true })
    const cachedModel = getCachedModel()
    renderModel({ includeReadOnly: true })
    renderModel({ includeWriteOnly: true })
    expect(getCachedModel()).toBe(cachedModel)

    const { pathname } = window.location
    window.history.pushState({}, "", "/other-page")
    try {
      renderModel({ includeWriteOnly: true })
      expect(getCachedModel()).not.toBe(cachedModel)
    } finally {
      window.history.pushState({}, "", pathname)
    }
  })
})
