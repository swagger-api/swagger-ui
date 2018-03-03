/* eslint-env mocha */
import expect from "expect"
import { fromJS } from "immutable"
import {
  parameterValues,
  contentTypeValues,
  operationScheme,
  specJsonWithResolvedSubtrees,
  operationConsumes
} from "corePlugins/spec/selectors"

describe("spec plugin - selectors", function(){

  describe("parameterValue", function(){

    it("should return Map({}) if no path found", function(){

      // Given
      const spec = fromJS({ })

      // When
      let paramValues = parameterValues(spec, ["/one", "get"])

      // Then
      expect(paramValues.toJS()).toEqual({})

    })

    it("should return a hash of [parameterName]: value", function(){

      // Given
      const spec = fromJS({
        json: {
          paths: {
            "/one": {
              get: {
                parameters: [
                  { name: "one", in: "query", value: 1},
                  { name: "two", in: "query", value: "duos"}
                ]
              }
            }
          }
        }
      })

      // When
      let paramValues = parameterValues(spec, ["/one", "get"])

      // Then
      expect(paramValues.toJS()).toEqual({
        "query.one": 1,
        "query.two": "duos"
      })

    })

  })

  describe("contentTypeValues", function(){
    it("should return { requestContentType, responseContentType } from an operation", function(){
      // Given
      let state = fromJS({
        json: {
          paths: {
            "/one": {
              get: {}
            }
          }
        },
        meta: {
          paths: {
            "/one": {
              get: {
                "consumes_value": "one",
                "produces_value": "two"
              }
            }
          }
        }
      })

      // When
      let contentTypes = contentTypeValues(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS()).toEqual({
        requestContentType: "one",
        responseContentType: "two"
      })
    })

    it("should default to the first `produces` array value if current is not set", function(){
      // Given
      let state = fromJS({
        json: {
          paths: {
            "/one": {
              get: {
                produces: [
                  "application/xml",
                  "application/whatever"
                ]
              }
            }
          }
        },
        meta: {
          paths: {
            "/one": {
              get: {
                "consumes_value": "one"
              }
            }
          }
        }
      })

      // When
      let contentTypes = contentTypeValues(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS()).toEqual({
        requestContentType: "one",
        responseContentType: "application/xml"
      })
    })

    it("should default to `application/json` if a default produces value is not available", function(){
      // Given
      let state = fromJS({
        json: {
          paths: {
            "/one": {
              get: {}
            }
          }
        },
        meta: {
          paths: {
            "/one": {
              get: {
                "consumes_value": "one"
              }
            }
          }
        }
      })

      // When
      let contentTypes = contentTypeValues(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS()).toEqual({
        requestContentType: "one",
        responseContentType: "application/json"
      })
    })

    it("should prioritize consumes value first from an operation", function(){
      // Given
      let state = fromJS({
        json: {
          paths: {
            "/one": {
              get: {
                "parameters": [{
                  "type": "file"
                }],
              }
            }
          }
        },
        meta: {
          paths: {
            "/one": {
              get: {
                "consumes_value": "one",
              }
            }
          }
        }
      })

      // When
      let contentTypes = contentTypeValues(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS().requestContentType).toEqual("one")
    })

    it("should fallback to multipart/form-data if there is no consumes value but there is a file parameter", function(){
      // Given
      let state = fromJS({
        json: {
          paths: {
            "/one": {
              get: {
                "parameters": [{
                  "type": "file"
                }],
              }
            }
          }
        }
      })

      // When
      let contentTypes = contentTypeValues(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS().requestContentType).toEqual("multipart/form-data")
    })

    it("should fallback to application/x-www-form-urlencoded if there is no consumes value, no file parameter, but there is a formData parameter", function(){
      // Given
      let state = fromJS({
        json: {
          paths: {
            "/one": {
              get: {
                "parameters": [{
                  "type": "formData"
                }],
              }
            }
          }
        }
      })

      // When
      let contentTypes = contentTypeValues(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS().requestContentType).toEqual("application/x-www-form-urlencoded")
    })

    it("should return nothing, if the operation does not exist", function(){
      // Given
      let state = fromJS({ })

      // When
      let contentTypes = contentTypeValues(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS()).toEqual({
        requestContentType: undefined,
        responseContentType: undefined
      })
    })

  })

  describe("operationConsumes", function(){
    it("should return the operationConsumes for an operation", function(){
      // Given
      let state = fromJS({
        json: {
          paths: {
            "/one": {
              get: {
                consumes: [
                  "application/xml",
                  "application/something-else"
                ]
              }
            }
          }
        }
      })

      // When
      let contentTypes = operationConsumes(state, [ "/one", "get" ])
      // Then
      expect(contentTypes.toJS()).toEqual([
        "application/xml",
        "application/something-else"
      ])
    })
  })

  describe("operationScheme", function(){

    it("should return the correct scheme for a remote spec that doesn't specify a scheme", function(){
      // Given
      let state = fromJS({
        url: "https://generator.swagger.io/api/swagger.json",
        json: {
          paths: {
            "/one": {
              get: {
                "consumes_value": "one",
                "produces_value": "two"
              }
            }
          }
        }
      })

      // When
      let scheme = operationScheme(state, ["/one"], "get")
      // Then
      expect(scheme).toEqual("https")
    })

    // it("should be ok, if no operation found", function(){
    //   // Given
    //   let state = fromJS({ })
    //
    //   // When
    //   let contentTypes = contentTypeValues(state, [ "/one", "get" ])
    //   // Then
    //   expect(contentTypes.toJS()).toEqual({
    //     requestContentType: undefined,
    //     responseContentType: undefined
    //   })
    // })

  })


  describe("specJsonWithResolvedSubtrees", function(){

    it("should return a correctly merged tree", function(){
      // Given
      let state = fromJS({
        json: {
          definitions: {
            Asdf: {
              $ref: "#/some/path",
              randomKey: "this should be removed b/c siblings of $refs must be removed, per the specification",
              description: "same for this key"
            },
            Fgsfds: {
              $ref: "#/another/path"
            },
            OtherDef: {
              description: "has no refs"
            }
          }
        },
        resolvedSubtrees: {
          definitions: {
            Asdf: {
              type: "object",
              $$ref: "#/some/path"
            }
          }
        }
      })

      // When
      let result = specJsonWithResolvedSubtrees(state)
      // Then
      expect(result.toJS()).toEqual({
        definitions: {
          Asdf: {
            type: "object",
            $$ref: "#/some/path"
          },
          Fgsfds: {
            $ref: "#/another/path"
          },
          OtherDef: {
            description: "has no refs"
          }
        }
      })
    })
  })
})
