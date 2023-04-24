/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const Properties = ({ schema }) => {
  const properties = schema?.properties || {}

  if (Object.keys(properties).length === 0) {
    return null
  }

  const JSONSchema = useComponent("JSONSchema")

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--properties">
      <ul>
        {Object.entries(properties).map(([propertyName, schema]) => (
          <li key={propertyName} className="json-schema-2020-12-property">
            <JSONSchema name={propertyName} schema={schema} />
          </li>
        ))}
      </ul>
    </div>
  )
}

Properties.propTypes = {
  schema: schema.isRequired,
}

export default Properties
