/**
 * @prettier
 */
import typeCast from "core/config/type-cast"

describe("typeCast", () => {
  it("should convert stringified `true` and `false` values to `boolean`", () => {
    const config = {
      deepLinking: "true",
      tryItOutEnabled: "false",
      withCredentials: "true",
      filter: "false",
    }

    const expectedConfig = {
      deepLinking: true,
      tryItOutEnabled: false,
      withCredentials: true,
      filter: false,
    }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })

  it("should convert stringified `number` values to `number`", () => {
    const config = {
      defaultModelExpandDepth: "5",
      defaultModelsExpandDepth: "-1",
      maxDisplayedTags: "1",
    }

    const expectedConfig = {
      defaultModelExpandDepth: 5,
      defaultModelsExpandDepth: -1,
      maxDisplayedTags: 1,
    }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })

  it("should convert stringified `null` values to `null`", () => {
    const config = {
      validatorUrl: "null",
      maxDisplayedTags: "null",
      filter: "null",
    }

    const expectedConfig = {
      validatorUrl: null,
      maxDisplayedTags: null,
      filter: null,
    }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })

  it("should convert stringified `undefined` values to `undefined`", () => {
    const config = { withCredentials: "undefined" }

    const expectedConfig = { withCredentials: undefined }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })

  it("should not convert `string` values", () => {
    const config = { defaultModelRendering: "model", filter: "pet" }

    const expectedConfig = { defaultModelRendering: "model", filter: "pet" }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })
})
