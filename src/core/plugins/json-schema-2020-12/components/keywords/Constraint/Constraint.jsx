/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { isPlainObject } from "../../../fn"

/**
 * This component represents various constraint keywords
 * from JSON Schema 2020-12 validation vocabulary.
 */
const Constraint = ({ constraint }) => {
  if (
    !isPlainObject(constraint) ||
    typeof constraint.scope !== "string" ||
    typeof constraint.value !== "string"
  ) {
    return null
  }

  return (
    <span
      className={`json-schema-2020-12__constraint json-schema-2020-12__constraint--${constraint.scope}`}
    >
      {constraint.value}
    </span>
  )
}

Constraint.propTypes = {
  constraint: PropTypes.shape({
    scope: PropTypes.oneOf(["number", "string", "array", "object"]).isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
}

export default React.memo(Constraint)
