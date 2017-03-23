/* eslint-env mocha */
import expect from "expect"
import { transformPathToArray } from "core/path-translator"

describe("validation plugin - path translator", function(){

  describe("string paths", function(){

    it("should translate a simple string path to an array", function(){
      // Given
      let jsSpec = {
        one: {
          a: "a thing",
          b: "another thing",
          c: "one more thing"
        },
        two: 2
      }

      let path = "instance.one.a"

      // Then
      expect(transformPathToArray(path, jsSpec)).toEqual(["one", "a"])

    })

    it("should translate an ambiguous string path to an array", function(){
      // Since JSONSchema uses periods to mark different properties,
      // a key with a period in it is ambiguous, because it can mean at least two things.
      // In our case, the path can mean:
      // ["google", "com", "a"] or ["google.com", "a"]

      // Given
      let jsSpec = {
        "google.com": {
          a: "a thing",
          b: "another thing",
          c: "one more thing"
        },
        "gmail.com": {
          d: "more stuff",
          e: "even more stuff"
        }
      }

      let path = "instance.google.com.a"

      // Then
      expect(transformPathToArray(path, jsSpec)).toEqual(["google.com", "a"])

    })

    it("should translate an doubly ambiguous string path to an array", function(){
      // Since JSONSchema uses periods to mark different properties,
      // a key with two periods in it (like "www.google.com") is doubly ambiguous,
      // because it can mean at least three things.


      // Given
      let jsSpec = {
        "www.google.com": {
          a: "a thing",
          b: "another thing",
          c: "one more thing"
        },
        "gmail.com": {
          d: "more stuff",
          e: "even more stuff"
        }
      }

      let path = "instance.www.google.com.a"

      // Then
      expect(transformPathToArray(path, jsSpec)).toEqual(["www.google.com", "a"])

    })

    it("should return null for an invalid path", function(){

      // Given
      let jsSpec = {
        "google.com": {
          a: "a thing",
          b: "another thing",
          c: "one more thing"
        },
        "gmail.com": {
          d: "more stuff",
          e: "even more stuff"
        }
      }

      let path = "instance.google.net.a"

      // Then
      expect(transformPathToArray(path, jsSpec)).toEqual(null)

    })

    it("should return inline array indices in their own value", function(){
      // "a[1]" => ["a", "1"]

      // Given
      let jsSpec = {
        "google.com": {
          a: [
            "hello",
            "here is the target"
          ],
          b: "another thing",
          c: "one more thing"
        },
        "gmail.com": {
          d: "more stuff",
          e: "even more stuff"
        }
      }

      let path = "instance.google.com.a[1]"

      // Then
      expect(transformPathToArray(path, jsSpec)).toEqual(["google.com", "a", "1"])

    })

    it("should return the correct path when the last part is ambiguous", function(){

      // Given
      let jsSpec = {
        "google.com": {
          a: [
            "hello",
            {
              "gmail.com": 1234
            }
          ],
          b: "another thing",
          c: "one more thing"
        },
        "gmail.com": {
          d: "more stuff",
          e: "even more stuff"
        }
      }

      let path = "instance.google.com.a[1].gmail.com"

      // Then
      expect(transformPathToArray(path, jsSpec)).toEqual(["google.com", "a", "1", "gmail.com"])

    })

    it("should return the correct path when the last part is doubly ambiguous", function(){

      // Given
      let jsSpec = {
        "google.com": {
          a: [
            "hello",
            {
              "www.gmail.com": 1234
            }
          ],
          b: "another thing",
          c: "one more thing"
        },
        "gmail.com": {
          d: "more stuff",
          e: "even more stuff"
        }
      }

      let path = "instance.google.com.a[1].www.gmail.com"

      // Then
      expect(transformPathToArray(path, jsSpec)).toEqual(["google.com", "a", "1", "www.gmail.com"])

    })

  })

})
