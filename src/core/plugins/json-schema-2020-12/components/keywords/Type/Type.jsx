/**
 * @prettier
 */
import React from "react"

import { schema } from "../../../prop-types"
import { useFn } from "../../../hooks"

const Type = ({ schema }) => {
  const fn = useFn()

  return <span className="json-schema-2020-12__type">{fn.getType(schema)}</span>
}

Type.propTypes = {
  schema: schema.isRequired,
}

export default Type
