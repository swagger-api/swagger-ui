import { fromJS } from "immutable"
import { definitions } from "core/plugins/oas3/spec-extensions/wrap-selectors"

describe("oas3 plugin - spec extensions - wrapSelectors", function(){

  describe("definitions", function(){
    it("should return definitions by default", function () {

      // Given
      const spec = fromJS({
        openapi: "3.0.0",
        components: {
          schemas: {
            a: {
              type: "string"
            },
            b: {
              type: "string"
            }
          }
        }
      })

      const system = {
        getSystem: () => system,
        specSelectors: {
          specJson: () => spec,
          isOAS3: () => true,
        }
      }

      // When
      let res = definitions(() => null, system)(fromJS({
        json: spec
      }))

      // Then
      expect(res.toJS()).toEqual({
        a: {
          type: "string"
        },
        b: {
          type: "string"
        }
      })
    })
    it("should return an empty Map when missing definitions", function () {

      // Given
      const spec = fromJS({
        openapi: "3.0.0"
      })

      const system = {
        getSystem: () => system,
        specSelectors: {
          specJson: () => spec,
          isOAS3: () => true,
        }
      }

      // When
      let res = definitions(() => null, system)(fromJS({
        json: spec
      }))

      // Then
      expect(res.toJS()).toEqual({})
    })
    it("should return an empty Map when given non-object definitions", function () {

      // Given
      const spec = fromJS({
        openapi: "3.0.0",
        components: {
          schemas: "..."
        }
      })

      const system = {
        getSystem: () => system,
        specSelectors: {
          specJson: () => spec,
          isOAS3: () => true,
        },
      }

      // When
      let res = definitions(() => null, system)(fromJS({
        json: spec
      }))

      // Then
      expect(res.toJS()).toEqual({})
    })
  })

})
