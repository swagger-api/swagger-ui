/**
 * @prettier
 */

import Model from "../../../../src/core/components/model"

describe("getModelName", () => {
    let m = new Model()
    it("Should decode JSON Pointer and URI encoding for OpenAPI v3 refs", () => {
        expect(m.getModelName("#/components/schemas/a~1b%2Bc"))
            .toEqual("a/b+c")
    })
    it("Should decode JSON Pointer and URI encoding for Swagger v2 refs", () => {
        expect(m.getModelName("#/definitions/custom%3A%3Anamespace%3A%3APerson"))
            .toEqual("custom::namespace::Person")
    })
    it("decode multiple json-pointer values", () => {
        expect(m.getModelName("#/components/schemas/~1~1~0~0"))
            .toEqual("//~~")
    })
    it("support invalid URI encoding", () => {
        expect(m.getModelName("#/components/schemas/%25%d"))
            .toEqual("%25%d")
    })
})
