/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const If = ({ schema }) => {
  if (!schema?.if) return null

  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--if">
      If
    </span>
  )

  return (
    <div className="json-schema-2020-12__if">
      <JSONSchema name={name} schema={schema.if} />
    </div>
  )
}

If.propTypes = {
  schema: schema.isRequired,
}

export default If
