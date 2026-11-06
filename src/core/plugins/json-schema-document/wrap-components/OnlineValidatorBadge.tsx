/**
 * @prettier
 */
import React from "react"

type Component = React.ComponentType<Record<string, unknown>>

export interface System {
  specSelectors: {
    isJSONSchemaDocument: () => boolean
  }
}

/**
 * The online validator validates OpenAPI definitions: it is no use for a JSON
 * Schema document, and would send the document's URL to a third party for
 * nothing. Every other document keeps the badge.
 */
const OnlineValidatorBadgeWrapper =
  (Original: Component, system: System) => (props: Record<string, unknown>) =>
    system.specSelectors.isJSONSchemaDocument() ? null : <Original {...props} />

export default OnlineValidatorBadgeWrapper
