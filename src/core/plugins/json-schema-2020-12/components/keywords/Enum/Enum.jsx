/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useComponent } from "../../../hooks"

const Enum = ({ schema }) => {
  const JSONViewer = useComponent("JSONViewer")

  if (!Array.isArray(schema?.enum)) return null

  return (
    <JSONViewer
      name="Enum"
      value={schema.enum}
      className="json-schema-2020-12-keyword json-schema-2020-12-keyword--enum"
    />
  )
}

Enum.propTypes = {
  schema: schema.isRequired,
}

export default Enum
