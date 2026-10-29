/**
 * @prettier
 */
import React, { useEffect, useMemo } from "react"
import { Map } from "immutable"

import { makeJSONSchema202012Overrides } from "../overrides"
import type { OverridesSystem } from "../overrides"

type Component = React.ComponentType<Record<string, unknown>>
type WithJSONSchemaContext = (
  component: Component,
  overrides: Record<string, unknown>
) => Component

export interface JSONSchemaDocumentProps {
  specSelectors: {
    specJson: () => Map<string, unknown>
    specResolvedSubtree: (path: string[]) => unknown
    jsonSchemaDialect: () => string | null
  }
  specActions: {
    requestResolvedSubtree: (path: string[]) => void
  }
  getComponent: (name: string, container?: boolean) => unknown
  getConfigs: () => {
    defaultModelExpandDepth?: number
    showExtensions?: boolean
  }
  getSystem: () => OverridesSystem
}

/**
 * Renders a standalone JSON Schema document: the root schema, resolved by
 * swagger-client, through an instance of the JSON Schema 2020-12 renderer
 * configured for the document's dialect. The instance takes none of the
 * OpenAPI `fn` overrides, so OpenAPI keywords and behaviour don't apply.
 */
const JSONSchemaDocument = ({
  specSelectors,
  specActions,
  getComponent,
  getConfigs,
  getSystem,
}: JSONSchemaDocumentProps) => {
  const specJson = specSelectors.specJson()
  const resolvedDocument = specSelectors.specResolvedSubtree([])
  const dialect = specSelectors.jsonSchemaDialect()
  const { defaultModelExpandDepth, showExtensions } = getConfigs()
  const isResolved = Map.isMap(resolvedDocument) && resolvedDocument.size > 0

  useEffect(() => {
    if (!isResolved) {
      specActions.requestResolvedSubtree([])
    }
    // once per document: a failed resolution isn't retried on every re-render
  }, [specJson])

  const schema = useMemo(
    () =>
      (isResolved
        ? (resolvedDocument as Map<string, unknown>)
        : specJson
      ).toJS(),
    [isResolved, resolvedDocument, specJson]
  )

  const JSONSchema = getComponent("JSONSchema202012") as Component
  const withJSONSchemaSystemContext = getComponent(
    "withJSONSchema202012SystemContext"
  ) as WithJSONSchemaContext
  // creating the instance is expensive, and it holds the expansion state
  const JSONSchemaInstance = useMemo(
    () =>
      withJSONSchemaSystemContext(JSONSchema, {
        config: {
          default$schema: dialect,
          defaultExpandedLevels: defaultModelExpandDepth,
        },
        ...makeJSONSchema202012Overrides(getSystem),
      }),
    [
      withJSONSchemaSystemContext,
      JSONSchema,
      dialect,
      defaultModelExpandDepth,
      showExtensions,
      getSystem,
    ]
  )

  const Row = getComponent("Row") as Component
  const Col = getComponent("Col") as Component

  return (
    <Row className="json-schema-document">
      <Col mobile={12}>
        <JSONSchemaInstance schema={schema} />
      </Col>
    </Row>
  )
}

export default JSONSchemaDocument
