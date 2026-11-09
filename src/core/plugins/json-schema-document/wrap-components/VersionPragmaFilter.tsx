/**
 * @prettier
 */
import React from "react"

import UnsupportedDialect from "../components/UnsupportedDialect"

type Component = React.ComponentType<Record<string, unknown>>

export interface VersionPragmaFilterProps {
  bypass?: boolean
  alsoShow?: React.ReactNode
  [prop: string]: unknown
}

export interface System {
  specSelectors: {
    isJSONSchemaDocument: () => boolean
    isUnsupportedJSONSchemaDocument: () => boolean
    rootSchemaKeyword: () => string
  }
  getComponent: (
    name: string,
    container?: boolean,
    config?: { failSilently?: boolean }
  ) => unknown
  fn: Record<string, unknown>
}

/**
 * Wraps the filter of the OpenAPI plugins (loaded before this one), which
 * renders the OpenAPI layout or "Unable to render this definition":
 *
 * - a JSON Schema document of a supported dialect renders `JSONSchemaDocument`;
 * - a document whose root `$schema` names an unsupported dialect gets a message
 *   naming it and the supported dialects;
 * - every other document renders exactly what the wrapped filter renders.
 */
const VersionPragmaFilterWrapper =
  (Original: Component, system: System) =>
  (props: VersionPragmaFilterProps) => {
    const { specSelectors, getComponent, fn } = system
    const { bypass, alsoShow } = props

    if (!bypass && specSelectors.isJSONSchemaDocument()) {
      const JSONSchemaDocument = getComponent(
        "JSONSchemaDocument",
        true
      ) as Component
      const ErrorBoundary = getComponent("ErrorBoundary", false, {
        failSilently: true,
      }) as Component | null
      const document = <JSONSchemaDocument />

      return (
        <div>
          {alsoShow}
          {ErrorBoundary ? (
            <ErrorBoundary
              targetName="JSONSchemaDocument"
              getComponent={getComponent}
              fn={fn}
            >
              {document}
            </ErrorBoundary>
          ) : (
            document
          )}
        </div>
      )
    }

    if (!bypass && specSelectors.isUnsupportedJSONSchemaDocument()) {
      return (
        <UnsupportedDialect
          $schema={specSelectors.rootSchemaKeyword()}
          alsoShow={alsoShow}
        />
      )
    }

    return <Original {...props} />
  }

export default VersionPragmaFilterWrapper
