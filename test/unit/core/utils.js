import { Map, fromJS } from "immutable"
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
  requiresValidationURL,
  extractFileNameFromContentDispositionHeader,
  deeplyStripKey,
  getSampleSchema,
  paramToIdentifier,
  paramToValue,
  generateCodeVerifier,
  createCodeChallenge,
} from "core/utils"

import {
  isAbsoluteUrl,
  buildBaseUrl,
  buildUrl,
  safeBuildUrl,
} from "core/utils/url"

import win from "core/window"
import { afterAll, beforeAll, expect, jest } from "@jest/globals"

describe("utils", () => {

  describe("mapToList", () =>{

    it("should convert a map to a list, setting `key`", () =>{
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

    it("should flatten an arbitrarily deep map", () =>{
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

    it("should handle an empty map", () =>{
      // With
      const aMap = fromJS({})

      // When
      const aList = mapToList(aMap, ["levelA", "levelB"])

      // Then
      expect(aList.toJS()).toEqual([])
    })

  })

  describe("extractFileNameFromContentDispositionHeader", () =>{
    it("should extract quoted filename", () =>{
      let cdHeader = "attachment; filename=\"file name.jpg\""
      let expectedResult = "file name.jpg"
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
    })

    it("should extract filename", () =>{
      let cdHeader = "attachment; filename=filename.jpg"
      let expectedResult = "filename.jpg"
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
    })

    it("should extract quoted filename in utf-8", () =>{
      let cdHeader = "attachment; filename*=UTF-8''\"%D1%84%D0%B0%D0%B9%D0%BB.txt\""
      let expectedResult = "файл.txt"
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
    })

    it("should extract filename in utf-8", () =>{
      let cdHeader = "attachment; filename*=utf-8'ru'%D1%84%D0%B0%D0%B9%D0%BB.txt"
      let expectedResult = "файл.txt"
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
    })

    it("should not extract filename and return null", () =>{
      let cdHeader = "attachment; no file name provided"
      let expectedResult = null
      expect(extractFileNameFromContentDispositionHeader(cdHeader)).toEqual(expectedResult)
    })
  })

  describe("validateMaximum", () => {
    it("doesn't return for valid input", () => {
      expect(validateMaximum(9, 10)).toBeFalsy()
      expect(validateMaximum(19, 20)).toBeFalsy()
    })

    it("returns a message for invalid input", () => {
      expect(validateMaximum(1, 0)).toEqual("Value must be less than 0")
      expect(validateMaximum(10, 9)).toEqual("Value must be less than 9")
      expect(validateMaximum(20, 19)).toEqual("Value must be less than 19")
    })
  })

  describe("validateMinimum", () => {
    it("doesn't return for valid input", () => {
      expect(validateMinimum(2, 1)).toBeFalsy()
      expect(validateMinimum(20, 10)).toBeFalsy()
    })

    it("returns a message for invalid input", () => {
      expect(validateMinimum(-1, 0)).toEqual("Value must be greater than 0")
      expect(validateMinimum(1, 2)).toEqual("Value must be greater than 2")
      expect(validateMinimum(10, 20)).toEqual("Value must be greater than 20")
    })
  })

  describe("validateNumber", () => {
    let errorMessage = "Value must be a number"

    it("doesn't return for whole numbers", () => {
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

    it("doesn't return for negative numbers", () => {
      expect(validateNumber(-1)).toBeFalsy()
      expect(validateNumber(-20)).toBeFalsy()
      expect(validateNumber(-5000000)).toBeFalsy()
    })

    it("doesn't return for decimal numbers", () => {
      expect(validateNumber(1.1)).toBeFalsy()
      expect(validateNumber(2.5)).toBeFalsy()
      expect(validateNumber(-30.99)).toBeFalsy()
    })

    it("returns a message for strings", () => {
      expect(validateNumber("")).toEqual(errorMessage)
      expect(validateNumber(" ")).toEqual(errorMessage)
      expect(validateNumber("test")).toEqual(errorMessage)
    })

    it("returns a message for invalid input", () => {
      expect(validateNumber(undefined)).toEqual(errorMessage)
      expect(validateNumber(null)).toEqual(errorMessage)
      expect(validateNumber({})).toEqual(errorMessage)
      expect(validateNumber([])).toEqual(errorMessage)
      expect(validateNumber(true)).toEqual(errorMessage)
      expect(validateNumber(false)).toEqual(errorMessage)
    })
  })

  describe("validateInteger", () => {
    let errorMessage = "Value must be an integer"

    it("doesn't return for positive integers", () => {
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

    it("doesn't return for negative integers", () => {
      expect(validateInteger(-1)).toBeFalsy()
      expect(validateInteger(-20)).toBeFalsy()
      expect(validateInteger(-5000000)).toBeFalsy()
    })

    it("returns a message for decimal values", () => {
      expect(validateInteger(1.1)).toEqual(errorMessage)
      expect(validateInteger(2.5)).toEqual(errorMessage)
      expect(validateInteger(-30.99)).toEqual(errorMessage)
    })

    it("returns a message for strings", () => {
      expect(validateInteger("")).toEqual(errorMessage)
      expect(validateInteger(" ")).toEqual(errorMessage)
      expect(validateInteger("test")).toEqual(errorMessage)
    })

    it("returns a message for invalid input", () => {
      expect(validateInteger(undefined)).toEqual(errorMessage)
      expect(validateInteger(null)).toEqual(errorMessage)
      expect(validateInteger({})).toEqual(errorMessage)
      expect(validateInteger([])).toEqual(errorMessage)
      expect(validateInteger(true)).toEqual(errorMessage)
      expect(validateInteger(false)).toEqual(errorMessage)
    })
  })

  describe("validateFile", () => {
    let errorMessage = "Value must be a file"

    it("validates against objects which are instances of 'File'", () => {
      let fileObj = new win.File([], "Test File")
      expect(validateFile(fileObj)).toBeFalsy()
      expect(validateFile(null)).toBeFalsy()
      expect(validateFile(undefined)).toBeFalsy()
      expect(validateFile(1)).toEqual(errorMessage)
      expect(validateFile("string")).toEqual(errorMessage)
    })
  })

  describe("validateDateTime", () => {
    let errorMessage = "Value must be a DateTime"

    it("doesn't return for valid dates", () => {
      expect(validateDateTime("Mon, 25 Dec 1995 13:30:00 +0430")).toBeFalsy()
    })

    it("returns a message for invalid input'", () => {
      expect(validateDateTime(null)).toEqual(errorMessage)
      expect(validateDateTime("string")).toEqual(errorMessage)
    })
  })

  describe("validateGuid", () => {
    let errorMessage = "Value must be a Guid"

    it("doesn't return for valid guid", () => {
      expect(validateGuid("8ce4811e-cec5-4a29-891a-15d1917153c1")).toBeFalsy()
      expect(validateGuid("{8ce4811e-cec5-4a29-891a-15d1917153c1}")).toBeFalsy()
      expect(validateGuid("8CE4811E-CEC5-4A29-891A-15D1917153C1")).toBeFalsy()
      expect(validateGuid("6ffefd8e-a018-e811-bbf9-60f67727d806")).toBeFalsy()
      expect(validateGuid("6FFEFD8E-A018-E811-BBF9-60F67727D806")).toBeFalsy()
      expect(validateGuid("00000000-0000-0000-0000-000000000000")).toBeFalsy()
    })

    it("returns a message for invalid input'", () => {
      expect(validateGuid(1)).toEqual(errorMessage)
      expect(validateGuid("string")).toEqual(errorMessage)
    })
  })

  describe("validateMaxLength", () => {
    it("doesn't return for valid input", () => {
      expect(validateMaxLength("a", 1)).toBeFalsy()
      expect(validateMaxLength("abc", 5)).toBeFalsy()
    })

    it("returns a message for invalid input'", () => {
      expect(validateMaxLength("abc", 0)).toEqual("Value must be no longer than 0 characters")
      expect(validateMaxLength("abc", 1)).toEqual("Value must be no longer than 1 character")
      expect(validateMaxLength("abc", 2)).toEqual("Value must be no longer than 2 characters")
    })
  })

  describe("validateMinLength", () => {
    it("doesn't return for valid input", () => {
      expect(validateMinLength("a", 1)).toBeFalsy()
      expect(validateMinLength("abc", 2)).toBeFalsy()
    })

    it("returns a message for invalid input'", () => {
      expect(validateMinLength("", 1)).toEqual("Value must be at least 1 character")
      expect(validateMinLength("abc", 5)).toEqual("Value must be at least 5 characters")
      expect(validateMinLength("abc", 8)).toEqual("Value must be at least 8 characters")
    })
  })

  describe("validatePattern", () => {
    let rxPattern = "^(red|blue)"
    let errorMessage = "Value must follow pattern " + rxPattern

    it("doesn't return for a match", () => {
      expect(validatePattern("red", rxPattern)).toBeFalsy()
      expect(validatePattern("blue", rxPattern)).toBeFalsy()
    })

    it("returns a message for invalid pattern", () => {
      expect(validatePattern("pink", rxPattern)).toEqual(errorMessage)
      expect(validatePattern("123", rxPattern)).toEqual(errorMessage)
    })

    it("fails gracefully when an invalid regex value is passed", () => {
      expect(() => validatePattern("aValue", "---")).not.toThrow()
      expect(() => validatePattern("aValue", 1234)).not.toThrow()
      expect(() => validatePattern("aValue", null)).not.toThrow()
      expect(() => validatePattern("aValue", [])).not.toThrow()
    })
  })

  describe("validateParam", () => {
    let param = null
    let value = null
    let result = null

    const assertValidateParam = (param, value, expectedError) => {
      // Swagger 2.0 version
      result = validateParam( fromJS(param), fromJS(value))
      expect( result ).toEqual( expectedError )

      // OAS3 version, using `schema` sub-object
      let oas3Param = {
        required: param.required,
        schema: {
          ...param,
          required: undefined
        }
      }
      result = validateParam( fromJS(oas3Param), fromJS(value), {
        isOAS3: true
      })
      expect( result ).toEqual( expectedError )
    }

    const assertValidateOas3Param = (param, value, expectedError) => {
      // for cases where you _only_ want to try OAS3
      result = validateParam(fromJS(param), value, {
        isOAS3: true
      })
      expect( result ).toEqual( expectedError )
    }

    it("should check the isOAS3 flag when validating parameters", () => {
      // This should "skip" validation because there is no `schema` property
      // and we are telling `validateParam` this is an OAS3 spec
      param = fromJS({
        required: true
      })
      value = ""
      result = validateParam( param, value, {
        isOAS3: true
      } )
      expect( result ).toEqual( [] )
    })

    it("validates required OAS3 objects", () => {
      // valid object
      param = {
        required: true,
        schema: {
          type: "object"
        }
      }
      value = {
        abc: 123
      }
      assertValidateOas3Param(param, value, [])

      // valid object-as-string
      param = {
        required: true,
        schema: {
          type: "object"
        }
      }
      value = JSON.stringify({
        abc: 123
      })
      assertValidateOas3Param(param, value, [])

      // invalid object-as-string
      param = {
        required: true,
        schema: {
          type: "object"
        }
      }
      value = "{{}"
      assertValidateOas3Param(param, value, ["Parameter string value must be valid JSON"])

      // missing when required
      param = {
        required: true,
        schema: {
          type: "object"
        },
      }
      value = undefined
      assertValidateOas3Param(param, value, ["Required field is not provided"])
    })

    it("validates optional OAS3 objects", () => {
      // valid object
      param = {
        schema: {
          type: "object"
        }
      }
      value = {
        abc: 123
      }
      assertValidateOas3Param(param, value, [])

      // valid object-as-string
      param = {
        schema: {
          type: "object"
        }
      }
      value = JSON.stringify({
        abc: 123
      })
      assertValidateOas3Param(param, value, [])

      // invalid object-as-string
      param = {
        schema: {
          type: "object"
        }
      }
      value = "{{}"
      assertValidateOas3Param(param, value, ["Parameter string value must be valid JSON"])

      // missing when not required
      param = {
        schema: {
          type: "object"
        },
      }
      value = undefined
      assertValidateOas3Param(param, value, [])
    })

    it("validates required strings", () => {
      // invalid string
      param = {
        required: true,
        type: "string"
      }
      value = ""
      assertValidateParam(param, value, ["Required field is not provided"])

      // valid string
      param = {
        required: true,
        type: "string"
      }
      value = "test string"
      assertValidateParam(param, value, [])

      // valid string with min and max length
      param = {
        required: true,
        type: "string",
        maxLength: 50,
        minLength: 1
      }
      value = "test string"
      assertValidateParam(param, value, [])
    })

    it("handles OAS3 `Parameter.content`", () => {
      // invalid string
      param = {
        content: {
          "text/plain": {
            schema: {
              required: true,
              type: "string"
            }
          }
        }
      }
      value = ""
      assertValidateOas3Param(param, value, ["Required field is not provided"])

      // valid string
      param = {
        content: {
          "text/plain": {
            schema: {
              required: true,
              type: "string"
            }
          }
        }
      }
      value = "test string"
      assertValidateOas3Param(param, value, [])


      // invalid (empty) JSON string
      param = {
        content: {
          "application/json": {
            schema: {
              required: true,
              type: "object"
            }
          }
        }
      }
      value = ""
      assertValidateOas3Param(param, value, ["Required field is not provided"])

      // invalid (malformed) JSON string
      param = {
        content: {
          "application/json": {
            schema: {
              required: true,
              type: "object"
            }
          }
        }
      }
      value = "{{}"
      assertValidateOas3Param(param, value, ["Parameter string value must be valid JSON"])


      // valid (empty object) JSON string
      param = {
        content: {
          "application/json": {
            schema: {
              required: true,
              type: "object"
            }
          }
        }
      }
      value = "{}"
      assertValidateOas3Param(param, value, [])

      // valid (empty object) JSON object
      param = {
        content: {
          "application/json": {
            schema: {
              required: true,
              type: "object"
            }
          }
        }
      }
      value = {}
      assertValidateOas3Param(param, value, [])

      // should skip JSON validation for non-JSON media types
      param = {
        content: {
          "application/definitely-not-json": {
            schema: {
              required: true,
              type: "object"
            }
          }
        }
      }
      value = "{{}"
      assertValidateOas3Param(param, value, [])
    })

    it("validates required strings with min and max length", () => {
      // invalid string with max length
      param = {
        required: true,
        type: "string",
        maxLength: 5
      }
      value = "test string"
      assertValidateParam(param, value, ["Value must be no longer than 5 characters"])

      // invalid string with max length 0
      param = {
        required: true,
        type: "string",
        maxLength: 0
      }
      value = "test string"
      assertValidateParam(param, value, ["Value must be no longer than 0 characters"])

      // invalid string with min length
      param = {
        required: true,
        type: "string",
        minLength: 50
      }
      value = "test string"
      assertValidateParam(param, value, ["Value must be at least 50 characters"])
    })

    it("validates optional strings", () => {
      // valid (empty) string
      param = {
        required: false,
        type: "string"
      }
      value = ""
      assertValidateParam(param, value, [])

      // valid string
      param = {
        required: false,
        type: "string"
      }
      value = "test"
      assertValidateParam(param, value, [])
    })

    it("validates required files", () => {
      // invalid file
      param = {
        required: true,
        type: "file"
      }
      value = undefined
      assertValidateParam(param, value, ["Required field is not provided"])

      // valid file
      param = {
        required: true,
        type: "file"
      }
      value = new win.File([""], "file.txt")
      assertValidateParam(param, value, [])
    })

    it("validates optional files", () => {
      // invalid file
      param = {
        required: false,
        type: "file"
      }
      value = "not a file"
      assertValidateParam(param, value, ["Value must be a file"])

      // valid (empty) file
      param = {
        required: false,
        type: "file"
      }
      value = undefined
      assertValidateParam(param, value, [])

      // valid file
      param = {
        required: false,
        type: "file"
      }
      value = new win.File([""], "file.txt")
      assertValidateParam(param, value, [])
    })

    it("validates required arrays", () => {
      // invalid (empty) array
      param = {
        required: true,
        type: "array"
      }
      value = []
      assertValidateParam(param, value, ["Required field is not provided"])

      // invalid (empty) array, represented as a string
      param = {
        required: true,
        type: "array"
      }
      value = ""
      assertValidateParam(param, value, ["Required field is not provided"])

      // invalid (not an array)
      param = {
        required: true,
        type: "array"
      }
      value = undefined
      assertValidateParam(param, value, ["Required field is not provided"])

      // invalid array, items do not match correct type
      param = {
        required: true,
        type: "array",
        items: {
          type: "string"
        }
      }
      value = [1]
      assertValidateParam(param, value, [{index: 0, error: "Value must be a string"}])

      // valid array, with no 'type' for items
      param = {
        required: true,
        type: "array"
      }
      value = [1]
      assertValidateParam(param, value, [])

      // valid array, with no 'type' for items, represented as a string
      param = {
        required: true,
        type: "array"
      }
      value = "[1]"
      assertValidateParam(param, value, [])

      // valid array, items match type
      param = {
        required: true,
        type: "array",
        items: {
          type: "string"
        }
      }
      value = ["1"]
      assertValidateParam(param, value, [])
    })

    it("validates optional arrays", () => {
      // valid, empty array
      param = {
        required: false,
        type: "array"
      }
      value = []
      assertValidateParam(param, value, [])

      // valid, empty array, with validation constraint
      param = {
        required: false,
        schema: {
          type: "array",
          minItems: 1
        }
      }
      value = undefined
      assertValidateOas3Param(param, value, [])

      // invalid, empty array, with minItems validation constraint
      param = {
        required: false,
        schema: {
          type: "array",
          minItems: 2
        }
      }
      value = ["12"]
      assertValidateOas3Param(param, value, ["Array must contain at least 2 items"])

      // valid, valid array with satisfied minItems validation constraint
      param = {
        required: false,
        schema: {
          type: "array",
          minItems: 1
        }
      }
      value = ["probe"]
      assertValidateOas3Param(param, value, [])

      // invalid, items do not match correct type
      param = {
        required: false,
        type: "array",
        items: {
          type: "number"
        }
      }
      value = ["number"]
      assertValidateParam(param, value, [{index: 0, error: "Value must be a number"}])

      // valid
      param = {
        required: false,
        type: "array",
        items: {
          type: "string"
        }
      }
      value = ["test"]
      assertValidateParam(param, value, [])
    })

    it("validates required booleans", () => {
      // invalid boolean value
      param = {
        required: true,
        type: "boolean"
      }
      value = undefined
      assertValidateParam(param, value, ["Required field is not provided"])

      // invalid boolean value (not a boolean)
      param = {
        required: true,
        type: "boolean"
      }
      value = "test string"
      assertValidateParam(param, value, ["Value must be a boolean"])

      // valid boolean value
      param = {
        required: true,
        type: "boolean"
      }
      value = "true"
      assertValidateParam(param, value, [])

      // valid boolean value
      param = {
        required: true,
        type: "boolean"
      }
      value = false
      assertValidateParam(param, value, [])
    })

    it("validates optional booleans", () => {
      // valid (empty) boolean value
      param = {
        required: false,
        type: "boolean"
      }
      value = undefined
      assertValidateParam(param, value, [])

      // invalid boolean value (not a boolean)
      param = {
        required: false,
        type: "boolean"
      }
      value = "test string"
      assertValidateParam(param, value, ["Value must be a boolean"])

      // valid boolean value
      param = {
        required: false,
        type: "boolean"
      }
      value = "true"
      assertValidateParam(param, value, [])

      // valid boolean value
      param = {
        required: false,
        type: "boolean"
      }
      value = false
      assertValidateParam(param, value, [])
    })

    it("validates required numbers", () => {
      // invalid number, string instead of a number
      param = {
        required: true,
        type: "number"
      }
      value = "test"
      assertValidateParam(param, value, ["Value must be a number"])

      // invalid number, undefined value
      param = {
        required: true,
        type: "number"
      }
      value = undefined
      assertValidateParam(param, value, ["Required field is not provided"])

      // valid number with min and max
      param = {
        required: true,
        type: "number",
        minimum: 5,
        maximum: 99
      }
      value = 10
      assertValidateParam(param, value, [])

      // valid negative number with min and max
      param = {
        required: true,
        type: "number",
        minimum: -50,
        maximum: -5
      }
      value = -10
      assertValidateParam(param, value, [])

      // invalid number with maximum:0
      param = {
        required: true,
        type: "number",

        maximum: 0
      }
      value = 1
      assertValidateParam(param, value, ["Value must be less than 0"])

      // invalid number with minimum:0
      param = {
        required: true,
        type: "number",
        minimum: 0
      }
      value = -10
      assertValidateParam(param, value, ["Value must be greater than 0"])
    })

    it("validates optional numbers", () => {
      // invalid number, string instead of a number
      param = {
        required: false,
        type: "number"
      }
      value = "test"
      assertValidateParam(param, value, ["Value must be a number"])

      // valid (empty) number
      param = {
        required: false,
        type: "number"
      }
      value = undefined
      assertValidateParam(param, value, [])

      // valid number
      param = {
        required: false,
        type: "number"
      }
      value = 10
      assertValidateParam(param, value, [])
    })

    it("validates required integers", () => {
      // invalid integer, string instead of an integer
      param = {
        required: true,
        type: "integer"
      }
      value = "test"
      assertValidateParam(param, value, ["Value must be an integer"])

      // invalid integer, undefined value
      param = {
        required: true,
        type: "integer"
      }
      value = undefined
      assertValidateParam(param, value, ["Required field is not provided"])

      // valid integer, but 0 is falsy in JS
      param = {
        required: true,
        type: "integer"
      }
      value = 0
      assertValidateParam(param, value, [])

      // valid integer
      param = {
        required: true,
        type: "integer"
      }
      value = 10
      assertValidateParam(param, value, [])
    })

    it("validates optional integers", () => {
      // invalid integer, string instead of an integer
      param = {
        required: false,
        type: "integer"
      }
      value = "test"
      assertValidateParam(param, value, ["Value must be an integer"])

      // valid (empty) integer
      param = {
        required: false,
        type: "integer"
      }
      value = undefined
      assertValidateParam(param, value, [])

      // integers
      param = {
        required: false,
        type: "integer"
      }
      value = 10
      assertValidateParam(param, value, [])
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

  describe("createDeepLinkPath", () => {
    it("creates a deep link path replacing spaces with underscores", () => {
      const result = createDeepLinkPath("tag id with spaces")
      expect(result).toEqual("tag%20id%20with%20spaces")
    })

    it("trims input when creating a deep link path", () => {
      let result = createDeepLinkPath("  spaces before and after    ")
      expect(result).toEqual("spaces%20before%20and%20after")

      result = createDeepLinkPath("  ")
      expect(result).toEqual("")
    })

    it("creates a deep link path with special characters", () => {
      const result = createDeepLinkPath("!@#$%^&*(){}[]")
      expect(result).toEqual("!@#$%^&*(){}[]")
    })

    it("returns an empty string for invalid input", () => {
      expect( createDeepLinkPath(null) ).toEqual("")
      expect( createDeepLinkPath(undefined) ).toEqual("")
      expect( createDeepLinkPath(1) ).toEqual("")
      expect( createDeepLinkPath([]) ).toEqual("")
      expect( createDeepLinkPath({}) ).toEqual("")
    })
  })

  describe("escapeDeepLinkPath", () => {
    it("creates and escapes a deep link path", () => {
      const result = escapeDeepLinkPath("tag id with spaces?")
      expect(result).toEqual("tag_id_with_spaces\\?")
    })

    it("escapes a deep link path that starts with a number", () => {
      const result = escapeDeepLinkPath("123")
      expect(result).toEqual("\\31 23")
    })

    it("escapes a deep link path with a class selector", () => {
      const result = escapeDeepLinkPath("hello.world")
      expect(result).toEqual("hello\\.world")
    })

    it("escapes a deep link path with an id selector", () => {
      const result = escapeDeepLinkPath("hello#world")
      expect(result).toEqual("hello\\#world")
    })

    it("escapes a deep link path with a space", () => {
      const result = escapeDeepLinkPath("hello world")
      expect(result).toEqual("hello_world")
    })

    it("escapes a deep link path with a percent-encoded space", () => {
      const result = escapeDeepLinkPath("hello%20world")
      expect(result).toEqual("hello_world")
    })
  })

  describe("getExtensions", () => {
    const objTest = Map([[ "x-test", "a"], ["minimum", "b"]])
    it("does not error on empty array", () => {
      const result1 = getExtensions([])
      expect(result1).toEqual([])
      const result2 = getCommonExtensions([])
      expect(result2).toEqual([])
    })
    it("gets only the x- keys", () => {
      const result = getExtensions(objTest)
      expect(result).toEqual(Map([[ "x-test", "a"]]))
    })
    it("gets the common keys", () => {
      const result = getCommonExtensions(objTest, true)
      expect(result).toEqual(Map([[ "minimum", "b"]]))
    })
  })

  describe("deeplyStripKey", () => {
    it("should filter out a specified key", () => {
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

    it("should filter out a specified key by predicate", () => {
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

    it("should only call the predicate when the key matches", () => {
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

  describe("parse and serialize search", () => {
    beforeEach(() => {
      // jsdom in Jest 25+ prevents modifying window.location,
      // so we replace with a stubbed version
      delete win.location
      win.location = {
        search: ""
      }
    })
    afterEach(() => {
      win.location.search = ""
    })

    describe("parsing", () => {
      it("works with empty search", () => {
        win.location.search = ""
        expect(parseSearch()).toEqual({})
      })

      it("works with only one key", () => {
        win.location.search = "?foo"
        expect(parseSearch()).toEqual({foo: ""})
      })

      it("works with keys and values", () => {
        win.location.search = "?foo=fooval&bar&baz=bazval"
        expect(parseSearch()).toEqual({foo: "fooval", bar: "", baz: "bazval"})
      })

      it("decode url encoded components", () => {
        win.location.search = "?foo=foo%20bar"
        expect(parseSearch()).toEqual({foo: "foo bar"})
      })
    })

    describe("serializing", () => {
      it("works with empty map", () => {
        expect(serializeSearch({})).toEqual("")
      })

      it("works with multiple keys with and without values", () => {
        expect(serializeSearch({foo: "", bar: "barval"})).toEqual("foo=&bar=barval")
      })

      it("encode url components", () => {
        expect(serializeSearch({foo: "foo bar"})).toEqual("foo=foo%20bar")
      })
    })
  })

  describe("sanitizeUrl", () => {
    it("should sanitize a `javascript:` url", () => {
      const res = sanitizeUrl("javascript:alert('bam!')")

      expect(res).toEqual("about:blank")
    })

    it("should sanitize a `data:` url", () => {
      const res = sanitizeUrl(`data:text/html;base64,PHNjcmlwdD5hbGVydCgiSGVsbG8iKTs8L3NjcmlwdD4=`)

      expect(res).toEqual("about:blank")
    })

    it("should not modify a `http:` url", () => {
      const res = sanitizeUrl(`http://swagger.io/`)

      expect(res).toEqual("http://swagger.io/")
    })

    it("should not modify a `https:` url", () => {
      const res = sanitizeUrl(`https://swagger.io/`)

      expect(res).toEqual("https://swagger.io/")
    })

    it("should gracefully handle empty strings", () => {
      expect(sanitizeUrl("")).toEqual("")
    })

    it("should gracefully handle non-string values", () => {
      expect(sanitizeUrl(123)).toEqual("")
      expect(sanitizeUrl(null)).toEqual("")
      expect(sanitizeUrl(undefined)).toEqual("")
      expect(sanitizeUrl([])).toEqual("")
      expect(sanitizeUrl({})).toEqual("")
    })
  })

  describe("isAbsoluteUrl", () => {

    it("check if url is absolute", () => {
      expect(!!isAbsoluteUrl("http://example.com")).toEqual(true)
      expect(!!isAbsoluteUrl("https://secure-example.com")).toEqual(true)
      expect(!!isAbsoluteUrl("HTTP://uppercase-example.com")).toEqual(true)
      expect(!!isAbsoluteUrl("HTTP://uppercase-secure-example.com")).toEqual(true)
      expect(!!isAbsoluteUrl("http://trailing-slash.com/")).toEqual(true)
      expect(!!isAbsoluteUrl("ftp://file-transfer-protocol.com")).toEqual(true)
      expect(!!isAbsoluteUrl("//no-protocol.com")).toEqual(true)
    })

    it("check if url is not absolute", () => {
      expect(!!isAbsoluteUrl("/url-relative-to-host/base-path/path")).toEqual(false)
      expect(!!isAbsoluteUrl("url-relative-to-base/base-path/path")).toEqual(false)
    })
  })

  describe("buildBaseUrl", () => {
    const specUrl = "https://petstore.swagger.io/v2/swagger.json"

    const noServerSelected = ""
    const absoluteServerUrl = "https://server-example.com/base-path/path"
    const serverUrlRelativeToBase = "server-example/base-path/path"
    const serverUrlRelativeToHost = "/server-example/base-path/path"

    it("build base url with no server selected", () => {
      expect(buildBaseUrl(noServerSelected, specUrl)).toBe("https://petstore.swagger.io/v2/swagger.json")
    })

    it("build base url from absolute server url", () => {
      expect(buildBaseUrl(absoluteServerUrl, specUrl)).toBe("https://server-example.com/base-path/path")
    })

    it("build base url from relative server url", () => {
      expect(buildBaseUrl(serverUrlRelativeToBase, specUrl)).toBe("https://petstore.swagger.io/v2/server-example/base-path/path")
      expect(buildBaseUrl(serverUrlRelativeToHost, specUrl)).toBe("https://petstore.swagger.io/server-example/base-path/path")
    })
  })

  describe("buildUrl", () => {
    const { location } = window
    beforeAll(() => {
      delete window.location
      window.location = {
        href: "http://localhost/",
      }
    })
    afterAll(() => {
      window.location = location
    })

    const specUrl = "https://petstore.swagger.io/v2/swagger.json"

    const noUrl = ""
    const absoluteUrl = "https://example.com/base-path/path"
    const urlRelativeToBase = "relative-url/base-path/path"
    const urlRelativeToHost = "/relative-url/base-path/path"

    const noServerSelected = ""
    const absoluteServerUrl = "https://server-example.com/base-path/path"
    const serverUrlRelativeToBase = "server-example/base-path/path"
    const serverUrlRelativeToHost = "/server-example/base-path/path"
    const serverUrlWithVariables = "https://api.example.com:{port}/{basePath}"

    const specUrlAsInvalidUrl = "./examples/test.yaml"
    const specUrlOas2NonUrlString = "an allowed OAS2 TermsOfService description string"

    it("build no url", () => {
      expect(buildUrl(noUrl, specUrl, { selectedServer: absoluteServerUrl })).toBe(undefined)
      expect(buildUrl(noUrl, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe(undefined)
      expect(buildUrl(noUrl, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe(undefined)
    })

    it("build absolute url", () => {
      expect(buildUrl(absoluteUrl, specUrl, { selectedServer: absoluteServerUrl })).toBe("https://example.com/base-path/path")
      expect(buildUrl(absoluteUrl, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe("https://example.com/base-path/path")
      expect(buildUrl(absoluteUrl, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe("https://example.com/base-path/path")
    })

    it("build relative url with no server selected", () => {
      expect(buildUrl(urlRelativeToBase, specUrl, { selectedServer: noServerSelected })).toBe("https://petstore.swagger.io/v2/relative-url/base-path/path")
      expect(buildUrl(urlRelativeToHost, specUrl, { selectedServer: noServerSelected })).toBe("https://petstore.swagger.io/relative-url/base-path/path")
    })

    it("build relative url with absolute server url", () => {
      expect(buildUrl(urlRelativeToBase, specUrl, { selectedServer: absoluteServerUrl })).toBe("https://server-example.com/base-path/relative-url/base-path/path")
      expect(buildUrl(urlRelativeToHost, specUrl, { selectedServer: absoluteServerUrl })).toBe("https://server-example.com/relative-url/base-path/path")
    })

    it("build relative url with server url relative to base", () => {
      expect(buildUrl(urlRelativeToBase, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe("https://petstore.swagger.io/v2/server-example/base-path/relative-url/base-path/path")
      expect(buildUrl(urlRelativeToHost, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe("https://petstore.swagger.io/relative-url/base-path/path")
    })

    it("build relative url with server url relative to host", () => {
      expect(buildUrl(urlRelativeToBase, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe("https://petstore.swagger.io/server-example/base-path/relative-url/base-path/path")
      expect(buildUrl(urlRelativeToHost, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe("https://petstore.swagger.io/relative-url/base-path/path")
    })

    it("build relative url when no servers defined AND specUrl is invalid Url", () => {
      expect(buildUrl(urlRelativeToHost, specUrlAsInvalidUrl, { selectedServer: noServerSelected })).toBe("http://localhost/relative-url/base-path/path")
    })

    it("build relative url when no servers defined AND specUrl is OAS2 non-url string", () => {
      expect(buildUrl(urlRelativeToHost, specUrlOas2NonUrlString, { selectedServer: noServerSelected })).toBe("http://localhost/relative-url/base-path/path")
    })

    it("throws error when server url contains non-transcluded server variables", () => {
      const buildUrlThunk = () => buildUrl(urlRelativeToHost, specUrl, { selectedServer: serverUrlWithVariables })

      expect(buildUrlThunk).toThrow(/^Invalid base URL/)
    })
  })

  describe("safeBuildUrl", () => {
    const { location } = window
    beforeAll(() => {
      delete window.location
      window.location = {
        href: "http://localhost/",
      }
    })
    afterAll(() => {
      window.location = location
    })

    const specUrl = "https://petstore.swagger.io/v2/swagger.json"

    const noUrl = ""
    const absoluteUrl = "https://example.com/base-path/path"
    const urlRelativeToBase = "relative-url/base-path/path"
    const urlRelativeToHost = "/relative-url/base-path/path"

    const noServerSelected = ""
    const absoluteServerUrl = "https://server-example.com/base-path/path"
    const serverUrlRelativeToBase = "server-example/base-path/path"
    const serverUrlRelativeToHost = "/server-example/base-path/path"
    const serverUrlWithVariables = "https://api.example.com:{port}/{basePath}"

    const specUrlAsInvalidUrl = "./examples/test.yaml"
    const specUrlOas2NonUrlString = "an allowed OAS2 TermsOfService description string"

    it("build no url", () => {
      expect(safeBuildUrl(noUrl, specUrl, { selectedServer: absoluteServerUrl })).toBe(undefined)
      expect(safeBuildUrl(noUrl, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe(undefined)
      expect(safeBuildUrl(noUrl, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe(undefined)
    })

    it("build absolute url", () => {
      expect(safeBuildUrl(absoluteUrl, specUrl, { selectedServer: absoluteServerUrl })).toBe("https://example.com/base-path/path")
      expect(safeBuildUrl(absoluteUrl, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe("https://example.com/base-path/path")
      expect(safeBuildUrl(absoluteUrl, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe("https://example.com/base-path/path")
    })

    it("build relative url with no server selected", () => {
      expect(safeBuildUrl(urlRelativeToBase, specUrl, { selectedServer: noServerSelected })).toBe("https://petstore.swagger.io/v2/relative-url/base-path/path")
      expect(safeBuildUrl(urlRelativeToHost, specUrl, { selectedServer: noServerSelected })).toBe("https://petstore.swagger.io/relative-url/base-path/path")
    })

    it("build relative url with absolute server url", () => {
      expect(safeBuildUrl(urlRelativeToBase, specUrl, { selectedServer: absoluteServerUrl })).toBe("https://server-example.com/base-path/relative-url/base-path/path")
      expect(safeBuildUrl(urlRelativeToHost, specUrl, { selectedServer: absoluteServerUrl })).toBe("https://server-example.com/relative-url/base-path/path")
    })

    it("build relative url with server url relative to base", () => {
      expect(safeBuildUrl(urlRelativeToBase, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe("https://petstore.swagger.io/v2/server-example/base-path/relative-url/base-path/path")
      expect(safeBuildUrl(urlRelativeToHost, specUrl, { selectedServer: serverUrlRelativeToBase })).toBe("https://petstore.swagger.io/relative-url/base-path/path")
    })

    it("build relative url with server url relative to host", () => {
      expect(safeBuildUrl(urlRelativeToBase, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe("https://petstore.swagger.io/server-example/base-path/relative-url/base-path/path")
      expect(safeBuildUrl(urlRelativeToHost, specUrl, { selectedServer: serverUrlRelativeToHost })).toBe("https://petstore.swagger.io/relative-url/base-path/path")
    })

    it("build relative url when no servers defined AND specUrl is invalid Url", () => {
      expect(safeBuildUrl(urlRelativeToHost, specUrlAsInvalidUrl, { selectedServer: noServerSelected })).toBe("http://localhost/relative-url/base-path/path")
    })

    it("build relative url when no servers defined AND specUrl is OAS2 non-url string", () => {
      expect(safeBuildUrl(urlRelativeToHost, specUrlOas2NonUrlString, { selectedServer: noServerSelected })).toBe("http://localhost/relative-url/base-path/path")
    })

    it("build no url when server url contains non-transcluded server variables", () => {
      expect(safeBuildUrl(urlRelativeToHost, specUrl, { selectedServer: serverUrlWithVariables })).toBe(undefined)
    })
  })

  describe("requiresValidationURL", () => {
    it("Should tell us if we require a ValidationURL", () => {
      const res = requiresValidationURL("https://example.com")

      expect(res).toBe(true)
    })

    it(".. and localhost is not", () => {
      const res = requiresValidationURL("http://localhost")

      expect(res).toBe(false)
    })

    it(".. and neither does 127.0.0.1", () => {
      const res = requiresValidationURL("http://127.0.0.1")

      expect(res).toBe(false)
    })

    it(".. even without the proto", () => {
      const res = requiresValidationURL("127.0.0.1")

      expect(res).toBe(false)
    })

    it(".. and also not with 'none'", () => {
      const res = requiresValidationURL("none")

      expect(res).toBe(false)
    })

    it(".. and also not with 'none'", () => {
      const res = requiresValidationURL("none")

      expect(res).toBe(false)
    })

    it(".. and also not with ''", () => {
      const res = requiresValidationURL("")

      expect(res).toBe(false)
    })

  })

  describe("getSampleSchema", () => {
    const oriDate = Date

    beforeEach(() => {
      Date = function () {
        this.toISOString = function () {
          return "2018-07-07T07:07:05.189Z"
        }
      }
    })

    afterEach(() => {
      Date = oriDate
    })

    it("should stringify string values if json content-type", () => {
      // Given
      const res = getSampleSchema({
        type: "string",
        format: "date-time"
      }, "text/json")

      // Then
      expect(res).toEqual(JSON.stringify(new Date().toISOString()))
    })

    it("should not unnecessarily stringify string values for other content-types", () => {
      // Given
      const res = getSampleSchema({
        type: "string",
        format: "date-time"
      })

      // Then
      expect(res).toEqual(new Date().toISOString())
    })

    it("should not unnecessarily stringify non-object values", () => {
      // Given
      const res = getSampleSchema({
        type: "number"
      })

      // Then
      expect(res).toEqual(0)
    })

    it("should not unnecessarily stringify non-object values if content-type is json", () => {
      // Given
      const res = getSampleSchema({
        type: "number"
      }, "application/json")

      // Then
      expect(res).toEqual(0)
    })

    it("should stringify object when literal string example is provided if json content-type", () => {
      // Given
      const expected = "<MyObject></MyObject>"
      const res = getSampleSchema({
        type: "object",
      }, "text/json", {}, expected)

      // Then
      expect(res).toEqual(JSON.stringify(expected))
    })

    it("should parse valid json literal example if json content-type", () => {
      // Given
      const expected = {test: 123}
      const res = getSampleSchema({
        type: "object",
      }, "text/json", {}, JSON.stringify(expected))

      // Then
      const actual = JSON.parse(res)
      expect(actual.test).toEqual(123)
    })

    it("should handle number example with string schema as string", () => {
      // Given
      const expected = 123
      const res = getSampleSchema({
        type: "string",
      }, "text/json", {}, expected)

      // Then
      const actual = JSON.parse(res)
      expect(actual).toEqual("123")
    })

    it("should handle number literal example with string schema as string", () => {
      // Given
      const expected = "123"
      const res = getSampleSchema({
        type: "string",
      }, "text/json", {}, expected)

      // Then
      const actual = JSON.parse(res)
      expect(actual).toEqual("123")
    })

    it("should handle number literal example with number schema as number", () => {
      // Given
      const expected = "123"
      const res = getSampleSchema({
        type: "number",
      }, "text/json", {}, expected)

      // Then
      const actual = JSON.parse(res)
      expect(actual).toEqual(123)
    })

    it("should return yaml example if yaml is contained in the content-type", () => {
      const res = getSampleSchema({
        type: "object",
      }, "text/yaml", {}, {test: 123})

      expect(res).toEqual("test: 123")
    })

    it("should return yaml example if yml is contained in the content-type", () => {
      const res = getSampleSchema({
        type: "object",
      }, "text/yml", {}, {test: 123})

      expect(res).toEqual("test: 123")
    })
  })

  describe("paramToIdentifier", () => {
    it("should convert an Immutable parameter map to an identifier", () => {
      const param = fromJS({
        name: "id",
        in: "query"
      })
      const res = paramToIdentifier(param)

      expect(res).toEqual("query.id.hash-606199662")
    })
    it("should convert an Immutable parameter map to a set of identifiers", () => {
      const param = fromJS({
        name: "id",
        in: "query"
      })
      const res = paramToIdentifier(param, { returnAll: true })

      expect(res).toEqual([
        "query.id.hash-606199662",
        "query.id",
        "id"
      ])
    })

    it("should convert an unhashable Immutable parameter map to an identifier", () => {
      const param = fromJS({
        name: "id",
        in: "query"
      })

      param.hashCode = null

      const res = paramToIdentifier(param)

      expect(res).toEqual("query.id")
    })

    it("should convert an unhashable Immutable parameter map to a set of identifiers", () => {
      const param = fromJS({
        name: "id",
        in: "query"
      })

      param.hashCode = null

      const res = paramToIdentifier(param, { returnAll: true })

      expect(res).toEqual([
        "query.id",
        "id"
      ])
    })

    it("should convert an Immutable parameter map lacking an `in` value to an identifier", () => {
      const param = fromJS({
        name: "id"
      })

      const res = paramToIdentifier(param)

      expect(res).toEqual("id")
    })

    it("should convert an Immutable parameter map lacking an `in` value to an identifier", () => {
      const param = fromJS({
        name: "id"
      })

      const res = paramToIdentifier(param, { returnAll: true })

      expect(res).toEqual(["id"])
    })

    it("should throw gracefully when given a non-Immutable parameter input", () => {
      const param = {
        name: "id"
      }

      let error = null
      let res = null

      try {
        const res = paramToIdentifier(param)
      } catch(e) {
        error = e
      }

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain("received a non-Im.Map parameter as input")
      expect(res).toEqual(null)
    })
  })

  describe("paramToValue", () => {
    it("should identify a hash-keyed value", () => {
      const param = fromJS({
        name: "id",
        in: "query"
      })

      const paramValues = {
        "query.id.hash-606199662": "asdf"
      }

      const res = paramToValue(param, paramValues)

      expect(res).toEqual("asdf")
    })

    it("should identify a in+name value", () => {
      const param = fromJS({
        name: "id",
        in: "query"
      })

      const paramValues = {
        "query.id": "asdf"
      }

      const res = paramToValue(param, paramValues)

      expect(res).toEqual("asdf")
    })

    it("should identify a name value", () => {
      const param = fromJS({
        name: "id",
        in: "query"
      })

      const paramValues = {
        "id": "asdf"
      }

      const res = paramToValue(param, paramValues)

      expect(res).toEqual("asdf")
    })
  })

  describe("generateCodeVerifier", () => {
    it("should generate a value of at least 43 characters", () => {
      const codeVerifier = generateCodeVerifier()

      // Source: https://tools.ietf.org/html/rfc7636#section-4.1
      expect(codeVerifier.length).toBeGreaterThanOrEqual(43)
    })
  })

  describe("createCodeChallenge", () => {
    it("should hash the input using SHA256 and output the base64 url encoded value", () => {
      // The `codeVerifier` has been randomly generated
      const codeVerifier = "cY8OJ9MKvZ7hxQeIyRYD7KFmKA5znSFJ2rELysvy2UI"

      // This value is the `codeVerifier` hashed using SHA256, which has been
      // encoded using base64 url format.
      // Source: https://tools.ietf.org/html/rfc7636#section-4.2
      const expectedCodeChallenge = "LD9lx2p2PbvGkojuJy7-Elex7RnckzmqR7oIXjd4u84"

      expect(createCodeChallenge(codeVerifier)).toBe(expectedCodeChallenge)
    })
  })
})
