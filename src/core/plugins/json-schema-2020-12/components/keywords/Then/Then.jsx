/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const Then = ({ schema }) => {
  if (!schema?.then) return null

  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-core-keyword json-schema-2020-12-core-keyword--then">
      Then
    </span>
  )

  return (
    <div className="json-schema-2020-12__then">
      <JSONSchema name={name} schema={schema.then} />
    </div>
  )
}

Then.propTypes = {
  schema: schema.isRequired,
}

export default Then
