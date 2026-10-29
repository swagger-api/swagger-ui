/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import type { KeywordProps } from "./types"

type Context<T> = () => React.Context<T>

/**
 * `definitions`, kept by the JSON Schema 2020-12 default meta-schema from
 * earlier drafts, rendered like `$defs` (a copy of the json-schema-2020-12
 * renderer's `$defs` component), which "implementations SHOULD assume" it
 * behaves like:
 * https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01.html#appendix-A
 */
const Definitions = ({ schema, getSystem }: KeywordProps) => {
  const { fn, getComponent } = getSystem()
  const { useComponent, useIsExpanded, usePath, useLevel } = fn.jsonSchema202012
  const definitions =
    schema !== null && typeof schema === "object" ? schema.definitions : null
  const pathToken = "definitions"
  const { path } = usePath(pathToken)
  const { isExpanded, setExpanded, setCollapsed } = useIsExpanded(pathToken)
  const [level, nextLevel] = useLevel()
  const Accordion = useComponent("Accordion")
  const ExpandDeepButton = useComponent("ExpandDeepButton")
  const JSONSchema = useComponent("JSONSchema")
  const JSONSchemaPathContext = (
    getComponent("JSONSchema202012PathContext") as Context<string[]>
  )()
  const JSONSchemaLevelContext = (
    getComponent("JSONSchema202012LevelContext") as Context<number>
  )()

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
  if (
    definitions === null ||
    typeof definitions !== "object" ||
    Array.isArray(definitions) ||
    Object.keys(definitions).length === 0
  ) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className="json-schema-2020-12-keyword json-schema-2020-12-keyword--definitions"
          data-json-schema-level={level}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--secondary">
              definitions
            </span>
          </Accordion>
          <ExpandDeepButton
            expanded={isExpanded}
            onClick={handleExpansionDeep}
          />
          <strong className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
            object
          </strong>
          <ul
            className={classNames("json-schema-2020-12-keyword__children", {
              "json-schema-2020-12-keyword__children--collapsed": !isExpanded,
            })}
          >
            {isExpanded &&
              Object.entries(definitions).map(([schemaName, subschema]) => (
                <li key={schemaName} className="json-schema-2020-12-property">
                  <JSONSchema name={schemaName} schema={subschema} />
                </li>
              ))}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

export default Definitions
