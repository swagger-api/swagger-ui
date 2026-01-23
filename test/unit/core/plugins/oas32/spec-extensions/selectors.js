/**
 * @prettier
 */
import { fromJS } from "immutable"
import {
  selectSelfUriField,
  selectMediaTypes,
  selectPathItems,
  selectHasQueryOperations,
  selectHasAdditionalOperations,
} from "core/plugins/oas32/spec-extensions/selectors"

describe("oas32 plugin - spec-extensions - selectors", () => {
  describe("selectSelfUriField", () => {
    it("should select $self field", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            $self: "https://api.example.com/spec",
          },
        },
      })

      const result = selectSelfUriField(state)
      expect(result).toBe("https://api.example.com/spec")
    })

    it("should return undefined when $self is not present", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
          },
        },
      })

      const result = selectSelfUriField(state)
      expect(result).toBeUndefined()
    })
  })

  describe("selectMediaTypes", () => {
    it("should select mediaTypes from components", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            components: {
              mediaTypes: {
                JsonError: {
                  schema: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
      })

      const result = selectMediaTypes(state)
      expect(result.size).toBe(1)
      expect(result.has("JsonError")).toBe(true)
    })

    it("should return empty Map when mediaTypes is not present", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            components: {},
          },
        },
      })

      const result = selectMediaTypes(state)
      expect(result.size).toBe(0)
    })

    it("should return empty Map when components is not present", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
          },
        },
      })

      const result = selectMediaTypes(state)
      expect(result.size).toBe(0)
    })
  })

  describe("selectPathItems", () => {
    it("should select pathItems from components", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            components: {
              pathItems: {
                UserEndpoint: {
                  get: {
                    summary: "Get user",
                  },
                },
              },
            },
          },
        },
      })

      const result = selectPathItems(state)
      expect(result.size).toBe(1)
      expect(result.has("UserEndpoint")).toBe(true)
    })

    it("should return empty Map when pathItems is not present", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            components: {},
          },
        },
      })

      const result = selectPathItems(state)
      expect(result.size).toBe(0)
    })
  })

  describe("selectHasQueryOperations", () => {
    it("should return true when paths contain query operations", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            paths: {
              "/search": {
                query: {
                  summary: "Search with query payload",
                },
              },
            },
          },
        },
      })

      const result = selectHasQueryOperations(state)
      expect(result).toBe(true)
    })

    it("should return false when no query operations exist", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            paths: {
              "/users": {
                get: {
                  summary: "Get users",
                },
              },
            },
          },
        },
      })

      const result = selectHasQueryOperations(state)
      expect(result).toBe(false)
    })

    it("should return false when paths is not present", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
          },
        },
      })

      const result = selectHasQueryOperations(state)
      expect(result).toBe(false)
    })
  })

  describe("selectHasAdditionalOperations", () => {
    it("should return true when paths contain additionalOperations", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            paths: {
              "/resource": {
                additionalOperations: {
                  COPY: {
                    summary: "Copy resource",
                  },
                },
              },
            },
          },
        },
      })

      const result = selectHasAdditionalOperations(state)
      expect(result).toBe(true)
    })

    it("should return false when no additionalOperations exist", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            paths: {
              "/users": {
                get: {
                  summary: "Get users",
                },
              },
            },
          },
        },
      })

      const result = selectHasAdditionalOperations(state)
      expect(result).toBe(false)
    })

    it("should return false when additionalOperations is empty", () => {
      const state = fromJS({
        spec: {
          json: {
            openapi: "3.2.0",
            paths: {
              "/resource": {
                additionalOperations: {},
              },
            },
          },
        },
      })

      const result = selectHasAdditionalOperations(state)
      expect(result).toBe(false)
    })
  })
})
