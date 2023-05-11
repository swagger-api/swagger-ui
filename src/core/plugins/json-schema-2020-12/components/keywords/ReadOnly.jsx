/**
 * @prettier
 */
import React from "react"

import { schema } from "../../prop-types"

const ReadOnly = ({ schema }) => {
  if (schema?.readOnly !== true) return null

  return (
    <span className="json-schema-2020-12__attribute json-schema-2020-12__attribute--muted">
      read-only
    </span>
  )
}

ReadOnly.propTypes = {
  schema: schema.isRequired,
}

export default ReadOnly
