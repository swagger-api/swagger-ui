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

// what an instance has loaded; replacing `json` or `url` simulates loading another document
interface Loaded {
  json: unknown
  url: string
}
const makeLoaded = (): Loaded => ({
  json: "document A",
  url: "http://localhost/schema.json",
})
let loaded = makeLoaded()

const makeSystem = (
  resolveSubtree: ResolveSubtree,
  resolvedSubtrees: Record<string, unknown> | boolean = {},
  state: Loaded = loaded
) => ({
  fn: { resolveSubtree: jest.fn(resolveSubtree) },
  getConfigs: () => ({}),
  errActions: { clearBy: jest.fn(), newThrownErrBatch: jest.fn() },
  errSelectors: { allErrors: () => List() },
  specActions: { updateResolvedSubtree: jest.fn() },
  specSelectors: {
    specJson: () => state.json,
    specStr: () => JSON.stringify(json),
    url: () => state.url,
    isOAS3: () => false,
    specJS: () => json,
    specResolvedSubtree: () =>
      typeof resolvedSubtrees === "boolean"
        ? resolvedSubtrees
        : fromJS(resolvedSubtrees),
  },
})

// the batch is debounced (35 ms) and resolves asynchronously
const flushBatch = () => new Promise((resolve) => setTimeout(resolve, 100))

describe("spec plugin - requestResolvedSubtree", () => {
  beforeEach(() => {
    loaded = makeLoaded()
  })

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

  it.each([true, false])(
    "stores a boolean root schema (%s) for an empty path",
    async (value) => {
      const system = makeSystem(async () => ({ spec: value, errors: [] }))

      requestResolvedSubtree([])(system)
      await flushBatch()

      expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledWith(
        [],
        value
      )
    }
  )

  it("does not fail when the earlier root result is a boolean", async () => {
    const system = makeSystem(async () => ({ spec: false, errors: [] }), true)

    requestResolvedSubtree([])(system)
    await flushBatch()

    expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledWith(
      [],
      false
    )
  })

  it("discards a batch that finishes after another document was loaded", async () => {
    const system = makeSystem(async () => {
      loaded.json = "document B"
      return { spec: { title: "A" }, errors: [new Error("late")] }
    })

    requestResolvedSubtree([])(system)
    await flushBatch()

    expect(system.fn.resolveSubtree).toHaveBeenCalledTimes(1)
    expect(system.specActions.updateResolvedSubtree).not.toHaveBeenCalled()
    expect(system.errActions.newThrownErrBatch).not.toHaveBeenCalled()
  })

  describe("a document replaced while a batch is resolving", () => {
    const petstore = {
      openapi: "3.0.4",
      paths: { "/pets": { get: { responses: {} } } },
    }

    it("keeps the results of an OpenAPI batch started on the current document", async () => {
      loaded.json = petstore
      const system = makeSystem(async () => ({
        spec: { get: { operationId: "listPets" } },
        errors: [],
      }))

      requestResolvedSubtree(["paths", "/pets"])(system)
      await flushBatch()

      expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledWith(
        [],
        {
          paths: { "/pets": { get: { operationId: "listPets" } } },
        }
      )
    })

    it("discards an OpenAPI batch, and resolves the path again when it is requested again", async () => {
      loaded.json = petstore
      let replaceOnce = true
      const system = makeSystem(async () => {
        if (replaceOnce) {
          replaceOnce = false
          loaded.json = { ...petstore, info: { title: "v2" } }
          return { spec: { get: { operationId: "stale" } }, errors: [] }
        }
        return { spec: { get: { operationId: "fresh" } }, errors: [] }
      })

      requestResolvedSubtree(["paths", "/pets"])(system)
      await flushBatch()
      expect(system.specActions.updateResolvedSubtree).not.toHaveBeenCalled()

      // what OperationContainer does while its subtree is still undefined
      requestResolvedSubtree(["paths", "/pets"])(system)
      await flushBatch()
      expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledTimes(1)
      expect(system.specActions.updateResolvedSubtree).toHaveBeenCalledWith(
        [],
        {
          paths: { "/pets": { get: { operationId: "fresh" } } },
        }
      )
    })

    it("discards a batch when the URL changed", async () => {
      const system = makeSystem(async () => {
        loaded.url = "http://localhost/other.json"
        return { spec: { get: {} }, errors: [] }
      })

      requestResolvedSubtree(["paths", "/a"])(system)
      await flushBatch()

      expect(system.specActions.updateResolvedSubtree).not.toHaveBeenCalled()
    })

    it("discards the remaining paths of a stale batch without resolving them", async () => {
      const system = makeSystem(async () => {
        loaded.json = "document B"
        return { spec: { get: {} }, errors: [] }
      })

      requestResolvedSubtree(["paths", "/a"])(system)
      requestResolvedSubtree(["paths", "/b"])(system)
      await flushBatch()

      expect(system.fn.resolveSubtree).toHaveBeenCalledTimes(1)
      expect(system.specActions.updateResolvedSubtree).not.toHaveBeenCalled()
    })

    it("does not let one instance's replaced document discard another instance's batch", async () => {
      const loadedA = makeLoaded()
      const loadedB = makeLoaded()
      const systemA = makeSystem(
        async () => {
          loadedA.json = "document A2"
          return { spec: { get: { operationId: "a" } }, errors: [] }
        },
        {},
        loadedA
      )
      const systemB = makeSystem(
        async () => ({ spec: { get: { operationId: "b" } }, errors: [] }),
        {},
        loadedB
      )

      requestResolvedSubtree(["paths", "/a"])(systemA)
      requestResolvedSubtree(["paths", "/b"])(systemB)
      await flushBatch()

      expect(systemA.specActions.updateResolvedSubtree).not.toHaveBeenCalled()
      expect(systemB.specActions.updateResolvedSubtree).toHaveBeenCalledWith(
        [],
        { paths: { "/b": { get: { operationId: "b" } } } }
      )
    })
  })
})
