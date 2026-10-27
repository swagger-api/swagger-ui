/**
 * @prettier
 */
import React from "react"
import { Map } from "immutable"

import UnsupportedDialect from "../components/UnsupportedDialect"
import { getRootSchemaKeyword, isUnsupportedJSONSchemaDocument } from "../fn"

type Component = React.ComponentType<Record<string, unknown>>

export interface VersionPragmaFilterProps {
  bypass?: boolean
  alsoShow?: React.ReactNode
  [prop: string]: unknown
}

export interface System {
  specSelectors: {
    specJson: () => Map<string, unknown>
    isJSONSchemaDocument: () => boolean
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

    const specJson = specSelectors.specJson()
    if (!bypass && isUnsupportedJSONSchemaDocument(specJson)) {
      return (
        <UnsupportedDialect
          $schema={getRootSchemaKeyword(specJson)}
          alsoShow={alsoShow}
        />
      )
    }

    return <Original {...props} />
  }

export default VersionPragmaFilterWrapper
