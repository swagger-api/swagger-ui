/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

/**
 * This component represents various constraint keywords
 * from JSON Schema 2020-12 validation vocabulary.
 */
const Constraint = ({ constraint }) => (
  <span
    className={`json-schema-2020-12__constraint json-schema-2020-12__constraint--${constraint.scope}`}
  >
    {constraint.value}
  </span>
)

Constraint.propTypes = {
  constraint: PropTypes.shape({
    scope: PropTypes.oneOf(["number", "string", "array", "object"]).isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
}

export default React.memo(Constraint)
