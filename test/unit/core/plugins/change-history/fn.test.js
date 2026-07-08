import {
  compareSpecs,
  formatChangeSummary,
  getStorageKey,
  hashSpec,
  resolveRefs,
  stableStringify,
} from "core/plugins/change-history/fn"

describe("change-history fn", () => {
  const baseSpec = {
    openapi: "3.0.0",
    info: {
      title: "Petstore",
      version: "1.0.0",
      description: "A sample API",
    },
    tags: [{ name: "pets" }],
    paths: {
      "/pets": {
        get: {
          summary: "List pets",
          operationId: "listPets",
          responses: {
            200: { description: "OK" },
          },
        },
      },
    },
    components: {
      schemas: {
        Pet: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
        },
      },
    },
  }

  it("creates stable hashes for equivalent specs", () => {
    const reordered = {
      components: baseSpec.components,
      info: baseSpec.info,
      openapi: baseSpec.openapi,
      paths: baseSpec.paths,
      tags: baseSpec.tags,
    }

    expect(hashSpec(baseSpec)).toEqual(hashSpec(reordered))
  })

  it("detects different hashes for changed specs", () => {
    const updated = {
      ...baseSpec,
      info: { ...baseSpec.info, version: "2.0.0" },
    }

    expect(hashSpec(baseSpec)).not.toEqual(hashSpec(updated))
  })

  it("builds storage keys from url or title", () => {
    expect(getStorageKey("https://example.com/openapi.json", baseSpec)).toEqual(
      "https://example.com/openapi.json"
    )
    expect(getStorageKey("", baseSpec)).toEqual("inline:Petstore")
    expect(getStorageKey("", {})).toEqual("inline")
  })

  it("detects added endpoints", () => {
    const updated = {
      ...baseSpec,
      paths: {
        ...baseSpec.paths,
        "/pets/{id}": {
          get: {
            summary: "Get pet",
            responses: { 200: { description: "OK" } },
          },
        },
      },
    }

    const changes = compareSpecs(baseSpec, updated)
    expect(changes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "endpoint-added",
          path: "/pets/{id}",
          method: "GET",
        }),
      ])
    )
  })

  it("detects removed endpoints", () => {
    const updated = {
      ...baseSpec,
      paths: {},
    }

    const changes = compareSpecs(baseSpec, updated)
    expect(changes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "endpoint-removed",
          path: "/pets",
          method: "GET",
        }),
      ])
    )
  })

  it("detects info version changes", () => {
    const updated = {
      ...baseSpec,
      info: { ...baseSpec.info, version: "2.0.0" },
    }

    const changes = compareSpecs(baseSpec, updated)
    expect(changes).toEqual([
      expect.objectContaining({
        type: "info-changed",
        field: "version",
        oldValue: "1.0.0",
        newValue: "2.0.0",
      }),
    ])
  })

  it("detects schema additions", () => {
    const updated = {
      ...baseSpec,
      components: {
        schemas: {
          ...baseSpec.components.schemas,
          NewPet: { type: "object" },
        },
      },
    }

    const changes = compareSpecs(baseSpec, updated)
    expect(changes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "schema-added",
          name: "NewPet",
        }),
      ])
    )
  })

  it("formats change summaries", () => {
    expect(
      formatChangeSummary({
        type: "endpoint-added",
        method: "POST",
        path: "/pets",
      })
    ).toEqual("POST /pets added")

    expect(
      formatChangeSummary({
        type: "info-changed",
        field: "version",
      })
    ).toEqual("Info version changed")
  })

  it("stableStringify sorts object keys", () => {
    expect(stableStringify({ b: 1, a: 2 })).toEqual(
      stableStringify({ a: 2, b: 1 })
    )
  })

  describe("property-level schema diffs", () => {
    it("detects added, removed and modified properties", () => {
      const updated = {
        ...baseSpec,
        components: {
          schemas: {
            Pet: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
              },
            },
          },
        },
      }

      const changes = compareSpecs(baseSpec, updated)
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "schema-property-added",
            name: "Pet",
            property: "name",
          }),
          expect.objectContaining({
            type: "schema-property-modified",
            name: "Pet",
            property: "id",
          }),
        ])
      )
      expect(changes).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: "schema-modified", name: "Pet" }),
        ])
      )
    })

    it("detects required-field changes", () => {
      const withRequired = {
        ...baseSpec,
        components: {
          schemas: {
            Pet: {
              type: "object",
              required: ["id"],
              properties: { id: { type: "integer" } },
            },
          },
        },
      }

      const changes = compareSpecs(baseSpec, withRequired)
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "schema-required-added",
            name: "Pet",
            property: "id",
          }),
        ])
      )
    })

    it("detects schema type changes", () => {
      const retyped = {
        ...baseSpec,
        components: {
          schemas: {
            Pet: { type: "array", properties: {} },
          },
        },
      }

      const changes = compareSpecs(baseSpec, retyped)
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "schema-type-changed",
            name: "Pet",
            oldValue: "object",
            newValue: "array",
          }),
        ])
      )
    })
  })

  describe("$ref resolution", () => {
    const refSpec = {
      openapi: "3.0.0",
      info: { title: "Refs", version: "1.0.0" },
      paths: {
        "/pets": {
          get: {
            responses: {
              200: {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Pet" },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          Pet: {
            type: "object",
            properties: { id: { type: "integer" } },
          },
        },
      },
    }

    it("resolves internal refs so schema changes attribute to endpoints", () => {
      const updated = JSON.parse(JSON.stringify(refSpec))
      updated.components.schemas.Pet.properties.name = { type: "string" }

      const changes = compareSpecs(refSpec, updated)

      // schema-level detail
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "schema-property-added",
            name: "Pet",
            property: "name",
          }),
        ])
      )
      // endpoint attribution (blast radius) via resolved refs
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "response-modified",
            method: "GET",
            path: "/pets",
            statusCode: "200",
          }),
        ])
      )
    })

    it("does not infinitely recurse on circular refs", () => {
      const circular = {
        openapi: "3.0.0",
        info: { title: "Circular", version: "1.0.0" },
        paths: {},
        components: {
          schemas: {
            Node: {
              type: "object",
              properties: {
                child: { $ref: "#/components/schemas/Node" },
              },
            },
          },
        },
      }

      // Should terminate; the cycle is broken by leaving the repeated ref intact.
      const resolved = resolveRefs(circular)
      expect(
        resolved.components.schemas.Node.properties.child.properties.child
      ).toEqual({
        $ref: "#/components/schemas/Node",
      })
    })
  })

  describe("broader coverage", () => {
    it("detects operation tag changes", () => {
      const oldOp = {
        openapi: "3.0.0",
        info: { title: "T", version: "1.0.0" },
        paths: {
          "/pets": { get: { tags: ["pets"], responses: {} } },
        },
      }
      const newOp = {
        ...oldOp,
        paths: {
          "/pets": { get: { tags: ["animals"], responses: {} } },
        },
      }

      const changes = compareSpecs(oldOp, newOp)
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "endpoint-tags-changed",
            method: "GET",
            path: "/pets",
          }),
        ])
      )
    })

    it("detects global security changes", () => {
      const oldSec = {
        openapi: "3.0.0",
        info: { title: "T", version: "1.0.0" },
        paths: {},
        security: [],
      }
      const newSec = { ...oldSec, security: [{ apiKey: [] }] }

      const changes = compareSpecs(oldSec, newSec)
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: "security-changed" }),
        ])
      )
    })

    it("detects response media type additions", () => {
      const oldMt = {
        openapi: "3.0.0",
        info: { title: "T", version: "1.0.0" },
        paths: {
          "/pets": {
            get: {
              responses: {
                200: {
                  description: "OK",
                  content: { "application/json": { schema: {} } },
                },
              },
            },
          },
        },
      }
      const newMt = JSON.parse(JSON.stringify(oldMt))
      newMt.paths["/pets"].get.responses[200].content["application/xml"] = {
        schema: {},
      }

      const changes = compareSpecs(oldMt, newMt)
      expect(changes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "response-content-added",
            method: "GET",
            path: "/pets",
            statusCode: "200",
            mediaType: "application/xml",
          }),
        ])
      )
    })

    it("formats new change summaries", () => {
      expect(
        formatChangeSummary({
          type: "schema-property-added",
          name: "Pet",
          property: "tag",
        })
      ).toEqual('Schema "Pet": property "tag" added')

      expect(
        formatChangeSummary({
          type: "schema-type-changed",
          name: "Pet",
          oldValue: "object",
          newValue: "array",
        })
      ).toEqual('Schema "Pet": type changed (object → array)')
    })
  })
})
