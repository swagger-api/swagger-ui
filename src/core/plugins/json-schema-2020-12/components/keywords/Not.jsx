/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useComponent } from "../../hooks"

const Not = ({ schema }) => {
  if (!schema?.not) return null

  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Not
    </span>
  )

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--not">
      <JSONSchema name={name} schema={schema.not} />
    </div>
  )
}

Not.propTypes = {
  schema: schema.isRequired,
}

export default Not
