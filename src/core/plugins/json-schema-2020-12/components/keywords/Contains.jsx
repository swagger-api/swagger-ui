/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"
import { useComponent } from "../../hooks"

const Contains = ({ schema }) => {
  if (!schema?.contains) return null

  const JSONSchema = useComponent("JSONSchema")
  const name = (
    <span className="json-schema-2020-12-keyword__name json-schema-2020-12-keyword__name--primary">
      Contains
    </span>
  )

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--contains">
      <JSONSchema name={name} schema={schema.contains} />
    </div>
  )
}

Contains.propTypes = {
  schema: schema.isRequired,
}

export default Contains
