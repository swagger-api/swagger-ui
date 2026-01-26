/**
 * @prettier
 */
import { fromJS, Map } from "immutable"
import {
  selectSelfUriField,
  selectMediaTypes,
  selectPathItems,
  selectPathItemQuery,
  selectPathItemAdditionalOperations,
  selectHasQueryOperations,
  selectHasAdditionalOperations,
  selectAdditionalOperations,
  selectTagSummaryField,
  selectTagKindField,
  selectTagParentField,
} from "core/plugins/oas32/spec-extensions/selectors"

describe("oas32 plugin - spec-extensions - selectors", () => {
  describe("selectSelfUriField", () => {
    it("should select $self field", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              $self: "https://api.example.com/spec",
            }),
        },
      }

      const result = selectSelfUriField()(mockSystem)
      expect(result).toBe("https://api.example.com/spec")
    })

    it("should return undefined when $self is not present", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
            }),
        },
      }

      const result = selectSelfUriField()(mockSystem)
      expect(result).toBeUndefined()
    })
  })

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

  describe("selectAdditionalOperations", () => {
    it("should select additionalOperations grouped by path", () => {
      const spec = fromJS({
        openapi: "3.2.0",
        paths: {
          "/resource": {
            additionalOperations: {
              COPY: {
                summary: "Copy resource",
              },
              MOVE: {
                summary: "Move resource",
              },
            },
          },
        },
      })

      const state = fromJS({})
      const mockSystem = {
        specSelectors: {
          specJson: () => spec,
          specResolvedSubtree: () => spec.get("paths"),
        },
      }

      const result = selectAdditionalOperations(state, mockSystem)
      expect(result).toBeDefined()
      expect(result["/resource"]).toBeDefined()
      expect(result["/resource"].length).toBe(2)
      expect(result["/resource"][0].method).toBe("COPY")
      expect(result["/resource"][1].method).toBe("MOVE")
      expect(result["/resource"][0].path).toBe("/resource")
    })

    it("should return empty object when no paths exist", () => {
      const spec = fromJS({
        openapi: "3.2.0",
      })

      const state = fromJS({})
      const mockSystem = {
        specSelectors: {
          specJson: () => spec,
          specResolvedSubtree: () => undefined,
        },
      }

      const result = selectAdditionalOperations(state, mockSystem)
      expect(result).toEqual({})
    })

    it("should return empty object when no additionalOperations exist", () => {
      const spec = fromJS({
        openapi: "3.2.0",
        paths: {
          "/resource": {
            get: {
              summary: "Get resource",
            },
          },
        },
      })

      const state = fromJS({})
      const mockSystem = {
        specSelectors: {
          specJson: () => spec,
          specResolvedSubtree: () => spec.get("paths"),
        },
      }

      const result = selectAdditionalOperations(state, mockSystem)
      expect(result).toEqual({})
    })

    it("should include correct specPath for each operation", () => {
      const spec = fromJS({
        openapi: "3.2.0",
        paths: {
          "/documents/{id}": {
            additionalOperations: {
              LOCK: {
                summary: "Lock document",
              },
            },
          },
        },
      })

      const state = fromJS({})
      const mockSystem = {
        specSelectors: {
          specJson: () => spec,
          specResolvedSubtree: () => spec.get("paths"),
        },
      }

      const result = selectAdditionalOperations(state, mockSystem)
      expect(result["/documents/{id}"][0].specPath).toEqual([
        "paths",
        "/documents/{id}",
        "additionalOperations",
        "LOCK",
      ])
    })

    it("should handle multiple paths with additionalOperations", () => {
      const spec = fromJS({
        openapi: "3.2.0",
        paths: {
          "/documents": {
            additionalOperations: {
              COPY: {
                summary: "Copy document",
              },
            },
          },
          "/collections": {
            additionalOperations: {
              PROPFIND: {
                summary: "Find properties",
              },
              MKCOL: {
                summary: "Make collection",
              },
            },
          },
        },
      })

      const state = fromJS({})
      const mockSystem = {
        specSelectors: {
          specJson: () => spec,
          specResolvedSubtree: () => spec.get("paths"),
        },
      }

      const result = selectAdditionalOperations(state, mockSystem)
      expect(Object.keys(result).length).toBe(2)
      expect(result["/documents"].length).toBe(1)
      expect(result["/collections"].length).toBe(2)
    })
  })

  describe("selectTagSummaryField", () => {
    it("should select summary field from a tag", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  summary: "User management operations",
                  description: "Operations for managing users",
                },
              ],
            }),
        },
      }

      const result = selectTagSummaryField("Users")(mockSystem)
      expect(result).toBe("User management operations")
    })

    it("should return null when tag is not found", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  summary: "User operations",
                },
              ],
            }),
        },
      }

      const result = selectTagSummaryField("Products")(mockSystem)
      expect(result).toBeNull()
    })

    it("should return null when tag has no summary field", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  description: "User operations",
                },
              ],
            }),
        },
      }

      const result = selectTagSummaryField("Users")(mockSystem)
      expect(result).toBeUndefined()
    })

    it("should return null when tags array is not present", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
            }),
        },
      }

      const result = selectTagSummaryField("Users")(mockSystem)
      expect(result).toBeNull()
    })
  })

  describe("selectTagKindField", () => {
    it("should select kind field from a tag", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Webhooks",
                  kind: "webhook",
                  description: "Webhook operations",
                },
              ],
            }),
        },
      }

      const result = selectTagKindField("Webhooks")(mockSystem)
      expect(result).toBe("webhook")
    })

    it("should handle resource kind", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  kind: "resource",
                },
              ],
            }),
        },
      }

      const result = selectTagKindField("Users")(mockSystem)
      expect(result).toBe("resource")
    })

    it("should handle admin kind", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Admin",
                  kind: "admin",
                },
              ],
            }),
        },
      }

      const result = selectTagKindField("Admin")(mockSystem)
      expect(result).toBe("admin")
    })

    it("should return null when tag is not found", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  kind: "resource",
                },
              ],
            }),
        },
      }

      const result = selectTagKindField("Products")(mockSystem)
      expect(result).toBeNull()
    })

    it("should return null when tag has no kind field", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  description: "User operations",
                },
              ],
            }),
        },
      }

      const result = selectTagKindField("Users")(mockSystem)
      expect(result).toBeUndefined()
    })
  })

  describe("selectTagParentField", () => {
    it("should select parent field from a tag", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "User Profile",
                  parent: "Users",
                  description: "User profile operations",
                },
              ],
            }),
        },
      }

      const result = selectTagParentField("User Profile")(mockSystem)
      expect(result).toBe("Users")
    })

    it("should handle nested parent relationships", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  description: "User operations",
                },
                {
                  name: "User Profile",
                  parent: "Users",
                },
                {
                  name: "User Settings",
                  parent: "Users",
                },
              ],
            }),
        },
      }

      const result1 = selectTagParentField("User Profile")(mockSystem)
      const result2 = selectTagParentField("User Settings")(mockSystem)

      expect(result1).toBe("Users")
      expect(result2).toBe("Users")
    })

    it("should return null when tag is not found", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "User Profile",
                  parent: "Users",
                },
              ],
            }),
        },
      }

      const result = selectTagParentField("Products")(mockSystem)
      expect(result).toBeNull()
    })

    it("should return null when tag has no parent field", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
              tags: [
                {
                  name: "Users",
                  description: "User operations",
                },
              ],
            }),
        },
      }

      const result = selectTagParentField("Users")(mockSystem)
      expect(result).toBeUndefined()
    })

    it("should return null when tags array is not present", () => {
      const mockSystem = {
        specSelectors: {
          specJson: () =>
            fromJS({
              openapi: "3.2.0",
            }),
        },
      }

      const result = selectTagParentField("Users")(mockSystem)
      expect(result).toBeNull()
    })
  })
})
