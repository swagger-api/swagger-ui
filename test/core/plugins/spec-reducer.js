/* eslint-env mocha */
import expect from "expect"
import { fromJS } from "immutable"
import reducer from "corePlugins/spec/reducers"

describe("spec plugin - reducer", function(){

  describe("update operation value", function() {
    it("should update the operation at the specified key", () => {
      const updateOperationValue = reducer["spec_update_operation_value"]

      const state = fromJS({
        resolved: {
          "paths": {
            "/pet": {
              "post": {
                "description": "my operation"
              }
            }
          }
        }
      })

      let result = updateOperationValue(state, {
        payload: {
          path: ["/pet", "post"],
          value: "application/json",
          key: "consumes_value"
        }
      })

      let expectedResult = {
        resolved: {
          "paths": {
            "/pet": {
              "post": {
                "description": "my operation",
                "consumes_value": "application/json"
              }
            }
          }
        }
      }

      expect(result.toJS()).toEqual(expectedResult)
    })

    it("shouldn't throw an error if we try to update the consumes_value of a null operation", () => {
      const updateOperationValue = reducer["spec_update_operation_value"]

      const state = fromJS({
        resolved: {
          "paths": {
            "/pet": {
              "post": null
            }
          }
        }
      })

      let result = updateOperationValue(state, {
        payload: {
          path: ["/pet", "post"],
          value: "application/json",
          key: "consumes_value"
        }
      })

      expect(result.toJS()).toEqual(state.toJS())
    })
  })
})
