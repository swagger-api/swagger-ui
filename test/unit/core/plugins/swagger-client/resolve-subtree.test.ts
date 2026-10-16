/**
 * @prettier
 */
import SwaggerClientPlugin from "core/plugins/swagger-client"

// swagger-client/es is native ESM, which Jest does not transform
jest.mock("swagger-client/es/resolver/strategies/generic", () =>
  jest.requireActual("swagger-client/lib/resolver/strategies/generic")
)
jest.mock("swagger-client/es/resolver/strategies/openapi-2", () =>
  jest.requireActual("swagger-client/lib/resolver/strategies/openapi-2")
)
jest.mock("swagger-client/es/resolver/strategies/openapi-3-0", () =>
  jest.requireActual("swagger-client/lib/resolver/strategies/openapi-3-0")
)
jest.mock("swagger-client/es/resolver/strategies/openapi-3-2-apidom", () =>
  jest.requireActual(
    "swagger-client/lib/resolver/strategies/openapi-3-2-apidom"
  )
)
jest.mock("swagger-client/es/resolver/strategies/openapi-3-1-apidom", () =>
  jest.requireActual(
    "swagger-client/lib/resolver/strategies/openapi-3-1-apidom"
  )
)
jest.mock("swagger-client/es/resolver", () =>
  jest.requireActual("swagger-client/lib/resolver")
)
jest.mock("swagger-client/es/execute", () =>
  jest.requireActual("swagger-client/lib/execute")
)
jest.mock("swagger-client/es/http", () =>
  jest.requireActual("swagger-client/lib/http")
)
jest.mock("swagger-client/es/subtree-resolver", () =>
  jest.requireActual("swagger-client/lib/subtree-resolver")
)
jest.mock("swagger-client/es/helpers", () =>
  jest.requireActual("swagger-client/lib/helpers")
)

const makeSpec = () => ({
  openapi: "3.2.0",
  info: { title: "t", version: "1.0.0" },
  paths: {
    "/files/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
        { name: "q", in: "query", schema: { type: "string" } },
      ],
      get: { responses: { 200: { description: "OK" } } },
      additionalOperations: {
        COPY: {
          parameters: [{ name: "q", in: "query", description: "override" }],
          responses: { 200: { description: "OK" } },
        },
        MOVE: { responses: { 200: { description: "OK" } } },
      },
    },
  },
})

describe("swagger-client plugin resolveSubtree", () => {
  type Param = { name: string; description?: string }
  const { fn } = SwaggerClientPlugin({
    configs: {},
    getConfigs: () => ({}),
  })

  it("inherits Path Item parameters in additionalOperations", async () => {
    const { spec } = await fn.resolveSubtree(makeSpec(), [
      "paths",
      "/files/{id}",
      "additionalOperations",
      "MOVE",
    ])

    expect(spec.parameters.map((p: Param) => p.name)).toEqual(["id", "q"])
  })

  it("lets operation parameters override but not remove Path Item ones", async () => {
    const { spec } = await fn.resolveSubtree(makeSpec(), [
      "paths",
      "/files/{id}",
      "additionalOperations",
      "COPY",
    ])

    expect(spec.parameters).toHaveLength(2)
    expect(spec.parameters.map((p: Param) => p.name).sort()).toEqual([
      "id",
      "q",
    ])
    expect(
      spec.parameters.find((p: Param) => p.name === "q").description
    ).toEqual("override")
  })
})
