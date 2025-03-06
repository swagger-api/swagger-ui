/**
 * @prettier
 */
import React, { forwardRef, useCallback } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import * as propTypes from "../../prop-types"
import {
  useComponent,
  useLevel,
  useFn,
  useIsEmbedded,
  useIsExpanded,
  useIsCircular,
  useRenderedSchemas,
  usePath,
} from "../../hooks"
import {
  JSONSchemaLevelContext,
  JSONSchemaCyclesContext,
  JSONSchemaPathContext,
} from "../../context"

const JSONSchema = forwardRef(
  (
    {
      schema,
      name = "",
      dependentRequired = [],
      onExpand = () => {},
      identifier = "",
    },
    ref
  ) => {
    const fn = useFn()
    // this implementation assumes that $id is always non-relative URI
    const pathToken = identifier || schema.$id || name
    const { path } = usePath(pathToken)
    const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
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
    const KeywordExamples = useComponent("KeywordExamples")
    const ExtensionKeywords = useComponent("ExtensionKeywords")
    const ExpandDeepButton = useComponent("ExpandDeepButton")

    /**
     * Event handlers.
     */
    const handleExpansion = useCallback(
      (e, expandedNew) => {
        if (expandedNew) {
          setExpanded()
        } else {
          setCollapsed()
        }
        onExpand(e, expandedNew, false)
      },
      [onExpand, setExpanded, setCollapsed]
    )
    const handleExpansionDeep = useCallback(
      (e, expandedDeepNew) => {
        if (expandedDeepNew) {
          setExpanded({ deep: true })
        } else {
          setCollapsed({ deep: true })
        }
        onExpand(e, expandedDeepNew, true)
      },
      [onExpand, setExpanded, setCollapsed]
    )

    return (
      <JSONSchemaPathContext.Provider value={path}>
        <JSONSchemaLevelContext.Provider value={nextLevel}>
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
                    <Accordion expanded={isExpanded} onChange={handleExpansion}>
                      <KeywordTitle title={name} schema={schema} />
                    </Accordion>
                    <ExpandDeepButton
                      expanded={isExpanded}
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
                  "json-schema-2020-12-body--collapsed": !isExpanded,
                })}
              >
                {isExpanded && (
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
                    <KeywordExamples schema={schema} />
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
                    <ExtensionKeywords schema={schema} />
                  </>
                )}
              </div>
            </article>
          </JSONSchemaCyclesContext.Provider>
        </JSONSchemaLevelContext.Provider>
      </JSONSchemaPathContext.Provider>
    )
  }
)

JSONSchema.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  schema: propTypes.schema.isRequired,
  dependentRequired: PropTypes.arrayOf(PropTypes.string),
  onExpand: PropTypes.func,
  identifier: PropTypes.string,
}

export default JSONSchema
