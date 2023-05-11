/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const Xml = ({ schema, getSystem }) => {
  const xml = schema?.xml || {}
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
  if (Object.keys(xml).length === 0) {
    return null
  }

  return (
    <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--xml">
        <Accordion expanded={expanded} onChange={handleExpansion}>
          <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
            XML
          </span>
        </Accordion>
        <ExpandDeepButton expanded={expanded} onClick={handleExpansionDeep} />
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
            "json-schema-2020-12-keyword__children--collapsed": !expanded,
          })}
        >
          {expanded && (
            <>
              <li className="json-schema-2020-12-property">
                {xml.name && (
                  <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword">
                    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                      name
                    </span>
                    <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                      {xml.name}
                    </span>
                  </div>
                )}

                {xml.namespace && (
                  <div className="json-schema-2020-12-keyword">
                    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                      namespace
                    </span>
                    <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                      {xml.namespace}
                    </span>
                  </div>
                )}

                {xml.prefix && (
                  <div className="json-schema-2020-12-keyword">
                    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                      prefix
                    </span>
                    <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                      {xml.prefix}
                    </span>
                  </div>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </JSONSchemaDeepExpansionContext.Provider>
  )
}

Xml.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  fn: PropTypes.shape({
    jsonSchema202012: PropTypes.shape({
      useIsExpandedDeeply: PropTypes.func.isRequired,
      useComponent: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Xml
