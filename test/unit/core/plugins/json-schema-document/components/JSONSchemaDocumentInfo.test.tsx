/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { fromJS } from "immutable"

import JSONSchemaDocumentInfo from "core/plugins/json-schema-document/components/JSONSchemaDocumentInfo"

const dialect = "https://json-schema.org/draft/2020-12/schema"

const InfoUrl = ({ url }: { url: string }) => <span className="url">{url}</span>

const getComponent = () => InfoUrl

const render = (json: Record<string, unknown>, url = "") =>
  mount(
    <JSONSchemaDocumentInfo
      specSelectors={{
        specJson: () => fromJS(json),
        jsonSchemaDialect: () => dialect,
        url: () => url,
      }}
      getComponent={getComponent}
    />
  )

const uris = (wrapper: ReturnType<typeof render>) =>
  wrapper
    .find("tr")
    .map((row) => [row.find("td").at(0).text(), row.find(".url").text()])

describe("<JSONSchemaDocumentInfo />", () => {
  it("renders the title with the dialect and the document kind stamps", () => {
    const wrapper = render({ $schema: dialect, title: "Person" })

    expect(wrapper.find("h1.title").text()).toBe("Person2020-12JSON Schema")
    expect(wrapper.find("h1 small").at(0).text()).toBe("2020-12")
    expect(wrapper.find("h1 small.version-stamp").text()).toBe("JSON Schema")
  })

  it("renders the description as plain text below the header", () => {
    const wrapper = render({
      $schema: dialect,
      description: "A *person*, **not** <b>bold</b> [or a link](https://e.com)",
    })

    expect(wrapper.find(".info__description p").text()).toBe(
      "A *person*, **not** <b>bold</b> [or a link](https://e.com)"
    )
    expect(wrapper.find(".info__description").find("b")).toHaveLength(0)
    expect(wrapper.find(".info__description").find("a")).toHaveLength(0)
    expect(
      render({ $schema: dialect }).find(".info__description")
    ).toHaveLength(0)
  })

  it("names a document without a title by its $anchor, $id, or dialect", () => {
    expect(
      render({ $schema: dialect, $anchor: "a", $id: "https://e.com/p" })
        .find("h1.title")
        .text()
    ).toBe("a2020-12JSON Schema")
    expect(
      render({ $schema: dialect, $id: "https://e.com/p" })
        .find("h1.title")
        .text()
    ).toBe("https://e.com/p2020-12JSON Schema")
    expect(render({ $schema: dialect }).find("h1.title").text()).toBe(
      "JSON Schema 2020-122020-12JSON Schema"
    )
  })

  it("ignores a title that isn't a string", () => {
    const wrapper = render({ $schema: dialect, title: { a: 1 } })

    expect(wrapper.find("h1.title").text()).toBe(
      "JSON Schema 2020-122020-12JSON Schema"
    )
  })

  it("shows only the retrieval URI when the base URI is the same", () => {
    const wrapper = render({ $schema: dialect }, "https://e.com/s.json")

    expect(uris(wrapper)).toEqual([["Retrieval URI", "https://e.com/s.json"]])
  })

  it("shows the $id as the base URI and the URL as the retrieval URI", () => {
    const wrapper = render(
      { $schema: dialect, $id: "https://e.com/schemas/person" },
      "https://cdn.e.com/p.json"
    )

    expect(uris(wrapper)).toEqual([
      ["Retrieval URI", "https://cdn.e.com/p.json"],
      ["Base URI", "https://e.com/schemas/person"],
    ])
  })

  it("resolves a relative $id against the retrieval URI", () => {
    const wrapper = render(
      { $schema: dialect, $id: "person" },
      "https://e.com/schemas/s.json"
    )

    expect(uris(wrapper)[1]).toEqual([
      "Base URI",
      "https://e.com/schemas/person",
    ])
  })

  it("shows the base URI of an $id with an empty fragment as the retrieval URI", () => {
    const wrapper = render(
      { $schema: dialect, $id: "https://e.com/s.json#" },
      "https://e.com/s.json"
    )

    expect(uris(wrapper)).toEqual([["Retrieval URI", "https://e.com/s.json"]])
  })

  it("knows a document without a URL by the URI of the page as its base URI, without its fragment", () => {
    const page = "https://e.com/docs/index.html#/Schemas/Person"
    const baseURI = jest
      .spyOn(globalThis.document, "baseURI", "get")
      .mockReturnValue(page)

    try {
      expect(uris(render({ $schema: dialect }))).toEqual([
        ["Base URI", "https://e.com/docs/index.html"],
      ])
    } finally {
      baseURI.mockRestore()
    }
  })

  it("shows no retrieval URI for a document that wasn't retrieved", () => {
    const page = globalThis.document.baseURI

    expect(uris(render({ $schema: dialect }))).toEqual([
      ["Base URI", new URL(page).toString()],
    ])
    expect(uris(render({ $schema: dialect, $id: "person" }))).toEqual([
      ["Base URI", new URL("person", page).toString()],
    ])
    expect(uris(render({ $schema: dialect, $id: "https://e.com/p" }))).toEqual([
      ["Base URI", "https://e.com/p"],
    ])
  })
})
