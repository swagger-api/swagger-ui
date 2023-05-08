/**
 * @prettier
 */
import React from "react"
import classNames from "classnames"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const Properties = ({ schema }) => {
  const properties = schema?.properties || {}
  const required = Array.isArray(schema?.required) ? schema.required : []
  const JSONSchema = useComponent("JSONSchema")

  /**
   * Rendering.
   */
  if (Object.keys(properties).length === 0) {
    return null
  }

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--properties">
      <ul>
        {Object.entries(properties).map(([propertyName, schema]) => (
          <li
            key={propertyName}
            className={classNames("json-schema-2020-12-property", {
              "json-schema-2020-12-property--required":
                required.includes(propertyName),
            })}
          >
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
