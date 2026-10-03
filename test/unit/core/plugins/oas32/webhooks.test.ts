/**
 * @prettier
 */
import System from "core/system"
import SpecPlugin from "core/plugins/spec"
import OpenAPI30Plugin from "core/plugins/oas3"
import OpenAPI31Plugin from "core/plugins/oas31"
import OpenAPI32Plugin from "core/plugins/oas32"

const makeSystem = (spec: Record<string, unknown>) => {
  const system = new System({
    plugins: [SpecPlugin, OpenAPI30Plugin, OpenAPI31Plugin, OpenAPI32Plugin],
  }).getSystem()
  system.specActions.updateJsonSpec(spec)
  return system
}

const operation = { responses: { 200: { description: "ok" } } }

const makeSpec = (openapi: string, webhooks: unknown) => ({
  openapi,
  info: { title: "Webhooks", version: "1.0.0" },
  webhooks,
})

describe("oas32 plugin - webhooks", () => {
  it("should select webhooks for OpenAPI 3.2.0", () => {
    const system = makeSystem(
      makeSpec("3.2.0", { newPet: { post: operation } })
    )

    expect(system.specSelectors.webhooks().toJS()).toEqual({
      newPet: { post: operation },
    })
  })

  it("should select webhooks operations for OpenAPI 3.2.0", () => {
    const system = makeSystem(
      makeSpec("3.2.0", {
        newPet: { post: operation, put: operation },
        oldPet: { post: operation },
      })
    )

    const operations = system.specSelectors.selectWebhooksOperations()

    expect(Object.keys(operations)).toEqual(["newPet", "oldPet"])
    expect(
      operations.newPet.map(({ method, path, specPath }) => ({
        method,
        path,
        specPath,
      }))
    ).toEqual([
      {
        method: "post",
        path: "newPet",
        specPath: ["webhooks", "newPet", "post"],
      },
      {
        method: "put",
        path: "newPet",
        specPath: ["webhooks", "newPet", "put"],
      },
    ])
    expect(operations.newPet[0].operation.toJS()).toEqual({ operation })
  })

  it("should select QUERY webhooks operations for OpenAPI 3.2.0", () => {
    const system = makeSystem(
      makeSpec("3.2.0", { search: { query: operation } })
    )

    const operations = system.specSelectors.selectWebhooksOperations()

    expect(operations.search.map(({ method }) => method)).toEqual(["query"])
  })

  it("should ignore path item fields that are not operations", () => {
    const system = makeSystem(
      makeSpec("3.2.0", {
        newPet: { summary: "a summary", parameters: [], post: operation },
      })
    )

    const operations = system.specSelectors.selectWebhooksOperations()

    expect(operations.newPet.map(({ method }) => method)).toEqual(["post"])
  })

  it("should select no webhooks operations when webhooks field is not an object", () => {
    const system = makeSystem(makeSpec("3.2.0", "not-an-object"))

    expect(system.specSelectors.webhooks().toJS()).toEqual({})
    expect(system.specSelectors.selectWebhooksOperations()).toEqual({})
  })

  it("should not select QUERY webhooks operations for OpenAPI 3.1.0", () => {
    const system = makeSystem(
      makeSpec("3.1.0", { search: { query: operation, post: operation } })
    )

    const operations = system.specSelectors.selectWebhooksOperations()

    expect(operations.search.map(({ method }) => method)).toEqual(["post"])
  })

  it("should not select webhooks for OpenAPI 3.0.x", () => {
    const system = makeSystem(
      makeSpec("3.0.4", { newPet: { post: operation } })
    )

    expect(system.specSelectors.webhooks()).toBeNull()
    expect(system.specSelectors.selectWebhooksOperations()).toBeNull()
  })
})
