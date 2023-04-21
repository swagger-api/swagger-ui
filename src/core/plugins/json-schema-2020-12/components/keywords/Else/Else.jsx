/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const Else = ({ schema }) => {
  if (!schema?.else) return null

  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--else">
      Else
    </span>
  )

  return (
    <div className="json-schema-2020-12__else">
      <JSONSchema name={name} schema={schema.else} />
    </div>
  )
}

Else.propTypes = {
  schema: schema.isRequired,
}

export default Else
