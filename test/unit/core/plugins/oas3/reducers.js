
import { fromJS } from "immutable"
import reducer from "core/plugins/oas3/reducers"

describe("oas3 plugin - reducer", function () {
  describe("SET_REQUEST_BODY_VALIDATE_ERROR", () => {
    const setRequestBodyValidateError = reducer["oas3_set_request_body_validate_error"]

    describe("missingBodyValue exists, e.g. application/json", () => {
      it("should set errors", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: "",
                requestContentType: "application/json"
              }
            }
          }
        })

        const result = setRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
            validationErrors: {
              missingBodyValue: true,
              missingRequiredKeys: []
            },
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: "",
                requestContentType: "application/json",
                errors: ["Required field is not provided"]
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })

    describe("missingRequiredKeys exists with length, e.g. application/x-www-form-urleconded", () => {
      it("should set nested errors", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                  },
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = setRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
            validationErrors: {
              missingBodyValue: null,
              missingRequiredKeys: ["name"]
            },
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                    errors: ["Required field is not provided"]
                  },
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })

      it("should overwrite nested errors, for keys listed in missingRequiredKeys", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                    errors: ["some fake error"]
                  },
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = setRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
            validationErrors: {
              missingBodyValue: null,
              missingRequiredKeys: ["name"]
            },
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                    errors: ["Required field is not provided"]
                  },
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })

      it("should not overwrite nested errors, for keys not listed in missingRequiredKeys", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                    errors: ["random error should not be overwritten"]
                  },
                  name: {
                    value: "",
                    errors: ["some fake error"]
                  },
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = setRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
            validationErrors: {
              missingBodyValue: null,
              missingRequiredKeys: ["name"]
            },
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                    errors: ["random error should not be overwritten"]
                  },
                  name: {
                    value: "",
                    errors: ["Required field is not provided"]
                  },
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })

      it("should set multiple nested errors", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "",
                  },
                  name: {
                    value: "",
                  },
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = setRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
            validationErrors: {
              missingBodyValue: null,
              missingRequiredKeys: ["id", "name"]
            },
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "",
                    errors: ["Required field is not provided"]
                  },
                  name: {
                    value: "",
                    errors: ["Required field is not provided"]
                  },
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })

    describe("missingRequiredKeys is empty list", () => {
      it("should not set any errors, and return state unchanged", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                  },
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = setRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
            validationErrors: {
              missingBodyValue: null,
              missingRequiredKeys: []
            },
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                  },
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })

    describe("other unexpected payload, e.g. no missingBodyValue or missingRequiredKeys", () => {
      it("should not throw error if receiving unexpected validationError format. return state unchanged", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                  },
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = setRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
            validationErrors: {
              missingBodyValue: null,
              // missingRequiredKeys: ["none provided"]
            },
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                  name: {
                    value: "",
                  },
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })
  })

  describe("CLEAR_REQUEST_BODY_VALIDATE_ERROR", function() {
    const clearRequestBodyValidateError = reducer["oas3_clear_request_body_validate_error"]

    describe("bodyValue is String, e.g. application/json", () => {
      it("should clear errors", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: "{}",
                requestContentType: "application/json"
              }
            }
          }
        })

        const result = clearRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: "{}",
                requestContentType: "application/json",
                errors: []
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })

    describe("bodyValue is Map with entries, e.g. application/x-www-form-urleconded", () => {
      it("should clear nested errors, and apply empty error list to all entries", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                    errors: ["some random error"]
                  },
                  name: {
                    value: "doggie",
                    errors: ["Required field is not provided"]
                  },
                  status: {
                    value: "available"
                  }
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = clearRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                    errors: [],
                  },
                  name: {
                    value: "doggie",
                    errors: [],
                  },
                  status: {
                    value: "available",
                    errors: [],
                  },
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })

    describe("bodyValue is empty Map", () => {
      it("should return state unchanged", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {},
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = clearRequestBodyValidateError(state, {
          payload: {
            path: "/pet",
            method: "post",
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                },
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })
  })

  describe("CLEAR_REQUEST_BODY_VALUE", function () {
    const clearRequestBodyValue = reducer["oas3_clear_request_body_value"]
    describe("when requestBodyValue is a String", () => {
      it("should clear requestBodyValue with empty String", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: "some random string",
                requestContentType: "application/json"
              }
            }
          }
        })

        const result = clearRequestBodyValue(state, {
          payload: {
            pathMethod: ["/pet", "post"],
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: "",
                requestContentType: "application/json",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })

    describe("when requestBodyValue is a Map", () => {
      it("should clear requestBodyValue with empty Map", () => {
        const state = fromJS({
          requestData: {
            "/pet": {
              post: {
                bodyValue: {
                  id: {
                    value: "10",
                  },
                },
                requestContentType: "application/x-www-form-urlencoded"
              }
            }
          }
        })

        const result = clearRequestBodyValue(state, {
          payload: {
            pathMethod: ["/pet", "post"],
          }
        })

        const expectedResult = {
          requestData: {
            "/pet": {
              post: {
                bodyValue: {},
                requestContentType: "application/x-www-form-urlencoded",
              }
            }
          }
        }

        expect(result.toJS()).toEqual(expectedResult)
      })
    })
  })

})
