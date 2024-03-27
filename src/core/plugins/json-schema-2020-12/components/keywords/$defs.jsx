/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import classNames from "classnames"

import { schema } from "../../prop-types"
import { useComponent, useIsExpanded, useIsExpandedDeeply } from "../../hooks"
import { JSONSchemaDeepExpansionContext } from "../../context"

const $defs = ({ schema }) => {
  const $defs = schema?.$defs || {}
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
  if (Object.keys($defs).length === 0) {
    return null
  }

  return (
    <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$defs">
        <Accordion expanded={expanded} onChange={handleExpansion}>
          <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
            $defs
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
              {Object.entries($defs).map(([schemaName, schema]) => (
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

$defs.propTypes = {
  schema: schema.isRequired,
}

export default $defs
