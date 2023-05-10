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
  const isStringRelated =
    /^matches /.test(constraint) || // pattern keyword
    /characters$/.test(constraint) || // minLength, maxLength keywords
    /^media type: /.test(constraint) || // contentMediaType keyword
    /^encoding: /.test(constraint) // contentEncoding keyword

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
