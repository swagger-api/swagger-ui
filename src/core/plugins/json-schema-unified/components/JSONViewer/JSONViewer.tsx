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
} from "../../hooks"
import { JSONSchemaLevelContext, JSONSchemaPathContext } from "../../context"
import { isEmptyObject, isEmptyArray } from "../../fn"
import {
  ATTRIBUTE,
  HIDDEN,
  JSON_VIEWER_NAME,
  JSON_VIEWER_VALUE,
  KEYWORD,
  KEYWORD_CHILDREN,
  PROPERTY,
} from "../../styles"
import type { Tone } from "../../styles"

export interface JSONViewerProps {
  name: string
  value: unknown
  /** Extra `sui:` classes for the root of this viewer and of its nested viewers. */
  className?: string
  /** Color scope of names and values; replaces the SCSS scoping classes. Inherited by nested viewers. */
  tone?: Tone
  /** Rendered as `data-keyword` on the root of this viewer only. */
  keyword?: string
}

const JSONViewer = ({
  name,
  value,
  className,
  tone = "secondary",
  keyword,
}: JSONViewerProps) => {
  const fn = useFn()
  const { path } = usePath(name)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(name)
  const [level, nextLevel] = useLevel()
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const isPrimitive =
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "bigint" ||
    typeof value === "boolean" ||
    typeof value === "symbol" ||
    value == null
  const isEmpty = isEmptyObject(value) || isEmptyArray(value)

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
  if (isPrimitive) {
    return (
      <div
        className={classNames(KEYWORD, className)}
        data-keyword={keyword}
        data-json-viewer-tone={tone}
      >
        <span className={JSON_VIEWER_NAME[tone]}>{name}</span>
        <span className={JSON_VIEWER_VALUE[tone]} data-json-viewer-value="">
          {fn.stringify(value)}
        </span>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div
        className={classNames(KEYWORD, className)}
        data-keyword={keyword}
        data-json-viewer-tone={tone}
      >
        <span className={JSON_VIEWER_NAME[tone]}>{name}</span>
        <strong className={ATTRIBUTE.primary}>
          {Array.isArray(value) ? "empty array" : "empty object"}
        </strong>
      </div>
    )
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className={classNames(KEYWORD, className)}
          data-json-schema-level={level}
          data-keyword={keyword}
          data-json-viewer-tone={tone}
          data-expanded={isExpanded ? "true" : "false"}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className={JSON_VIEWER_NAME[tone]}>{name}</span>
          </Accordion>
          <ExpandDeepButton
            expanded={isExpanded}
            onClick={handleExpansionDeep}
          />
          <strong className={ATTRIBUTE.primary}>
            {Array.isArray(value) ? "array" : "object"}
          </strong>
          <ul
            className={classNames(KEYWORD_CHILDREN, !isExpanded && HIDDEN)}
            data-json-viewer-children=""
          >
            {isExpanded && (
              <>
                {Array.isArray(value)
                  ? value.map((item, index) => (
                      <li key={`#${index}`} className={PROPERTY}>
                        <JSONViewer
                          name={`#${index}`}
                          value={item}
                          className={className}
                          tone={tone}
                        />
                      </li>
                    ))
                  : Object.entries(value as object).map(
                      ([propertyName, propertyValue]) => (
                        <li key={propertyName} className={PROPERTY}>
                          <JSONViewer
                            name={propertyName}
                            value={propertyValue}
                            className={className}
                            tone={tone}
                          />
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

export default JSONViewer
