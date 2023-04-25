/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useFn, useComponent } from "../../hooks"

const AdditionalProperties = ({ schema }) => {
  const fn = useFn()

  if (!fn.hasKeyword(schema, "additionalProperties")) return null

  const { additionalProperties } = schema
  const JSONSchema = useComponent("JSONSchema")
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
          <span className="json-schema-2020-12__type">allowed</span>
        </>
      ) : additionalProperties === false ? (
        <>
          {name}
          <span className="json-schema-2020-12__type">forbidden</span>
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
