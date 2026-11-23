/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import {
  useComponent,
  useConfig,
  useIsExpanded,
  useLevel,
  usePath,
} from "../../../hooks"
import { JSONSchemaLevelContext, JSONSchemaPathContext } from "../../../context"
import { getOpenAPIExtensions } from "../../../fn"
import {
  ATTRIBUTE,
  HIDDEN,
  KEYWORD,
  KEYWORD_CHILDREN,
  KEYWORD_NAME,
  KEYWORD_VALUE,
  VALUE_AFTER_NAME,
} from "../../../styles"

export interface OASFieldProps {
  name: string
  value: React.ReactNode
}

/**
 * One `name=value` field of an OpenAPI object (`.json-schema-2020-12-keyword`
 * with secondary name and value).
 */
export const OASField = ({ name, value }: OASFieldProps) => (
  <div className={KEYWORD}>
    <span className={KEYWORD_NAME.secondary}>{name}</span>
    <span className={classNames(KEYWORD_VALUE.secondary, VALUE_AFTER_NAME)}>
      {value}
    </span>
  </div>
)

export interface OASObjectProps {
  /** Schema keyword holding the object; the path token and `data-keyword`. */
  keyword: string
  /** Visible name, e.g. "XML". */
  label: string
  /** The OpenAPI object; nothing renders when it is empty. */
  value: Record<string, unknown>
  /** Whether the object has fields to show when expanded (besides extensions). */
  hasFields: boolean
  /** Muted attributes rendered between the name and the `object` type. */
  attributes?: React.ReactNode
  /** The `<li>` entries shown when expanded. */
  children?: React.ReactNode
}

/**
 * The shared frame of the OpenAPI object keywords `discriminator`, `xml` and
 * `externalDocs` (one oas31 component each, with identical expansion and
 * markup): an expandable name, attributes, the `object` type, and the
 * object's fields plus its Specification Extensions (shown when
 * `showExtensionKeywords`, i.e. the `showExtensions` config) as children.
 */
const OASObject = ({
  keyword,
  label,
  value,
  hasFields,
  attributes = null,
  children = null,
}: OASObjectProps) => {
  const { showExtensionKeywords } = useConfig()
  const { path } = usePath(keyword)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(keyword)
  const [level, nextLevel] = useLevel()
  const extensions = showExtensionKeywords ? getOpenAPIExtensions(value) : []
  const isExpandable = hasFields || extensions.length > 0
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const OpenAPIExtensions = useComponent("KeywordOpenAPIExtensions")

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
  if (Object.keys(value).length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className={KEYWORD}
          data-keyword={keyword}
          data-json-schema-level={level}
          data-expanded={
            isExpandable ? (isExpanded ? "true" : "false") : undefined
          }
        >
          {isExpandable ? (
            <>
              <Accordion expanded={isExpanded} onChange={handleExpansion}>
                <span className={KEYWORD_NAME.secondary}>{label}</span>
              </Accordion>
              <ExpandDeepButton
                expanded={isExpanded}
                onClick={handleExpansionDeep}
              />
            </>
          ) : (
            <span className={KEYWORD_NAME.secondary}>{label}</span>
          )}
          {attributes}
          <strong className={ATTRIBUTE.primary}>object</strong>
          <ul className={classNames(KEYWORD_CHILDREN, !isExpanded && HIDDEN)}>
            {isExpanded && children}
            {extensions.length > 0 && (
              <OpenAPIExtensions
                openAPISpecObj={value}
                openAPIExtensions={extensions}
              />
            )}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

export default OASObject
