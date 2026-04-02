/**
 * @prettier
 */
import { makeGetTitle } from "core/plugins/oas31/json-schema-2020-12-extensions/fn"

const baseGetTitle = (schema) => schema?.title ?? ""

describe("OAS31 - json-schema-2020-12-extensions - makeGetTitle", () => {
  const getTitle = makeGetTitle(baseGetTitle)

  it("should return null when original is not a function", () => {
    expect(makeGetTitle(null)).toBeNull()
    expect(makeGetTitle(undefined)).toBeNull()
    expect(makeGetTitle("string")).toBeNull()
  })

  describe("when schema has a title", () => {
    it("should return the title from the original getTitle", () => {
      expect(getTitle({ title: "MyTitle" })).toBe("MyTitle")
    })

    it("should prefer title over $$ref", () => {
      expect(
        getTitle({
          title: "MyTitle",
          $$ref: "#/components/schemas/Foo",
        })
      ).toBe("MyTitle")
    })
  })

  describe("when schema has no title but has $$ref", () => {
    it("should extract the schema name from a full URL $$ref", () => {
      expect(
        getTitle({
          $$ref: "http://localhost:3200/swagger.json#/components/schemas/Foo",
        })
      ).toBe("Foo")
    })

    it("should extract the schema name from a relative $$ref", () => {
      expect(getTitle({ $$ref: "swagger.json#/components/schemas/Bar" })).toBe("Bar")
    })

    it("should extract the schema name from a fragment-only $$ref", () => {
      expect(getTitle({ $$ref: "#/components/schemas/Foo" })).toBe("Foo")
    })
  })

  describe("when schema has no title and $$ref does not point to components/schemas", () => {
    it("should return empty string for a non-schema $$ref", () => {
      expect(getTitle({ $$ref: "#/definitions/Bar" })).toBe("")
    })

    it("should return empty string for null schema", () => {
      expect(getTitle(null)).toBe("")
    })
  })
})
