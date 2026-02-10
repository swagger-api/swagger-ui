/**
 * @prettier
 */
import { fromJS } from "immutable"
import { selectHasQueryOperations } from "core/plugins/oas32/spec-extensions/selectors"

describe("oas32 plugin - spec-extensions - selectors", () => {
  describe("selectHasQueryOperations", () => {
    it("should return true when paths contain QUERY operations", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/search": {
                  query: {
                    summary: "Search with query payload",
                  },
                },
              },
            }),
        },
      }

      const result = selectHasQueryOperations()(mockSystem)
      expect(result).toBe(true)
    })

    it("should return false when no paths exist", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
            }),
        },
      }

      const result = selectHasQueryOperations()(mockSystem)
      expect(result).toBe(false)
    })

    it("should return false when paths exist but no QUERY operations", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/pets": {
                  get: {
                    summary: "List pets",
                  },
                  post: {
                    summary: "Create pet",
                  },
                },
              },
            }),
        },
      }

      const result = selectHasQueryOperations()(mockSystem)
      expect(result).toBe(false)
    })

    it("should return true when at least one path has QUERY operation", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/pets": {
                  get: {
                    summary: "List pets",
                  },
                },
                "/search": {
                  query: {
                    summary: "Search",
                  },
                },
              },
            }),
        },
      }

      const result = selectHasQueryOperations()(mockSystem)
      expect(result).toBe(true)
    })
  })
})
