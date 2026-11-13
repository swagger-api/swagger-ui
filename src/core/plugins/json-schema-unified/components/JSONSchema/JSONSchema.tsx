/**
 * @prettier
 */
import React, { forwardRef, useCallback } from "react"
import classNames from "classnames"

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
import { toSchemaObject } from "../../fn"
import { HIDDEN, SCHEMA, SCHEMA_BACKGROUND, SCHEMA_BODY } from "../../styles"
import type { Schema } from "../../types"

export interface JSONSchemaProps {
  schema: Schema
  name?: string | React.ReactElement
  dependentRequired?: string[]
  onExpand?: (event: unknown, expanded: boolean, deep: boolean) => void
  identifier?: string
  /**
   * Rendered at the end of the schema's head, outside the expansion toggle
   * (the Schemas section puts the `JumpToPath` of each schema here).
   */
  titleAddon?: React.ReactNode
}

const JSONSchema = forwardRef(
  (
    {
      schema,
      name = "",
      dependentRequired = [],
      onExpand = () => {},
      identifier = "",
      titleAddon = null,
    }: JSONSchemaProps,
    ref: React.Ref<HTMLElement>
  ) => {
    const fn = useFn()
    // this implementation assumes that $id is always non-relative URI
    const pathToken = identifier || toSchemaObject(schema).$id || name
    const { path } = usePath(pathToken)
    const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
    const [level, nextLevel] = useLevel()
    const isEmbedded = useIsEmbedded()
    const isExpandable = fn.isExpandable(schema) || dependentRequired.length > 0
    const isCircular = useIsCircular(schema)
    const renderedSchemas = useRenderedSchemas(schema)
    const constraints = fn.stringifyConstraints(schema)
    const renderedTitle = name || fn.getTitle(schema)
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
      (e: unknown, expandedNew: boolean) => {
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
      (e: unknown, expandedDeepNew: boolean) => {
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
              data-json-schema-unified=""
              data-json-schema-level={level}
              data-schema-name={
                typeof renderedTitle === "string" && renderedTitle !== ""
                  ? renderedTitle
                  : undefined
              }
              data-expanded={
                isExpandable && !isCircular
                  ? isExpanded
                    ? "true"
                    : "false"
                  : undefined
              }
              className={classNames(
                SCHEMA,
                isEmbedded ? SCHEMA_BACKGROUND.embedded : SCHEMA_BACKGROUND.root
              )}
            >
              <div>
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
                {titleAddon}
              </div>
              <div className={classNames(SCHEMA_BODY, !isExpanded && HIDDEN)}>
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

export default JSONSchema
