/**
 * @prettier
 */
import { fromJS, List } from "immutable"
import { requestResolvedSubtree } from "core/plugins/spec/actions"

// stands in for swagger-client's resolveSubtree(obj, path, options)
type ResolveSubtree = () => Promise<{ spec: unknown; errors: unknown[] }>

const json = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  properties: { a: { $ref: "#/$defs/A" } },
  $defs: { A: { type: "string" } },
}

const makeSystem = (
  resolveSubtree: ResolveSubtree,
  resolvedSubtrees: Record<string, unknown> = {}
) => ({
  fn: { resolveSubtree: jest.fn(resolveSubtree) },
  getConfigs: () => ({}),
  errActions: { clearBy: jest.fn(), newThrownErrBatch: jest.fn() },
  errSelectors: { allErrors: () => List() },
  specActions: { updateResolvedSubtree: jest.fn() },
  specSelectors: {
    specStr: () => JSON.stringify(json),
    url: () => "http://localhost/schema.json",
    isOAS3: () => false,
    specJS: () => json,
    specResolvedSubtree: () => fromJS(resolvedSubtrees),
  },
})

// the batch is debounced (35 ms) and resolves asynchronously
const flushBatch = () => new Promise((resolve) => setTimeout(resolve, 100))

describe("spec plugin - requestResolvedSubtree", () => {
  it("stores the resolved document for an empty path", async () => {
    const resolved = {
      ...json,
      properties: { a: { type: "string", $$ref: "#/$defs/A" } },
    }
    const system = makeSystem(async () => ({ spec: resolved, errors: [] }), {
      components: { securitySchemes: null },
    })

    requestResolvedSubtree([])(system)
    await flushBatch()

    expect(system.fn.resolveSubtree).toHaveBeenCalledWith(
      json,
      [],
      expect.objectContaining({ baseDoc: "http://localhost/schema.json" })
    )
    expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledTimes(1)
    expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledWith(
      [],
      resolved
    )
  })

  it("keeps the earlier results when the document resolves to nothing", async () => {
    const system = makeSystem(async () => ({ spec: null, errors: [] }), {
      paths: { "/a": { get: {} } },
    })

    requestResolvedSubtree([])(system)
    await flushBatch()

    expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledWith([], {
      paths: { "/a": { get: {} } },
    })
  })

  it("stores a non-empty path under that path, next to earlier results", async () => {
    const system = makeSystem(async () => ({ spec: { get: {} }, errors: [] }), {
      components: { securitySchemes: null },
    })

    requestResolvedSubtree(["paths", "/a"])(system)
    await flushBatch()

    expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledWith([], {
      components: { securitySchemes: null },
      paths: { "/a": { get: {} } },
    })
  })
})
