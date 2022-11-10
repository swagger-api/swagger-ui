import { Map } from "immutable"
import opsFilter from "corePlugins/filter/opsFilter"

describe("opsFilter", function() {
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
})
