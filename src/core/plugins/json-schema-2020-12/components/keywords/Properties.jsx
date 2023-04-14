/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"

const Properties = ({ schema }) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")

  if (fn.isBooleanJSONSchema(schema)) {
    return null
  }

  const properties = schema.properties || {}

  if (Object.keys(properties).length === 0) {
    return null
  }

  return (
    <>
      {Object.entries(properties).map(([propertyName, propertyValue]) => (
        <div key={propertyName} className="json-schema-2020-12-property">
          <JSONSchema name={propertyName} schema={propertyValue} />
        </div>
      ))}
    </>
  )
}

Properties.propTypes = {
  schema: schema.isRequired,
}

export default Properties
