/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

/**
 * This component represents various constraint keywords
 * from JSON Schema 2020-12 validation vocabulary.
 */
const Constraint = ({ constraint }) => {
  const isPattern = /^matches /.test(constraint)
  const isStringRange = /characters/.test(constraint)
  const isStringRelated = isPattern || isStringRange

  return (
    <span
      className={classNames("json-schema-2020-12__constraint", {
        "json-schema-2020-12__constraint--string-related": isStringRelated,
      })}
    >
      {constraint}
    </span>
  )
}

Constraint.propTypes = {
  constraint: PropTypes.string.isRequired,
}

export default React.memo(Constraint)
