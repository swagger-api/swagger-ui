
import { fromJS, Map } from "immutable"
import {
  definitionsToAuthorize
} from "corePlugins/oas3/auth-extensions/wrap-selectors"

describe("oas3 plugin - auth extensions - wrapSelectors", function(){

  describe("execute", function(){

    it("should add `securities` to the oriAction call", function(){
      // Given
      const system = {
        getSystem: () => system,
        getState: () => new Map(),
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
              },
              "oidc": {
                "type": "openIdConnect",
                "openIdConnectUrl": "https://accounts.google.com/.well-known/openid-configuration",
                "openIdConnectData": {
                  "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
                  "token_endpoint": "https://oauth2.googleapis.com/token",
                  "scopes_supported": [
                    "openid",
                    "email",
                    "profile"
                  ],
                  "grant_types_supported": [
                    "authorization_code",
                    "refresh_token",
                    "urn:ietf:params:oauth:grant-type:device_code",
                    "urn:ietf:params:oauth:grant-type:jwt-bearer"
                  ]
                }
              },
              "oidcNoGrant": {
                "type": "openIdConnect",
                "openIdConnectUrl": "https://accounts.google.com/.well-known/openid-configuration",
                "openIdConnectData": {
                  "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
                  "token_endpoint": "https://oauth2.googleapis.com/token",
                  "scopes_supported": [
                    "openid",
                    "email",
                    "profile"
                  ]
                },
              },
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
        {
          oidc: {
            flow: "authorization_code",
            authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            openIdConnectUrl: "https://accounts.google.com/.well-known/openid-configuration",
            scopes: {
              "openid": "",
              "email": "",
              "profile": "",
            },
            type: "oauth2"
          }
        },
        {
          oidc: {
            flow: "refresh_token",
            authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            openIdConnectUrl: "https://accounts.google.com/.well-known/openid-configuration",
            scopes: {
              "openid": "",
              "email": "",
              "profile": "",
            },
            type: "oauth2"
          }
        },
        {
          oidc: {
            flow: "urn:ietf:params:oauth:grant-type:device_code",
            authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            openIdConnectUrl: "https://accounts.google.com/.well-known/openid-configuration",
            scopes: {
              "openid": "",
              "email": "",
              "profile": "",
            },
            type: "oauth2"
          }
        },
        {
          oidc: {
            flow: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            openIdConnectUrl: "https://accounts.google.com/.well-known/openid-configuration",
            scopes: {
              "openid": "",
              "email": "",
              "profile": "",
            },
            type: "oauth2"
          }
        },
        {
          // See https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
          // grant_types_supported
          //   OPTIONAL. JSON array containing a list of the OAuth 2.0 Grant Type values that
          //   this OP supports. Dynamic OpenID Providers MUST support the authorization_code
          //   and implicit Grant Type values and MAY support other Grant Types. If omitted,
          //   the default value is ["authorization_code", "implicit"]. 
          oidcNoGrant: {
            flow: "authorization_code",
            authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            openIdConnectUrl: "https://accounts.google.com/.well-known/openid-configuration",
            scopes: {
              "openid": "",
              "email": "",
              "profile": "",
            },
            type: "oauth2"
          }
        },
        {
          oidcNoGrant: {
            flow: "implicit",
            authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
            tokenUrl: "https://oauth2.googleapis.com/token",
            openIdConnectUrl: "https://accounts.google.com/.well-known/openid-configuration",
            scopes: {
              "openid": "",
              "email": "",
              "profile": "",
            },
            type: "oauth2"
          }
        },
      ])

    })

  })

})
