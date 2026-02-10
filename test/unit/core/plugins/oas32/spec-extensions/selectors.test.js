/**
 * @prettier
 */
import { fromJS, Map } from "immutable"
import {
  selectMediaTypes,
  selectPathItems,
  selectPathItemQuery,
  selectPathItemAdditionalOperations,
  selectHasQueryOperations,
  selectHasAdditionalOperations,
} from "core/plugins/oas32/spec-extensions/selectors"

describe("oas32 plugin - spec-extensions - selectors", () => {
  describe("selectMediaTypes", () => {
    it("should select mediaTypes from components", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              components: {
                mediaTypes: {
                  JsonError: {
                    schema: {
                      type: "object",
                    },
                  },
                },
              },
            }),
        },
      }

      const result = selectMediaTypes()(mockSystem)
      expect(result.size).toBe(1)
      expect(result.has("JsonError")).toBe(true)
    })

    it("should return empty Map when mediaTypes is not present", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              components: {},
            }),
        },
      }

      const result = selectMediaTypes()(mockSystem)
      expect(result.size).toBe(0)
    })

    it("should return empty Map when components is not present", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
            }),
        },
      }

      const result = selectMediaTypes()(mockSystem)
      expect(result.size).toBe(0)
    })
  })

  describe("selectPathItems", () => {
    it("should select pathItems from components", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              components: {
                pathItems: {
                  UserEndpoint: {
                    get: {
                      summary: "Get user",
                    },
                  },
                },
              },
            }),
        },
      }

      const result = selectPathItems()(mockSystem)
      expect(result.size).toBe(1)
      expect(result.has("UserEndpoint")).toBe(true)
    })

    it("should return empty Map when pathItems is not present", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              components: {},
            }),
        },
      }

      const result = selectPathItems()(mockSystem)
      expect(result.size).toBe(0)
    })
  })

  describe("selectPathItemQuery", () => {
    it("should return the query operation from a path", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/pets": {
                  get: { summary: "Get pets" },
                  query: {
                    summary: "Search pets with complex criteria",
                    requestBody: {
                      content: {
                        "application/json": {
                          schema: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            })
          ),
        },
      }

      const result = selectPathItemQuery("/pets")(system)

      expect(Map.isMap(result)).toBe(true)
      expect(result.get("summary")).toBe("Search pets with complex criteria")
    })

    it("should return null when path does not have query operation", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/pets": {
                  get: { summary: "Get pets" },
                  post: { summary: "Create pet" },
                },
              },
            })
          ),
        },
      }

      const result = selectPathItemQuery("/pets")(system)

      expect(result).toBeNull()
    })

    it("should return null when path does not exist", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/pets": {
                  get: { summary: "Get pets" },
                },
              },
            })
          ),
        },
      }

      const result = selectPathItemQuery("/nonexistent")(system)

      expect(result).toBeNull()
    })

    it("should return null when paths is not present", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
            })
          ),
        },
      }

      const result = selectPathItemQuery("/pets")(system)

      expect(result).toBeNull()
    })
  })

  describe("selectPathItemAdditionalOperations", () => {
    it("should return additionalOperations from a path", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/resource": {
                  get: { summary: "Get resource" },
                  additionalOperations: {
                    COPY: { summary: "Copy resource" },
                    MOVE: { summary: "Move resource" },
                    LOCK: { summary: "Lock resource" },
                  },
                },
              },
            })
          ),
        },
      }

      const result = selectPathItemAdditionalOperations("/resource")(system)

      expect(Map.isMap(result)).toBe(true)
      expect(result.has("COPY")).toBe(true)
      expect(result.has("MOVE")).toBe(true)
      expect(result.has("LOCK")).toBe(true)
      expect(result.get("COPY").get("summary")).toBe("Copy resource")
    })

    it("should return empty Map when path has no additionalOperations", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/resource": {
                  get: { summary: "Get resource" },
                },
              },
            })
          ),
        },
      }

      const result = selectPathItemAdditionalOperations("/resource")(system)

      expect(Map.isMap(result)).toBe(true)
      expect(result.size).toBe(0)
    })

    it("should return empty Map when path does not exist", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/resource": {
                  get: { summary: "Get resource" },
                },
              },
            })
          ),
        },
      }

      const result =
        selectPathItemAdditionalOperations("/nonexistent")(system)

      expect(Map.isMap(result)).toBe(true)
      expect(result.size).toBe(0)
    })

    it("should return empty Map when paths is not present", () => {
      const system = {
        specSelectors: {
          specJson: jest.fn(() =>
            fromJS({
              openapi: "3.2.0",
            })
          ),
        },
      }

      const result = selectPathItemAdditionalOperations("/resource")(system)

      expect(Map.isMap(result)).toBe(true)
      expect(result.size).toBe(0)
    })
  })

  describe("selectHasQueryOperations", () => {
    it("should return true when paths contain query operations", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/search": {
                  query: {
                    summary: "Search with query payload",
                  },
                },
              },
            }),
        },
      }

      const result = selectHasQueryOperations()(mockSystem)
      expect(result).toBe(true)
    })

    it("should return false when no query operations exist", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/users": {
                  get: {
                    summary: "Get users",
                  },
                },
              },
            }),
        },
      }

      const result = selectHasQueryOperations()(mockSystem)
      expect(result).toBe(false)
    })

    it("should return false when paths is not present", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
            }),
        },
      }

      const result = selectHasQueryOperations()(mockSystem)
      expect(result).toBe(false)
    })
  })

  describe("selectHasAdditionalOperations", () => {
    it("should return true when paths contain additionalOperations", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/resource": {
                  additionalOperations: {
                    COPY: {
                      summary: "Copy resource",
                    },
                  },
                },
              },
            }),
        },
      }

      const result = selectHasAdditionalOperations()(mockSystem)
      expect(result).toBe(true)
    })

    it("should return false when no additionalOperations exist", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/users": {
                  get: {
                    summary: "Get users",
                  },
                },
              },
            }),
        },
      }

      const result = selectHasAdditionalOperations()(mockSystem)
      expect(result).toBe(false)
    })

    it("should return false when additionalOperations is empty", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              paths: {
                "/resource": {
                  additionalOperations: {},
                },
              },
            }),
        },
      }

      const result = selectHasAdditionalOperations()(mockSystem)
      expect(result).toBe(false)
    })
  })

})
