/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { schema } from "../../../prop-types"
import { useComponent, usePath } from "../../../hooks"
import { JSONSchemaPathContext } from "../../../context"
import { toSchemaObject } from "../../../fn"
import { KEYWORD, PATTERN_PROPERTIES, PROPERTY } from "../../../styles"
import type { KeywordProps } from "../../../types"

const PatternProperties = ({ schema }: KeywordProps) => {
  const patternProperties = toSchemaObject(schema).patternProperties || {}
  const JSONSchema = useComponent("JSONSchema")
  const { path } = usePath("patternProperties")

  /**
   * Rendering.
   */
  if (Object.keys(patternProperties).length === 0) {
    return null
  }

  return (
    <JSONSchemaPathContext.Provider value={path}>
      <div
        className={classNames(KEYWORD, PATTERN_PROPERTIES)}
        data-keyword="patternProperties"
      >
        <ul>
          {Object.entries(patternProperties).map(([propertyName, schema]) => (
            <li key={propertyName} className={PROPERTY}>
              <JSONSchema name={propertyName} schema={schema} />
            </li>
          ))}
        </ul>
      </div>
    </JSONSchemaPathContext.Provider>
  )
}

PatternProperties.propTypes = {
  schema: schema.isRequired,
}

export default PatternProperties
