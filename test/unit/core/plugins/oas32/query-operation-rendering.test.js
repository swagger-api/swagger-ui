/**
 * @prettier
 */
import { Map, List, fromJS } from "immutable"
import { validOperationMethods as validOperationMethodsWrapper } from "core/plugins/oas32/spec-extensions/wrap-selectors"
import { validOperationMethods as oas32ValidOperationMethods } from "core/plugins/oas32/selectors"

describe("OAS 3.2 QUERY operation rendering", () => {
  describe("validOperationMethods wrapper", () => {
    it("should include 'query' method for OAS 3.2 specs", () => {
      const originalSelector = jest.fn(() => [
        "get",
        "put",
        "post",
        "delete",
        "options",
        "head",
        "patch",
        "trace",
      ])

      const system = {
        getSystem: jest.fn(() => ({
          specSelectors: {
            isOAS32: jest.fn(() => true),
          },
        })),
        specSelectors: {
          specJsonWithResolvedSubtrees: jest.fn(() => Map()),
        },
        oas32Selectors: {
          validOperationMethods: oas32ValidOperationMethods,
        },
      }

      const wrappedSelector = validOperationMethodsWrapper(
        originalSelector,
        system
      )
      const state = Map()
      const result = wrappedSelector(state)

      expect(result).toContain("query")
      expect(result).toContain("get")
      expect(result).toContain("post")
      expect(result.length).toBe(9) // 8 standard + query
    })

    it("should include custom additionalOperations methods for OAS 3.2 specs", () => {
      const originalSelector = jest.fn(() => [
        "get",
        "put",
        "post",
        "delete",
        "options",
        "head",
        "patch",
        "trace",
      ])

      const system = {
        getSystem: jest.fn(() => ({
          specSelectors: {
            isOAS32: jest.fn(() => true),
          },
        })),
        specSelectors: {
          specJsonWithResolvedSubtrees: jest.fn(() =>
            fromJS({
              paths: {
                "/pets": {
                  additionalOperations: {
                    LIST: { summary: "List pets" },
                    SEARCH: { summary: "Search pets" },
                  },
                },
              },
            })
          ),
        },
        oas32Selectors: {
          validOperationMethods: oas32ValidOperationMethods,
        },
      }

      const wrappedSelector = validOperationMethodsWrapper(
        originalSelector,
        system
      )
      const state = Map()
      const result = wrappedSelector(state)

      expect(result).toContain("query")
      expect(result).toContain("LIST")
      expect(result).toContain("SEARCH")
    })

    it("should discover exact custom tokens from resolved path items", () => {
      const system = {
        getSystem: () => ({ specSelectors: { isOAS32: () => true } }),
        specSelectors: {
          specJson: () => Map(),
          specJsonWithResolvedSubtrees: jest.fn(() =>
            fromJS({
              paths: {
                "/pets": {
                  additionalOperations: { "Search-Pets": {} },
                },
                "/other": {
                  additionalOperations: { "Search-Pets": {} },
                },
              },
            })
          ),
        },
        oas32Selectors: { validOperationMethods: oas32ValidOperationMethods },
      }
      const result = validOperationMethodsWrapper(jest.fn(), system)(Map())

      expect(result.filter((method) => method === "Search-Pets")).toEqual([
        "Search-Pets",
      ])
      expect(result).not.toContain("search-pets")
    })

    it("should not include 'query' for non-OAS32 specs", () => {
      const originalSelector = jest.fn(() => [
        "get",
        "put",
        "post",
        "delete",
        "options",
        "head",
        "patch",
        "trace",
      ])

      const system = {
        getSystem: jest.fn(() => ({
          specSelectors: {
            isOAS32: jest.fn(() => false),
          },
        })),
        oas32Selectors: {
          validOperationMethods: oas32ValidOperationMethods,
        },
      }

      const wrappedSelector = validOperationMethodsWrapper(
        originalSelector,
        system
      )
      const state = Map()
      const result = wrappedSelector(state)

      expect(result).not.toContain("query")
      expect(result.length).toBe(8)
    })

    it("returns the same array for unchanged paths (memoized)", () => {
      const paths = fromJS({ "/pets": { additionalOperations: { LIST: {} } } })
      const system = {
        getSystem: () => ({ specSelectors: { isOAS32: () => true } }),
        specSelectors: {
          specJsonWithResolvedSubtrees: () => fromJS({}).set("paths", paths),
        },
        oas32Selectors: { validOperationMethods: oas32ValidOperationMethods },
      }
      const wrapped = validOperationMethodsWrapper(jest.fn(), system)
      expect(wrapped(Map())).toBe(wrapped(Map()))
    })
  })

  describe("integration test", () => {
    it("should allow Operations component to render QUERY operations", () => {
      // Simulate what the Operations component does
      const validOperationMethods = [
        "get",
        "put",
        "post",
        "delete",
        "options",
        "head",
        "patch",
        "trace",
        "query",
      ]

      const operations = List([
        fromJS({
          path: "/pets",
          method: "get",
          operation: fromJS({ summary: "Get pets" }),
        }),
        fromJS({
          path: "/pets",
          method: "query",
          operation: fromJS({ summary: "Search pets" }),
        }),
        fromJS({
          path: "/pets",
          method: "post",
          operation: fromJS({ summary: "Create pet" }),
        }),
      ])

      // Filter operations like Operations component does
      const renderedOperations = operations.filter(
        (op) => validOperationMethods.indexOf(op.get("method")) !== -1
      )

      expect(renderedOperations.size).toBe(3)
      expect(
        renderedOperations.find((op) => op.get("method") === "query")
      ).toBeDefined()
    })
  })
})
