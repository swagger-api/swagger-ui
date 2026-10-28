/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import classNames from "classnames"

type Component = React.ComponentType<Record<string, unknown>>

export interface JSONSchemaDocumentDefinitionsProps {
  definitions: Record<string, unknown>
  JSONSchema: Component
  getComponent: (name: string) => unknown
  isOpenDefault?: boolean
}

/**
 * The `$defs` of the root schema in a collapsible section below it, like the
 * Schemas section of an OpenAPI document, each definition rendered by the
 * given instance of the JSON Schema renderer.
 */
const JSONSchemaDocumentDefinitions = ({
  definitions,
  JSONSchema,
  getComponent,
  isOpenDefault = true,
}: JSONSchemaDocumentDefinitionsProps) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault)
  const Collapse = getComponent("Collapse") as Component
  const ArrowUpIcon = getComponent("ArrowUpIcon") as Component
  const ArrowDownIcon = getComponent("ArrowDownIcon") as Component

  const handleExpansion = useCallback(() => {
    setIsOpen((open) => !open)
  }, [])

  return (
    <section
      className={classNames("models", "json-schema-document__definitions", {
        "is-open": isOpen,
      })}
    >
      <h4>
        <button
          type="button"
          aria-expanded={isOpen}
          className="models-control"
          onClick={handleExpansion}
        >
          <span>Schemas ($defs)</span>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </button>
      </h4>
      <Collapse isOpened={isOpen}>
        {Object.entries(definitions).map(([name, schema]) => (
          <JSONSchema key={name} name={name} schema={schema} />
        ))}
      </Collapse>
    </section>
  )
}

export default JSONSchemaDocumentDefinitions
