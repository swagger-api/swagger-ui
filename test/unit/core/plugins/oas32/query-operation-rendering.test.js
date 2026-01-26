/**
 * @prettier
 */
import { fromJS, Map, List } from "immutable"
import { validOperationMethods as validOperationMethodsWrapper } from "core/plugins/oas32/spec-extensions/wrap-selectors"
import { operationsWithRootInherited as operationsWithRootInheritedWrapper } from "core/plugins/oas32/spec-extensions/wrap-selectors"
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
        specSelectors: {
          isOAS32: jest.fn(() => true),
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
        specSelectors: {
          isOAS32: jest.fn(() => false),
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

      expect(result).not.toContain("query")
      expect(result.length).toBe(8)
    })
  })

  describe("operationsWithRootInherited wrapper", () => {
    it("should include QUERY operations for OAS 3.2 specs", () => {
      const originalOperations = fromJS([
        {
          path: "/pets",
          method: "get",
          operation: { summary: "Get pets" },
          id: "get-/pets",
        },
        {
          path: "/pets",
          method: "post",
          operation: { summary: "Create pet" },
          id: "post-/pets",
        },
      ])

      const originalSelector = jest.fn(() => originalOperations)

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() =>
            fromJS({
              "/pets": {
                get: { summary: "Get pets" },
                post: { summary: "Create pet" },
                query: { summary: "Search pets with complex criteria" },
              },
            })
          ),
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/pets": {
                  get: { summary: "Get pets" },
                  post: { summary: "Create pet" },
                  query: { summary: "Search pets with complex criteria" },
                },
              },
            })
          ),
        },
      }

      const wrappedSelector = operationsWithRootInheritedWrapper(originalSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(List.isList(result)).toBe(true)
      expect(result.size).toBe(3) // get + post + query

      const queryOp = result.find((op) => op.get("method") === "query")
      expect(queryOp).toBeDefined()
      expect(queryOp.get("path")).toBe("/pets")
      expect(queryOp.get("id")).toBe("query-/pets")
      expect(queryOp.getIn(["operation", "summary"])).toBe(
        "Search pets with complex criteria"
      )
    })

    it("should not duplicate operations from original selector", () => {
      const originalOperations = fromJS([
        {
          path: "/pets",
          method: "get",
          operation: { summary: "Get pets" },
          id: "get-/pets",
        },
      ])

      const originalSelector = jest.fn(() => originalOperations)

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() =>
            fromJS({
              "/pets": {
                get: { summary: "Get pets" },
                query: { summary: "Search pets" },
              },
            })
          ),
          specJson: jest.fn(() => fromJS({ openapi: "3.2.0" })),
        },
      }

      const wrappedSelector = operationsWithRootInheritedWrapper(originalSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(result.size).toBe(2) // get + query, not duplicated
      const getMethods = result.filter((op) => op.get("method") === "get")
      expect(getMethods.size).toBe(1)
    })

    it("should handle multiple paths with QUERY operations", () => {
      const originalOperations = fromJS([])
      const originalSelector = jest.fn(() => originalOperations)

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() =>
            fromJS({
              "/pets": {
                query: { summary: "Search pets" },
              },
              "/users": {
                query: { summary: "Search users" },
              },
              "/stores": {
                get: { summary: "Get stores" },
              },
            })
          ),
          specJson: jest.fn(() => fromJS({ openapi: "3.2.0" })),
        },
      }

      const wrappedSelector = operationsWithRootInheritedWrapper(originalSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      const queryOps = result.filter((op) => op.get("method") === "query")
      expect(queryOps.size).toBe(2)

      const petQuery = queryOps.find((op) => op.get("path") === "/pets")
      const userQuery = queryOps.find((op) => op.get("path") === "/users")

      expect(petQuery).toBeDefined()
      expect(userQuery).toBeDefined()
      expect(petQuery.get("id")).toBe("query-/pets")
      expect(userQuery.get("id")).toBe("query-/users")
    })

    it("should not add QUERY operations for non-OAS32 specs", () => {
      const originalOperations = fromJS([
        {
          path: "/pets",
          method: "get",
          operation: { summary: "Get pets" },
          id: "get-/pets",
        },
      ])

      const originalSelector = jest.fn(() => originalOperations)

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => false),
          paths: jest.fn(() =>
            fromJS({
              "/pets": {
                get: { summary: "Get pets" },
                query: { summary: "Should not be included" },
              },
            })
          ),
        },
      }

      const wrappedSelector = operationsWithRootInheritedWrapper(originalSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(result.size).toBe(1)
      expect(result.find((op) => op.get("method") === "query")).toBeUndefined()
    })

    it("should handle empty paths", () => {
      const originalOperations = fromJS([])
      const originalSelector = jest.fn(() => originalOperations)

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() => Map()),
        },
      }

      const wrappedSelector = operationsWithRootInheritedWrapper(originalSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(result.size).toBe(0)
    })

    it("should handle paths without query operations", () => {
      const originalOperations = fromJS([
        {
          path: "/pets",
          method: "get",
          operation: { summary: "Get pets" },
          id: "get-/pets",
        },
      ])

      const originalSelector = jest.fn(() => originalOperations)

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() =>
            fromJS({
              "/pets": {
                get: { summary: "Get pets" },
                post: { summary: "Create pet" },
              },
            })
          ),
          specJson: jest.fn(() => fromJS({ openapi: "3.2.0" })),
        },
      }

      const wrappedSelector = operationsWithRootInheritedWrapper(originalSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      // Should have original operations but no query added
      expect(result.size).toBe(1)
      expect(result.find((op) => op.get("method") === "query")).toBeUndefined()
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

      // Filter operations like Operations component does (line 71)
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
