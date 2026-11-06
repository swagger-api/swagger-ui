/**
 * @prettier
 */
import React from "react"

import SkipToJSONSchema from "../components/SkipToJSONSchema"

type Component = React.ComponentType<Record<string, unknown>>

export interface System {
  specSelectors: {
    isJSONSchemaDocument: () => boolean
  }
}

/**
 * A JSON Schema document renders no operations: its skip link targets the
 * schema region instead. Every other document keeps "Skip to operations".
 */
const SkipToOperationsWrapper =
  (Original: Component, system: System) => (props: Record<string, unknown>) =>
    system.specSelectors.isJSONSchemaDocument() ? (
      <SkipToJSONSchema />
    ) : (
      <Original {...props} />
    )

export default SkipToOperationsWrapper
