import Im from "immutable"
import { requestSnippetGenerator_curl_bash as curl } from "core/plugins/request-snippets/fn.js"
import win from "core/window"

describe("curlify", function () {

  it("prints a curl statement with custom content-type", function () {
    const body = JSON.stringify({
      id: 0,
      name: "doggie",
      status: "available"
    }, null, 2)
    let req = {
      url: "http://example.com",
      method: "POST",
      body,
      headers: {
        Accept: "application/json",
        "content-type": "application/json"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual(`curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'Accept: application/json' \\\n  -H 'content-type: application/json' \\\n  -d '${body}'`)
  })

  it("does add a empty data param if no request body given", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -d ''")
  })

  it("does not change the case of header in curl", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
      headers: {
        "conTenT Type": "application/Moar"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'conTenT Type: application/Moar' \\\n  -d ''")
  })

  it("prints a curl statement with an array of query params", function () {
    let req = {
      url: "http://swaggerhub.com/v1/one?name=john|smith",
      method: "GET"
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'GET' \\\n  'http://swaggerhub.com/v1/one?name=john|smith'")
  })

  it("prints a curl statement with an array of query params and auth", function () {
    let req = {
      url: "http://swaggerhub.com/v1/one?name=john|smith",
      method: "GET",
      headers: {
        authorization: "Basic Zm9vOmJhcg=="
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'GET' \\\n  'http://swaggerhub.com/v1/one?name=john|smith' \\\n  -H 'authorization: Basic Zm9vOmJhcg=='")
  })

  it("prints a curl statement with html", function () {
    const body = {
      description: "<b>Test</b>"
    }
    let req = {
      url: "http://swaggerhub.com/v1/one?name=john|smith",
      method: "GET",
      headers: {
        accept: "application/json"
      },
      body
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual(`curl -X 'GET' \\\n  'http://swaggerhub.com/v1/one?name=john|smith' \\\n  -H 'accept: application/json' \\\n  -d '${JSON.stringify(body, null, 2)}'`)
  })

  it("handles post body with html", function () {
    let req = {
      url: "http://swaggerhub.com/v1/one?name=john|smith",
      method: "POST",
      headers: {
        accept: "application/json"
      },
      body: {
        description: "<b>Test</b>"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual(`curl -X 'POST' \\
  'http://swaggerhub.com/v1/one?name=john|smith' \\
  -H 'accept: application/json' \\
  -d '{
  "description": "<b>Test</b>"
}'`)
  })

  it("handles post body with special chars", function () {
    let req = {
      url: "http://swaggerhub.com/v1/one?name=john|smith",
      method: "POST",
      body: {
        description: "@prefix nif:<http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#> .\n" +
          "@prefix itsrdf: <http://www.w3.org/2005/11/its/rdf#> ."
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://swaggerhub.com/v1/one?name=john|smith' \\\n  -d '{\n  \"description\": \"@prefix nif:<http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#> .\\n@prefix itsrdf: <http://www.w3.org/2005/11/its/rdf#> .\"\n}'")
  })

  it("handles delete form with parameters", function () {
    let req = {
      url: "http://example.com",
      method: "DELETE",
      headers: {
        accept: "application/x-www-form-urlencoded"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'DELETE' \\\n  'http://example.com' \\\n  -H 'accept: application/x-www-form-urlencoded'")
  })

  it("should print a curl with formData", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
      headers: { "content-type": "multipart/form-data" },
      body: {
        id: "123",
        name: "Sahar"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'content-type: multipart/form-data' \\\n  -F 'id=123' \\\n  -F 'name=Sahar'")
  })

  it("should print a curl with formData that extracts array representation with hashIdx", function () {
    // Note: hashIdx = `_**[]${counter}`
    // Usage of hashIdx is an internal SwaggerUI method to convert formData array into something curlify can handle
    const req = {
      url: "http://example.com",
      method: "POST",
      headers: { "content-type": "multipart/form-data" },
      body: {
        id: "123",
        "fruits[]_**[]1": "apple",
        "fruits[]_**[]2": "banana",
        "fruits[]_**[]3": "grape"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'content-type: multipart/form-data' \\\n  -F 'id=123' \\\n  -F 'fruits[]=apple' \\\n  -F 'fruits[]=banana' \\\n  -F 'fruits[]=grape'")
  })

  it("should print a curl with formData and file", function () {
    let file = new win.File([""], "file.txt", { type: "text/plain" })
    // file.name = "file.txt"
    // file.type = "text/plain"

    let req = {
      url: "http://example.com",
      method: "POST",
      headers: { "content-type": "multipart/form-data" },
      body: {
        id: "123",
        file
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'content-type: multipart/form-data' \\\n  -F 'id=123' \\\n  -F 'file=@file.txt;type=text/plain'")
  })

  it("should print a curl without form data type if type is unknown", function () {
    let file = new win.File([""], "file.txt", { type: "" })
    // file.name = "file.txt"
    // file.type = ""

    let req = {
      url: "http://example.com",
      method: "POST",
      headers: { "content-type": "multipart/form-data" },
      body: {
        id: "123",
        file
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'content-type: multipart/form-data' \\\n  -F 'id=123' \\\n  -F 'file=@file.txt'")
  })

  it("should print a curl with data-binary if body is instance of File and it is not a multipart form data request", function () {
    let file = new win.File([""], "file.txt", { type: "" })

    let req = {
      url: "http://example.com",
      method: "POST",
      headers: { "content-type": "application/octet-stream" },
      body: file
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'content-type: application/octet-stream' \\\n  --data-binary '@file.txt'")
  })

  it("prints a curl post statement from an object", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
      headers: {
        accept: "application/json"
      },
      body: {
        id: 10101
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'accept: application/json' \\\n  -d '{\n  \"id\": 10101\n}'")
  })

  it("prints a curl post statement from a string containing a single quote", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
      headers: {
        accept: "application/json"
      },
      body: "{\"id\":\"foo'bar\"}"
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'accept: application/json' \\\n  -d '{\"id\":\"foo'\\''bar\"}'")
  })

  describe("given multiple entries with file", function () {
    describe("and with leading custom header", function () {
      it("should print a proper curl -F", function () {
        let file = new win.File([""], "file.txt", { type: "text/plain" })
        // file.name = "file.txt"
        // file.type = "text/plain"

        let req = {
          url: "http://example.com",
          method: "POST",
          headers: {
            "x-custom-name": "multipart/form-data",
            "content-type": "multipart/form-data"
          },
          body: {
            id: "123",
            file
          }
        }

        let curlified = curl(Im.fromJS(req))

        expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'x-custom-name: multipart/form-data' \\\n  -H 'content-type: multipart/form-data' \\\n  -F 'id=123' \\\n  -F 'file=@file.txt;type=text/plain'")
      })
    })

    describe("and with trailing custom header; e.g. from requestInterceptor appending req.headers", function () {
      it("should print a proper curl -F", function () {
        let file = new win.File([""], "file.txt", { type: "text/plain" })
        // file.name = "file.txt"
        // file.type = "text/plain"

        let req = {
          url: "http://example.com",
          method: "POST",
          headers: {
            "content-type": "multipart/form-data",
            "x-custom-name": "any-value"
          },
          body: {
            id: "123",
            file
          }
        }

        let curlified = curl(Im.fromJS(req))

        expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'content-type: multipart/form-data' \\\n  -H 'x-custom-name: any-value' \\\n  -F 'id=123' \\\n  -F 'file=@file.txt;type=text/plain'")
      })
    })
  })

  describe("POST when header value is 'multipart/form-data' but header name is not 'content-type'", function () {
    it("shoud print a proper curl as -d <data>, when file type is provided", function () {
      let file = new win.File([""], "file.txt", { type: "text/plain" })
      // file.name = "file.txt"
      // file.type = "text/plain"

      let req = {
        url: "http://example.com",
        method: "POST",
        headers: { "x-custom-name": "multipart/form-data" },
        body: {
          id: "123",
          file
        }
      }

      let curlified = curl(Im.fromJS(req))

      expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'x-custom-name: multipart/form-data' \\\n  -d '{\n  \"id\": \"123\",\n  \"file\": {\n    \"name\": \"file.txt\",\n    \"type\": \"text/plain\"\n  }\n}'")
    })

    it("shoud print a proper curl as -d <data>, no file type provided", function () {
      let file = new win.File([""], "file.txt")
      // file.name = "file.txt"
      // file.type = "text/plain"

      let req = {
        url: "http://example.com",
        method: "POST",
        headers: { "x-custom-name": "multipart/form-data" },
        body: {
          id: "123",
          file
        }
      }

      let curlified = curl(Im.fromJS(req))

      expect(curlified).toEqual("curl -X 'POST' \\\n  'http://example.com' \\\n  -H 'x-custom-name: multipart/form-data' \\\n  -d '{\n  \"id\": \"123\",\n  \"file\": {\n    \"name\": \"file.txt\"\n  }\n}'")
    })
  })

  it("should include curlOptions from the request in the curl command", function () {
    let req = {
      url: "http://example.com",
      method: "GET",
      headers: { "X-DOLLAR": "token/123$" },
      curlOptions: ["-g"]
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -g -X 'GET' \\\n  'http://example.com' \\\n  -H 'X-DOLLAR: token/123$'")
  })

  it("should include multiple curlOptions from the request in the curl command", function () {
    let req = {
      url: "http://example.com",
      method: "GET",
      headers: { "X-DOLLAR": "token/123$" },
      curlOptions: ["-g", "--limit-rate 20k"]
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -g --limit-rate 20k -X 'GET' \\\n  'http://example.com' \\\n  -H 'X-DOLLAR: token/123$'")
  })
})
