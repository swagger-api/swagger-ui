/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import { getSchemaDependencies } from "../../fn"
import type { KeywordProps } from "./types"

type Context<T> = () => React.Context<T>

/**
 * The schema entries of `dependencies`, kept by the JSON Schema 2020-12
 * default meta-schema from earlier drafts, rendered like `dependentSchemas`
 * (a copy of the json-schema-2020-12 renderer's `DependentSchemas` component),
 * which took over that form; the array entries render like
 * `dependentRequired`, on the properties they make required
 * (`getDependentRequired`):
 * https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01.html#appendix-A
 */
const Dependencies = ({ schema, getSystem }: KeywordProps) => {
  const { fn, getComponent } = getSystem()
  const { useComponent, useIsExpanded, usePath, useLevel } = fn.jsonSchema202012
  const dependencies = getSchemaDependencies(schema)
  const pathToken = "dependencies"
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
  if (Object.keys(dependencies).length === 0) return null

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <JSONSchemaLevelContext.Provider value={nextLevel}>
        <div
          className="json-schema-2020-12-keyword json-schema-2020-12-keyword--dependencies"
          data-json-schema-level={level}
        >
          <Accordion expanded={isExpanded} onChange={handleExpansion}>
            <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
              Dependencies
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
              Object.entries(dependencies).map(([propertyName, subschema]) => (
                <li key={propertyName} className="json-schema-2020-12-property">
                  <JSONSchema name={propertyName} schema={subschema} />
                </li>
              ))}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

export default Dependencies
