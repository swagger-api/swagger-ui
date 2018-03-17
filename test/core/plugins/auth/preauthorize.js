/* eslint-env mocha */
import expect from "expect"
import { fromJS } from "immutable"
import { preauthorizeBasic, preauthorizeApiKey } from "corePlugins/auth"
import { authorize } from "corePlugins/auth/actions"

const S2_SYSTEM = {
  authActions: {
    authorize
  },
  specSelectors: {
    isOAS3: () => false,
    specJson: () => {
      return fromJS({
        swagger: "2.0",
        securityDefinitions: {
          "APIKeyHeader": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key"
          },
          "basicAuth": {
            "type": "basic"
          }
        }
      })
    }
  }
}

describe.only("auth plugin - preauthorizers", () => {
  describe("preauthorizeBasic", () => {
    it("should return a valid authorize action in Swagger 2", () => {
      const res = preauthorizeBasic(S2_SYSTEM, "basicAuth", "user", "pass")

      expect(res).toEqual({
        type: "authorize",
        payload: {
          basicAuth: {
            schema: {
              type: "basic"
            },
            value: {
              username: "user",
              password: "pass"
            }
          }
        }
      })
    })
    it("should return null when the authorization name is invalid", () => {
      const res = preauthorizeBasic(S2_SYSTEM, "fakeBasicAuth", "user", "pass")

      expect(res).toEqual(null)
    })
  })
  describe("preauthorizeApiKey", () => {
    it("should return a valid authorize action in Swagger 2", () => {
      const res = preauthorizeApiKey(S2_SYSTEM, "APIKeyHeader", "Asdf1234")

      expect(res).toEqual({
        type: "authorize",
        payload: {
          APIKeyHeader: {
            schema: {
              type: "apiKey",
              name: "X-API-Key",
              "in": "header"
            },
            value: "Asdf1234"
          }
        }
      })
    })
    it("should return null when the authorization name is invalid", () => {
      const res = preauthorizeApiKey(S2_SYSTEM, "FakeAPIKeyHeader", "Asdf1234")

      expect(res).toEqual(null)
    })
  })
})
