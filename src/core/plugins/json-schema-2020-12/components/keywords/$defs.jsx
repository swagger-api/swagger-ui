/**
 * @prettier
 */
import React, { useCallback, useState } from "react"

import { schema } from "../../prop-types"
import { useComponent, useIsExpandedDeeply } from "../../hooks"
import { JSONSchemaDeepExpansionContext } from "../../context"

const $defs = ({ schema }) => {
  const $defs = schema?.$defs || {}

  if (Object.keys($defs).length === 0) {
    return null
  }

  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const [expandedDeeply, setExpandedDeeply] = useState(false)
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Event handlers.
   */
  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])
  const handleExpansionDeep = useCallback((e, expandedDeepNew) => {
    setExpanded(expandedDeepNew)
    setExpandedDeeply(expandedDeepNew)
  }, [])

  return (
    <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$defs">
        <Accordion expanded={expanded} onChange={handleExpansion}>
          <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
            $defs
          </span>
        </Accordion>
        <ExpandDeepButton expanded={expanded} onClick={handleExpansionDeep} />
        <span className="json-schema-2020-12__type">object</span>
        {expanded && (
          <ul>
            {Object.entries($defs).map(([schemaName, schema]) => (
              <li key={schemaName} className="json-schema-2020-12-property">
                <JSONSchema name={schemaName} schema={schema} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </JSONSchemaDeepExpansionContext.Provider>
  )
}

$defs.propTypes = {
  schema: schema.isRequired,
}

export default $defs
