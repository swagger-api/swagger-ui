import { fromJS } from "immutable"
import { stringifyConstraintNumberRange as stringifyConstraintNumberRangeOAS31 } from "core/plugins/json-schema-2020-12/fn"
import { stringifyConstraintNumberRange as stringifyConstraintNumberRangeDraft5 } from "core/plugins/json-schema-5/fn"

describe("stringifyConstraintNumberRange", () => {
  describe("JSON Schema 2020-12 (OpenAPI 3.1)", () => {
    it("should format minimum constraint", () => {
      const schema = { minimum: 1 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("≥ 1")
    })

    it("should format maximum constraint", () => {
      const schema = { maximum: 100 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("≤ 100")
    })

    it("should format exclusive minimum constraint", () => {
      const schema = { exclusiveMinimum: 0 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("> 0")
    })

    it("should format exclusive maximum constraint", () => {
      const schema = { exclusiveMaximum: 100 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("< 100")
    })

    it("should format range constraint with inclusive bounds", () => {
      const schema = { minimum: 1, maximum: 100 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("[1, 100]")
    })

    it("should format range constraint with exclusive bounds", () => {
      const schema = { exclusiveMinimum: 0, exclusiveMaximum: 100 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("(0, 100)")
    })

    it("should format mixed range constraint (exclusive min, inclusive max)", () => {
      const schema = { exclusiveMinimum: 0, maximum: 100 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("(0, 100]")
    })

    it("should format mixed range constraint (inclusive min, exclusive max)", () => {
      const schema = { minimum: 1, exclusiveMaximum: 100 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("[1, 100)")
    })

    it("should prefer exclusiveMinimum over minimum when both present", () => {
      const schema = { minimum: 1, exclusiveMinimum: 2 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("> 2")
    })

    it("should prefer exclusiveMaximum over maximum when both present", () => {
      const schema = { maximum: 100, exclusiveMaximum: 99 }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe("< 99")
    })

    it("should return null when no constraints present", () => {
      const schema = { type: "number" }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe(null)
    })

    it("should return null when schema is null or undefined", () => {
      expect(stringifyConstraintNumberRangeOAS31(null)).toBe(null)
      expect(stringifyConstraintNumberRangeOAS31(undefined)).toBe(null)
    })

    it("should handle non-numeric constraint values", () => {
      const schema = { minimum: "not a number", maximum: null }
      expect(stringifyConstraintNumberRangeOAS31(schema)).toBe(null)
    })
  })

  describe("JSON Schema Draft 5 (OpenAPI 2.0/3.0)", () => {
    it("should format minimum constraint", () => {
      const schema = fromJS({ minimum: 1 })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("≥ 1")
    })

    it("should format maximum constraint", () => {
      const schema = fromJS({ maximum: 100 })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("≤ 100")
    })

    it("should format exclusive minimum constraint (boolean style)", () => {
      const schema = fromJS({ minimum: 0, exclusiveMinimum: true })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("> 0")
    })

    it("should format exclusive maximum constraint (boolean style)", () => {
      const schema = fromJS({ maximum: 100, exclusiveMaximum: true })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("< 100")
    })

    it("should format range constraint with inclusive bounds", () => {
      const schema = fromJS({ minimum: 1, maximum: 100 })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("[1, 100]")
    })

    it("should format range constraint with exclusive bounds (boolean style)", () => {
      const schema = fromJS({ minimum: 0, exclusiveMinimum: true, maximum: 100, exclusiveMaximum: true })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("(0, 100)")
    })

    it("should format mixed range constraint (exclusive min, inclusive max)", () => {
      const schema = fromJS({ minimum: 0, exclusiveMinimum: true, maximum: 100 })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("(0, 100]")
    })

    it("should format mixed range constraint (inclusive min, exclusive max)", () => {
      const schema = fromJS({ minimum: 1, maximum: 100, exclusiveMaximum: true })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("[1, 100)")
    })

    it("should handle plain objects (not Immutable)", () => {
      const schema = { minimum: 1, maximum: 100 }
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("[1, 100]")
    })

    it("should ignore boolean exclusiveMinimum when false", () => {
      const schema = fromJS({ minimum: 1, exclusiveMinimum: false })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("≥ 1")
    })

    it("should ignore boolean exclusiveMaximum when false", () => {
      const schema = fromJS({ maximum: 100, exclusiveMaximum: false })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe("≤ 100")
    })

    it("should return null when no constraints present", () => {
      const schema = fromJS({ type: "number" })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe(null)
    })

    it("should return null when schema is null or undefined", () => {
      expect(stringifyConstraintNumberRangeDraft5(null)).toBe(null)
      expect(stringifyConstraintNumberRangeDraft5(undefined)).toBe(null)
    })

    it("should handle constraints without minimum/maximum when exclusive flags are present", () => {
      const schema = fromJS({ exclusiveMinimum: true, exclusiveMaximum: true })
      expect(stringifyConstraintNumberRangeDraft5(schema)).toBe(null)
    })

    it("should handle mixed Immutable and plain object access patterns", () => {
      // Test with an object that has both .get method and direct property access
      const mockSchema = {
        get: jest.fn((key) => {
          const values = { minimum: 1, maximum: 100 }
          return values[key]
        }),
        minimum: 1,
        maximum: 100,
      }
      
      expect(stringifyConstraintNumberRangeDraft5(mockSchema)).toBe("[1, 100]")
      expect(mockSchema.get).toHaveBeenCalledWith("minimum")
      expect(mockSchema.get).toHaveBeenCalledWith("maximum")
      expect(mockSchema.get).toHaveBeenCalledWith("exclusiveMinimum")
      expect(mockSchema.get).toHaveBeenCalledWith("exclusiveMaximum")
    })
  })

  describe("edge cases", () => {
    it("should handle zero values correctly", () => {
      expect(stringifyConstraintNumberRangeOAS31({ minimum: 0 })).toBe("≥ 0")
      expect(stringifyConstraintNumberRangeOAS31({ maximum: 0 })).toBe("≤ 0")
      expect(stringifyConstraintNumberRangeOAS31({ exclusiveMinimum: 0 })).toBe("> 0")
      expect(stringifyConstraintNumberRangeOAS31({ exclusiveMaximum: 0 })).toBe("< 0")
    })

    it("should handle negative values correctly", () => {
      expect(stringifyConstraintNumberRangeOAS31({ minimum: -10, maximum: -1 })).toBe("[-10, -1]")
      expect(stringifyConstraintNumberRangeDraft5(fromJS({ minimum: -10, maximum: -1 }))).toBe("[-10, -1]")
    })

    it("should handle decimal values correctly", () => {
      expect(stringifyConstraintNumberRangeOAS31({ minimum: 0.1, maximum: 99.9 })).toBe("[0.1, 99.9]")
      expect(stringifyConstraintNumberRangeDraft5(fromJS({ minimum: 0.1, maximum: 99.9 }))).toBe("[0.1, 99.9]")
    })
  })
})