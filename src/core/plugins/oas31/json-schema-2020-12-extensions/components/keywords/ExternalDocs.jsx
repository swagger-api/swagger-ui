/**
 * @prettier
 */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import { sanitizeUrl } from "core/utils/url"
import { getExtensions } from "../../../../../utils"

const ExternalDocs = ({ schema, getSystem }) => {
  const externalDocs = schema?.externalDocs || {}
  const { fn, getComponent, getConfigs } = getSystem()
  const { showExtensions } = getConfigs()
  const { useComponent, useIsExpanded, usePath, useLevel } = fn.jsonSchema202012
  const pathToken = "externalDocs"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const extensions = showExtensions ? getExtensions(externalDocs) : []
  const isExpandable = !!(
    externalDocs.description ||
    externalDocs.url ||
    extensions.length > 0
  )
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const KeywordDescription = getComponent("JSONSchema202012KeywordDescription")
  const Link = getComponent("Link")
  const OpenAPI31Extensions = getComponent("OpenAPI31Extensions")
  const JSONSchemaPathContext = getComponent("JSONSchema202012PathContext")()
  const JSONSchemaLevelContext = getComponent("JSONSchema202012LevelContext")()

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
    (e, expandedDeepNew) => {
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
  if (Object.keys(externalDocs).length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className="json-schema-2020-12-keyword json-schema-2020-12-keyword--externalDocs"
          data-json-schema-level={level}
        >
          {isExpandable ? (
            <>
              <Accordion expanded={isExpanded} onChange={handleExpansion}>
                <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                  External documentation
                </span>
              </Accordion>
              <ExpandDeepButton
                expanded={isExpanded}
                onClick={handleExpansionDeep}
              />
            </>
          ) : (
            <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
              External documentation
            </span>
          )}
          <strong className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
            object
          </strong>
          <ul
            className={classNames("json-schema-2020-12-keyword__children", {
              "json-schema-2020-12-keyword__children--collapsed": !isExpanded,
            })}
          >
            {isExpanded && (
              <>
                {externalDocs.description && (
                  <li className="json-schema-2020-12-property">
                    <KeywordDescription
                      schema={externalDocs}
                      getSystem={getSystem}
                    />
                  </li>
                )}

                {externalDocs.url && (
                  <li className="json-schema-2020-12-property">
                    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword">
                      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                        url
                      </span>
                      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                        <Link
                          target="_blank"
                          href={sanitizeUrl(externalDocs.url)}
                        >
                          {externalDocs.url}
                        </Link>
                      </span>
                    </div>
                  </li>
                )}
              </>
            )}
            {extensions.length > 0 && (
              <OpenAPI31Extensions
                openAPISpecObj={externalDocs}
                openAPIExtensions={extensions}
                getSystem={getSystem}
              />
            )}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

ExternalDocs.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getSystem: PropTypes.func.isRequired,
}

export default ExternalDocs
