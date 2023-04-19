/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { schema } from "../../../prop-types"
import { useFn } from "../../../hooks"

const Type = ({ schema, isCircular }) => {
  const fn = useFn()
  const type = fn.getType(schema)
  const circularSuffix = isCircular ? " [circular]" : ""

  return (
    <span className="json-schema-2020-12__type">{`${type}${circularSuffix}`}</span>
  )
}

Type.propTypes = {
  schema: schema.isRequired,
  isCircular: PropTypes.bool,
}

Type.defaultProps = {
  isCircular: false,
}

export default Type
