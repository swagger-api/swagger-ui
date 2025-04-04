/**
 * @prettier
 */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import DiscriminatorMapping from "./DiscriminatorMapping"
import { getExtensions } from "../../../../../../utils"

const Discriminator = ({ schema, getSystem }) => {
  const discriminator = schema?.discriminator || {}
  const { fn, getComponent, getConfigs } = getSystem()
  const { showExtensions } = getConfigs()
  const { useComponent, useIsExpanded, usePath, useLevel } = fn.jsonSchema202012
  const pathToken = "discriminator"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const extensions = showExtensions ? getExtensions(discriminator) : []
  const isExpandable = !!(discriminator.mapping || extensions.length > 0)
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
  if (Object.keys(discriminator).length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className="json-schema-2020-12-keyword json-schema-2020-12-keyword--discriminator"
          data-json-schema-level={level}
        >
          {isExpandable ? (
            <>
              <Accordion expanded={isExpanded} onChange={handleExpansion}>
                <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                  Discriminator
                </span>
              </Accordion>
              <ExpandDeepButton
                expanded={isExpanded}
                onClick={handleExpansionDeep}
              />
            </>
          ) : (
            <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
              Discriminator
            </span>
          )}

          {discriminator.propertyName && (
            <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--muted">
              {discriminator.propertyName}
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
              <li className="json-schema-2020-12-property">
                <DiscriminatorMapping discriminator={discriminator} />
              </li>
            )}
            {extensions.length > 0 && (
              <OpenAPI31Extensions
                openAPISpecObj={discriminator}
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

Discriminator.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getSystem: PropTypes.func.isRequired,
}

export default Discriminator
