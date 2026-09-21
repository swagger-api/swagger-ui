/**
 * @prettier
 */
import Im from "immutable"
import {
  requestSnippetGenerator_curl_bash,
  requestSnippetGenerator_curl_cmd,
  requestSnippetGenerator_curl_powershell
} from "core/plugins/request-snippets/fn.js"

describe("curlify - CMD pipe escaping (issue #10540)", function () {
  it("escapes pipe in CMD request body", function () {
    const req = {
      url: "http://example.com/api",
      method: "POST",
      body: "data|with|pipes",
      headers: {}
    }

    const curlified = requestSnippetGenerator_curl_cmd(Im.fromJS(req))
    expect(curlified).toContain("data^|with^|pipes")
  })

  it("escapes pipe in CMD URL and header", function () {
    const req = {
      url: "http://example.com/api?name=john|smith",
      method: "GET",
      headers: {
        "X-Custom": "value|with|pipe"
      }
    }

    const curlified = requestSnippetGenerator_curl_cmd(Im.fromJS(req))
    expect(curlified).toContain("john^|smith")
    expect(curlified).toContain("value^|with^|pipe")
  })

  it("keeps bash and powershell behavior unchanged", function () {
    const req = {
      url: "http://example.com/api?name=john|smith",
      method: "GET",
      headers: {}
    }

    const bashResult = requestSnippetGenerator_curl_bash(Im.fromJS(req))
    const psResult = requestSnippetGenerator_curl_powershell(Im.fromJS(req))

    expect(bashResult).toContain("john|smith")
    expect(psResult).toContain("john|smith")
    expect(bashResult).not.toContain("^|")
    expect(psResult).not.toContain("^|")
  })
})
