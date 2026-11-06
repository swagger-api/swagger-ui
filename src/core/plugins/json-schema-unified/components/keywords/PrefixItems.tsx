/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import { schema } from "../../prop-types"
import {
  useFn,
  useComponent,
  useIsExpanded,
  usePath,
  useLevel,
} from "../../hooks"
import { JSONSchemaLevelContext, JSONSchemaPathContext } from "../../context"
import { toSchemaObject } from "../../fn"
import {
  HIDDEN,
  KEYWORD,
  KEYWORD_CHILDREN,
  KEYWORD_NAME,
  PROPERTY,
} from "../../styles"
import type { KeywordProps } from "../../types"

const PrefixItems = ({ schema }: KeywordProps) => {
  const prefixItems = toSchemaObject(schema).prefixItems || []
  const fn = useFn()
  const pathToken = "prefixItems"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONSchema = useComponent("JSONSchema")
  const KeywordType = useComponent("KeywordType")

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
  if (!Array.isArray(prefixItems) || prefixItems.length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className={KEYWORD}
          data-keyword="prefixItems"
          data-json-schema-level={level}
          data-expanded={isExpanded ? "true" : "false"}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className={KEYWORD_NAME.primary}>Prefix items</span>
          </Accordion>
          <ExpandDeepButton
            expanded={isExpanded}
            onClick={handleExpansionDeep}
          />
          <KeywordType schema={{ prefixItems }} />
          <ul className={classNames(KEYWORD_CHILDREN, !isExpanded && HIDDEN)}>
            {isExpanded && (
              <>
                {prefixItems.map((schema, index) => (
                  <li key={`#${index}`} className={PROPERTY}>
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
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

PrefixItems.propTypes = {
  schema: schema.isRequired,
}

export default PrefixItems
