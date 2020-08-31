
import { fromJS } from "immutable"
import reducer from "corePlugins/spec/reducers"

describe("spec plugin - reducer", function(){

  describe("update operation meta value", function() {
    it("should update the operation metadata at the specified key", () => {
      const updateOperationValue = reducer["spec_update_operation_meta_value"]

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
                "description": "my operation"
              }
            }
          }
        },
        meta: {
          paths: {
            "/pet": {
              post: {
                "consumes_value": "application/json"
              }
            }
          }
        }
      }

      expect(result.toJS()).toEqual(expectedResult)
    })

    it("shouldn't throw an error if we try to update the consumes_value of a null operation", () => {
      const updateOperationValue = reducer["spec_update_operation_meta_value"]

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

  describe("set response value", function() {
    it("should combine the response and error objects", () => {
      const setResponse = reducer["spec_set_response"]

      const path = "/pet/post"
      const method = "POST"

      const state = fromJS({})
      const result = setResponse(state, {
        payload: {
          path: path,
          method: method,
          res: {
            error: true,
            err: {
              message: "Not Found",
              name: "Error",
              response: {
                data: "response data",
                headers: {
                  key: "value"
                },
                ok: false,
                status: 404,
                statusText: "Not Found"
              },
              status: 404,
              statusCode: 404
            }
          }
        }
      })

      let expectedResult = {
        error: true,
        message: "Not Found",
        name: "Error",
        data: "response data",
        headers: {
          key: "value"
        },
        ok: false,
        status: 404,
        statusCode: 404,
        statusText: "Not Found"
      }

      const response = result.getIn(["responses", path, method]).toJS()
      expect(response).toEqual(expectedResult)
    })
  })
  describe("SPEC_UPDATE_PARAM", function() {
    it("should store parameter values by {in}.{name}", () => {
      const updateParam = reducer["spec_update_param"]

      const path = "/pet/post"
      const method = "POST"

      const state = fromJS({})
      const result = updateParam(state, {
        payload: {
          path: [path, method],
          paramName: "myBody",
          paramIn: "body",
          value: `{ "a": 123 }`,
          isXml: false
        }
      })

      const response = result.getIn(["meta", "paths", path, method, "parameters", "body.myBody", "value"])
      expect(response).toEqual(`{ "a": 123 }`)
    })
    it("should store parameter values by identity", () => {
      const updateParam = reducer["spec_update_param"]

      const path = "/pet/post"
      const method = "POST"

      const param = fromJS({
        name: "myBody",
        in: "body",
        schema: {
          type: "string"
        }
      })

      const state = fromJS({})
      const result = updateParam(state, {
        payload: {
          param,
          path: [path, method],
          value: `{ "a": 123 }`,
          isXml: false
        }
      })

      const value = result.getIn(["meta", "paths", path, method, "parameters", `body.myBody.hash-${param.hashCode()}`, "value"])
      expect(value).toEqual(`{ "a": 123 }`)
    })
  })
  describe("SPEC_UPDATE_EMPTY_PARAM_INCLUSION", function() {
    it("should store parameter values by {in}.{name}", () => {
      const updateParam = reducer["spec_update_empty_param_inclusion"]

      const path = "/pet/post"
      const method = "POST"

      const state = fromJS({})

      const result = updateParam(state, {
        payload: {
          pathMethod: [path, method],
          paramName: "param",
          paramIn: "query",
          includeEmptyValue: true
        }
      })

      const response = result.getIn(["meta", "paths", path, method, "parameter_inclusions", "query.param"])
      expect(response).toEqual(true)
    })
  })
})
