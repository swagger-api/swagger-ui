/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import { schema } from "../../../prop-types"
import { useComponent, useIsExpanded, usePath } from "../../../hooks"
import { JSONSchemaPathContext } from "../../../context"

const $vocabulary = ({ schema }) => {
  const pathToken = "$vocabulary"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const Accordion = useComponent("Accordion")

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
  if (!schema?.$vocabulary) return null
  if (typeof schema.$vocabulary !== "object") return null

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--$vocabulary">
        <Accordion expanded={isExpanded} onChange={handleExpansion}>
          <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
            $vocabulary
          </span>
        </Accordion>
        <strong className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
          object
        </strong>
        <ul>
          {isExpanded &&
            Object.entries(schema.$vocabulary).map(([uri, enabled]) => (
              <li
                key={uri}
                className={classNames("json-schema-2020-12-$vocabulary-uri", {
                  "json-schema-2020-12-$vocabulary-uri--disabled": !enabled,
                })}
              >
                <span className="json-schema-2020-12-keyword__value json-schema-2020-12-keyword__value--secondary">
                  {uri}
                </span>
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
