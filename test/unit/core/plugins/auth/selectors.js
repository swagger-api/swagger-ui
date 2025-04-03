
import { fromJS } from "immutable"
import { definitionsToAuthorize, definitionsForRequirements } from "core/plugins/auth/selectors"

describe("auth plugin - selectors", () => {
  describe("definitionsToAuthorize", () => {
    it("should return securityDefinitions as a List", () => {
      const securityDefinitions = {
        "petstore_auth": {
          "type": "oauth2",
          "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
          "flow": "implicit",
          "scopes": {
            "write:pets": "modify pets in your account",
            "read:pets": "read your pets"
          }
        },
        "api_key": {
          "type": "apiKey",
          "name": "api_key",
          "in": "header"
        }
      }

      const system = {
        specSelectors: {
          securityDefinitions() {
            return fromJS(securityDefinitions)
          }
        }
      }

      const res = definitionsToAuthorize({})(system)

      expect(res.toJS()).toEqual([
        {
          "petstore_auth": securityDefinitions["petstore_auth"]
        },
        {
          "api_key": securityDefinitions["api_key"]
        },
      ])
    })

    it("should fail gracefully with bad data", () => {
      const securityDefinitions = null

      const system = {
        specSelectors: {
          securityDefinitions() {
            return fromJS(securityDefinitions)
          }
        }
      }

      const res = definitionsToAuthorize({})(system)

      expect(res.toJS()).toEqual([])
    })
  })

  describe("definitionsForRequirements", () => {
    it("should return applicable securityDefinitions as a List", () => {
      const securityDefinitions = {
        "petstore_auth": {
          "type": "oauth2",
          "authorizationUrl": "http://petstore.swagger.io/oauth/dialog",
          "flow": "implicit",
          "scopes": {
            "write:pets": "modify pets in your account",
            "read:pets": "read your pets"
          }
        },
        "api_key": {
          "type": "apiKey",
          "name": "api_key",
          "in": "header"
        }
      }

      const system = {
        authSelectors: {
          definitionsToAuthorize() {
            return fromJS([
              {
                "petstore_auth": securityDefinitions["petstore_auth"]
              },
              {
                "api_key": securityDefinitions["api_key"]
              },
            ])
          }
        }
      }

      const securities = fromJS([
        {
          "petstore_auth": [
            "write:pets",
            "read:pets"
          ]
        }
      ])

      const res = definitionsForRequirements({}, securities)(system)

      expect(res.toJS()).toEqual([
        {
          "petstore_auth": securityDefinitions["petstore_auth"]
        }
      ])
    })

    it("should fail gracefully with bad data", () => {
      const system = {
        authSelectors: {
          definitionsToAuthorize() {
            return null
          }
        }
      }

      const securities = null

      const res = definitionsForRequirements({}, securities)(system)

      expect(res.toJS()).toEqual([])
    })
  })

  it("should return only security definitions used by the endpoint", () => {
    const securityDefinitions = {
      "used": {
        "type": "http",
        "scheme": "basic",
      },
      "unused": {
        "type": "http",
        "scheme": "basic",
      }
    }

    const system = {
      authSelectors: {
        definitionsToAuthorize() {
          return fromJS([
            {
              "used": securityDefinitions["used"]
            },
            {
              "unused": securityDefinitions["unused"]
            },
          ])
        }
      }
    }

    const securities = fromJS([
      {
        "used": [],
        "undefined": [],
      }
    ])

    const res = definitionsForRequirements({}, securities)(system)

    expect(res.toJS()).toEqual([
      {
        "used": securityDefinitions["used"]
      }
    ])
  })

  it("should return only oauth scopes used by the endpoint", () => {
    const securityDefinitions = {
      "oauth2": {
        "type": "oauth2",
        "flow": "clientCredentials",
        "tokenUrl": "https://api.testserver.com/oauth2/token/",
        "scopes": {
          "used": "foo",
          "unused": "bar"
        }
      },
      "other": {
        "type": "apiKey",
        "name": "api_key",
        "in": "header"
      }

    }

    const system = {
      authSelectors: {
        definitionsToAuthorize() {
          return fromJS([
            {
              "oauth2": securityDefinitions["oauth2"],
              "other": securityDefinitions["other"],
            },
          ])
        }
      }
    }

    const securities = fromJS([
      {
        "oauth2": ["used", "undefined"],
        "other": [],
      }
    ])

    let expectedOauth2Definitions = {...securityDefinitions["oauth2"]}
    expectedOauth2Definitions["scopes"] = {"used": "foo"}

    const res = definitionsForRequirements({}, securities)(system)

    expect(res.toJS()).toEqual([
      {
        "oauth2": expectedOauth2Definitions,
        "other": securityDefinitions["other"]
      }
    ])
  })

})
