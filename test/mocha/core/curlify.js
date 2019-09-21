import expect from "expect"
import Im from "immutable"
import curl from "core/curlify"
import win from "core/window"

describe("curlify", function() {

    it("prints a curl statement with custom content-type", function() {
        var req = {
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

    it("does not change the case of header in curl", function() {
        var req = {
            url: "http://example.com",
            method: "POST",
            headers: {
                "conTenT Type": "application/Moar"
            }
        }

        let curlified = curl(Im.fromJS(req))

        expect(curlified).toEqual("curl -X POST \"http://example.com\" -H  \"conTenT Type: application/Moar\"")
    })

    it("prints a curl statement with an array of query params", function() {
        var req = {
            url: "http://swaggerhub.com/v1/one?name=john|smith",
            method: "GET"
        }

        let curlified = curl(Im.fromJS(req))

        expect(curlified).toEqual("curl -X GET \"http://swaggerhub.com/v1/one?name=john|smith\"")
    })

    it("prints a curl statement with an array of query params and auth", function() {
        var req = {
            url: "http://swaggerhub.com/v1/one?name=john|smith",
            method: "GET",
            headers: {
                authorization: "Basic Zm9vOmJhcg=="
            }
        }

        let curlified = curl(Im.fromJS(req))

        expect(curlified).toEqual("curl -X GET \"http://swaggerhub.com/v1/one?name=john|smith\" -H  \"authorization: Basic Zm9vOmJhcg==\"")
    })

    it("prints a curl statement with html", function() {
        var req = {
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

    it("handles post body with html", function() {
        var req = {
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

    it("handles post body with special chars", function() {
        var req = {
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

    it("handles delete form with parameters", function() {
        var req = {
            url: "http://example.com",
            method: "DELETE",
            headers: {
                accept: "application/x-www-form-urlencoded"
            }
        }

        let curlified = curl(Im.fromJS(req))

        expect(curlified).toEqual("curl -X DELETE \"http://example.com\" -H  \"accept: application/x-www-form-urlencoded\"")
    })

    it("should print a curl with formData", function() {
        var req = {
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

    it("should print a curl with formData and file", function() {
        var file = new win.File()
        file.name = "file.txt"
        file.type = "text/plain"

        var req = {
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

    it("should print a curl without form data type if type is unknown", function() {
      var file = new win.File()
      file.name = "file.txt"
      file.type = ""

      var req = {
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

    it("prints a curl post statement from an object", function() {
        var req = {
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

    it("prints a curl post statement from a string containing a single quote", function() {
        var req = {
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

})
