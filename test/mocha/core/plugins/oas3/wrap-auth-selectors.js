/* eslint-env mocha */
import expect, { createSpy } from "expect"
import { Map, fromJS } from "immutable"
import {
  definitionsToAuthorize
} from "corePlugins/oas3/auth-extensions/wrap-selectors"

describe("oas3 plugin - auth extensions - wrapSelectors", function(){

  describe("execute", function(){

    it("should add `securities` to the oriAction call", function(){
      // Given
      const system = {
        getSystem: () => system,
        specSelectors: {
          specJson: () => fromJS({
            openapi: "3.0.0"
          }),
          securityDefinitions: () => {
            return fromJS({
              "oauth2AuthorizationCode": {
                "type": "oauth2",
                "flows": {
                  "authorizationCode": {
                    "authorizationUrl": "http://google.com/",
                    "tokenUrl": "http://google.com/",
                    "scopes": {
                      "myScope": "our only scope"
                    }
                  }
                }
              },
              "oauth2Multiflow": {
                "type": "oauth2",
                "flows": {
                  "clientCredentials": {
                    "tokenUrl": "http://google.com/",
                    "scopes": {
                      "myScope": "our only scope"
                    }
                  },
                  "password": {
                    "tokenUrl": "http://google.com/",
                    "scopes": {
                      "myScope": "our only scope"
                    }
                  },
                  "authorizationCode": {
                    "authorizationUrl": "http://google.com/",
                    "tokenUrl": "http://google.com/",
                    "scopes": {
                      "myScope": "our only scope"
                    }
                  }
                }
              }
            })
          }
        }
      }

      // When
      let res = definitionsToAuthorize(() => null, system)()

      // Then
      expect(res.toJS()).toEqual([
        {
          oauth2AuthorizationCode: {
            flow: "authorizationCode",
            authorizationUrl: "http://google.com/",
            tokenUrl: "http://google.com/",
            scopes: {
              "myScope": "our only scope"
            },
            type: "oauth2"
          }
        },
        {
          oauth2Multiflow: {
            flow: "clientCredentials",
            tokenUrl: "http://google.com/",
            scopes: {
              "myScope": "our only scope"
            },
            type: "oauth2"
          }
        },
        {
          oauth2Multiflow: {
            flow: "password",
            tokenUrl: "http://google.com/",
            scopes: {
              "myScope": "our only scope"
            },
            type: "oauth2"
          }
        },
        {
          oauth2Multiflow: {
            flow: "authorizationCode",
            authorizationUrl: "http://google.com/",
            tokenUrl: "http://google.com/",
            scopes: {
              "myScope": "our only scope"
            },
            type: "oauth2"
          }
        },
      ])

    })

  })

})
