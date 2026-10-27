/**
 * @prettier
 */

export type RequestResolvedSubtree = (path: string[]) => unknown

export interface System {
  specSelectors: {
    isJSONSchemaDocument: () => boolean
  }
}

/**
 * A JSON Schema document is resolved as a whole: whatever subtree is
 * requested, resolve the root. Its `$id`s and `$anchor`s can make any
 * reference depend on the whole document, and a request for a path the
 * document doesn't have (`updateJsonSpec` asks for
 * `["components", "securitySchemes"]` for every document) would otherwise
 * store an empty value under that path and add it to the rendered schema.
 */
export const requestResolvedSubtree =
  (oriAction: RequestResolvedSubtree, system: System) => (path: string[]) =>
    oriAction(system.specSelectors.isJSONSchemaDocument() ? [] : path)
