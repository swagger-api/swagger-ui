import { Map } from "immutable"
import OpsFilter from "corePlugins/filter/OpsFilter"
import expect from "expect"

describe("OpsFilter", function() {
  it("should filter taggedOps by tag name", function () {
    const taggedOps = Map([["pet"], ["store"], ["user"]])

    const filtered = OpsFilter(taggedOps, "sto")

    expect(filtered.size).toEqual(1)
  })
})
