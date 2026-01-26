/**
 * @prettier
 */
import { Map } from "immutable"
import { createSelector } from "reselect"
import { isOAS32 } from "../fn"

/**
 * Detects if the current spec is OAS 3.2.x
 */
export const selectIsOAS32 = (state, system) => () => {
  const spec = system.specSelectors.specJson()
  return isOAS32(spec)
}

/**
 * Selects the $self field from the OpenAPI Object
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#openapi-object
 *
 * The $self field provides the self-assigned URI of the document,
 * serving as its base URI for reference resolution.
 */
export const selectSelfUriField = createSelector(
  (state) => state,
  (state) => {
    const spec = state.getIn(["spec", "json"])
    return spec.get("$self")
  }
)

/**
 * Selects the mediaTypes from Components Object
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#components-object
 *
 * Holds reusable Media Type Objects for component-level reference.
 */
export const selectMediaTypes = createSelector(
  (state) => state,
  (state) => {
    const spec = state.getIn(["spec", "json"])
    const components = spec.get("components")
    if (!components) return Map()
    return components.get("mediaTypes") || Map()
  }
)

/**
 * Selects the pathItems from Components Object
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#components-object
 *
 * Provides reusable Path Item Objects for consistent endpoint definitions.
 */
export const selectPathItems = createSelector(
  (state) => state,
  (state) => {
    const spec = state.getIn(["spec", "json"])
    const components = spec.get("components")
    if (!components) return Map()
    return components.get("pathItems") || Map()
  }
)

/**
 * Checks if a path item has the QUERY operation
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 *
 * Supports QUERY HTTP method per draft-ietf-httpbis-safe-method-w-body
 */
export const selectPathItemQuery = (path) =>
  createSelector(
    (state) => state,
    (state) => {
      const spec = state.getIn(["spec", "json"])
      const paths = spec.get("paths")
      if (!paths) return null

      const pathItem = paths.get(path)
      if (!pathItem) return null

      return pathItem.get("query") || null
    }
  )

/**
 * Selects additionalOperations from a path item
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 *
 * Allows defining custom HTTP methods beyond standard ones
 */
export const selectPathItemAdditionalOperations = (path) =>
  createSelector(
    (state) => state,
    (state) => {
      const spec = state.getIn(["spec", "json"])
      const paths = spec.get("paths")
      if (!paths) return Map()

      const pathItem = paths.get(path)
      if (!pathItem) return Map()

      return pathItem.get("additionalOperations") || Map()
    }
  )

/**
 * Checks if any path has QUERY operations
 */
export const selectHasQueryOperations = createSelector(
  (state) => state,
  (state) => {
    const spec = state.getIn(["spec", "json"])
    const paths = spec.get("paths")
    if (!paths || !paths.size) return false

    return paths.some((pathItem) => pathItem && pathItem.has("query"))
  }
)

/**
 * Checks if any path has additionalOperations
 */
export const selectHasAdditionalOperations = createSelector(
  (state) => state,
  (state) => {
    const spec = state.getIn(["spec", "json"])
    const paths = spec.get("paths")
    if (!paths || !paths.size) return false

    return paths.some(
      (pathItem) =>
        pathItem &&
        pathItem.has("additionalOperations") &&
        pathItem.get("additionalOperations").size > 0
    )
  }
)

/**
 * Selects all additionalOperations from all paths
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 *
 * Returns operations grouped by path in the format:
 * {
 *   "/resource": [
 *     {
 *       operation: Map({ operation }),
 *       method: "COPY",
 *       path: "/resource",
 *       specPath: ["paths", "/resource", "additionalOperations", "COPY"]
 *     }
 *   ]
 * }
 */
export const selectAdditionalOperations = createSelector(
  (state) => state,
  (state, system) => system.specSelectors.specResolvedSubtree(["paths"]),
  (state) => {
    const spec = state.getIn(["spec", "json"])
    const paths = spec.get("paths")

    if (!paths || !Map.isMap(paths) || !paths.size) {
      return {}
    }

    const allOperations = []

    paths.forEach((pathItem, pathName) => {
      if (!pathItem || !Map.isMap(pathItem)) return

      const additionalOperations = pathItem.get("additionalOperations")
      if (!additionalOperations || !Map.isMap(additionalOperations)) return

      additionalOperations.forEach((operation, method) => {
        allOperations.push({
          operation: Map({ operation }),
          method,
          path: pathName,
          specPath: ["paths", pathName, "additionalOperations", method],
        })
      })
    })

    // Group by path
    const grouped = {}
    allOperations.forEach((operationDTO) => {
      const path = operationDTO.path
      if (!grouped[path]) {
        grouped[path] = []
      }
      grouped[path].push(operationDTO)
    })

    return grouped
  }
)

/**
 * Selects the summary field from a tag
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#tag-object
 *
 * The summary field provides a short summary of the tag.
 */
export const selectTagSummaryField = (tagName) =>
  createSelector(
    (state) => state,
    (state) => {
      const spec = state.getIn(["spec", "json"])
      const tags = spec.get("tags")
      if (!tags || !tags.size) return null

      const tag = tags.find((t) => t.get("name") === tagName)
      return tag ? tag.get("summary") : null
    }
  )

/**
 * Selects the kind field from a tag
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#tag-object
 *
 * The kind field categorizes the tag (e.g., "webhook", "callback", etc.).
 */
export const selectTagKindField = (tagName) =>
  createSelector(
    (state) => state,
    (state) => {
      const spec = state.getIn(["spec", "json"])
      const tags = spec.get("tags")
      if (!tags || !tags.size) return null

      const tag = tags.find((t) => t.get("name") === tagName)
      return tag ? tag.get("kind") : null
    }
  )

/**
 * Selects the parent field from a tag
 * OAS 3.2 spec reference: https://spec.openapis.org/oas/v3.2.0.html#tag-object
 *
 * The parent field establishes a hierarchical relationship between tags.
 */
export const selectTagParentField = (tagName) =>
  createSelector(
    (state) => state,
    (state) => {
      const spec = state.getIn(["spec", "json"])
      const tags = spec.get("tags")
      if (!tags || !tags.size) return null

      const tag = tags.find((t) => t.get("name") === tagName)
      return tag ? tag.get("parent") : null
    }
  )
