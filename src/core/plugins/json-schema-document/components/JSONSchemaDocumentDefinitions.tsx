/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import classNames from "classnames"

import { getDisplayName } from "../fn"

type Component = React.ComponentType<Record<string, unknown>>

export interface JSONSchemaDocumentDefinitionsProps {
  definitions: Record<string, unknown>
  JSONSchema: Component
  getComponent: (name: string) => unknown
  getTitle: (schema: unknown) => string
  isOpenDefault?: boolean
  /**
   * Remounts the entries, not the section (it keeps its open state), when it
   * changes: the expansion callbacks of an entry keep the paths of its first
   * render, which a resolved `$ref` can change.
   */
  entriesKey?: string
}

/**
 * The `$defs` of the root schema in a collapsible section below it, like the
 * Schemas section of an OpenAPI document, each definition rendered by the
 * given instance of the JSON Schema renderer. Each entry has an expansion path
 * token of its own: its name as a JSON string, not the renderer's default of
 * the schema's `$id` before its name, which another entry's name can equal.
 * Quoted, no name is a key inherited from `Object.prototype` (`constructor`),
 * nor the beginning of another entry's token (`Person`, `PersonAddress`), nor
 * the empty token of the root.
 */
const JSONSchemaDocumentDefinitions = ({
  definitions,
  JSONSchema,
  getComponent,
  getTitle,
  isOpenDefault = true,
  entriesKey = "",
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
          <JSONSchema
            key={`${entriesKey}:${name}`}
            name={getDisplayName(name, schema, getTitle)}
            identifier={JSON.stringify(name)}
            schema={schema}
          />
        ))}
      </Collapse>
    </section>
  )
}

export default JSONSchemaDocumentDefinitions
