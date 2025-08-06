/**
 * @prettier
 */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { getExtensions } from "../../../../../utils"

const Xml = ({ schema, getSystem }) => {
  const xml = schema?.xml || {}
  const { fn, getComponent, getConfigs } = getSystem()
  const { showExtensions } = getConfigs()
  const { useComponent, useIsExpanded, usePath, useLevel } = fn.jsonSchema202012
  const pathToken = "xml"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const extensions = showExtensions ? getExtensions(xml) : []
  const isExpandable = !!(
    xml.name ||
    xml.namespace ||
    xml.prefix ||
    extensions.length > 0
  )
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
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
  if (Object.keys(xml).length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className="json-schema-2020-12-keyword json-schema-2020-12-keyword--xml"
          data-json-schema-level={level}
        >
          {isExpandable ? (
            <>
              <Accordion expanded={isExpanded} onChange={handleExpansion}>
                <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                  XML
                </span>
              </Accordion>
              <ExpandDeepButton
                expanded={isExpanded}
                onClick={handleExpansionDeep}
              />
            </>
          ) : (
            <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
              XML
            </span>
          )}
          {xml.attribute === true && (
            <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--muted">
              attribute
            </span>
          )}
          {xml.wrapped === true && (
            <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--muted">
              wrapped
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
                {xml.name && (
                  <li className="json-schema-2020-12-property">
                    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword">
                      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                        name
                      </span>
                      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                        {xml.name}
                      </span>
                    </div>
                  </li>
                )}

                {xml.namespace && (
                  <li className="json-schema-2020-12-property">
                    <div className="json-schema-2020-12-keyword">
                      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                        namespace
                      </span>
                      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                        {xml.namespace}
                      </span>
                    </div>
                  </li>
                )}

                {xml.prefix && (
                  <li className="json-schema-2020-12-property">
                    <div className="json-schema-2020-12-keyword">
                      <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                        prefix
                      </span>
                      <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                        {xml.prefix}
                      </span>
                    </div>
                  </li>
                )}
              </>
            )}
            {extensions.length > 0 && (
              <OpenAPI31Extensions
                openAPISpecObj={xml}
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

Xml.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getSystem: PropTypes.func.isRequired,
}

export default Xml
