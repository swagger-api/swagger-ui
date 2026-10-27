/**
 * @prettier
 */
import { requestResolvedSubtree } from "core/plugins/json-schema-document/wrap-actions"

const systemFor = (isJSONSchemaDocument: boolean) => ({
  specSelectors: { isJSONSchemaDocument: () => isJSONSchemaDocument },
})

describe("json-schema-document requestResolvedSubtree wrap-action", () => {
  it("resolves the root of a JSON Schema document whatever path is asked for", () => {
    const oriAction = jest.fn()

    requestResolvedSubtree(
      oriAction,
      systemFor(true)
    )(["components", "securitySchemes"])
    requestResolvedSubtree(oriAction, systemFor(true))([])

    expect(oriAction.mock.calls).toEqual([[[]], [[]]])
  })

  it("passes the path through for every other document", () => {
    const oriAction = jest.fn(() => "dispatched")

    const result = requestResolvedSubtree(
      oriAction,
      systemFor(false)
    )(["paths", "/pets", "get"])

    expect(oriAction).toHaveBeenCalledWith(["paths", "/pets", "get"])
    expect(result).toBe("dispatched")
  })
})
