/**
 * @prettier
 */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
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

const JSONViewer = ({ name, value, className }) => {
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
  if (isPrimitive) {
    return (
      <div className={classNames("json-schema-2020-12-json-viewer", className)}>
        <span className="json-schema-2020-12-json-viewer__name json-schema-2020-12-json-viewer__name--secondary">
          {name}
        </span>
        <span className="json-schema-2020-12-json-viewer__value json-schema-2020-12-json-viewer__value--secondary">
          {fn.stringify(value)}
        </span>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className={classNames("json-schema-2020-12-json-viewer", className)}>
        <span className="json-schema-2020-12-json-viewer__name json-schema-2020-12-json-viewer__name--secondary">
          {name}
        </span>
        <strong className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
          {Array.isArray(value) ? "empty array" : "empty object"}
        </strong>
      </div>
    )
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className={classNames("json-schema-2020-12-json-viewer", className)}
          data-json-schema-level={level}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className="json-schema-2020-12-json-viewer__name json-schema-2020-12-json-viewer__name--secondary">
              {name}
            </span>
          </Accordion>
          <ExpandDeepButton
            expanded={isExpanded}
            onClick={handleExpansionDeep}
          />
          <strong className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
            {Array.isArray(value) ? "array" : "object"}
          </strong>
          <ul
            className={classNames("json-schema-2020-12-json-viewer__children", {
              "json-schema-2020-12-json-viewer__children--collapsed":
                !isExpanded,
            })}
          >
            {isExpanded && (
              <>
                {Array.isArray(value)
                  ? value.map((item, index) => (
                      <li
                        key={`#${index}`}
                        className="json-schema-2020-12-property"
                      >
                        <JSONViewer
                          name={`#${index}`}
                          value={item}
                          className={className}
                        />
                      </li>
                    ))
                  : Object.entries(value).map(
                      ([propertyName, propertyValue]) => (
                        <li
                          key={propertyName}
                          className="json-schema-2020-12-property"
                        >
                          <JSONViewer
                            name={propertyName}
                            value={propertyValue}
                            className={className}
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

JSONViewer.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  className: PropTypes.string,
}

export default JSONViewer
