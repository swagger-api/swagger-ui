/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import { schema } from "../../prop-types"
import {
  useFn,
  useComponent,
  useIsExpanded,
  usePath,
  useLevel,
} from "../../hooks"
import { JSONSchemaLevelContext, JSONSchemaPathContext } from "../../context"

const OneOf = ({ schema }) => {
  const oneOf = schema?.oneOf || []
  const fn = useFn()
  const pathToken = "oneOf"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONSchema = useComponent("JSONSchema")
  const KeywordType = useComponent("KeywordType")

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
  if (!Array.isArray(oneOf) || oneOf.length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className="json-schema-2020-12-keyword json-schema-2020-12-keyword--oneOf"
          data-json-schema-level={level}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
              One of
            </span>
          </Accordion>
          <ExpandDeepButton
            expanded={isExpanded}
            onClick={handleExpansionDeep}
          />
          <KeywordType schema={{ oneOf }} />
          <ul
            className={classNames("json-schema-2020-12-keyword__children", {
              "json-schema-2020-12-keyword__children--collapsed": !isExpanded,
            })}
          >
            {isExpanded && (
              <>
                {oneOf.map((schema, index) => (
                  <li
                    key={`#${index}`}
                    className="json-schema-2020-12-property"
                  >
                    <JSONSchema
                      name={`#${index} ${fn.getTitle(schema)}`}
                      schema={schema}
                    />
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

OneOf.propTypes = {
  schema: schema.isRequired,
}

export default OneOf
