/**
 * @prettier
 */
import { fromJS, List, Map } from "immutable"
import {
  callbacksOperations,
  selectWebhooksOperations,
  webhooks,
} from "core/plugins/oas32/spec-extensions/wrap-selectors"
import { validOperationMethods } from "core/plugins/oas32/selectors"

describe("OAS 3.2 additional operations in nested Path Items", () => {
  const pathItem = fromJS({
    post: { summary: "Standard" },
    additionalOperations: {
      "Notify-Pet": { summary: "Custom" },
      PUT: { summary: "Invalid duplicate of a fixed field" },
    },
  })
  const system = {
    getSystem: () => ({ specSelectors: { isOAS32: () => true } }),
    oas32Selectors: { validOperationMethods },
    specSelectors: {
      specJsonWithResolvedSubtrees: () =>
        Map({ webhooks: Map({ petChanged: pathItem }) }),
    },
  }

  it("includes custom callback methods with the complete document path", () => {
    const specPath = List(["paths", "/pets", "get", "callbacks"])
    const callbacks = Map({
      changed: Map({ "{$request.query.url}": pathItem }),
    })
    const result = callbacksOperations(jest.fn(), system)(Map(), {
      callbacks,
      specPath,
    })

    expect(result.changed.map((operation) => operation.method)).toEqual([
      "post",
      "Notify-Pet",
    ])
    expect(result.changed[1].specPath.toJS()).toEqual([
      ...specPath,
      "changed",
      "{$request.query.url}",
      "additionalOperations",
      "Notify-Pet",
    ])
  })

  it("includes custom webhook methods with the complete document path", () => {
    expect(webhooks(jest.fn(), system)(Map()).has("petChanged")).toBe(true)
    const result = selectWebhooksOperations(jest.fn(), system)(Map())

    expect(result.petChanged.map((operation) => operation.method)).toEqual([
      "post",
      "Notify-Pet",
    ])
    expect(result.petChanged[1].specPath).toEqual([
      "webhooks",
      "petChanged",
      "additionalOperations",
      "Notify-Pet",
    ])
  })

  it.each([callbacksOperations, selectWebhooksOperations])(
    "delegates older specs to the original selector",
    (wrapper) => {
      const original = jest.fn(() => ({ original: true }))
      const olderSystem = {
        getSystem: () => ({ specSelectors: { isOAS32: () => false } }),
      }

      expect(
        wrapper(original, olderSystem)(Map(), {
          callbacks: Map(),
          specPath: List(),
        })
      ).toEqual({ original: true })
      expect(original).toHaveBeenCalled()
    }
  )
})
