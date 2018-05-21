import expect from "expect"
import manipHtmlStr from "../../src/core/plugins/deep-linking/manipHtmlStr.js"



describe("manipHtmlStr", function() {
    const callback = function(elem) {
        elem.removeAttribute("target")
    }
    it("removes target=_blank from anchor in an html string", function() {
        const str = "<p><a target='_blank'>link</a></p>"
        const correctVal = "<p><a>link</a></p>"
        const testVal = manipHtmlStr(str, "a", callback)
        expect(testVal).toEqual(correctVal)
    })
    it("removes target=_blank from anchor in an html string while that anchor has siblings", function() {
      const str = "<p><a target='_blank'>link</a>works with<a href='https://www.google.com/'>google</a></p>"
      const correctVal = '<p><a>link</a>works with<a href="https://www.google.com/">google</a></p>'
      const testVal = manipHtmlStr(str, "a", callback)
      expect(testVal).toEqual(correctVal)
    })
    it("throws an exception when a string isn't passed for htmlStr", function() {
      const errMsg = "A string needs to be passed for htmlStr"
      expect(() => {
        manipHtmlStr(1, "a", callback)
      }).toThrow(errMsg)
    })
    it("throws an exception when a string isn't passed for selector", function() {
      const errMsg = "A string needs to be passed for selector"
      const htmlStr = "<img />"
      expect(() => {
        manipHtmlStr(htmlStr, 1, callback)
      }).toThrow(errMsg)
    })
    it("throws an exception when a function object isn't passed for the callback parameter", function() {
      const errMsg = "A function object needs to be passed for the callback parameter"
      const htmlStr = "<img />"
      expect(() => {
        manipHtmlStr(htmlStr, "a", 1)
      }).toThrow(errMsg)
    })
    it("throws an exception when not passed valid html", function() {
      const errMsg = "Valid html was not passed"
      const htmlStr = "<img"
      expect(() => {
        manipHtmlStr(htmlStr, "a", callback)
      }).toThrow(errMsg)
    })
})
