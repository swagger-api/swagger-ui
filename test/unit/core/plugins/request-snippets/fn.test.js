
import { Map, fromJS } from "immutable"
import { requestSnippetGenerator_curl_bash } from "core/plugins/request-snippets/fn"

describe("curl generation for the HTTP QUERY method (RFC 10008)", () => {
  it("generates `-X 'QUERY'` and omits `-d`/Content-Type when there is no body", () => {
    const request = fromJS({
      method: "QUERY",
      url: "https://example.com/search",
      headers: {},
    })

    const curl = requestSnippetGenerator_curl_bash(request)

    expect(curl).toContain("-X 'QUERY'")
    expect(curl).not.toContain("-X 'POST'")
    expect(curl).not.toContain("-X 'GET'")
    expect(curl).not.toContain("-d")
    expect(curl).not.toContain("Content-Type")
  })

  it("preserves QUERY as the method and includes the JSON body/content-type/headers", () => {
    const request = fromJS({
      method: "QUERY",
      url: "https://example.com/search",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer token123",
      },
      body: JSON.stringify({ filter: { status: "active" }, limit: 50 }),
    })

    const curl = requestSnippetGenerator_curl_bash(request)

    expect(curl).toContain("-X 'QUERY'")
    expect(curl).toContain("-H 'Content-Type: application/json'")
    expect(curl).toContain("-H 'Accept: application/json'")
    expect(curl).toContain("-H 'Authorization: Bearer token123'")
    expect(curl).toContain(
      `-d '${JSON.stringify({ filter: { status: "active" }, limit: 50 })}'`
    )
    expect(curl).not.toContain("-X 'POST'")
    expect(curl).not.toContain("-X 'GET'")
  })

  it("preserves the query string (URI query parameters) separately from the QUERY method", () => {
    const request = fromJS({
      method: "QUERY",
      url: "https://example.com/search?tenant=abc",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter: { status: "active" } }),
    })

    const curl = requestSnippetGenerator_curl_bash(request)

    expect(curl).toContain("-X 'QUERY'")
    expect(curl).toContain("https://example.com/search?tenant=abc")
  })

  it("uses -F multipart flags for a multipart/form-data QUERY request body", () => {
    const body = Map({
      filter: "active",
    })

    const request = Map({
      method: "QUERY",
      url: "https://example.com/search",
      headers: Map({ "Content-Type": "multipart/form-data" }),
      body,
    })

    const curl = requestSnippetGenerator_curl_bash(request)

    expect(curl).toContain("-X 'QUERY'")
    expect(curl).toContain("-F")
    expect(curl).toContain("filter=active")
  })

  it("does not add the POST-specific empty-body `-d ''` fallback to QUERY", () => {
    const request = fromJS({
      method: "QUERY",
      url: "https://example.com/search",
      headers: {},
    })

    const curl = requestSnippetGenerator_curl_bash(request)

    expect(curl).not.toContain("-d ''")
  })

  describe("regression: existing methods are unaffected", () => {
    it("still adds `-d ''` for a bodyless POST", () => {
      const request = fromJS({
        method: "POST",
        url: "https://example.com/thing",
        headers: {},
      })

      const curl = requestSnippetGenerator_curl_bash(request)

      expect(curl).toContain("-X 'POST'")
      expect(curl).toContain("-d ''")
    })

    it("still generates a correct GET request", () => {
      const request = fromJS({
        method: "GET",
        url: "https://example.com/thing",
        headers: {},
      })

      const curl = requestSnippetGenerator_curl_bash(request)

      expect(curl).toContain("-X 'GET'")
      expect(curl).not.toContain("-d")
    })
  })
})
