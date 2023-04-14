/**
 * @prettier
 */
import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import * as propTypes from "../../prop-types"
import {
  useComponent,
  useFn,
  useLevel,
  useIsEmbedded,
  useIsExpandedDeeply,
} from "../../hooks"
import {
  JSONSchemaLevelContext,
  JSONSchemaDeepExpansionContext,
} from "../../context"

const JSONSchema = ({ schema, name }) => {
  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const [expandedDeeply, setExpandedDeeply] = useState(false)
  const fn = useFn()
  const [level, nextLevel] = useLevel()
  const isEmbedded = useIsEmbedded()
  const BooleanJSONSchema = useComponent("BooleanJSONSchema")
  const Accordion = useComponent("Accordion")
  const KeywordProperties = useComponent("KeywordProperties")
  const ExpandDeepButton = useComponent("ExpandDeepButton")

  /**
   * Event handlers.
   */
  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])
  const handleExpansionDeep = useCallback(() => {
    setExpanded((prev) => !prev)
    setExpandedDeeply((prev) => !prev)
  }, [])

  /**
   * Effects handlers.
   */
  useEffect(() => {
    setExpandedDeeply(isExpandedDeeply)
  }, [isExpandedDeeply])

  useEffect(() => {
    setExpandedDeeply(expandedDeeply)
  }, [expandedDeeply])

  /**
   * Rendering handlers.
   */
  if (fn.isBooleanJSONSchema(schema)) {
    return <BooleanJSONSchema schema={schema} name={name} />
  }

  return (
    <JSONSchemaLevelContext.Provider value={nextLevel}>
      <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
        <article
          data-json-schema-level={level}
          className={classNames("json-schema-2020-12", {
            "json-schema-2020-12--embedded": isEmbedded,
          })}
        >
          <div className="json-schema-2020-12-head">
            <Accordion expanded={expanded} onChange={handleExpansion}>
              <div className="json-schema-2020-12__title">
                {name || fn.getTitle(schema)}
              </div>
            </Accordion>
            <ExpandDeepButton
              expanded={expanded}
              onClick={handleExpansionDeep}
            />
          </div>
          {expanded && (
            <div className="json-schema-2020-12-body">
              <KeywordProperties schema={schema} />
            </div>
          )}
        </article>
      </JSONSchemaDeepExpansionContext.Provider>
    </JSONSchemaLevelContext.Provider>
  )
}

JSONSchema.propTypes = {
  name: PropTypes.string,
  schema: propTypes.schema.isRequired,
}

JSONSchema.defaultProps = {
  name: "",
}

export default JSONSchema
