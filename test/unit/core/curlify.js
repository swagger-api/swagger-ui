import Im from "immutable"
import curl from "core/curlify"
import win from "core/window"

describe("curlify", function () {

  it("prints a curl statement with custom content-type", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
      body: {
        id: 0,
        name: "doggie",
        status: "available"
      },
      headers: {
        Accept: "application/json",
        "content-type": "application/json"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"Accept: application/json\" -H  \"content-type: application/json\" -d {\"id\":0,\"name\":\"doggie\",\"status\":\"available\"}")
  })

  it("does add a empty data param if no request body given", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -d \"\"")
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

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"conTenT Type: application/Moar\" -d \"\"")
  })

  it("prints a curl statement with an array of query params", function () {
    let req = {
      url: "http://swaggerhub.com/v1/one?name=john|smith",
      method: "GET"
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X GET \"http://swaggerhub.com/v1/one?name=john|smith\"")
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

    expect(curlified).toEqual("curl -X GET \"http://swaggerhub.com/v1/one?name=john|smith\" -H  \"authorization: Basic Zm9vOmJhcg==\"")
  })

  it("prints a curl statement with html", function () {
    let req = {
      url: "http://swaggerhub.com/v1/one?name=john|smith",
      method: "GET",
      headers: {
        accept: "application/json"
      },
      body: {
        description: "<b>Test</b>"
      }
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X GET \"http://swaggerhub.com/v1/one?name=john|smith\" -H  \"accept: application/json\" -d {\"description\":\"<b>Test</b>\"}")
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

    expect(curlified).toEqual("curl -X POST \"http://swaggerhub.com/v1/one?name=john|smith\" -H  \"accept: application/json\" -d {\"description\":\"<b>Test</b>\"}")
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

    expect(curlified).toEqual("curl -X POST \"http://swaggerhub.com/v1/one?name=john|smith\" -d {\"description\":\"@prefix nif:<http://persistence.uni-leipzig.org/nlp2rdf/ontologies/nif-core#> .@prefix itsrdf: <http://www.w3.org/2005/11/its/rdf#> .\"}")
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

    expect(curlified).toEqual("curl -X DELETE \"http://example.com\" -H  \"accept: application/x-www-form-urlencoded\"")
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

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"content-type: multipart/form-data\" -F \"id=123\" -F \"name=Sahar\"")
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

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"content-type: multipart/form-data\" -F \"id=123\" -F \"fruits[]=apple\" -F \"fruits[]=banana\" -F \"fruits[]=grape\"")
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

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"content-type: multipart/form-data\" -F \"id=123\" -F \"file=@file.txt;type=text/plain\"")
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

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"content-type: multipart/form-data\" -F \"id=123\" -F \"file=@file.txt\"")
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

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"accept: application/json\" -d {\"id\":10101}")
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

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"accept: application/json\" -d \"{\\\"id\\\":\\\"foo'bar\\\"}\"")
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

        expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"x-custom-name: multipart/form-data\" -H  \"content-type: multipart/form-data\" -F \"id=123\" -F \"file=@file.txt;type=text/plain\"")
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

        expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"content-type: multipart/form-data\" -H  \"x-custom-name: any-value\" -F \"id=123\" -F \"file=@file.txt;type=text/plain\"")
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

      expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"x-custom-name: multipart/form-data\" -d {\"id\":\"123\",\"file\":{\"name\":\"file.txt\",\"type\":\"text/plain\"}}")
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

      expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"x-custom-name: multipart/form-data\" -d {\"id\":\"123\",\"file\":{\"name\":\"file.txt\"}}")
    })
  })

  it("should escape dollar signs in headers and request body", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
      headers: { "X-DOLLAR": "token/123$" },
      body: "CREATE ($props)"
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"X-DOLLAR: token/123\\$\" -d \"CREATE (\\$props)\"")
  })

  it("should escape multiple dollar signs", function () {
    let req = {
      url: "http://example.com",
      method: "POST",
      headers: { },
      body: "RETURN $x + $y"
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -X POST \"http://example.com\" -d \"RETURN \\$x + \\$y\"")
  })

  it("should include curlOptions from the request in the curl command", function () {
    let req = {
      url: "http://example.com",
      method: "GET",
      headers: { "X-DOLLAR": "token/123$" },
      curlOptions: ["-g"]
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -g -X GET \"http://example.com\" -H  \"X-DOLLAR: token/123\\$\"")
  })

  it("should include multiple curlOptions from the request in the curl command", function () {
    let req = {
      url: "http://example.com",
      method: "GET",
      headers: { "X-DOLLAR": "token/123$" },
      curlOptions: ["-g", "--limit-rate 20k"]
    }

    let curlified = curl(Im.fromJS(req))

    expect(curlified).toEqual("curl -g --limit-rate 20k -X GET \"http://example.com\" -H  \"X-DOLLAR: token/123\\$\"")
  })
})
