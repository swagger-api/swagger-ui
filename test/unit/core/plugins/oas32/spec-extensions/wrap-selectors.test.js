/**
 * @prettier
 */
import { fromJS, Map, List } from "immutable"
import {
  operations as operationsWrapper,
  validOperationMethods as validOperationMethodsWrapper,
} from "core/plugins/oas32/spec-extensions/wrap-selectors"

describe("OAS32 wrap-selectors", () => {
  describe("operations", () => {
    it("should include query operations for OAS 3.2 specs", () => {
      // Mock original selector that returns standard operations
      const oriSelector = jest.fn(() =>
        fromJS([
          {
            path: "/pet",
            method: "get",
            operation: { summary: "Get pets" },
            id: "get-/pet",
          },
          {
            path: "/pet",
            method: "post",
            operation: { summary: "Create pet" },
            id: "post-/pet",
          },
        ])
      )

      // Mock system with OAS 3.2 spec containing query operation
      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() =>
            fromJS({
              "/pet": {
                get: { summary: "Get pets" },
                post: { summary: "Create pet" },
                query: { summary: "Search pets with complex criteria" },
              },
              "/store": {
                get: { summary: "Get store" },
              },
            })
          ),
        },
      }

      const wrappedSelector = operationsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      // Should include original operations plus query operation
      expect(result.size).toBe(3)

      // Check query operation was added
      const queryOp = result.find((op) => op.get("method") === "query")
      expect(queryOp).toBeDefined()
      expect(queryOp.get("path")).toBe("/pet")
      expect(queryOp.get("id")).toBe("query-/pet")
      expect(queryOp.getIn(["operation", "summary"])).toBe(
        "Search pets with complex criteria"
      )

      // Original operations should still be there
      expect(result.find((op) => op.get("method") === "get")).toBeDefined()
      expect(result.find((op) => op.get("method") === "post")).toBeDefined()
    })

    it("should not modify operations for non-OAS32 specs", () => {
      const oriSelector = jest.fn(() =>
        fromJS([
          {
            path: "/pet",
            method: "get",
            operation: { summary: "Get pets" },
            id: "get-/pet",
          },
        ])
      )

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => false),
          paths: jest.fn(() =>
            fromJS({
              "/pet": {
                get: { summary: "Get pets" },
                query: { summary: "Should not be included" },
              },
            })
          ),
        },
      }

      const wrappedSelector = operationsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      // Should only return original operations, not query
      expect(result.size).toBe(1)
      expect(result.find((op) => op.get("method") === "query")).toBeUndefined()
    })

    it("should handle specs with no query operations", () => {
      const oriSelector = jest.fn(() =>
        fromJS([
          {
            path: "/pet",
            method: "get",
            operation: { summary: "Get pets" },
            id: "get-/pet",
          },
        ])
      )

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() =>
            fromJS({
              "/pet": {
                get: { summary: "Get pets" },
                post: { summary: "Create pet" },
              },
            })
          ),
        },
      }

      const wrappedSelector = operationsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      // Should return original operations unchanged
      expect(result.size).toBe(1)
      expect(result.find((op) => op.get("method") === "query")).toBeUndefined()
    })

    it("should handle empty paths", () => {
      const oriSelector = jest.fn(() => List())

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() => Map()),
        },
      }

      const wrappedSelector = operationsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(result.size).toBe(0)
    })

    it("should handle multiple paths with query operations", () => {
      const oriSelector = jest.fn(() => List())

      const system = {
        specSelectors: {
          isOAS32: jest.fn(() => true),
          paths: jest.fn(() =>
            fromJS({
              "/pet": {
                query: { summary: "Search pets" },
              },
              "/user": {
                query: { summary: "Search users" },
              },
              "/store": {
                get: { summary: "Get store" },
              },
            })
          ),
        },
      }

      const wrappedSelector = operationsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      // Should have 2 query operations
      const queryOps = result.filter((op) => op.get("method") === "query")
      expect(queryOps.size).toBe(2)

      const petQuery = queryOps.find((op) => op.get("path") === "/pet")
      const userQuery = queryOps.find((op) => op.get("path") === "/user")

      expect(petQuery).toBeDefined()
      expect(petQuery.get("id")).toBe("query-/pet")
      expect(userQuery).toBeDefined()
      expect(userQuery.get("id")).toBe("query-/user")
    })
  })

  describe("validOperationMethods", () => {
    it("should include query for OAS 3.2 specs", () => {
      const oriSelector = jest.fn(() => [
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
          validOperationMethods: jest.fn(() => [
            "get",
            "put",
            "post",
            "delete",
            "options",
            "head",
            "patch",
            "trace",
            "query",
          ]),
        },
      }

      const wrappedSelector = validOperationMethodsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(result).toContain("query")
      expect(system.oas32Selectors.validOperationMethods).toHaveBeenCalled()
    })

    it("should not include query for non-OAS32 specs", () => {
      const oriSelector = jest.fn(() => [
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
          validOperationMethods: jest.fn(),
        },
      }

      const wrappedSelector = validOperationMethodsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(result).not.toContain("query")
      expect(oriSelector).toHaveBeenCalled()
      expect(system.oas32Selectors.validOperationMethods).not.toHaveBeenCalled()
    })
  })
})
