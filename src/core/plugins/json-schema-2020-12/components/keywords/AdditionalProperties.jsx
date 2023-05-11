/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"

const AdditionalProperties = ({ schema }) => {
  const fn = useFn()
  const { additionalProperties } = schema
  const JSONSchema = useComponent("JSONSchema")

  if (!fn.hasKeyword(schema, "additionalProperties")) return null

  /**
   * Rendering.
   */
  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Additional properties
    </span>
  )

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--additionalProperties">
      {additionalProperties === true ? (
        <>
          {name}
          <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
            allowed
          </span>
        </>
      ) : additionalProperties === false ? (
        <>
          {name}
          <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
            forbidden
          </span>
        </>
      ) : (
        <JSONSchema name={name} schema={additionalProperties} />
      )}
    </div>
  )
}

AdditionalProperties.propTypes = {
  schema: schema.isRequired,
}

export default AdditionalProperties
