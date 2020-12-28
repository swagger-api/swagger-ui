import { Map } from "immutable"
import opsFilter from "corePlugins/filter/opsFilter"

describe("opsFilter", () => {
  const taggedOps = Map([["pet"], ["store"], ["user"], ["user word"]])

  describe("with default filterConfig", () => {
    it("should filter taggedOps by tag name", () => {
      const filtered = opsFilter(taggedOps, "sto")

      expect(filtered.size).toEqual(1)
    })

    it("should filter taggedOps using case sensitive matching", () => {
      const filtered = opsFilter(taggedOps, "Sto")

      expect(filtered.size).toEqual(0)
    })

    it("should return all taggedOps when search phrase is empty", () => {
      const filtered = opsFilter(taggedOps, "")

      expect(filtered.size).toEqual(taggedOps.size)
    })

    it("should return empty result when there is no match", () => {
      const filtered = opsFilter(taggedOps, "NoMatch")

      expect(filtered.size).toEqual(0)
    })

    it("should not use regex matching", () => {
      const filtered = opsFilter(taggedOps, ".*")

      expect(filtered.size).toEqual(0)
    })
  })

  describe("with regex matching", () => {
    const regexFilterConfig = {
      isRegexFilter: true,
      matchCase: true,
      matchWords: false,
    }
    it("should filter taggedOps by tag name", () => {
      const filtered = opsFilter(taggedOps, "st.", regexFilterConfig)

      expect(filtered.size).toEqual(1)
    })

    it("should filter taggedOps using case sensitive matching", () => {
      const filtered = opsFilter(taggedOps, "St.", regexFilterConfig)

      expect(filtered.size).toEqual(0)
    })

    it("should return all taggedOps when search phrase is empty", () => {
      const filtered = opsFilter(taggedOps, "", regexFilterConfig)

      expect(filtered.size).toEqual(taggedOps.size)
    })

    it("should return empty result when there is no match", () => {
      const filtered = opsFilter(taggedOps, "NoM.tch", regexFilterConfig)

      expect(filtered.size).toEqual(0)
    })

    it("should use regex matching", () => {
      const filtered = opsFilter(taggedOps, ".*", regexFilterConfig)

      expect(filtered.size).toEqual(taggedOps.size)
    })
  })

  describe("full words matching", () => {
    const filterConfig = {
      isRegexFilter: false,
      matchCase: true,
      matchWords: true,
    }
    const regexFilterConfig = {
      isRegexFilter: true,
      matchCase: true,
      matchWords: true,
    }
    describe("with default matching", () => {
      it("should return empty result if it is a partial match", () => {
        const filtered = opsFilter(taggedOps, "sto", filterConfig)

        expect(filtered.size).toEqual(0)
      })

      it("should return full words match result, when string boundary == word boundary", () => {
        const filtered = opsFilter(taggedOps, "store", filterConfig)

        expect(filtered.size).toEqual(1)
      })

      it("should return full words match result, when space == word boundary", () => {
        const filtered = opsFilter(taggedOps, "user", filterConfig)

        expect(filtered.size).toEqual(2)
      })

      it("should filter taggedOps using case sensitive matching", () => {
        const filtered = opsFilter(taggedOps, "Store", filterConfig)

        expect(filtered.size).toEqual(0)
      })

      it("should return all taggedOps when search phrase is empty", () => {
        const filtered = opsFilter(taggedOps, "", filterConfig)

        expect(filtered.size).toEqual(taggedOps.size)
      })

      it("should return empty result when there is no match", () => {
        const filtered = opsFilter(taggedOps, "NoMatch", filterConfig)

        expect(filtered.size).toEqual(0)
      })
    })
    describe("with regex matching", () => {
      it("should return empty result if it is a partial match", () => {
        const filtered = opsFilter(taggedOps, "st.", regexFilterConfig)

        expect(filtered.size).toEqual(0)
      })

      it("should return full words match result, when string boundary == word boundary", () => {
        const filtered = opsFilter(taggedOps, "st.re", regexFilterConfig)

        expect(filtered.size).toEqual(1)
      })

      it("should return full words match result, when space == word boundary", () => {
        const filtered = opsFilter(taggedOps, "u.er", regexFilterConfig)

        expect(filtered.size).toEqual(2)
      })


      it("should filter taggedOps using case sensitive matching", () => {
        const filtered = opsFilter(taggedOps, "St.re", regexFilterConfig)

        expect(filtered.size).toEqual(0)
      })

      it("should return all taggedOps when search phrase is empty", () => {
        const filtered = opsFilter(taggedOps, "", regexFilterConfig)

        expect(filtered.size).toEqual(taggedOps.size)
      })
      it("should return empty result when there is no match", () => {
        const filtered = opsFilter(taggedOps, "NoM.tch", filterConfig)

        expect(filtered.size).toEqual(0)
      })
    })
  })
})
