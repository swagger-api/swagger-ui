/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const WriteOnly = ({ schema }) => {
  if (schema?.writeOnly !== true) return null

  return (
    <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--muted">
      write-only
    </span>
  )
}

WriteOnly.propTypes = {
  schema: schema.isRequired,
}

export default WriteOnly
