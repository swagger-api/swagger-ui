/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import {
  useComponent,
  useIsExpanded,
  useFn,
  usePath,
  useLevel,
  useConfig,
} from "../../../hooks"
import { JSONSchemaLevelContext, JSONSchemaPathContext } from "../../../context"
import { toSchemaObject } from "../../../fn"
import {
  HIDDEN,
  KEYWORD,
  KEYWORD_CHILDREN,
  KEYWORD_NAME,
} from "../../../styles"
import type { KeywordProps } from "../../../types"

const ExtensionKeywords = ({ schema }: KeywordProps) => {
  const fn = useFn()
  const pathToken = "ExtensionKeywords"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONViewer = useComponent("JSONViewer")
  const { showExtensionKeywords } = useConfig()
  const extensionKeywords = fn.getExtensionKeywords(schema)

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
  if (!showExtensionKeywords || extensionKeywords.length === 0) {
    return null
  }

  const schemaObject = toSchemaObject(schema)

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className={KEYWORD}
          data-keyword="extensionKeywords"
          data-json-schema-level={level}
          data-expanded={isExpanded ? "true" : "false"}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className={KEYWORD_NAME.extension}>Extension Keywords</span>
          </Accordion>
          <ExpandDeepButton
            expanded={isExpanded}
            onClick={handleExpansionDeep}
          />
          <ul className={classNames(KEYWORD_CHILDREN, !isExpanded && HIDDEN)}>
            {isExpanded && (
              <>
                {extensionKeywords.map((keyword) => (
                  <JSONViewer
                    key={keyword}
                    name={keyword}
                    value={schemaObject[keyword]}
                    tone="extension"
                  />
                ))}
              </>
            )}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

export default ExtensionKeywords
