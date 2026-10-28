/**
 * @prettier
 */
import React, { useEffect, useMemo } from "react"
import { Map } from "immutable"

import { makeJSONSchema202012Overrides } from "../overrides"
import JSONSchemaDocumentDefinitions from "./JSONSchemaDocumentDefinitions"
import type { OverridesSystem } from "../overrides"
import { JSON_SCHEMA_DOCUMENT_ID } from "../fn"

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
    defaultModelsExpandDepth?: number
    docExpansion?: string
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
  const {
    defaultModelExpandDepth,
    defaultModelsExpandDepth = 1,
    docExpansion,
    showExtensions,
  } = getConfigs()
  // a boolean is a valid root schema, e.g. a `$ref` to `false`
  const isResolved =
    typeof resolvedDocument === "boolean" ||
    (Map.isMap(resolvedDocument) && resolvedDocument.size > 0)
  const { getTitle } = getSystem().fn.jsonSchema202012

  useEffect(() => {
    if (!isResolved) {
      specActions.requestResolvedSubtree([])
    }
    // once per document: a failed resolution isn't retried on every re-render
  }, [specJson])

  // the root `$defs` are listed in their own section, not as a root keyword
  const { schema, definitions } = useMemo(() => {
    if (typeof resolvedDocument === "boolean") {
      return { schema: resolvedDocument, definitions: null }
    }

    const { $defs, ...rest } = (
      isResolved ? (resolvedDocument as Map<string, unknown>) : specJson
    ).toJS()
    const hasDefinitions =
      $defs !== null &&
      typeof $defs === "object" &&
      !Array.isArray($defs) &&
      Object.keys($defs).length > 0

    return hasDefinitions
      ? { schema: rest, definitions: $defs as Record<string, unknown> }
      : {
          schema: { ...rest, ...($defs === undefined ? {} : { $defs }) },
          definitions: null,
        }
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
  const Info = getComponent("JSONSchemaDocumentInfo", true) as Component

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
      <Row className="information-container">
        <Col mobile={12}>
          <Info />
        </Col>
      </Row>
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
      {definitions !== null && defaultModelsExpandDepth >= 0 && (
        <Row className="json-schema-document-definitions">
          <Col mobile={12}>
            <JSONSchemaDocumentDefinitions
              definitions={definitions}
              JSONSchema={JSONSchemaInstance}
              getComponent={getComponent}
              isOpenDefault={
                defaultModelsExpandDepth > 0 && docExpansion !== "none"
              }
            />
          </Col>
        </Row>
      )}
    </main>
  )
}

export default JSONSchemaDocument
