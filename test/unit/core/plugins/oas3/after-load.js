import afterLoad from "core/plugins/oas3/after-load"

describe("OAS3 plugin - afterLoad", function () {
  describe("buildRequest wrapper", function () {
    it("should apply default encoding (style=form, explode=true) for array properties in form-urlencoded when encoding is omitted", function () {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/implicit-encoding": {
            post: {
              requestBody: {
                content: {
                  "application/x-www-form-urlencoded": {
                    schema: {
                      type: "object",
                      properties: {
                        numbers: {
                          type: "array",
                          items: {
                            type: "integer",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      const mockBuildRequest = jest.fn().mockReturnValue({})
      const context = { fn: {} }

      afterLoad.call(context, { fn: { buildRequest: mockBuildRequest } })

      context.fn.buildRequest({
        spec,
        pathName: "/implicit-encoding",
        method: "post",
        requestBody: { numbers: [1, 2, 3] },
        requestContentType: "application/x-www-form-urlencoded",
      })

      expect(mockBuildRequest).toHaveBeenCalledTimes(1)

      const operation = spec.paths["/implicit-encoding"].post
      const mediaType =
        operation.requestBody.content["application/x-www-form-urlencoded"]
      expect(mediaType.encoding).toBeDefined()
      expect(mediaType.encoding.numbers).toEqual({
        style: "form",
        explode: true,
      })
    })

    it("should not override existing encoding when explicitly specified", function () {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/explicit-encoding": {
            post: {
              requestBody: {
                content: {
                  "application/x-www-form-urlencoded": {
                    schema: {
                      type: "object",
                      properties: {
                        numbers: {
                          type: "array",
                          items: {
                            type: "integer",
                          },
                        },
                      },
                    },
                    encoding: {
                      numbers: {
                        style: "pipeDelimited",
                        explode: false,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      const mockBuildRequest = jest.fn().mockReturnValue({})
      const context = { fn: {} }

      afterLoad.call(context, { fn: { buildRequest: mockBuildRequest } })

      context.fn.buildRequest({
        spec,
        pathName: "/explicit-encoding",
        method: "post",
        requestBody: { numbers: [1, 2, 3] },
        requestContentType: "application/x-www-form-urlencoded",
      })

      const operation = spec.paths["/explicit-encoding"].post
      const mediaType =
        operation.requestBody.content["application/x-www-form-urlencoded"]
      expect(mediaType.encoding.numbers).toEqual({
        style: "pipeDelimited",
        explode: false,
      })
    })

    it("should not add encoding for non-array properties", function () {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/no-arrays": {
            post: {
              requestBody: {
                content: {
                  "application/x-www-form-urlencoded": {
                    schema: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        age: {
                          type: "integer",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      const mockBuildRequest = jest.fn().mockReturnValue({})
      const context = { fn: {} }

      afterLoad.call(context, { fn: { buildRequest: mockBuildRequest } })

      context.fn.buildRequest({
        spec,
        pathName: "/no-arrays",
        method: "post",
        requestBody: { name: "test", age: 25 },
        requestContentType: "application/x-www-form-urlencoded",
      })

      const operation = spec.paths["/no-arrays"].post
      const mediaType =
        operation.requestBody.content["application/x-www-form-urlencoded"]
      expect(mediaType.encoding).toBeUndefined()
    })

    it("should not modify request for non-form-urlencoded content types", function () {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/json": {
            post: {
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        numbers: {
                          type: "array",
                          items: {
                            type: "integer",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      const mockBuildRequest = jest.fn().mockReturnValue({})
      const context = { fn: {} }

      afterLoad.call(context, { fn: { buildRequest: mockBuildRequest } })

      context.fn.buildRequest({
        spec,
        pathName: "/json",
        method: "post",
        requestBody: { numbers: [1, 2, 3] },
        requestContentType: "application/json",
      })

      const operation = spec.paths["/json"].post
      const mediaType = operation.requestBody.content["application/json"]
      expect(mediaType.encoding).toBeUndefined()
    })

    it("should apply default encoding only for array properties among mixed properties", function () {
      const spec = {
        openapi: "3.0.0",
        paths: {
          "/mixed": {
            post: {
              requestBody: {
                content: {
                  "application/x-www-form-urlencoded": {
                    schema: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                        },
                        tags: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        ids: {
                          type: "array",
                          items: {
                            type: "integer",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }

      const mockBuildRequest = jest.fn().mockReturnValue({})
      const context = { fn: {} }

      afterLoad.call(context, { fn: { buildRequest: mockBuildRequest } })

      context.fn.buildRequest({
        spec,
        pathName: "/mixed",
        method: "post",
        requestBody: { name: "test", tags: ["a", "b"], ids: [1, 2] },
        requestContentType: "application/x-www-form-urlencoded",
      })

      const operation = spec.paths["/mixed"].post
      const mediaType =
        operation.requestBody.content["application/x-www-form-urlencoded"]
      expect(mediaType.encoding).toBeDefined()
      expect(mediaType.encoding.name).toBeUndefined()
      expect(mediaType.encoding.tags).toEqual({
        style: "form",
        explode: true,
      })
      expect(mediaType.encoding.ids).toEqual({ style: "form", explode: true })
    })
  })
})
