import { Map } from "immutable"
import OpsFilter from "corePlugins/filter/OpsFilter"
import expect from "expect"

describe("OpsFilter", function() {
  const taggedOps = Map([["pet"], ["store"], ["user"]])

  it("should filter taggedOps by tag name", function () {
    const filtered = OpsFilter(taggedOps, "sto")

    expect(filtered.size).toEqual(1)
  })

  it("should return all taggedOps when search phrase is empty", function () {
    const filtered = OpsFilter(taggedOps, "")

    expect(filtered.size).toEqual(taggedOps.size)
  })

  it("should return empty result when there is no match", function () {
    const filtered = OpsFilter(taggedOps, "NoMatch")

    expect(filtered.size).toEqual(0)
  })
})
