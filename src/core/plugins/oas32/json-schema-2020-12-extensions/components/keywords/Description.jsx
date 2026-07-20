/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const Description = ({ schema, getSystem }) => {
  if (!schema?.description) return null

  const { getComponent } = getSystem()
  const MarkDown = getComponent("Markdown")

  return (
    <div className="json-schema-2020-12-keyword json-schema-2020-12-keyword--description">
      <div className="json-schema-2020-12-core-keyword__value json-schema-2020-12-core-keyword__value--secondary">
        <MarkDown source={schema.description} />
      </div>
    </div>
  )
}

Description.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getSystem: PropTypes.func.isRequired,
}

export default Description
