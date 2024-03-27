/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { schema } from "../../prop-types"
import { useFn } from "../../hooks"

const Type = ({ schema, isCircular = false }) => {
  const fn = useFn()
  const type = fn.getType(schema)
  const circularSuffix = isCircular ? " [circular]" : ""

  return (
    <strong className="json-schema-2020-12__attribute json-schema-2020-12__attribute--primary">
      {`${type}${circularSuffix}`}
    </strong>
  )
}

Type.propTypes = {
  schema: schema.isRequired,
  isCircular: PropTypes.bool,
}

export default Type
