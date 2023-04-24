/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useComponent } from "../../hooks"

const Else = ({ schema }) => {
  if (!Object.hasOwn(schema, "contains")) return null

  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Else
    </span>
  )

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--if">
      <JSONSchema name={name} schema={schema.else} />
    </div>
  )
}

Else.propTypes = {
  schema: schema.isRequired,
}

export default Else
