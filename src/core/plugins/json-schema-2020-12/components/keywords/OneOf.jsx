/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import classNames from "classnames"

import { schema } from "../../prop-types"
import {
  useFn,
  useComponent,
  useIsExpanded,
  useIsExpandedDeeply,
} from "../../hooks"
import { JSONSchemaDeepExpansionContext } from "../../context"

const OneOf = ({ schema }) => {
  const oneOf = schema?.oneOf || []
  const fn = useFn()
  const isExpanded = useIsExpanded()
  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpanded || isExpandedDeeply)
  const [expandedDeeply, setExpandedDeeply] = useState(false)
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONSchema = useComponent("JSONSchema")
  const KeywordType = useComponent("KeywordType")

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
  if (!Array.isArray(oneOf) || oneOf.length === 0) {
    return null
  }

  return (
    <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--oneOf">
        <Accordion expanded={expanded} onChange={handleExpansion}>
          <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
            One of
          </span>
        </Accordion>
        <ExpandDeepButton expanded={expanded} onClick={handleExpansionDeep} />
        <KeywordType schema={{ oneOf }} />
        <ul
          className={classNames("json-schema-2020-12-keyword__children", {
            "json-schema-2020-12-keyword__children--collapsed": !expanded,
          })}
        >
          {expanded && (
            <>
              {oneOf.map((schema, index) => (
                <li key={`#${index}`} className="json-schema-2020-12-property">
                  <JSONSchema
                    name={`#${index} ${fn.getTitle(schema)}`}
                    schema={schema}
                  />
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </JSONSchemaDeepExpansionContext.Provider>
  )
}

OneOf.propTypes = {
  schema: schema.isRequired,
}

export default OneOf
