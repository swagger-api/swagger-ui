/* eslint-env mocha */
import expect from "expect"
import { fromJS } from "immutable"
import { mapToList, validateNumber, validateInteger, validateParam, validateFile } from "core/utils"
import win from "core/window"

describe("utils", function(){

  describe("mapToList", function(){

    it("should convert a map to a list, setting `key`", function(){
      // With
      const aMap = fromJS({
        a: {
          one: 1,
        },
        b: {
          two: 2,
        }
      })

      // When
      const aList = mapToList(aMap, "someKey")

      // Then
      expect(aList.toJS()).toEqual([
        { someKey: "a", one: 1 },
        { someKey: "b", two: 2 },
      ])
    })

    it("should flatten an arbitrarily deep map", function(){
      // With
      const aMap = fromJS({
        a: {
          one: {
            alpha: true
          }
        },
        b: {
          two: {
            bravo: true
          },
          three: {
            charlie: true
          }
        }
      })

      // When
      const aList = mapToList(aMap, ["levelA", "levelB"])

      // Then
      expect(aList.toJS()).toEqual([
        { levelA: "a", levelB: "one", alpha: true },
        { levelA: "b", levelB: "two", bravo: true },
        { levelA: "b", levelB: "three", charlie: true },
      ])

    })

    it("should handle an empty map", function(){
      // With
      const aMap = fromJS({})

      // When
      const aList = mapToList(aMap, ["levelA", "levelB"])

      // Then
      expect(aList.toJS()).toEqual([])
    })

  })

  describe("validateNumber", function() {
    let errorMessage = "Value must be a number"

    it("doesn't return for whole numbers", function() {
      expect(validateNumber(0)).toBeFalsy()
      expect(validateNumber(1)).toBeFalsy()
      expect(validateNumber(20)).toBeFalsy()
      expect(validateNumber(5000000)).toBeFalsy()
      expect(validateNumber("1")).toBeFalsy()
      expect(validateNumber("2")).toBeFalsy()
      expect(validateNumber(-1)).toBeFalsy()
      expect(validateNumber(-20)).toBeFalsy()
      expect(validateNumber(-5000000)).toBeFalsy()
    })

    it("doesn't return for negative numbers", function() {
      expect(validateNumber(-1)).toBeFalsy()
      expect(validateNumber(-20)).toBeFalsy()
      expect(validateNumber(-5000000)).toBeFalsy()
    })

    it("doesn't return for decimal numbers", function() {
      expect(validateNumber(1.1)).toBeFalsy()
      expect(validateNumber(2.5)).toBeFalsy()
      expect(validateNumber(-30.99)).toBeFalsy()
    })

    it("returns a message for strings", function() {
      expect(validateNumber("")).toEqual(errorMessage)
      expect(validateNumber(" ")).toEqual(errorMessage)
      expect(validateNumber("test")).toEqual(errorMessage)
    })

    it("returns a message for invalid input", function() {
      expect(validateNumber(undefined)).toEqual(errorMessage)
      expect(validateNumber(null)).toEqual(errorMessage)
      expect(validateNumber({})).toEqual(errorMessage)
      expect(validateNumber([])).toEqual(errorMessage)
      expect(validateNumber(true)).toEqual(errorMessage)
      expect(validateNumber(false)).toEqual(errorMessage)
    })
  })

  describe("validateInteger", function() {
    let errorMessage = "Value must be an integer"

    it("doesn't return for positive integers", function() {
      expect(validateInteger(0)).toBeFalsy()
      expect(validateInteger(1)).toBeFalsy()
      expect(validateInteger(20)).toBeFalsy()
      expect(validateInteger(5000000)).toBeFalsy()
      expect(validateInteger("1")).toBeFalsy()
      expect(validateInteger("2")).toBeFalsy()
      expect(validateInteger(-1)).toBeFalsy()
      expect(validateInteger(-20)).toBeFalsy()
      expect(validateInteger(-5000000)).toBeFalsy()
    })

    it("doesn't return for negative integers", function() {
      expect(validateInteger(-1)).toBeFalsy()
      expect(validateInteger(-20)).toBeFalsy()
      expect(validateInteger(-5000000)).toBeFalsy()
    })

    it("returns a message for decimal values", function() {
      expect(validateInteger(1.1)).toEqual(errorMessage)
      expect(validateInteger(2.5)).toEqual(errorMessage)
      expect(validateInteger(-30.99)).toEqual(errorMessage)
    })

    it("returns a message for strings", function() {
      expect(validateInteger("")).toEqual(errorMessage)
      expect(validateInteger(" ")).toEqual(errorMessage)
      expect(validateInteger("test")).toEqual(errorMessage)
    })

    it("returns a message for invalid input", function() {
      expect(validateInteger(undefined)).toEqual(errorMessage)
      expect(validateInteger(null)).toEqual(errorMessage)
      expect(validateInteger({})).toEqual(errorMessage)
      expect(validateInteger([])).toEqual(errorMessage)
      expect(validateInteger(true)).toEqual(errorMessage)
      expect(validateInteger(false)).toEqual(errorMessage)
    })
  })

   describe("validateFile", function() {
    let errorMessage = "Value must be a file"

    it("validates against objects which are instances of 'File'", function() {
      let fileObj = new win.File([], "Test File")
      expect(validateFile(fileObj)).toBeFalsy()
      expect(validateFile(null)).toBeFalsy()
      expect(validateFile(undefined)).toBeFalsy()
      expect(validateFile(1)).toEqual(errorMessage)
      expect(validateFile("string")).toEqual(errorMessage)
    })
   })

  describe("validateParam", function() {
    let param = null
    let result = null

    it("validates required strings", function() {
      param = fromJS({
        required: true,
        type: "string",
        value: ""
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )
    })

    it("validates required files", function() {
      param = fromJS({
        required: true,
        type: "file",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )
    })

    it("validates required arrays", function() {
      param = fromJS({
        required: true,
        type: "array",
        value: []
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      param = fromJS({
        required: true,
        type: "array",
        value: []
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )
    })

    it("validates numbers", function() {
      // string instead of a number
      param = fromJS({
        required: false,
        type: "number",
        value: "test"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be a number"] )

      // undefined value
      param = fromJS({
        required: false,
        type: "number",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // null value
      param = fromJS({
        required: false,
        type: "number",
        value: null
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates integers", function() {
      // string instead of integer
      param = fromJS({
        required: false,
        type: "integer",
        value: "test"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be an integer"] )

      // undefined value
      param = fromJS({
        required: false,
        type: "integer",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // null value
      param = fromJS({
        required: false,
        type: "integer",
        value: null
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates arrays", function() {
      // empty array
      param = fromJS({
        required: false,
        type: "array",
        value: []
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // numbers
      param = fromJS({
        required: false,
        type: "array",
        value: ["number"],
        items: {
          type: "number"
        }
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [{index: 0, error: "Value must be a number"}] )

      // integers
      param = fromJS({
        required: false,
        type: "array",
        value: ["not", "numbers"],
        items: {
          type: "integer"
        }
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [{index: 0, error: "Value must be an integer"}, {index: 1, error: "Value must be an integer"}] )
    })
  })
})
