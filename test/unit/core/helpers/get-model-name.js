/**
 * @prettier
 */

import { fromJS } from "immutable"
import getModelName from "../../../../src/core/components/model"

describe("getModelName", () => {
    it("Should decode JSON Pointer and URI encoding", () => {
        expect(getModelName('#/components/schemas/a~1b%2Bc')).toEqual('a/b+c')
    })
})
