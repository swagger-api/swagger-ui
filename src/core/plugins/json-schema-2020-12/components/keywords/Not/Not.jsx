/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const Not = ({ schema }) => {
  if (!schema?.not) return null

  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--not">
      Not
    </span>
  )

  return (
    <div className="json-schema-2020-12__not">
      <JSONSchema name={name} schema={schema.not} />
    </div>
  )
}

Not.propTypes = {
  schema: schema.isRequired,
}

export default Not
