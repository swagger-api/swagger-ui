/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const Examples = ({ schema }) => {
  const examples = schema?.examples || []
  const JSONViewer = useComponent("JSONViewer")

  if (!Array.isArray(examples) || examples.length === 0) {
    return null
  }

  return (
    <JSONViewer
      name="Examples"
      value={schema.examples}
      className="json-schema-2020-12-keyword json-schema-2020-12-keyword--examples"
    />
  )
}

Examples.propTypes = {
  schema: schema.isRequired,
}

export default Examples
