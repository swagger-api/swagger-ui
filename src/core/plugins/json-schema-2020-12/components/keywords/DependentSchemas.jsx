/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import classNames from "classnames"

import { schema } from "../../prop-types"
import { useComponent, useIsExpanded, useIsExpandedDeeply } from "../../hooks"
import { JSONSchemaDeepExpansionContext } from "../../context"

const DependentSchemas = ({ schema }) => {
  const dependentSchemas = schema?.dependentSchemas || []
  const isExpanded = useIsExpanded()
  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpanded || isExpandedDeeply)
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

  /**
   * Rendering.
   */
  if (typeof dependentSchemas !== "object") return null
  if (Object.keys(dependentSchemas).length === 0) return null

  return (
    <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--dependentSchemas">
        <Accordion expanded={expanded} onChange={handleExpansion}>
          <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
            Dependent schemas
          </span>
        </Accordion>
        <ExpandDeepButton expanded={expanded} onClick={handleExpansionDeep} />
        <strong className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
          object
        </strong>
        <ul
          className={classNames("json-schema-2020-12-keyword__children", {
            "json-schema-2020-12-keyword__children--collapsed": !expanded,
          })}
        >
          {expanded && (
            <>
              {Object.entries(dependentSchemas).map(([schemaName, schema]) => (
                <li key={schemaName} className="json-schema-2020-12-property">
                  <JSONSchema name={schemaName} schema={schema} />
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </JSONSchemaDeepExpansionContext.Provider>
  )
}

DependentSchemas.propTypes = {
  schema: schema.isRequired,
}

export default DependentSchemas
