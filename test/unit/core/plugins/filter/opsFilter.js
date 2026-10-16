/**
 * @prettier
 */

import { Map, fromJS } from "immutable"
import opsFilter from "core/plugins/filter/opsFilter"

describe("opsFilter", function () {
  const taggedOps = Map([["pet"], ["store"], ["user"]])

  it("should filter taggedOps by tag name", function () {
    const filtered = opsFilter(taggedOps, "sto")

    expect(filtered.size).toEqual(1)
  })

  it("should return all taggedOps when search phrase is empty", function () {
    const filtered = opsFilter(taggedOps, "")

    expect(filtered.size).toEqual(taggedOps.size)
  })

  it("should return empty result when there is no match", function () {
    const filtered = opsFilter(taggedOps, "NoMatch")

    expect(filtered.size).toEqual(0)
  })

  it("should match tag names case-insensitively", function () {
    expect(opsFilter(taggedOps, "STO").size).toEqual(1)
  })

  describe("path matching", () => {
    const tagged = () =>
      fromJS({
        animals: {
          operations: [
            { path: "/pet/findByStatus" },
            { path: "/pet/findByTags" },
            { path: "/pet/{petId}" },
          ],
        },
        shop: {
          operations: [
            { path: "/store/order" },
            { path: "/store/findByStatus" },
          ],
        },
      })

    it("should keep only operations whose path matches", function () {
      const filtered = opsFilter(tagged(), "findby")

      expect(filtered.keySeq().toJS()).toEqual(["animals", "shop"])
      expect(
        filtered
          .getIn(["animals", "operations"])
          .map((op) => op.get("path"))
          .toJS()
      ).toEqual(["/pet/findByStatus", "/pet/findByTags"])
      expect(
        filtered
          .getIn(["shop", "operations"])
          .map((op) => op.get("path"))
          .toJS()
      ).toEqual(["/store/findByStatus"])
    })

    it("should drop tags with no matching operations", function () {
      const filtered = opsFilter(tagged(), "order")

      expect(filtered.keySeq().toJS()).toEqual(["shop"])
    })

    it("should keep all operations of a tag whose name matches", function () {
      const filtered = opsFilter(tagged(), "animal")

      expect(filtered.keySeq().toJS()).toEqual(["animals"])
      expect(filtered.getIn(["animals", "operations"]).size).toEqual(3)
    })
  })
})
