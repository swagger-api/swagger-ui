/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { schema } from "../../../prop-types"
import { useFn } from "../../../hooks"

const Title = ({ title = "", schema }) => {
  const fn = useFn()
  const renderedTitle = title || fn.getTitle(schema)

  if (!renderedTitle) return null

  return (
    <div className="json-schema-2020-12__title">
      {title || fn.getTitle(schema)}
    </div>
  )
}

Title.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  schema: schema.isRequired,
}

export default Title
