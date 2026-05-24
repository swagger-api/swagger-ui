/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent, usePath } from "../../../hooks"
import { JSONSchemaPathContext } from "../../../context"

const PatternProperties = ({ schema }) => {
  const patternProperties = schema?.patternProperties || {}
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
      <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--patternProperties">
        <ul>
          {Object.entries(patternProperties).map(([propertyName, schema]) => (
            <li key={propertyName} className="json-schema-2020-12-property">
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
