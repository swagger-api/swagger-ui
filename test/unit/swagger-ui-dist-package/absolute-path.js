
import path from "path"
import getAbsoluteFSPath from "../../../swagger-ui-dist-package/absolute-path"

describe("swagger-ui-dist", function(){
  describe("getAbsoluteFSPath", function(){
    it("returns absolute path", function(){
      const expectedPath = path.resolve(__dirname, "../../../swagger-ui-dist-package")
      expect(getAbsoluteFSPath()).toEqual(expectedPath)
    })
  })
})
