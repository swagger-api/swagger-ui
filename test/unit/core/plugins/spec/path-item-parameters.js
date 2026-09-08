/**
 * @prettier
 */

import { inheritPathItemParameters } from "core/plugins/spec/path-item-parameters"

describe("spec plugin - path-item-parameters helper", () => {
  it("should be a no-op when paths is not a plain object", () => {
    expect(inheritPathItemParameters(null)).toBe(null)
    expect(inheritPathItemParameters(undefined)).toBe(undefined)
    expect(inheritPathItemParameters("nope")).toBe("nope")
    expect(inheritPathItemParameters([])).toEqual([])
  })

  it("should inherit path-level parameters into operations that lack them", () => {
    const pathParam = {
      in: "path",
      name: "petId",
      required: true,
      schema: { type: "string" },
    }
    const paths = {
      "/pets/{petId}": {
        parameters: [pathParam],
        get: {
          operationId: "showPetById",
          parameters: [
            {
              in: "query",
              name: "verbose",
              schema: { type: "boolean" },
            },
          ],
        },
        options: {
          operationId: "optionsPetById",
        },
      },
    }

    inheritPathItemParameters(paths)

    const get = paths["/pets/{petId}"].get
    const options = paths["/pets/{petId}"].options

    expect(get.parameters).toHaveLength(2)
    expect(get.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "verbose", in: "query" }),
        expect.objectContaining({ name: "petId", in: "path" }),
      ])
    )

    expect(options.parameters).toHaveLength(1)
    expect(options.parameters[0]).toEqual(
      expect.objectContaining({ name: "petId", in: "path" })
    )
  })

  it("should not duplicate parameters that the operation already declares by name", () => {
    const pathParam = {
      in: "path",
      name: "petId",
      required: true,
      schema: { type: "string" },
    }
    const paths = {
      "/pets/{petId}": {
        parameters: [pathParam],
        get: {
          parameters: [
            {
              in: "path",
              name: "petId",
              description: "operation-level override",
              schema: { type: "string" },
            },
          ],
        },
      },
    }

    inheritPathItemParameters(paths)

    expect(paths["/pets/{petId}"].get.parameters).toHaveLength(1)
    expect(paths["/pets/{petId}"].get.parameters[0].description).toBe(
      "operation-level override"
    )
  })

  it("should not duplicate parameters that share a $ref", () => {
    const pathParam = { $ref: "#/components/parameters/PetIdPathParam" }
    const paths = {
      "/pets/{petId}": {
        parameters: [pathParam],
        get: {
          parameters: [{ $ref: "#/components/parameters/PetIdPathParam" }],
        },
      },
    }

    inheritPathItemParameters(paths)

    expect(paths["/pets/{petId}"].get.parameters).toHaveLength(1)
  })

  it("should leave operations untouched when the path item has no parameters", () => {
    const paths = {
      "/pets": {
        get: {
          parameters: [
            { in: "query", name: "limit", schema: { type: "integer" } },
          ],
        },
      },
    }

    inheritPathItemParameters(paths)

    expect(paths["/pets"].get.parameters).toHaveLength(1)
    expect(paths["/pets"].get.parameters[0].name).toBe("limit")
  })

  it("should ignore non-operation keys on the path item", () => {
    const pathParam = {
      in: "path",
      name: "petId",
      schema: { type: "string" },
    }
    const paths = {
      "/pets/{petId}": {
        summary: "Operations on a single pet",
        description: "Use this group for pet operations",
        servers: [{ url: "https://example.com" }],
        parameters: [pathParam],
        get: { operationId: "showPetById" },
      },
    }

    inheritPathItemParameters(paths)

    // summary/description/servers should remain plain values
    expect(paths["/pets/{petId}"].summary).toBe("Operations on a single pet")
    expect(paths["/pets/{petId}"].description).toBe(
      "Use this group for pet operations"
    )
    expect(Array.isArray(paths["/pets/{petId}"].servers)).toBe(true)

    expect(paths["/pets/{petId}"].get.parameters).toHaveLength(1)
  })

  it("should treat the operation parameters as an array even when missing", () => {
    const pathParam = {
      in: "path",
      name: "petId",
      schema: { type: "string" },
    }
    const paths = {
      "/pets/{petId}": {
        parameters: [pathParam],
        options: {},
      },
    }

    inheritPathItemParameters(paths)

    expect(Array.isArray(paths["/pets/{petId}"].options.parameters)).toBe(true)
    expect(paths["/pets/{petId}"].options.parameters).toHaveLength(1)
  })
})
