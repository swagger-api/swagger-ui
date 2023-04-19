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
  useIsCircular,
  useRenderedSchemas,
} from "../../hooks"
import {
  JSONSchemaLevelContext,
  JSONSchemaDeepExpansionContext,
  JSONSchemaCyclesContext,
} from "../../context"

const JSONSchema = ({ schema, name }) => {
  const fn = useFn()
  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const [expandedDeeply, setExpandedDeeply] = useState(false)
  const [level, nextLevel] = useLevel()
  const isEmbedded = useIsEmbedded()
  const isExpandable = fn.isExpandable(schema)
  const isCircular = useIsCircular(schema)
  const renderedSchemas = useRenderedSchemas(schema)
  const Accordion = useComponent("Accordion")
  const Keyword$schema = useComponent("Keyword$schema")
  const Keyword$vocabulary = useComponent("Keyword$vocabulary")
  const Keyword$id = useComponent("Keyword$id")
  const Keyword$anchor = useComponent("Keyword$anchor")
  const Keyword$dynamicAnchor = useComponent("Keyword$dynamicAnchor")
  const Keyword$ref = useComponent("Keyword$ref")
  const Keyword$dynamicRef = useComponent("Keyword$dynamicRef")
  const Keyword$defs = useComponent("Keyword$defs")
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
        <JSONSchemaCyclesContext.Provider value={renderedSchemas}>
          <article
            data-json-schema-level={level}
            className={classNames("json-schema-2020-12", {
              "json-schema-2020-12--embedded": isEmbedded,
              "json-schema-2020-12--circular": isCircular,
            })}
          >
            <div className="json-schema-2020-12-head">
              {isExpandable && !isCircular ? (
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
              <KeywordType schema={schema} isCircular={isCircular} />
              <KeywordFormat schema={schema} />
            </div>
            {expanded && (
              <div className="json-schema-2020-12-body">
                <KeywordDescription schema={schema} />
                {!isCircular && isExpandable && (
                  <KeywordProperties schema={schema} />
                )}
                <Keyword$schema schema={schema} />
                <Keyword$vocabulary schema={schema} />
                <Keyword$id schema={schema} />
                <Keyword$anchor schema={schema} />
                <Keyword$dynamicAnchor schema={schema} />
                <Keyword$ref schema={schema} />
                <Keyword$dynamicRef schema={schema} />
                <Keyword$defs schema={schema} />
              </div>
            )}
          </article>
        </JSONSchemaCyclesContext.Provider>
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
