
import { fromJS } from "immutable"
import { definitionsToAuthorize, definitionsForRequirements } from "corePlugins/auth/selectors"

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
      const securityDefinitions = null

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
})
