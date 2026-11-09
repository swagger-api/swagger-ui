/**
 * @prettier
 */
import React, { useCallback } from "react"
import classNames from "classnames"

import { getDefinitions } from "../../fn"
import type { KeywordProps, Schema, System } from "./types"

type Context<T> = () => React.Context<T>

/**
 * Labels of a definition whose name is the empty string, or only whitespace
 * (both valid property names), and that has no title, `$anchor` or `$id` to
 * show instead: a blank head would be an accordion without a name.
 */
const EMPTY_NAME_LABEL = "(empty name)"
const BLANK_NAME_LABEL = "(blank name)"

const isBlank = (value: string) => value.trim() === ""

/**
 * The name the renderer shows for a definition: the name itself, nothing for
 * a blank name when the schema has a title to show, else a label.
 */
const getDisplayName = (
  schemaName: string,
  subschema: Schema,
  getTitle: (schema: Schema) => string
) => {
  if (!isBlank(schemaName)) return schemaName
  if (!isBlank(getTitle(subschema))) return ""

  return schemaName === "" ? EMPTY_NAME_LABEL : BLANK_NAME_LABEL
}

/**
 * The expansion path token of a definition named "": one that no other
 * definition's name is, so that the entry keeps a path of its own whatever
 * label it shows. Every other definition's token is its name (see
 * `identifier` below).
 */
const getEmptyNameIdentifier = (definitions: Record<string, unknown>) => {
  let identifier = EMPTY_NAME_LABEL
  while (identifier in definitions) identifier += "_"
  return identifier
}

interface DefinitionsListProps {
  definitions: Record<string, unknown>
  getSystem: () => System
}

/**
 * The keyword with its expansion state. Split from `Definitions`, which
 * mounts it only for a schema that has something to list: every schema of a
 * document reaches `Definitions`, and the hooks here would register a path
 * and re-render for each of them.
 */
const DefinitionsList = ({ definitions, getSystem }: DefinitionsListProps) => {
  const { fn, getComponent } = getSystem()
  const { useComponent, useIsExpanded, usePath, useLevel, getTitle } =
    fn.jsonSchema202012
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
  const emptyNameIdentifier = getEmptyNameIdentifier(definitions)

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
                  <JSONSchema
                    name={getDisplayName(
                      schemaName,
                      subschema as Schema,
                      getTitle
                    )}
                    // the renderer's default token is the schema's `$id` before
                    // its name, which another definition's name can equal
                    identifier={
                      schemaName === "" ? emptyNameIdentifier : schemaName
                    }
                    schema={subschema}
                  />
                </li>
              ))}
          </ul>
        </div>
      </JSONSchemaLevelContext.Provider>
    </JSONSchemaPathContext.Provider>
  )
}

/**
 * `definitions`, kept by the JSON Schema 2020-12 default meta-schema from
 * earlier drafts, rendered like `$defs` (a copy of the json-schema-2020-12
 * renderer's `$defs` component), which "implementations SHOULD assume" it
 * behaves like:
 * https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-01.html#appendix-A
 */

const Definitions = ({ schema, getSystem }: KeywordProps) => {
  const definitions = getDefinitions(schema)

  return definitions === null ? null : (
    <DefinitionsList definitions={definitions} getSystem={getSystem} />
  )
}

export default Definitions
