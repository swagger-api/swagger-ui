/**
 * @prettier
 */
import React, { useEffect, useMemo } from "react"
import { Map } from "immutable"

import { JSON_SCHEMA_DOCUMENT_ID, makeGetSchemaKeywords } from "../fn"

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
  fn: {
    jsonSchema202012: {
      getSchemaKeywords: () => string[]
      getTitle?: (schema: unknown) => string
    }
  }
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
  fn,
}: JSONSchemaDocumentProps) => {
  const specJson = specSelectors.specJson()
  const resolvedDocument = specSelectors.specResolvedSubtree([])
  const dialect = specSelectors.jsonSchemaDialect()
  const { defaultModelExpandDepth, showExtensions } = getConfigs()
  // a boolean is a valid root schema, e.g. a `$ref` to `false`
  const isResolved =
    typeof resolvedDocument === "boolean" ||
    (Map.isMap(resolvedDocument) && resolvedDocument.size > 0)
  const { getSchemaKeywords, getTitle } = fn.jsonSchema202012

  useEffect(() => {
    if (!isResolved) {
      specActions.requestResolvedSubtree([])
    }
    // once per document: a failed resolution isn't retried on every re-render
  }, [specJson])

  const schema = useMemo(() => {
    if (typeof resolvedDocument === "boolean") return resolvedDocument
    return (
      isResolved ? (resolvedDocument as Map<string, unknown>) : specJson
    ).toJS()
  }, [isResolved, resolvedDocument, specJson])

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
        fn: {
          getSchemaKeywords: makeGetSchemaKeywords(getSchemaKeywords),
        },
      }),
    [
      withJSONSchemaSystemContext,
      JSONSchema,
      dialect,
      defaultModelExpandDepth,
      showExtensions,
      getSchemaKeywords,
    ]
  )

  const Row = getComponent("Row") as Component
  const Col = getComponent("Col") as Component

  // without a title, `$anchor` or `$id` the expand button would have no
  // accessible name; schema-provided titles are kept
  const name = getTitle?.(schema) ? undefined : "Schema"

  return (
    <main
      id={JSON_SCHEMA_DOCUMENT_ID}
      aria-label="JSON Schema"
      tabIndex={-1}
      style={{ outline: "none" }}
    >
      <Row className="json-schema-document">
        <Col mobile={12}>
          {/* the paths of the expansion callbacks come from the first render:
              remount when the resolved schema (its title, `$id`s) replaces the raw one */}
          <JSONSchemaInstance
            key={isResolved ? "resolved" : "raw"}
            schema={schema}
            name={name}
          />
        </Col>
      </Row>
    </main>
  )
}

export default JSONSchemaDocument
