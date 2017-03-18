/* eslint-env mocha */
import expect from "expect"
import { pathForPosition, positionRangeForPath } from "corePlugins/ast/ast"

describe.skip("ASTManager", function() {
  describe("#pathForPosition", function() {
    describe("out of range", function() {
      it("returns empty array for out of range row", function(done) {
        var position = {line: 3, column: 0}
        var assertPath = function(path) {
          expect(path).toEqual([])
          done()
        }

        pathForPosition("swagger: 2.0", position)
        .then(assertPath)
      })

      it("returns empty array for out of range column", function(done) {
        var position = {line: 0, column: 100}
        var assertPath = function(path) {
          expect(path).toEqual([])
          done()
        }

        pathForPosition("swagger: 2.0", position)
        .then(assertPath)
      })
    })

    describe("when document is a simple hash `swagger: 2.0`", function() {
      it("should return empty array when pointer is at middle of the hash key", function(done) {
        var position = {line: 0, column: 3}
        pathForPosition("swagger: 2.0", position).then(function(path) {
          expect(path).toEqual([])
          done()
        })
      })

      it("should return ['swagger'] when pointer is at the value", function(done) {
        var position = {line: 0, column: 10}
        pathForPosition("swagger: 2.0", position).then(function(path) {
          expect(path).toEqual(["swagger"])
          done()
        })
      })
    })

    describe("when document is an array: ['abc', 'cde']", function() {
      var yaml = [
        /*
        0
        01234567 */
        /* 0 */ "- abc",
        /* 1 */ "- def"
      ].join("\n")

      it("should return empty array when pointer is at array dash", function(done) {
        var position = {line: 0, column: 0}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual([])
          done()
        })
      })

      it("should return ['0'] when pointer is at abc", function(done) {
        var position = {line: 0, column: 3}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual(["0"])
          done()
        })
      })

      it("should return ['1'] when pointer is at abc", function(done) {
        var position = {line: 1, column: 3}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual(["1"])
          done()
        })
      })
    })

    describe("when document is an array of arrays", function() {
      var yaml = [
        /*
        0         10
        0123456789012345 */
        /* 0 */ "-",
        /* 1 */ " - abc",
        /* 2 */ " - def",
        /* 3 */ "-",
        /* 4 */ " - ABC",
        /* 5 */ " - DEF"
      ].join("\n")

      it("should return ['0', '0'] when pointer is at 'abc'", function(done) {
        var position = {line: 1, column: 5}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual(["0", "0"])
          done()
        })
      })
    })

    describe("when document is an array of hashs", function() {
      var yaml = [
        /*
        0         10
        0123456789012345 */
        /* 0 */ "- key: value",
        /* 1 */ "  num: 1",
        /* 2 */ "- name: Tesla",
        /* 3 */ "  year: 2016"
      ].join("\n")

      it("should return ['0'] when pointer is at 'key'", function(done) {
        var position = {line: 0, column: 3}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual(["0"])
          done()
        })
      })

      it("should return ['0', 'key'] when pointer is at 'value'", function(done) {
        var position = {line: 0, column: 9}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual(["0", "key"])
          done()
        })
      })

      it("should return ['1', 'year'] when pointer is at '2016'", function(done) {
        var position = {line: 3, column: 10}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual(["1", "year"])
          done()
        })
      })
    })

    describe("full document", function() {
      var yaml = [
        /*
        0         10        20        30
        012345678901234567890123456789012345678 */
        /* 0 */ "swagger: '2.0'",
        /* 1 */ "info:",
        /* 2 */ "  title: Test document",
        /* 3 */ "  version: 0.0.1",
        /* 4 */ "  contact:",
        /* 5 */ "    name: Sahar",
        /* 6 */ "    url: github.com",
        /* 7 */ "    email: me@example.com",
        /* 8 */ "                         "
      ].join("\n")

      it("should return ['info', 'contact', 'email'] when pointer is at me@", function(done) {
        var position = {line: 7, column: 13}
        pathForPosition(yaml, position).then(function(path) {
          expect(path).toEqual(["info", "contact", "email"])
          done()
        })
      })
    })

  })

  describe("#positionRangeForPath", function() {
    it("return {{-1, -1}, {-1, -1}} for invalid paths", function(done) {
      var yaml = [
        "key: value",
        "anotherKey: value"
      ].join("\n")

      positionRangeForPath(yaml, ["invalid"])
      .then(function(position) {
        expect(position.start).toEqual({line: -1, column: -1})
        expect(position.end).toEqual({line: -1, column: -1})
        done()
      })
    })

    describe("when document is a simple hash `swagger: 2.0`", function() {
      var yaml = "swagger: 2.0"

      it("return {0, 0} for start of empty array path (root)", function(done) {
        positionRangeForPath(yaml, []).then(function(position) {
          expect(position.start).toEqual({line: 0, column: 0})
          done()
        })
      })

      it("return {0, 12} for end of empty array path (root)", function(done) {
        positionRangeForPath(yaml, []).then(function(position) {
          expect(position.end).toEqual({line: 0, column: 12})
          done()
        })
      })

      it("return {0, 9} for start of ['swagger']", function(done) {
        positionRangeForPath(yaml, ["swagger"]).then(function(position) {
          expect(position.start).toEqual({line: 0, column: 9})
          done()
        })
      })

      it("return {0, 12} for end of ['swagger']", function(done) {
        positionRangeForPath(yaml, ["swagger"]).then(function(position) {
          expect(position.end).toEqual({line: 0, column: 12})
          done()
        })
      })
    })

    describe("when document is an array of primitives", function() {
      var yaml = [
        "key:",
        "  - value1",
        "  - value2"
      ].join("\n")

      it("returns {1, 4} for ['key', '0']", function(done) {
        positionRangeForPath(yaml, ["key", "0"]).then(function(position) {
          expect(position.start).toEqual({line: 1, column: 4})
          done()
        })
      })
    })

    describe("full document", function() {
      var yaml = [
        /*
        0         10        20        30
        012345678901234567890123456789012345678 */
        /* 0 */ "swagger: '2.0'",
        /* 1 */ "info:",
        /* 2 */ "  title: Test document",
        /* 3 */ "  version: 0.0.1",
        /* 4 */ "  contact:",
        /* 5 */ "    name: Sahar",
        /* 6 */ "    url: github.com",
        /* 7 */ "    email: me@example.com",
        /* 8 */ "                         "
      ].join("\n")

      it("returns {2, 2} for start of ['info']", function(done) {
        positionRangeForPath(yaml, ["info"]).then(function(position) {
          expect(position.start).toEqual({line: 2, column: 2})
          done()
        })
      })

      it("returns {5, 10} for start of ['info', 'contact', 'name']", function(done) {
        positionRangeForPath(yaml, ["info", "contact", "name"]).then(function(position) {
          expect(position.start).toEqual({line: 5, column: 10})
          done()
        })
      })

      it("returns {5, 15} for end of ['info', 'contact', 'name']", function(done) {
        positionRangeForPath(yaml, ["info", "contact", "name"]).then(function(position) {
          expect(position.end).toEqual({line: 5, column: 15})
          done()
        })
      })
    })
  })
})
