/**
 * @prettier
 */
import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import * as propTypes from "../../prop-types"
import {
  useComponent,
  useLevel,
  useFn,
  useIsEmbedded,
  useIsExpandedDeeply,
} from "../../hooks"
import {
  JSONSchemaLevelContext,
  JSONSchemaDeepExpansionContext,
} from "../../context"

const JSONSchema = ({ schema, name }) => {
  const fn = useFn()
  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const [expandedDeeply, setExpandedDeeply] = useState(false)
  const [level, nextLevel] = useLevel()
  const isEmbedded = useIsEmbedded()
  const isExpandable = fn.isExpandable(schema)
  const Accordion = useComponent("Accordion")
  const KeywordProperties = useComponent("KeywordProperties")
  const KeywordType = useComponent("KeywordType")
  const KeywordFormat = useComponent("KeywordFormat")
  const KeywordTitle = useComponent("KeywordTitle")
  const KeywordDescription = useComponent("KeywordDescription")
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
            {isExpandable ? (
              <>
                <Accordion expanded={expanded} onChange={handleExpansion}>
                  <KeywordTitle title={name} schema={schema} />
                </Accordion>
                <ExpandDeepButton
                  expanded={expanded}
                  onClick={handleExpansionDeep}
                />
              </>
            ) : (
              <KeywordTitle title={name} schema={schema} />
            )}
            <KeywordType schema={schema} />
            <KeywordFormat schema={schema} />
          </div>
          {expanded && (
            <div className="json-schema-2020-12-body">
              <KeywordDescription schema={schema} />
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
