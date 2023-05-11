/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import DiscriminatorMapping from "./DiscriminatorMapping"

const Discriminator = ({ schema, getSystem }) => {
  const discriminator = schema?.discriminator || {}
  const { fn, getComponent } = getSystem()
  const { useIsExpandedDeeply, useComponent } = fn.jsonSchema202012
  const isExpandedDeeply = useIsExpandedDeeply()
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const [expandedDeeply, setExpandedDeeply] = useState(false)
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONSchemaDeepExpansionContext = getComponent(
    "JSONSchema202012DeepExpansionContext"
  )()

  /**
   * Event handlers.
   */
  const handleExpansion = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])
  const handleExpansionDeep = useCallback((e, expandedDeepNew) => {
    setExpanded(expandedDeepNew)
    setExpandedDeeply(expandedDeepNew)
  }, [])

  /**
   * Rendering.
   */
  if (Object.keys(discriminator).length === 0) {
    return null
  }

  return (
    <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--discriminator">
        <Accordion expanded={expanded} onChange={handleExpansion}>
          <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
            Discriminator
          </span>
        </Accordion>
        <ExpandDeepButton expanded={expanded} onClick={handleExpansionDeep} />
        {discriminator.propertyName && (
          <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--muted">
            {discriminator.propertyName}
          </span>
        )}
        <ul
          className={classNames("json-schema-2020-12-keyword__children", {
            "json-schema-2020-12-keyword__children--collapsed": !expanded,
          })}
        >
          {expanded && (
            <li className="json-schema-2020-12-property">
              <DiscriminatorMapping discriminator={discriminator} />
            </li>
          )}
        </ul>
      </div>
    </JSONSchemaDeepExpansionContext.Provider>
  )
}

Discriminator.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  getSystem: PropTypes.func.isRequired,
}

export default Discriminator
