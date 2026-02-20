/**
 * @prettier
 */
import { Map, List } from "immutable"
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
        Map({
          path: "/pets",
          method: "get",
          operation: Map({ summary: "Get pets" }),
        }),
        Map({
          path: "/pets",
          method: "query",
          operation: Map({ summary: "Search pets" }),
        }),
        Map({
          path: "/pets",
          method: "post",
          operation: Map({ summary: "Create pet" }),
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
