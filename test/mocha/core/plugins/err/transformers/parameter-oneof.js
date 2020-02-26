/* eslint-disable no-useless-escape */
import expect from "expect"
import { fromJS } from "immutable"
import { transform } from "corePlugins/err/error-transformers/transformers/parameter-oneof"

describe.skip("err plugin - tranformers - parameter oneof", () => {

  describe("parameter.in misuse transformation to fixed value error", () => {

    it("should return a helpful error for invalid 'in' values", () => {
      const jsSpec = {
        paths: {
          "/CoolPath/": {
            get: {
              parameters: [
                {
                  name: "id",
                  in: "heder"
                }
              ]
            }
          }
        }
      }

      const jsonSchemaError = {
        "level": "error",
        "path": "paths.\/CoolPath\/.get.parameters[0]",
        "message": "is not exactly one from <#\/definitions\/parameter>,<#\/definitions\/jsonReference>",
        "source": "schema",
        "type": "spec"
      }

      let res = transform(fromJS([jsonSchemaError]), { jsSpec })

      expect(res.toJS()).toEqual([{
        path: "paths./CoolPath/.get.parameters[0].in",
        message: "Wrong value for the \"in\" keyword. Expected one of: path, query, header, body, formData.",
        level: "error",
        source: "schema",
        type: "spec"
      }])
    })

  })

  describe("parameter.collectionFormat misuse transformation to fixed value error", () => {
    it("should return a helpful error for invalid 'collectionFormat' values", () => {
      const jsSpec = {
        paths: {
          "/CoolPath/": {
            get: {
              parameters: [
                {
                  name: "id",
                  in: "query",
                  collectionFormat: "asdf"
                }
              ]
            }
          }
        }
      }

      const jsonSchemaError = {
        "level": "error",
        "path": "paths.\/CoolPath\/.get.parameters[0]",
        "message": "is not exactly one from <#\/definitions\/parameter>,<#\/definitions\/jsonReference>",
        "source": "schema",
        "type": "spec"
      }

      let res = transform(fromJS([jsonSchemaError]), { jsSpec })

      expect(res.toJS()).toEqual([{
        path: "paths./CoolPath/.get.parameters[0].collectionFormat",
        message: "Wrong value for the \"collectionFormat\" keyword. Expected one of: csv, ssv, tsv, pipes, multi.",
        level: "error",
        source: "schema",
        type: "spec"
      }])
    })
  })

  describe("Integrations", () => {
    it("should return the correct errors when both 'in' and 'collectionFormat' are incorrect", () => {
      const jsSpec = {
        paths: {
          "/CoolPath/": {
            get: {
              parameters: [
                {
                  name: "id",
                  in: "blah",
                  collectionFormat: "asdf"
                }
              ]
            }
          }
        }
      }

      const jsonSchemaError = {
        "level": "error",
        "path": "paths.\/CoolPath\/.get.parameters[0]",
        "message": "is not exactly one from <#\/definitions\/parameter>,<#\/definitions\/jsonReference>",
        "source": "schema",
        "type": "spec"
      }

      let res = transform(fromJS([jsonSchemaError]), { jsSpec })

      expect(res.toJS()).toEqual([
        {
          path: "paths./CoolPath/.get.parameters[0].in",
          message: "Wrong value for the \"in\" keyword. Expected one of: path, query, header, body, formData.",
          level: "error",
          source: "schema",
          type: "spec"
        },
        {
          path: "paths./CoolPath/.get.parameters[0].collectionFormat",
          message: "Wrong value for the \"collectionFormat\" keyword. Expected one of: csv, ssv, tsv, pipes, multi.",
          level: "error",
          source: "schema",
          type: "spec"
        }
    ])
    })
  })

})
