/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"

const Format = ({ schema }) => {
  if (!schema.format) return null

  return <span className="json-schema-2020-12__format">{schema.format}</span>
}

Format.propTypes = {
  schema: schema.isRequired,
}

export default Format
