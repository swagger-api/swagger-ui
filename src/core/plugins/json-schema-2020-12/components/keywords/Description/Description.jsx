/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"

const Description = ({ schema }) => {
  if (!schema?.description) return null

  return (
    <div className="json-schema-2020-12__description">{schema.description}</div>
  )
}

Description.propTypes = {
  schema: schema.isRequired,
}

export default Description
