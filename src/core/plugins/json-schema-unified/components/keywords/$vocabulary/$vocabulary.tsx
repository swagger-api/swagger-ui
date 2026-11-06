/**
 * @prettier
 */
import React, { useCallback } from "react"

import { schema } from "../../../prop-types"
import { useComponent, useIsExpanded, usePath } from "../../../hooks"
import { JSONSchemaPathContext } from "../../../context"
import { toSchemaObject } from "../../../fn"
import {
  ATTRIBUTE,
  KEYWORD,
  KEYWORD_NAME,
  KEYWORD_VALUE,
  VOCABULARY_LIST,
  VOCABULARY_URI,
} from "../../../styles"
import type { KeywordProps } from "../../../types"

const $vocabulary = ({ schema }: KeywordProps) => {
  const pathToken = "$vocabulary"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const Accordion = useComponent("Accordion")
  const vocabulary = toSchemaObject(schema).$vocabulary

  const handleExpansion = useCallback(() => {
    if (isExpanded) {
      setCollapsed()
    } else {
      setExpanded()
    }
  }, [isExpanded, setExpanded, setCollapsed])

  /**
   * Rendering.
   */
  if (!vocabulary) return null
  if (typeof vocabulary !== "object") return null

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <div
        className={KEYWORD}
        data-keyword="$vocabulary"
        data-expanded={isExpanded ? "true" : "false"}
      >
        <Accordion expanded={isExpanded} onChange={handleExpansion}>
          <span className={KEYWORD_NAME.secondary}>$vocabulary</span>
        </Accordion>
        <strong className={ATTRIBUTE.primary}>object</strong>
        <ul className={VOCABULARY_LIST}>
          {isExpanded &&
            Object.entries(vocabulary).map(([uri, enabled]) => (
              <li
                key={uri}
                className={
                  enabled ? VOCABULARY_URI.enabled : VOCABULARY_URI.disabled
                }
              >
                <span className={KEYWORD_VALUE.secondary}>{uri}</span>
              </li>
            ))}
        </ul>
      </div>
    </JSONSchemaPathContext.Provider>
  )
}

$vocabulary.propTypes = {
  schema: schema.isRequired,
}

export default $vocabulary
