/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import { schema } from "../../prop-types"
import { useComponent, useIsExpanded, usePath, useLevel } from "../../hooks"
import { JSONSchemaLevelContext, JSONSchemaPathContext } from "../../context"
import { toSchemaObject } from "../../fn"
import {
  ATTRIBUTE,
  HIDDEN,
  KEYWORD,
  KEYWORD_CHILDREN,
  KEYWORD_NAME,
  PROPERTY,
} from "../../styles"
import type { KeywordProps } from "../../types"

const DependentSchemas = ({ schema }: KeywordProps) => {
  const dependentSchemas = toSchemaObject(schema).dependentSchemas || []
  const pathToken = "dependentSchemas"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Event handlers.
   */
  const handleExpansion = useCallback(() => {
    if (isExpanded) {
      setCollapsed()
    } else {
      setExpanded()
    }
  }, [isExpanded, setExpanded, setCollapsed])
  const handleExpansionDeep = useCallback(
    (e: unknown, expandedDeepNew: boolean) => {
      if (expandedDeepNew) {
        setExpanded({ deep: true })
      } else {
        setCollapsed({ deep: true })
      }
    },
    [setExpanded, setCollapsed]
  )

  /**
   * Rendering.
   */
  if (typeof dependentSchemas !== "object") return null
  if (Object.keys(dependentSchemas).length === 0) return null

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className={KEYWORD}
          data-keyword="dependentSchemas"
          data-json-schema-level={level}
          data-expanded={isExpanded ? "true" : "false"}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className={KEYWORD_NAME.primary}>Dependent schemas</span>
          </Accordion>
          <ExpandDeepButton
            expanded={isExpanded}
            onClick={handleExpansionDeep}
          />
          <strong className={ATTRIBUTE.primary}>object</strong>
          <ul className={classNames(KEYWORD_CHILDREN, !isExpanded && HIDDEN)}>
            {isExpanded && (
              <>
                {Object.entries(dependentSchemas).map(
                  ([schemaName, schema]) => (
                    <li key={schemaName} className={PROPERTY}>
                      <JSONSchema name={schemaName} schema={schema} />
                    </li>
                  )
                )}
              </>
            )}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

DependentSchemas.propTypes = {
  schema: schema.isRequired,
}

export default DependentSchemas
