/* eslint-env mocha */
import expect from "expect"
import { fromJS, OrderedMap } from "immutable"
import {
  mapToList,
  validateMinLength,
  validateMaxLength,
  validateDateTime,
  validateGuid,
  validateNumber,
  validateInteger,
  validateParam,
  validateFile,
  validateMaximum,
  validateMinimum,
  fromJSOrdered,
  getAcceptControllingResponse,
  createDeepLinkPath,
  escapeDeepLinkPath
} from "core/utils"
import win from "core/window"

describe("utils", function() {

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

  describe("validateMaximum", function() {
    let errorMessage = "Value must be less than Maximum"

    it("doesn't return for valid input", function() {
      expect(validateMaximum(9, 10)).toBeFalsy()
      expect(validateMaximum(19, 20)).toBeFalsy()
    })

    it("returns a message for invalid input", function() {
      expect(validateMaximum(1, 0)).toEqual(errorMessage)
      expect(validateMaximum(10, 9)).toEqual(errorMessage)
      expect(validateMaximum(20, 19)).toEqual(errorMessage)
    })
  })

  describe("validateMinimum", function() {
    let errorMessage = "Value must be greater than Minimum"

    it("doesn't return for valid input", function() {
      expect(validateMinimum(2, 1)).toBeFalsy()
      expect(validateMinimum(20, 10)).toBeFalsy()
    })

    it("returns a message for invalid input", function() {
      expect(validateMinimum(-1, 0)).toEqual(errorMessage)
      expect(validateMinimum(1, 2)).toEqual(errorMessage)
      expect(validateMinimum(10, 20)).toEqual(errorMessage)
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

   describe("validateDateTime", function() {
    let errorMessage = "Value must be a DateTime"

    it("doesn't return for valid dates", function() {
      expect(validateDateTime("Mon, 25 Dec 1995 13:30:00 +0430")).toBeFalsy()
    })

    it("returns a message for invalid input'", function() {
      expect(validateDateTime(null)).toEqual(errorMessage)
      expect(validateDateTime("string")).toEqual(errorMessage)
    })
   })

  describe("validateGuid", function() {
    let errorMessage = "Value must be a Guid"

    it("doesn't return for valid guid", function() {
      expect(validateGuid("8ce4811e-cec5-4a29-891a-15d1917153c1")).toBeFalsy()
      expect(validateGuid("{8ce4811e-cec5-4a29-891a-15d1917153c1}")).toBeFalsy()
    })

    it("returns a message for invalid input'", function() {
      expect(validateGuid(1)).toEqual(errorMessage)
      expect(validateGuid("string")).toEqual(errorMessage)
    })
   })

   describe("validateMaxLength", function() {
    let errorMessage = "Value must be less than MaxLength"

    it("doesn't return for valid guid", function() {
      expect(validateMaxLength("a", 1)).toBeFalsy()
      expect(validateMaxLength("abc", 5)).toBeFalsy()
    })

    it("returns a message for invalid input'", function() {
      expect(validateMaxLength("abc", 0)).toEqual(errorMessage)
      expect(validateMaxLength("abc", 1)).toEqual(errorMessage)
      expect(validateMaxLength("abc", 2)).toEqual(errorMessage)
    })
   })

   describe("validateMinLength", function() {
    let errorMessage = "Value must be greater than MinLength"

    it("doesn't return for valid guid", function() {
      expect(validateMinLength("a", 1)).toBeFalsy()
      expect(validateMinLength("abc", 2)).toBeFalsy()
    })

    it("returns a message for invalid input'", function() {
      expect(validateMinLength("abc", 5)).toEqual(errorMessage)
      expect(validateMinLength("abc", 8)).toEqual(errorMessage)
    })
   })

  describe("validateParam", function() {
    let param = null
    let result = null

    it("skips validation when `type` is not specified", function() {
      // invalid type
      param = fromJS({
        required: false,
        type: undefined,
        value: ""
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates required strings", function() {
      // invalid string
      param = fromJS({
        required: true,
        type: "string",
        value: ""
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // valid string
      param = fromJS({
        required: true,
        type: "string",
        value: "test string"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid string with min and max length
      param = fromJS({
        required: true,
        type: "string",
        value: "test string",
        maxLength: 50,
        minLength: 1
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates required strings with min and max length", function() {
      // invalid string with max length
      param = fromJS({
        required: true,
        type: "string",
        value: "test string",
        maxLength: 5
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be less than MaxLength"] )

      // invalid string with max length 0
      param = fromJS({
        required: true,
        type: "string",
        value: "test string",
        maxLength: 0
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be less than MaxLength"] )


      // invalid string with min length
      param = fromJS({
        required: true,
        type: "string",
        value: "test string",
        minLength: 50
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be greater than MinLength"] )
    })

    it("validates optional strings", function() {
      // valid (empty) string
      param = fromJS({
        required: false,
        type: "string",
        value: ""
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid string
      param = fromJS({
        required: false,
        type: "string",
        value: "test"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates required files", function() {
      // invalid file
      param = fromJS({
        required: true,
        type: "file",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // valid file
      param = fromJS({
        required: true,
        type: "file",
        value: new win.File()
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates optional files", function() {
      // invalid file
      param = fromJS({
        required: false,
        type: "file",
        value: "not a file"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be a file"] )

      // valid (empty) file
      param = fromJS({
        required: false,
        type: "file",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid file
      param = fromJS({
        required: false,
        type: "file",
        value: new win.File()
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates required arrays", function() {
      // invalid (empty) array
      param = fromJS({
        required: true,
        type: "array",
        value: []
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // invalid (not an array)
      param = fromJS({
        required: true,
        type: "array",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // invalid array, items do not match correct type
      param = fromJS({
        required: true,
        type: "array",
        value: [1],
        items: {
          type: "string"
        }
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [{index: 0, error: "Value must be a string"}] )

      // valid array, with no 'type' for items
      param = fromJS({
        required: true,
        type: "array",
        value: ["1"]
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid array, items match type
      param = fromJS({
        required: true,
        type: "array",
        value: ["1"],
        items: {
          type: "string"
        }
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates optional arrays", function() {
      // valid, empty array
      param = fromJS({
        required: false,
        type: "array",
        value: []
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // invalid, items do not match correct type
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

      // valid
      param = fromJS({
        required: false,
        type: "array",
        value: ["test"],
        items: {
          type: "string"
        }
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates required booleans", function() {
      // invalid boolean value
      param = fromJS({
        required: true,
        type: "boolean",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // invalid boolean value (not a boolean)
      param = fromJS({
        required: true,
        type: "boolean",
        value: "test string"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // valid boolean value
      param = fromJS({
        required: true,
        type: "boolean",
        value: "true"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid boolean value
      param = fromJS({
        required: true,
        type: "boolean",
        value: false
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates optional booleans", function() {
      // valid (empty) boolean value
      param = fromJS({
        required: false,
        type: "boolean",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // invalid boolean value (not a boolean)
      param = fromJS({
        required: false,
        type: "boolean",
        value: "test string"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be a boolean"] )

      // valid boolean value
      param = fromJS({
        required: false,
        type: "boolean",
        value: "true"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid boolean value
      param = fromJS({
        required: false,
        type: "boolean",
        value: false
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates required numbers", function() {
      // invalid number, string instead of a number
      param = fromJS({
        required: true,
        type: "number",
        value: "test"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // invalid number, undefined value
      param = fromJS({
        required: true,
        type: "number",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // valid number with min and max
      param = fromJS({
        required: true,
        type: "number",
        value: 10,
        minimum: 5,
        maximum: 99
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid negative number with min and max
      param = fromJS({
        required: true,
        type: "number",
        value: -10,
        minimum: -50,
        maximum: -5
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // invalid number with maximum:0
      param = fromJS({
        required: true,
        type: "number",
        value: 1,
        maximum: 0
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be less than Maximum"] )

      // invalid number with minimum:0
      param = fromJS({
        required: true,
        type: "number",
        value: -10,
        minimum: 0
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be greater than Minimum"] )
    })

    it("validates optional numbers", function() {
      // invalid number, string instead of a number
      param = fromJS({
        required: false,
        type: "number",
        value: "test"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be a number"] )

      // valid (empty) number
      param = fromJS({
        required: false,
        type: "number",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // valid number
      param = fromJS({
        required: false,
        type: "number",
        value: 10
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates required integers", function() {
      // invalid integer, string instead of an integer
      param = fromJS({
        required: true,
        type: "integer",
        value: "test"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // invalid integer, undefined value
      param = fromJS({
        required: true,
        type: "integer",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Required field is not provided"] )

      // valid integer
      param = fromJS({
        required: true,
        type: "integer",
        value: 10
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })

    it("validates optional integers", function() {
      // invalid integer, string instead of an integer
      param = fromJS({
        required: false,
        type: "integer",
        value: "test"
      })
      result = validateParam( param, false )
      expect( result ).toEqual( ["Value must be an integer"] )

      // valid (empty) integer
      param = fromJS({
        required: false,
        type: "integer",
        value: undefined
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )

      // integers
      param = fromJS({
        required: false,
        type: "integer",
        value: 10
      })
      result = validateParam( param, false )
      expect( result ).toEqual( [] )
    })
  })

  describe("fromJSOrdered", () => {
    it("should create an OrderedMap from an object", () => {
      const param = {
        value: "test"
      }

      const result = fromJSOrdered(param).toJS()
      expect( result ).toEqual( { value: "test" } )
    })

    it("should not use an object's length property for Map size", () => {
      const param = {
        length: 5
      }

      const result = fromJSOrdered(param).toJS()
      expect( result ).toEqual( { length: 5 } )
    })

    it("should create an OrderedMap from an array", () => {
      const param = [1, 1, 2, 3, 5, 8]

      const result = fromJSOrdered(param).toJS()
      expect( result ).toEqual( [1, 1, 2, 3, 5, 8] )
    })
  })

  describe("getAcceptControllingResponse", () => {
    it("should return the first 2xx response with a media type", () => {
      const responses = fromJSOrdered({
        "200": {
          content: {
            "application/json": {
              schema: {
                type: "object"
              }
            }
          }
        },
        "201": {
          content: {
            "application/json": {
              schema: {
                type: "object"
              }
            }
          }
        }
      })

      expect(getAcceptControllingResponse(responses)).toEqual(responses.get("200"))
    })
    it("should skip 2xx responses without defined media types", () => {
      const responses = fromJSOrdered({
        "200": {
          content: {
            "application/json": {
              schema: {
                type: "object"
              }
            }
          }
        },
        "201": {
          content: {
            "application/json": {
              schema: {
                type: "object"
              }
            }
          }
        }
      })

      expect(getAcceptControllingResponse(responses)).toEqual(responses.get("201"))
    })
    it("should default to the `default` response if it has defined media types", () => {
      const responses = fromJSOrdered({
        "200": {
          description: "quite empty"
        },
        "201": {
          description: "quite empty"
        },
        default: {
          content: {
            "application/json": {
              schema: {
                type: "object"
              }
            }
          }
        }
      })

      expect(getAcceptControllingResponse(responses)).toEqual(responses.get("default"))
    })
    it("should return null if there are no suitable controlling responses", () => {
      const responses = fromJSOrdered({
        "200": {
          description: "quite empty"
        },
        "201": {
          description: "quite empty"
        },
        "default": {
          description: "also empty.."
        }
      })

      expect(getAcceptControllingResponse(responses)).toBe(null)
    })
    it("should return null if an empty OrderedMap is passed", () => {
      const responses = fromJSOrdered()

      expect(getAcceptControllingResponse(responses)).toBe(null)
    })
    it("should return null if anything except an OrderedMap is passed", () => {
      const responses = {}

      expect(getAcceptControllingResponse(responses)).toBe(null)
    })
  })

  describe("createDeepLinkPath", function() {
    it("creates a deep link path replacing spaces with underscores", function() {
      const result = createDeepLinkPath("tag id with spaces")
      expect(result).toEqual("tag_id_with_spaces")
    })

    it("trims input when creating a deep link path", function() {
      let result = createDeepLinkPath("  spaces before and after    ")
      expect(result).toEqual("spaces_before_and_after")

      result = createDeepLinkPath("  ")
      expect(result).toEqual("")
    })

    it("creates a deep link path with special characters", function() {
      const result = createDeepLinkPath("!@#$%^&*(){}[]")
      expect(result).toEqual("!@#$%^&*(){}[]")
    })

    it("returns an empty string for invalid input", function() {
      expect( createDeepLinkPath(null) ).toEqual("")
      expect( createDeepLinkPath(undefined) ).toEqual("")
      expect( createDeepLinkPath(1) ).toEqual("")
      expect( createDeepLinkPath([]) ).toEqual("")
      expect( createDeepLinkPath({}) ).toEqual("")
    })
  })

  describe("escapeDeepLinkPath", function() {
    it("creates and escapes a deep link path", function() {
      const result = escapeDeepLinkPath("tag id with spaces?")
      expect(result).toEqual("tag_id_with_spaces\\?")
    })

    it("escapes a deep link path that starts with a number", function() {
      const result = escapeDeepLinkPath("123")
      expect(result).toEqual("\\31 23")
    })

    it("escapes a deep link path with a class selector", function() {
      const result = escapeDeepLinkPath("hello.world")
      expect(result).toEqual("hello\\.world")
    })

    it("escapes a deep link path with an id selector", function() {
      const result = escapeDeepLinkPath("hello#world")
      expect(result).toEqual("hello\\#world")
    })
  })
})
