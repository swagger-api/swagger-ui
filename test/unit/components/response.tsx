/**
 * @prettier
 */
import React from "react"
import { shallow } from "enzyme"
import { fromJS, List } from "immutable"
import Response from "core/components/response"

const ModelExample = () => null

const components: Record<string, unknown> = { modelExample: ModelExample }
const getComponent = (name: string) => components[name] ?? "div"
const getConfigs = () => ({})
const fn = {
  inferSchema: (thing: unknown) => thing,
  getSampleSchema: (schema: unknown) =>
    schema ? JSON.stringify(schema) : undefined,
}

const render = (response: unknown) =>
  shallow(
    <Response
      path="/foo"
      method="get"
      code="200"
      response={fromJS(response)}
      contentType="application/json"
      specPath={List(["paths", "/foo", "get", "responses", "200"])}
      getComponent={getComponent}
      getConfigs={getConfigs}
      specSelectors={{ isOAS3: () => true }}
      oas3Actions={{}}
      fn={fn}
    />
  )

describe("<Response /> (OAS3)", () => {
  describe("without a schema", () => {
    it.each([
      ["no content", { description: "ok" }],
      ["empty content", { description: "ok", content: {} }],
      [
        "empty media type object",
        { description: "ok", content: { "application/json": {} } },
      ],
    ])("does not render a ModelExample for %s", (_name, response) => {
      expect(render(response).find(ModelExample)).toHaveLength(0)
    })
  })

  describe("with a schema", () => {
    it("renders a ModelExample", () => {
      const wrapper = render({
        description: "ok",
        content: {
          "application/json": { schema: { type: "object", properties: {} } },
        },
      })
      expect(wrapper.find(ModelExample)).toHaveLength(1)
    })
  })

  describe("with malformed values that are not Immutable collections", () => {
    it.each([
      ["boolean schema", { schema: true }],
      ["string schema", { schema: "string" }],
      ["numeric schema", { schema: 1 }],
    ])("does not throw for a %s", (_name, mediaType) => {
      const wrapper = render({
        description: "ok",
        content: { "application/json": mediaType },
      })
      expect(wrapper.find(ModelExample)).toHaveLength(0)
    })

    it.each([
      ["boolean examples", { examples: true }],
      ["string examples", { examples: "nope" }],
    ])("does not throw for %s", (_name, mediaType) => {
      expect(() =>
        render({
          description: "ok",
          content: { "application/json": mediaType },
        })
      ).not.toThrow()
    })

    it.each([
      ["null media type", { "application/json": null }],
      ["string media type", { "application/json": "nope" }],
    ])("does not throw for a %s", (_name, content) => {
      expect(() => render({ description: "ok", content })).not.toThrow()
    })

    it.each([
      ["string content", "nope"],
      ["boolean content", true],
    ])("does not throw for %s", (_name, content) => {
      expect(() => render({ description: "ok", content })).not.toThrow()
    })

    it.each([
      ["string links", "nope"],
      ["boolean links", true],
    ])("does not throw for %s", (_name, links) => {
      expect(() => render({ description: "ok", links })).not.toThrow()
    })
  })
})
