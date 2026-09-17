/**
 * @prettier
 */
import { fromJS } from "immutable"

import { getSchemaObjectTypeLabel } from "core/plugins/json-schema-5/fn"

describe("json-schema-5 fn", () => {
  describe("getSchemaObjectTypeLabel", () => {
    it("returns the type for a primitive schema", () => {
      const schema = fromJS({ type: "string" })

      expect(getSchemaObjectTypeLabel(schema)).toEqual("string")
    })

    it("returns the type without inline format for a top-level primitive", () => {
      // Format on a primitive top-level schema is rendered separately by the
      // calling component, so the label itself should not embed it.
      const schema = fromJS({ type: "string", format: "uuid" })

      expect(getSchemaObjectTypeLabel(schema)).toEqual("string")
    })

    it("returns array<itemsType> when items has no format", () => {
      const schema = fromJS({
        type: "array",
        items: { type: "string" },
      })

      expect(getSchemaObjectTypeLabel(schema)).toEqual("array<string>")
    })

    it("inlines items format inside the array<...> label (#4516)", () => {
      const schema = fromJS({
        type: "array",
        items: { type: "string", format: "uuid" },
      })

      expect(getSchemaObjectTypeLabel(schema)).toEqual("array<string($uuid)>")
    })

    it("inlines items format for integer arrays (#4516)", () => {
      const schema = fromJS({
        type: "array",
        items: { type: "integer", format: "int64" },
      })

      expect(getSchemaObjectTypeLabel(schema)).toEqual("array<integer($int64)>")
    })

    it("inlines items format for nested arrays (#4516)", () => {
      const schema = fromJS({
        type: "array",
        items: {
          type: "array",
          items: { type: "string", format: "uuid" },
        },
      })

      expect(getSchemaObjectTypeLabel(schema)).toEqual(
        "array<array<string($uuid)>>"
      )
    })

    it("inlines items format for the issue's repro spec (#4516)", () => {
      // Excerpt from https://github.com/swagger-api/swagger-ui/issues/4516
      const schema = fromJS({
        items: { format: "uuid", type: "string" },
        in: "query",
        name: "targetUserIds",
        collectionFormat: "multi",
        type: "array",
      })

      expect(getSchemaObjectTypeLabel(schema)).toEqual("array<string($uuid)>")
    })
  })
})
