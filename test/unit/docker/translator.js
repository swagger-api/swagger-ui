const translator = require("../../../docker/configurator/translator")
const dedent = require("dedent")

describe("docker: env translator", function() {
  describe("fundamentals", function() {
    it("should generate an empty baseline config", function () {
      const input = {}

      expect(translator(input)).toEqual(``)
    })

    it("should call an onFound callback", function () {
      const input = {
        MY_THING: "hey"
      }

      const onFoundSpy = jest.fn()

      const schema = {
        MY_THING: {
          type: "string",
          name: "myThing",
          onFound: onFoundSpy
        }
      }

      const res = translator(input, {
        schema
      })
      expect(res).toEqual(`myThing: "hey",`)
      expect(onFoundSpy.mock.calls.length).toEqual(1)

    })

    it("should use a regular value over a legacy one, regardless of order", function () {
      const schema = {
        MY_THING: {
          type: "string",
          name: "myThing"
        },
        MY_OTHER_THING: {
          type: "string",
          name: "myThing",
          legacy: true
        }
      }

      // Regular value provided first
      expect(translator({
        MY_THING: "hey",
        MY_OTHER_THING: "hello"
      }, {
        schema
      })).toEqual(`myThing: "hey",`)

      // Legacy value provided first
      expect(translator({
        MY_OTHER_THING: "hello",
        MY_THING: "hey"
      }, {
        schema
      })).toEqual(`myThing: "hey",`)
    })

    it("should use a legacy value over a base one, regardless of order", function () {
      const schema = {
        MY_THING: {
          type: "string",
          name: "myThing",
          legacy: true
        }
      }

      const baseConfig = {
        myThing: {
          value: "base",
          schema: {
            type: "string",
            base: true
          }
        }
      }

      // Regular value provided first
      expect(translator({
        MY_THING: "legacy"
      }, {
        injectBaseConfig: true,
        schema,
        baseConfig
      })).toEqual(`myThing: "legacy",`)
    })
  })
  describe("Swagger UI configuration", function() {
    it("should generate a base config including the base content", function () {
      const input = {}

      expect(translator(input, {
        injectBaseConfig: true
      })).toEqual(dedent(`
    url: "https://petstore.swagger.io/v2/swagger.json",
    "dom_id": "#swagger-ui",
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    `))
    })

    it("should ignore an unknown config", function () {
      const input = {
        ASDF1234: "wow hello"
      }

      expect(translator(input)).toEqual(dedent(``))
    })

    it("should generate a string config", function () {
      const input = {
        URL: "http://petstore.swagger.io/v2/swagger.json",
        FILTER: ""
      }

      expect(translator(input)).toEqual(dedent(`
      url: "http://petstore.swagger.io/v2/swagger.json",
      filter: "",`
      ).trim())
    })

    it("should generate a boolean config", function () {
      const input = {
        DEEP_LINKING: "true",
        SHOW_EXTENSIONS: "false",
        SHOW_COMMON_EXTENSIONS: ""
      }

      expect(translator(input)).toEqual(dedent(`
      deepLinking: true,
      showExtensions: false,
      showCommonExtensions: undefined,`
      ))
    })

    it("should generate an object config", function () {
      const input = {
        SPEC: `{ swagger: "2.0" }`
      }

      expect(translator(input)).toEqual(dedent(`
      spec: { swagger: "2.0" },`
      ).trim())
    })

    it("should generate an array config", function () {
      const input = {
        URLS: `["/one", "/two"]`,
        SUPPORTED_SUBMIT_METHODS: ""
      }

      expect(translator(input)).toEqual(dedent(`
      urls: ["/one", "/two"],
      supportedSubmitMethods: undefined,`
      ).trim())
    })

    it("should properly escape key names when necessary", function () {
      const input = {
        URLS: `["/one", "/two"]`,
        URLS_PRIMARY_NAME: "one",
      }

      expect(translator(input)).toEqual(dedent(`
      urls: ["/one", "/two"],
      "urls.primaryName": "one",`
      ).trim())
    })

    it("should disregard a legacy variable in favor of a regular one", function () {
      const input = {
        // Order is important to this test... legacy vars should be
        // superseded regardless of what is fed in first.
        API_URL: "/old.json",
        URL: "/swagger.json",
        URLS: `["/one", "/two"]`,
        API_URLS: `["/three", "/four"]`,
      }

      expect(translator(input)).toEqual(dedent(`
      url: "/swagger.json",
      urls: ["/one", "/two"],`
      ).trim())
    })


    it("should pick up legacy variables when using base config", function () {
      const input = {
        API_URL: "/swagger.json",
        API_URLS: `["/one", "/two"]`,
      }

      expect(translator(input, { injectBaseConfig: true })).toEqual(dedent(`
      "dom_id": "#swagger-ui",
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout",
      url: "/swagger.json",
      urls: ["/one", "/two"],`

      ).trim())
    })

    it("should generate a full config k:v string", function () {
      const input = {
        API_URL: "/old.yaml",
        API_URLS: `["/old", "/older"]`,
        CONFIG_URL: "/wow",
        DOM_ID: "#swagger_ui",
        SPEC: `{ swagger: "2.0" }`,
        URL: "/swagger.json",
        URLS: `["/one", "/two"]`,
        URLS_PRIMARY_NAME: "one",
        LAYOUT: "BaseLayout",
        DEEP_LINKING: "false",
        DISPLAY_OPERATION_ID: "true",
        DEFAULT_MODELS_EXPAND_DEPTH: "0",
        DEFAULT_MODEL_EXPAND_DEPTH: "1",
        DEFAULT_MODEL_RENDERING: "example",
        DISPLAY_REQUEST_DURATION: "true",
        DOC_EXPANSION: "full",
        FILTER: "wowee",
        MAX_DISPLAYED_TAGS: "4",
        SHOW_EXTENSIONS: "true",
        SHOW_COMMON_EXTENSIONS: "false",
        OAUTH2_REDIRECT_URL: "http://google.com/",
        SHOW_MUTATED_REQUEST: "true",
        SUPPORTED_SUBMIT_METHODS: `["get", "post"]`,
        VALIDATOR_URL: "http://smartbear.com/"
      }

      expect(translator(input)).toEqual(dedent(`
      configUrl: "/wow",
      "dom_id": "#swagger_ui",
      spec: { swagger: "2.0" },
      url: "/swagger.json",
      urls: ["/one", "/two"],
      "urls.primaryName": "one",
      layout: "BaseLayout",
      deepLinking: false,
      displayOperationId: true,
      defaultModelsExpandDepth: 0,
      defaultModelExpandDepth: 1,
      defaultModelRendering: "example",
      displayRequestDuration: true,
      docExpansion: "full",
      filter: "wowee",
      maxDisplayedTags: 4,
      showExtensions: true,
      showCommonExtensions: false,
      oauth2RedirectUrl: "http://google.com/",
      showMutatedRequest: true,
      supportedSubmitMethods: ["get", "post"],
      validatorUrl: "http://smartbear.com/",`
      ).trim())
    })

    it("should generate a full config k:v string including base config", function () {
      const input = {
        API_URL: "/old.yaml",
        API_URLS: `["/old", "/older"]`,
        CONFIG_URL: "/wow",
        DOM_ID: "#swagger_ui",
        SPEC: `{ swagger: "2.0" }`,
        URL: "/swagger.json",
        URLS: `["/one", "/two"]`,
        URLS_PRIMARY_NAME: "one",
        LAYOUT: "BaseLayout",
        DEEP_LINKING: "false",
        DISPLAY_OPERATION_ID: "true",
        DEFAULT_MODELS_EXPAND_DEPTH: "0",
        DEFAULT_MODEL_EXPAND_DEPTH: "1",
        DEFAULT_MODEL_RENDERING: "example",
        DISPLAY_REQUEST_DURATION: "true",
        DOC_EXPANSION: "full",
        FILTER: "wowee",
        MAX_DISPLAYED_TAGS: "4",
        SHOW_EXTENSIONS: "true",
        SHOW_COMMON_EXTENSIONS: "false",
        OAUTH2_REDIRECT_URL: "http://google.com/",
        SHOW_MUTATED_REQUEST: "true",
        SUPPORTED_SUBMIT_METHODS: `["get", "post"]`,
        VALIDATOR_URL: "http://smartbear.com/"
      }

      expect(translator(input, { injectBaseConfig: true })).toEqual(dedent(`
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      configUrl: "/wow",
      "dom_id": "#swagger_ui",
      spec: { swagger: "2.0" },
      url: "/swagger.json",
      urls: ["/one", "/two"],
      "urls.primaryName": "one",
      layout: "BaseLayout",
      deepLinking: false,
      displayOperationId: true,
      defaultModelsExpandDepth: 0,
      defaultModelExpandDepth: 1,
      defaultModelRendering: "example",
      displayRequestDuration: true,
      docExpansion: "full",
      filter: "wowee",
      maxDisplayedTags: 4,
      showExtensions: true,
      showCommonExtensions: false,
      oauth2RedirectUrl: "http://google.com/",
      showMutatedRequest: true,
      supportedSubmitMethods: ["get", "post"],
      validatorUrl: "http://smartbear.com/",`
      ).trim())
    })
  })
})
