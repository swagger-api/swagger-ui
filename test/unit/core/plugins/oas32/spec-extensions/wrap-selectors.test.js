/**
 * @prettier
 */
import { Map } from "immutable"
import { validOperationMethods as validOperationMethodsWrapper } from "core/plugins/oas32/spec-extensions/wrap-selectors"

describe("OAS32 wrap-selectors", () => {
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

      const oas32Methods = [
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

      const system = {
        getSystem: jest.fn(() => ({
          specSelectors: {
            isOAS32: jest.fn(() => true),
          },
        })),
        oas32Selectors: {
          validOperationMethods: jest.fn(() => oas32Methods),
        },
      }

      const wrappedSelector = validOperationMethodsWrapper(oriSelector, system)
      const state = Map()
      const result = wrappedSelector(state)

      expect(result).toContain("query")
      expect(system.oas32Selectors.validOperationMethods).toHaveBeenCalled()
    })

    it("should not include query for non-OAS32 specs", () => {
      const oas3Methods = [
        "get",
        "put",
        "post",
        "delete",
        "options",
        "head",
        "patch",
        "trace",
      ]
      const oriSelector = jest.fn(() => oas3Methods)

      const system = {
        getSystem: jest.fn(() => ({
          specSelectors: {
            isOAS32: jest.fn(() => false),
          },
        })),
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
