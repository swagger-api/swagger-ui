/**
 * @prettier
 */
import React, { useCallback, useState } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import { sanitizeUrl } from "core/utils"

const ExternalDocs = ({ schema, getSystem }) => {
  const externalDocs = schema?.externalDocs || {}
  const { fn, getComponent } = getSystem()
  const { useIsExpandedDeeply, useComponent } = fn.jsonSchema202012
  const isExpandedDeeply = useIsExpandedDeeply()
  const isExpandable = !!(externalDocs.description || externalDocs.url)
  const [expanded, setExpanded] = useState(isExpandedDeeply)
  const [expandedDeeply, setExpandedDeeply] = useState(false)
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const KeywordDescription = getComponent("JSONSchema202012KeywordDescription")
  const Link = getComponent("Link")
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
  if (Object.keys(externalDocs).length === 0) {
    return null
  }

  return (
    <JSONSchemaDeepExpansionContext.Provider value={expandedDeeply}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--externalDocs">
        {isExpandable ? (
          <>
            <Accordion expanded={expanded} onChange={handleExpansion}>
              <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
                External documentation
              </span>
            </Accordion>
            <ExpandDeepButton
              expanded={expanded}
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
            "json-schema-2020-12-keyword__children--collapsed": !expanded,
          })}
        >
          {expanded && (
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
        </ul>
      </div>
    </JSONSchemaDeepExpansionContext.Provider>
  )
}

ExternalDocs.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getSystem: PropTypes.func.isRequired,
}

export default ExternalDocs
