import { Map, List } from "immutable"
import { transform } from "core/plugins/err/error-transformers/transformers/example-mutually-exclusive"

describe("err plugin - transformers - example mutually exclusive", () => {

  it("should filter out false-positive ExampleElement mutually exclusive resolver errors", () => {
    let ori = List([
      Map({
        path: "post.responses.200.content.application/json.examples.testExample.externalValue",
        message: "Could not resolve reference: ExampleElement value and externalValue fields are mutually exclusive.",
        source: "resolver",
        level: "error",
        type: "thrown"
      })
    ])

    let res = transform(ori)

    expect(res.size).toEqual(0)
  })

  it("should not filter out non-resolver errors with the same message", () => {
    let ori = List([
      Map({
        path: "some.path",
        message: "ExampleElement value and externalValue fields are mutually exclusive.",
        source: "parser",
        level: "error",
        type: "thrown"
      })
    ])

    let res = transform(ori)

    expect(res.size).toEqual(1)
  })

  it("should not filter out other resolver errors", () => {
    let ori = List([
      Map({
        path: "some.path",
        message: "Could not resolve reference: some other error",
        source: "resolver",
        level: "error",
        type: "thrown"
      })
    ])

    let res = transform(ori)

    expect(res.size).toEqual(1)
  })

  it("should keep unrelated errors while filtering the mutually exclusive error", () => {
    let ori = List([
      Map({
        path: "info.version",
        message: "is not of a type(s) string",
        source: "structural",
        level: "error"
      }),
      Map({
        path: "post.responses.200.content.application/json.examples.testExample.externalValue",
        message: "Could not resolve reference: ExampleElement value and externalValue fields are mutually exclusive.",
        source: "resolver",
        level: "error",
        type: "thrown"
      }),
      Map({
        path: "paths./test",
        message: "Could not resolve reference: Network error",
        source: "resolver",
        level: "error",
        type: "thrown"
      })
    ])

    let res = transform(ori)

    expect(res.size).toEqual(2)
    expect(res.get(0).get("message")).toEqual("is not of a type(s) string")
    expect(res.get(1).get("message")).toEqual("Could not resolve reference: Network error")
  })

})
