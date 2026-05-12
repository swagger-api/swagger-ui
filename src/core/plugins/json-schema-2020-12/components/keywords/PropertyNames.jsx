/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"

const PropertyNames = ({ schema }) => {
  const fn = useFn()
  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Property names
    </span>
  )

  /**
   * Rendering.
   */
  if (!fn.hasKeyword(schema, "propertyNames")) return null

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--propertyNames">
      <JSONSchema
        name={name}
        schema={schema.propertyNames}
        identifier="propertyNames"
      />
    </div>
  )
}

PropertyNames.propTypes = {
  schema: schema.isRequired,
}

export default PropertyNames
