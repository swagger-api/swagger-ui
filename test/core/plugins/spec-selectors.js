/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { fromJS } from "immutable"
import { parameterValues, contentTypeValues } from "corePlugins/spec/selectors"

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
                  { name: "one", value: 1},
                  { name: "two", value: "duos"}
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
        one: 1,
        two: "duos"
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

})
