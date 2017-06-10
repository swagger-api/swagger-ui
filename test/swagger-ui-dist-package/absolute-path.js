/* eslint-env mocha */
import expect from "expect"
import path from "path"
import absolutePath from "../../swagger-ui-dist-package/absolute-path"

describe("swagger-ui-dist", function(){
  describe("absolutePath", function(){
    it("has absolute path", function(){
      const expectedPath = path.resolve(__dirname, "../../swagger-ui-dist-package")
      expect(absolutePath).toEqual(expectedPath)
    })
  })
})
