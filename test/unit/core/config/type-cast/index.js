/**
 * @prettier
 */
import typeCast from "core/config/type-cast"

jest.mock("core/presets/apis", () => {})

describe("typeCast", () => {
  it("should cast stringified `true` and `false` values to `boolean`", () => {
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

  it("should cast stringified `number` values to `number`", () => {
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

  it("should cast stringified `null` values to `null`", () => {
    const config = {
      validatorUrl: "null",
    }

    const expectedConfig = {
      validatorUrl: null,
    }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })

  it("should cast `string` values to `string`", () => {
    const config = { defaultModelRendering: "model", filter: "pet" }

    const expectedConfig = { defaultModelRendering: "model", filter: "pet" }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })

  it("should cast stringified values to correct type", () => {
    const config = {
      dom_id: "null",
      oauth2RedirectUrl: "undefined",
      syntaxHighlight: "false",
      urls: "null",
    }

    const expectedConfig = {
      dom_id: null,
      oauth2RedirectUrl: undefined,
      syntaxHighlight: { activated: false },
      urls: null,
    }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })

  it("should cast incorrect value types to default value", () => {
    const config = {
      deepLinking: "deepLinking",
      urls: "urls",
      syntaxHighlight: "syntaxHighlight",
      spec: "spec",
      maxDisplayedTags: "null",
      defaultModelExpandDepth: {},
      defaultModelsExpandDepth: false,
    }

    const expectedConfig = {
      deepLinking: false,
      urls: null,
      syntaxHighlight: { activated: true, theme: "agate" },
      spec: {},
      maxDisplayedTags: -1,
      defaultModelExpandDepth: 1,
      defaultModelsExpandDepth: 1,
    }

    expect(typeCast(config)).toStrictEqual(expectedConfig)
  })
})
