import deepLinkingLayout from "core/plugins/deep-linking/layout"

describe("deep-linking layout plugin", function() {
  describe("isShownKeyFromUrlHashArray selector", function() {
    const selector = deepLinkingLayout.statePlugins.layout.selectors.isShownKeyFromUrlHashArray

    it("should return empty array when urlHashArray is empty", function() {
      const urlHashArray = []
      const result = selector(null, urlHashArray)
      expect(result).toEqual([])
    })

    it("should return operations-tag array when urlHashArray has only tag", function() {
      const urlHashArray = ["pet"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations-tag", "pet"])
    })

    it("should return operations array when urlHashArray has tag and operationId", function() {
      const urlHashArray = ["pet", "addPet"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "pet", "addPet"])
    })

    it("should normalize segments when urlHashArray has more than 2 segments", function() {
      const urlHashArray = ["pet", "store", "addPet"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "pet", "addPet"])
    })

    it("should normalize segments when urlHashArray has 4 segments", function() {
      const urlHashArray = ["api", "v1", "pet", "addPet"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "api", "addPet"])
    })

    it("should normalize segments when urlHashArray has many segments", function() {
      const urlHashArray = ["api", "v1", "users", "profile", "updateProfile"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "api", "updateProfile"])
    })

    it("should handle empty strings in urlHashArray", function() {
      const urlHashArray = ["", "addPet"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "", "addPet"])
    })

    it("should return empty array when urlHashArray has only empty string", function() {
      const urlHashArray = [""]
      const result = selector(null, urlHashArray)
      expect(result).toEqual([])
    })

    it("should handle segments with special characters", function() {
      const urlHashArray = ["pet store", "add pet"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "pet store", "add pet"])
    })

    it("should handle segments with special characters when more than 2 segments", function() {
      const urlHashArray = ["api", "pet store", "add pet"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "api", "add pet"])
    })

    it("should preserve original behavior for 2 segments", function() {
      const urlHashArray = ["user", "getUser"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations", "user", "getUser"])
    })

    it("should preserve original behavior for 1 segment", function() {
      const urlHashArray = ["user"]
      const result = selector(null, urlHashArray)
      expect(result).toEqual(["operations-tag", "user"])
    })
  })
})
