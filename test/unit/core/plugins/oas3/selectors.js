/**
 * @prettier
 */
import { fromJS } from "immutable"
import { findSchema } from "core/plugins/oas3/spec-extensions/selectors"

describe("findSchema", function () {
  const state = fromJS({
    resolvedSubtrees: {
      components: {
        schemas: {
          resolvedSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
    json: {
      components: {
        schemas: {
          unresolvedSchema: {
            $ref: "#/components/schemas/resolvedSchema",
          },
          resolvedSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
        },
      },
    },
  })

  it("should get an unresolved schema", function () {
    const result = findSchema(state, "unresolvedSchema")

    expect(result).toEqual(
      state.getIn(["json", "components", "schemas", "unresolvedSchema"])
    )
  })

  it("should get a resolved schema", function () {
    const result = findSchema(state, "resolvedSchema")

    expect(result).toEqual(
      state.getIn([
        "resolvedSubtrees",
        "components",
        "schemas",
        "resolvedSchema",
      ])
    )
  })
})
