/**
 * @prettier
 */
import { fromJS } from "immutable"
import { findSchema } from "core/plugins/oas3/spec-extensions/selectors"
import { responseContentType } from "core/plugins/oas3/selectors"

describe("findSchema", function () {
  const state = fromJS({
    resolvedSubtrees: {
      components: {
        schemas: {
          resolvedSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
    json: {
      components: {
        schemas: {
          unresolvedSchema: {
            $ref: "#/components/schemas/resolvedSchema",
          },
          resolvedSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
  })

  it("should get an unresolved schema", function () {
    const result = findSchema(state, "unresolvedSchema")

    expect(result).toEqual(
      state.getIn(["json", "components", "schemas", "unresolvedSchema"])
    )
  })

  it("should get a resolved schema", function () {
    const result = findSchema(state, "resolvedSchema")

    expect(result).toEqual(
      state.getIn([
        "resolvedSubtrees",
        "components",
        "schemas",
        "resolvedSchema",
      ])
    )
  })

  describe("responseContentType", function () {
    const makeSystem = (responses, isOAS3 = true) => ({
      getSystem() {
        return {
          specSelectors: {
            isOAS3: () => isOAS3,
            specJsonWithResolvedSubtrees: () =>
              fromJS({
                paths: {
                  "/ping": {
                    get: {
                      responses,
                    },
                  },
                },
              }),
            operationSpecPath: () => ["paths", "/ping", "get"],
          },
        }
      },
    })

    it("should default to the declared single response content type when requestData is empty", function () {
      const state = fromJS({})
      const system = makeSystem({
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
      })

      const result = responseContentType(state, "/ping", "get")(system)
      expect(result).toEqual("application/json")
    })

    it("should return user-selected responseContentType if explicitly set", function () {
      const state = fromJS({
        requestData: {
          "/ping": {
            get: {
              responseContentType: "application/xml",
            },
          },
        },
      })
      const system = makeSystem({
        200: {
          content: {
            "application/json": {},
            "application/xml": {},
          },
        },
      })

      const result = responseContentType(state, "/ping", "get")(system)
      expect(result).toEqual("application/xml")
    })

    it("should return user-selected responseCodeContentType for the controlling response code", function () {
      const state = fromJS({
        requestData: {
          "/ping": {
            get: {
              responseCodeContentType: {
                200: "application/xml",
              },
            },
          },
        },
      })
      const system = makeSystem({
        200: {
          content: {
            "application/json": {},
            "application/xml": {},
          },
        },
      })

      const result = responseContentType(state, "/ping", "get")(system)
      expect(result).toEqual("application/xml")
    })

    it("should default to the default response content type if no 2xx response is present", function () {
      const state = fromJS({})
      const system = makeSystem({
        default: {
          content: {
            "application/problem+json": {},
          },
        },
      })

      const result = responseContentType(state, "/ping", "get")(system)
      expect(result).toEqual("application/problem+json")
    })

    it("should return null if responses have no content", function () {
      const state = fromJS({})
      const system = makeSystem({
        204: {
          description: "No Content",
        },
      })

      const result = responseContentType(state, "/ping", "get")(system)
      expect(result).toBeNull()
    })
  })
})
