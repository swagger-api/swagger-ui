/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { schema } from "../../../prop-types"
import { useFn } from "../../../hooks"

const Title = ({ title = "", schema }) => {
  const fn = useFn()
  const schemaTitle = fn.getTitle(schema, { lookup: "basic" })
  const renderedTitle = title || fn.getTitle(schema)
  const hasSecondaryTitle =
    typeof title === "string" &&
    title !== "" &&
    schemaTitle !== "" &&
    !title.toLowerCase().includes(schemaTitle.toLowerCase())

  if (!renderedTitle) return null

  return (
    <strong className="json-schema-2020-12__title">
      {renderedTitle}
      {hasSecondaryTitle && (
        <span className="json-schema-2020-12__title-secondary">
          {schemaTitle}
        </span>
      )}
    </strong>
  )
}

Title.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  schema: schema.isRequired,
}

export default Title
