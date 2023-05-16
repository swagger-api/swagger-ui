/**
 * @prettier
 */
import React, { forwardRef, useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import * as propTypes from "../../prop-types"
import {
  useComponent,
  useLevel,
  useFn,
  useIsEmbedded,
  useIsExpanded,
  useIsExpandedDeeply,
  useIsCircular,
  useRenderedSchemas,
} from "../../hooks"
import {
  JSONSchemaLevelContext,
  JSONSchemaDeepExpansionContext,
  JSONSchemaCyclesContext,
} from "../../context"

const JSONSchema = forwardRef(
  ({ schema, name, dependentRequired, onExpand }, ref) => {
    const fn = useFn()
    const isExpanded = useIsExpanded()
    const isExpandedDeeply = useIsExpandedDeeply()
    const [expanded, setExpanded] = useState(isExpanded || isExpandedDeeply)
    const [expandedDeeply, setExpandedDeeply] = useState(isExpandedDeeply)
    const [level, nextLevel] = useLevel()
    const isEmbedded = useIsEmbedded()
    const isExpandable = fn.isExpandable(schema) || dependentRequired.length > 0
    const isCircular = useIsCircular(schema)
    const renderedSchemas = useRenderedSchemas(schema)
    const constraints = fn.stringifyConstraints(schema)
    const Accordion = useComponent("Accordion")
    const Keyword$schema = useComponent("Keyword$schema")
    const Keyword$vocabulary = useComponent("Keyword$vocabulary")
    const Keyword$id = useComponent("Keyword$id")
    const Keyword$anchor = useComponent("Keyword$anchor")
    const Keyword$dynamicAnchor = useComponent("Keyword$dynamicAnchor")
    const Keyword$ref = useComponent("Keyword$ref")
    const Keyword$dynamicRef = useComponent("Keyword$dynamicRef")
    const Keyword$defs = useComponent("Keyword$defs")
    const Keyword$comment = useComponent("Keyword$comment")
    const KeywordAllOf = useComponent("KeywordAllOf")
    const KeywordAnyOf = useComponent("KeywordAnyOf")
    const KeywordOneOf = useComponent("KeywordOneOf")
    const KeywordNot = useComponent("KeywordNot")
    const KeywordIf = useComponent("KeywordIf")
    const KeywordThen = useComponent("KeywordThen")
    const KeywordElse = useComponent("KeywordElse")
    const KeywordDependentSchemas = useComponent("KeywordDependentSchemas")
    const KeywordPrefixItems = useComponent("KeywordPrefixItems")
    const KeywordItems = useComponent("KeywordItems")
    const KeywordContains = useComponent("KeywordContains")
    const KeywordProperties = useComponent("KeywordProperties")
    const KeywordPatternProperties = useComponent("KeywordPatternProperties")
    const KeywordAdditionalProperties = useComponent(
      "KeywordAdditionalProperties"
    )
    const KeywordPropertyNames = useComponent("KeywordPropertyNames")
    const KeywordUnevaluatedItems = useComponent("KeywordUnevaluatedItems")
    const KeywordUnevaluatedProperties = useComponent(
      "KeywordUnevaluatedProperties"
    )
    const KeywordType = useComponent("KeywordType")
    const KeywordEnum = useComponent("KeywordEnum")
    const KeywordConst = useComponent("KeywordConst")
    const KeywordConstraint = useComponent("KeywordConstraint")
    const KeywordDependentRequired = useComponent("KeywordDependentRequired")
    const KeywordContentSchema = useComponent("KeywordContentSchema")
    const KeywordTitle = useComponent("KeywordTitle")
    const KeywordDescription = useComponent("KeywordDescription")
    const KeywordDefault = useComponent("KeywordDefault")
    const KeywordDeprecated = useComponent("KeywordDeprecated")
    const KeywordReadOnly = useComponent("KeywordReadOnly")
    const KeywordWriteOnly = useComponent("KeywordWriteOnly")
    const ExpandDeepButton = useComponent("ExpandDeepButton")

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
     * Event handlers.
     */
    const handleExpansion = useCallback(
      (e, expandedNew) => {
        setExpanded(expandedNew)
        !expandedNew && setExpandedDeeply(false)
        onExpand(e, expandedNew, false)
      },
      [onExpand]
    )
    const handleExpansionDeep = useCallback(
      (e, expandedDeepNew) => {
        setExpanded(expandedDeepNew)
        setExpandedDeeply(expandedDeepNew)
        onExpand(e, expandedDeepNew, true)
      },
      [onExpand]
    )

    return (
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
          <JSONSchemaCyclesContext.Provider value={renderedSchemas}>
            <article
              ref={ref}
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
                <KeywordDeprecated schema={schema} />
                <KeywordReadOnly schema={schema} />
                <KeywordWriteOnly schema={schema} />
                <KeywordType schema={schema} isCircular={isCircular} />
                {constraints.length > 0 &&
                  constraints.map((constraint) => (
                    <KeywordConstraint
                      key={`${constraint.scope}-${constraint.value}`}
                      constraint={constraint}
                    />
                  ))}
              </div>
              <div
                className={classNames("json-schema-2020-12-body", {
                  "json-schema-2020-12-body--collapsed": !expanded,
                })}
              >
                {expanded && (
                  <>
                    <KeywordDescription schema={schema} />
                    {!isCircular && isExpandable && (
                      <>
                        <KeywordProperties schema={schema} />
                        <KeywordPatternProperties schema={schema} />
                        <KeywordAdditionalProperties schema={schema} />
                        <KeywordUnevaluatedProperties schema={schema} />
                        <KeywordPropertyNames schema={schema} />
                        <KeywordAllOf schema={schema} />
                        <KeywordAnyOf schema={schema} />
                        <KeywordOneOf schema={schema} />
                        <KeywordNot schema={schema} />
                        <KeywordIf schema={schema} />
                        <KeywordThen schema={schema} />
                        <KeywordElse schema={schema} />
                        <KeywordDependentSchemas schema={schema} />
                        <KeywordPrefixItems schema={schema} />
                        <KeywordItems schema={schema} />
                        <KeywordUnevaluatedItems schema={schema} />
                        <KeywordContains schema={schema} />
                        <KeywordContentSchema schema={schema} />
                      </>
                    )}
                    <KeywordEnum schema={schema} />
                    <KeywordConst schema={schema} />
                    <KeywordDependentRequired
                      schema={schema}
                      dependentRequired={dependentRequired}
                    />
                    <KeywordDefault schema={schema} />
                    <Keyword$schema schema={schema} />
                    <Keyword$vocabulary schema={schema} />
                    <Keyword$id schema={schema} />
                    <Keyword$anchor schema={schema} />
                    <Keyword$dynamicAnchor schema={schema} />
                    <Keyword$ref schema={schema} />
                    {!isCircular && isExpandable && (
                      <Keyword$defs schema={schema} />
                    )}
                    <Keyword$dynamicRef schema={schema} />
                    <Keyword$comment schema={schema} />
                  </>
                )}
              </div>
            </article>
          </JSONSchemaCyclesContext.Provider>
        </JSONSchemaDeepExpansionContext.Provider>
      </JSONSchemaLevelContext.Provider>
    )
  }
)

JSONSchema.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  schema: propTypes.schema.isRequired,
  dependentRequired: PropTypes.arrayOf(PropTypes.string),
  onExpand: PropTypes.func,
}

JSONSchema.defaultProps = {
  name: "",
  dependentRequired: [],
  onExpand: () => {},
}

export default JSONSchema
