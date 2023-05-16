/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const PatternProperties = ({ schema }) => {
  const patternProperties = schema?.patternProperties || {}
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (Object.keys(patternProperties).length === 0) {
    return null
  }

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--patternProperties">
      <ul>
        {Object.entries(patternProperties).map(([propertyName, schema]) => (
          <li key={propertyName} className="json-schema-2020-12-property">
            <JSONSchema name={propertyName} schema={schema} />
          </li>
        ))}
      </ul>
    </div>
  )
}

PatternProperties.propTypes = {
  schema: schema.isRequired,
}

export default PatternProperties
