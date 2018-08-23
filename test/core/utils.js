/* eslint-env mocha */
import expect from "expect"
import { Map, fromJS, OrderedMap } from "immutable"
import {
  mapToList,
  parseSearch,
  serializeSearch,
  validatePattern,
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
  escapeDeepLinkPath,
  getExtensions,
  getCommonExtensions,
  sanitizeUrl,
  extractFileNameFromContentDispositionHeader,
  deeplyStripKey,
  getSampleSchema
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

  describe("extractFileNameFromContentDispositionHeader", function(){
    it("should extract quoted filename", function(){
      let cdHeader = "attachment; filename=\"file name.jpg\""
      let expectedResult = "file name.jpg"
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
    })

    it("should extract filename", function(){
      let cdHeader = "attachment; filename=filename.jpg"
      let expectedResult = "filename.jpg"
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
    })

    it("should not extract filename and return null", function(){
      let cdHeader = "attachment; no file name provided"
      let expectedResult = null
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
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
      expect(validateGuid("8CE4811E-CEC5-4A29-891A-15D1917153C1")).toBeFalsy()
      expect(validateGuid("6ffefd8e-a018-e811-bbf9-60f67727d806")).toBeFalsy()
      expect(validateGuid("6FFEFD8E-A018-E811-BBF9-60F67727D806")).toBeFalsy()
      expect(validateGuid("00000000-0000-0000-0000-000000000000")).toBeFalsy()
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

  describe("validatePattern", function() {
    let rxPattern = "^(red|blue)"
    let errorMessage = "Value must follow pattern " + rxPattern

    it("doesn't return for a match", function() {
      expect(validatePattern("red", rxPattern)).toBeFalsy()
      expect(validatePattern("blue", rxPattern)).toBeFalsy()
    })

    it("returns a message for invalid pattern", function() {
      expect(validatePattern("pink", rxPattern)).toEqual(errorMessage)
      expect(validatePattern("123", rxPattern)).toEqual(errorMessage)
    })

    it("fails gracefully when an invalid regex value is passed", function() {
      expect(() => validatePattern("aValue", "---")).toNotThrow()
      expect(() => validatePattern("aValue", 1234)).toNotThrow()
      expect(() => validatePattern("aValue", null)).toNotThrow()
      expect(() => validatePattern("aValue", [])).toNotThrow()
    })
  })

  describe("validateParam", function() {
    let param = null
    let result = null

    const assertValidateParam = (param, expectedError) => {
      // Swagger 2.0 version
      result = validateParam( fromJS(param), false )
      expect( result ).toEqual( expectedError )

      // OAS3 version, using `schema` sub-object
      let oas3Param = {
        value: param.value,
        required: param.required,
        schema: {
          ...param,
          value: undefined,
          required: undefined
        }
      }
      result = validateParam( fromJS(oas3Param), false, true )
      expect( result ).toEqual( expectedError )
    }

    const assertValidateOas3Param = (param, expectedError) => {
      // for cases where you _only_ want to try OAS3
      result = validateParam( fromJS(param), false, true )
      expect( result ).toEqual( expectedError )
    }

    it("should check the isOAS3 flag when validating parameters", function() {
      // This should "skip" validation because there is no `schema` property
      // and we are telling `validateParam` this is an OAS3 spec
      param = fromJS({
        value: "",
        required: true
      })
      result = validateParam( param, false, true )
      expect( result ).toEqual( [] )
    })

    it("validates required OAS3 objects", function() {
      // valid object
      param = {
        required: true,
        schema: {
          type: "object"
        },
        value: {
          abc: 123
        }
      }
      assertValidateOas3Param(param, [])

      // valid object-as-string
      param = {
        required: true,
        schema: {
          type: "object"
        },
        value: JSON.stringify({
          abc: 123
        })
      }
      assertValidateOas3Param(param, [])

      // invalid object-as-string
      param = {
        required: true,
        schema: {
          type: "object"
        },
        value: "{{}"
      }
      assertValidateOas3Param(param, ["Parameter string value must be valid JSON"])

      // missing when required
      param = {
        required: true,
        schema: {
          type: "object"
        },
      }
      assertValidateOas3Param(param, ["Required field is not provided"])
    })

    it("validates optional OAS3 objects", function() {
      // valid object
      param = {
        schema: {
          type: "object"
        },
        value: {
          abc: 123
        }
      }
      assertValidateOas3Param(param, [])

      // valid object-as-string
      param = {
        schema: {
          type: "object"
        },
        value: JSON.stringify({
          abc: 123
        })
      }
      assertValidateOas3Param(param, [])

      // invalid object-as-string
      param = {
        schema: {
          type: "object"
        },
        value: "{{}"
      }
      assertValidateOas3Param(param, ["Parameter string value must be valid JSON"])

      // missing when not required
      param = {
        schema: {
          type: "object"
        },
      }
      assertValidateOas3Param(param, [])
    })

    it("validates required strings", function() {
      // invalid string
      param = {
        required: true,
        type: "string",
        value: ""
      }
      assertValidateParam(param, ["Required field is not provided"])

      // valid string
      param = {
        required: true,
        type: "string",
        value: "test string"
      }
      assertValidateParam(param, [])

      // valid string with min and max length
      param = {
        required: true,
        type: "string",
        value: "test string",
        maxLength: 50,
        minLength: 1
      }
      assertValidateParam(param, [])
    })

    it("validates required strings with min and max length", function() {
      // invalid string with max length
      param = {
        required: true,
        type: "string",
        value: "test string",
        maxLength: 5
      }
      assertValidateParam(param, ["Value must be less than MaxLength"])

      // invalid string with max length 0
      param = {
        required: true,
        type: "string",
        value: "test string",
        maxLength: 0
      }
      assertValidateParam(param, ["Value must be less than MaxLength"])

      // invalid string with min length
      param = {
        required: true,
        type: "string",
        value: "test string",
        minLength: 50
      }
      assertValidateParam(param, ["Value must be greater than MinLength"])
    })

    it("validates optional strings", function() {
      // valid (empty) string
      param = {
        required: false,
        type: "string",
        value: ""
      }
      assertValidateParam(param, [])

      // valid string
      param = {
        required: false,
        type: "string",
        value: "test"
      }
      assertValidateParam(param, [])
    })

    it("validates required files", function() {
      // invalid file
      param = {
        required: true,
        type: "file",
        value: undefined
      }
      assertValidateParam(param, ["Required field is not provided"])

      // valid file
      param = {
        required: true,
        type: "file",
        value: new win.File()
      }
      assertValidateParam(param, [])
    })

    it("validates optional files", function() {
      // invalid file
      param = {
        required: false,
        type: "file",
        value: "not a file"
      }
      assertValidateParam(param, ["Value must be a file"])

      // valid (empty) file
      param = {
        required: false,
        type: "file",
        value: undefined
      }
      assertValidateParam(param, [])

      // valid file
      param = {
        required: false,
        type: "file",
        value: new win.File()
      }
      assertValidateParam(param, [])
    })

    it("validates required arrays", function() {
      // invalid (empty) array
      param = {
        required: true,
        type: "array",
        value: []
      }
      assertValidateParam(param, ["Required field is not provided"])

      // invalid (not an array)
      param = {
        required: true,
        type: "array",
        value: undefined
      }
      assertValidateParam(param, ["Required field is not provided"])

      // invalid array, items do not match correct type
      param = {
        required: true,
        type: "array",
        value: [1],
        items: {
          type: "string"
        }
      }
      assertValidateParam(param, [{index: 0, error: "Value must be a string"}])

      // valid array, with no 'type' for items
      param = {
        required: true,
        type: "array",
        value: ["1"]
      }
      assertValidateParam(param, [])

      // valid array, items match type
      param = {
        required: true,
        type: "array",
        value: ["1"],
        items: {
          type: "string"
        }
      }
      assertValidateParam(param, [])
    })

    it("validates optional arrays", function() {
      // valid, empty array
      param = {
        required: false,
        type: "array",
        value: []
      }
      assertValidateParam(param, [])

      // invalid, items do not match correct type
      param = {
        required: false,
        type: "array",
        value: ["number"],
        items: {
          type: "number"
        }
      }
      assertValidateParam(param, [{index: 0, error: "Value must be a number"}])

      // valid
      param = {
        required: false,
        type: "array",
        value: ["test"],
        items: {
          type: "string"
        }
      }
      assertValidateParam(param, [])
    })

    it("validates required booleans", function() {
      // invalid boolean value
      param = {
        required: true,
        type: "boolean",
        value: undefined
      }
      assertValidateParam(param, ["Required field is not provided"])

      // invalid boolean value (not a boolean)
      param = {
        required: true,
        type: "boolean",
        value: "test string"
      }
      assertValidateParam(param, ["Value must be a boolean"])

      // valid boolean value
      param = {
        required: true,
        type: "boolean",
        value: "true"
      }
      assertValidateParam(param, [])

      // valid boolean value
      param = {
        required: true,
        type: "boolean",
        value: false
      }
      assertValidateParam(param, [])
    })

    it("validates optional booleans", function() {
      // valid (empty) boolean value
      param = {
        required: false,
        type: "boolean",
        value: undefined
      }
      assertValidateParam(param, [])

      // invalid boolean value (not a boolean)
      param = {
        required: false,
        type: "boolean",
        value: "test string"
      }
      assertValidateParam(param, ["Value must be a boolean"])

      // valid boolean value
      param = {
        required: false,
        type: "boolean",
        value: "true"
      }
      assertValidateParam(param, [])

      // valid boolean value
      param = {
        required: false,
        type: "boolean",
        value: false
      }
      assertValidateParam(param, [])
    })

    it("validates required numbers", function() {
      // invalid number, string instead of a number
      param = {
        required: true,
        type: "number",
        value: "test"
      }
      assertValidateParam(param, ["Value must be a number"])

      // invalid number, undefined value
      param = {
        required: true,
        type: "number",
        value: undefined
      }
      assertValidateParam(param, ["Required field is not provided"])

      // valid number with min and max
      param = {
        required: true,
        type: "number",
        value: 10,
        minimum: 5,
        maximum: 99
      }
      assertValidateParam(param, [])

      // valid negative number with min and max
      param = {
        required: true,
        type: "number",
        value: -10,
        minimum: -50,
        maximum: -5
      }
      assertValidateParam(param, [])

      // invalid number with maximum:0
      param = {
        required: true,
        type: "number",
        value: 1,
        maximum: 0
      }
      assertValidateParam(param, ["Value must be less than Maximum"])

      // invalid number with minimum:0
      param = {
        required: true,
        type: "number",
        value: -10,
        minimum: 0
      }
      assertValidateParam(param, ["Value must be greater than Minimum"])
    })

    it("validates optional numbers", function() {
      // invalid number, string instead of a number
      param = {
        required: false,
        type: "number",
        value: "test"
      }
      assertValidateParam(param, ["Value must be a number"])

      // valid (empty) number
      param = {
        required: false,
        type: "number",
        value: undefined
      }
      assertValidateParam(param, [])

      // valid number
      param = {
        required: false,
        type: "number",
        value: 10
      }
      assertValidateParam(param, [])
    })

    it("validates required integers", function() {
      // invalid integer, string instead of an integer
      param = {
        required: true,
        type: "integer",
        value: "test"
      }
      assertValidateParam(param, ["Value must be an integer"])

      // invalid integer, undefined value
      param = {
        required: true,
        type: "integer",
        value: undefined
      }
      assertValidateParam(param, ["Required field is not provided"])

      // valid integer, but 0 is falsy in JS
      param = {
        required: true,
        type: "integer",
        value: 0
      }
      assertValidateParam(param, [])

      // valid integer
      param = {
        required: true,
        type: "integer",
        value: 10
      }
      assertValidateParam(param, [])
    })

    it("validates optional integers", function() {
      // invalid integer, string instead of an integer
      param = {
        required: false,
        type: "integer",
        value: "test"
      }
      assertValidateParam(param, ["Value must be an integer"])

      // valid (empty) integer
      param = {
        required: false,
        type: "integer",
        value: undefined
      }
      assertValidateParam(param, [])

      // integers
      param = {
        required: false,
        type: "integer",
        value: 10
      }
      assertValidateParam(param, [])
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

  describe("getExtensions", function() {
    const objTest = Map([[ "x-test", "a"], ["minimum", "b"]])
    it("does not error on empty array", function() {
      const result1 = getExtensions([])
      expect(result1).toEqual([])
      const result2 = getCommonExtensions([])
      expect(result2).toEqual([])
    })
    it("gets only the x- keys", function() {
      const result = getExtensions(objTest)
      expect(result).toEqual(Map([[ "x-test", "a"]]))
    })
    it("gets the common keys", function() {
      const result = getCommonExtensions(objTest, true)
      expect(result).toEqual(Map([[ "minimum", "b"]]))
    })
  })

  describe("deeplyStripKey", function() {
    it("should filter out a specified key", function() {
      const input = {
        $$ref: "#/this/is/my/ref",
        a: {
          $$ref: "#/this/is/my/other/ref",
          value: 12345
        }
      }
      const result = deeplyStripKey(input, "$$ref")
      expect(result).toEqual({
        a: {
          value: 12345
        }
      })
    })

    it("should filter out a specified key by predicate", function() {
      const input = {
        $$ref: "#/this/is/my/ref",
        a: {
          $$ref: "#/keep/this/one",
          value: 12345
        }
      }
      const result = deeplyStripKey(input, "$$ref", (v) => v !== "#/keep/this/one")
      expect(result).toEqual({
        a: {
          value: 12345,
          $$ref: "#/keep/this/one"
        }
      })
    })

    it("should only call the predicate when the key matches", function() {
      const input = {
        $$ref: "#/this/is/my/ref",
        a: {
          $$ref: "#/this/is/my/other/ref",
          value: 12345
        }
      }
      let count = 0

      const result = deeplyStripKey(input, "$$ref", () => {
        count++
        return true
      })
      expect(count).toEqual(2)
    })
  })

  describe("parse and serialize search", function() {
    afterEach(function() {
      win.location.search = ""
    })

    describe("parsing", function() {
      it("works with empty search", function() {
        win.location.search = ""
        expect(parseSearch()).toEqual({})
      })

      it("works with only one key", function() {
        win.location.search = "?foo"
        expect(parseSearch()).toEqual({foo: ""})
      })

      it("works with keys and values", function() {
        win.location.search = "?foo=fooval&bar&baz=bazval"
        expect(parseSearch()).toEqual({foo: "fooval", bar: "", baz: "bazval"})
      })

      it("decode url encoded components", function() {
        win.location.search = "?foo=foo%20bar"
        expect(parseSearch()).toEqual({foo: "foo bar"})
      })
    })

    describe("serializing", function() {
      it("works with empty map", function() {
        expect(serializeSearch({})).toEqual("")
      })

      it("works with multiple keys with and without values", function() {
        expect(serializeSearch({foo: "", bar: "barval"})).toEqual("foo=&bar=barval")
      })

      it("encode url components", function() {
        expect(serializeSearch({foo: "foo bar"})).toEqual("foo=foo%20bar")
      })
    })
  })

  describe("sanitizeUrl", function() {
    it("should sanitize a `javascript:` url", function() {
      const res = sanitizeUrl("javascript:alert('bam!')")

      expect(res).toEqual("about:blank")
    })

    it("should sanitize a `data:` url", function() {
      const res = sanitizeUrl(`data:text/html;base64,PHNjcmlwdD5hbGVydCgiSGVsbG8iKTs8L3NjcmlwdD4=`)

      expect(res).toEqual("about:blank")
    })

    it("should not modify a `http:` url", function() {
      const res = sanitizeUrl(`http://swagger.io/`)

      expect(res).toEqual("http://swagger.io/")
    })

    it("should not modify a `https:` url", function() {
      const res = sanitizeUrl(`https://swagger.io/`)

      expect(res).toEqual("https://swagger.io/")
    })

    it("should gracefully handle empty strings", function() {
      expect(sanitizeUrl("")).toEqual("")
    })

    it("should gracefully handle non-string values", function() {
      expect(sanitizeUrl(123)).toEqual("")
      expect(sanitizeUrl(null)).toEqual("")
      expect(sanitizeUrl(undefined)).toEqual("")
      expect(sanitizeUrl([])).toEqual("")
      expect(sanitizeUrl({})).toEqual("")
    })
  })
  describe("getSampleSchema", function() {
    const oriDate = Date

    before(function() {
      Date = function () {
        this.toISOString = function () {
          return "2018-07-07T07:07:05.189Z"
        }
      }
    })

    after(function() {
      Date = oriDate
    })
    
    it("should not unnecessarily stringify non-object values", function() {
      // Given
      const res = getSampleSchema({
        type: "string",
        format: "date-time"
      })

      // Then
      expect(res).toEqual(new Date().toISOString())
    })
  })
})
