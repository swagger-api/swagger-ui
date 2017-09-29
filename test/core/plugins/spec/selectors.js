/* eslint-env mocha */
import expect from "expect"
import { fromJS } from "immutable"
import { parameterValues, contentTypeValues, operationScheme } from "corePlugins/spec/selectors"

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
        resolved: {
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
        resolved: {
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

    it("should prioritize consumes value first from an operation", function(){
      // Given
      let state = fromJS({
        resolved: {
          paths: {
            "/one": {
              get: {
                "consumes_value": "one",
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
      expect(contentTypes.toJS().requestContentType).toEqual("one")
    })

    it("should fallback to multipart/form-data if there is no consumes value but there is a file parameter", function(){
      // Given
      let state = fromJS({
        resolved: {
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
        resolved: {
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

    it("should be ok, if no operation found", function(){
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

  describe("operationScheme", function(){

    it("should return the correct scheme for a remote spec that doesn't specify a scheme", function(){
      // Given
      let state = fromJS({
        url: "https://generator.swagger.io/api/swagger.json",
        resolved: {
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

})
