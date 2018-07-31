import expect from "expect"
import modifyHtmlElems from "../../src/core/plugins/deep-linking/modifyHtmlElems.js"



describe("modifyHtmlElems", function() {
    const callback = function(anchor) {
        const removedTrgtBlnk = anchor.replace(" target='_blank'", "")
        return removedTrgtBlnk
    }
    it("removes target=_blank from anchor in an html string", function() {
        const str = "<p><a target='_blank'>link</a></p>"
        const correctVal = "<p><a>link</a></p>"
        const testVal = modifyHtmlElems(str, "a", callback)
        expect(testVal).toEqual(correctVal)
    })
    it("removes target=_blank from anchor in an html string while that anchor has siblings", function() {
      const str = "<p><a target='_blank'>link</a>works with<a href='https://www.google.com/'>google</a></p>"
      const correctVal = "<p><a>link</a>works with<a href='https://www.google.com/'>google</a></p>"
      const testVal = modifyHtmlElems(str, "a", callback)
      expect(testVal).toEqual(correctVal)
    })
    it("throws an exception when a string isn't passed for htmlStr", function() {
      const errMsg = "A string needs to be passed for htmlStr"
      expect(() => {
        modifyHtmlElems(1, "a", callback)
      }).toThrow(errMsg)
    })
    it("throws an exception when a string isn't passed for elemName", function() {
      const errMsg = "A string needs to be passed for elemName"
      const htmlStr = "<img />"
      expect(() => {
        modifyHtmlElems(htmlStr, 1, callback)
      }).toThrow(errMsg)
    })
    it("throws an exception when a function object isn't passed for the callback parameter", function() {
      const errMsg = "A function object needs to be passed for the callback parameter"
      const htmlStr = "<img />"
      expect(() => {
        modifyHtmlElems(htmlStr, "a", 1)
      }).toThrow(errMsg)
    })
    it("throws an exception when not passed valid html", function() {
      const errMsg = "Valid html was not passed"
      const htmlStr = "<img"
      expect(() => {
        modifyHtmlElems(htmlStr, "a", callback)
      }).toThrow(errMsg)
    })
})
