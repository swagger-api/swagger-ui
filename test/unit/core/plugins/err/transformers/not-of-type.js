import { Map, List } from "immutable"
import { transform } from "core/plugins/err/error-transformers/transformers/not-of-type"

describe("err plugin - tranformers - not of type", () => {

  it("should transform a singular not of type(s) error without an inline path", () => {
    let ori = List([
      Map({
        path: "info.version",
        message: "is not of a type(s) string"
      })
    ])

    let res = transform(ori).toJS()

    expect(res).toEqual([{
      path: "info.version",
      message: "should be a string"
    }])
  })

  it("should transform a plural (2) not of type(s) error without an inline path", () => {
    let ori = List([
      Map({
        path: "info.version",
        message: "is not of a type(s) string,array"
      })
    ])

    let res = transform(ori).toJS()

    expect(res).toEqual([{
      path: "info.version",
      message: "should be a string or array"
    }])
  })

  it("should transform a plural (3+) not of type(s) error without an inline path", () => {
    let ori = List([
      Map({
        path: "info.version",
        message: "is not of a type(s) string,array,number"
      })
    ])

    let res = transform(ori).toJS()

    expect(res).toEqual([{
      path: "info.version",
      message: "should be a string, array, or number"
    }])
  })

})
