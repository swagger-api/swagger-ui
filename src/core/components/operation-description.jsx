import React from "react"
import PropTypes from "prop-types"

const OperationDesc = ({ description, getComponent }) => {
  const Markdown = getComponent("Markdown")

  return (
    <div className="opblock-description-wrapper">
      <div className="opblock-description">
        <Markdown source={ description } />
      </div>
    </div>
  )
}

OperationDesc.propTypes = {
  getComponent: PropTypes.func.isRequired,
  description: PropTypes.object.isRequired
}

export default OperationDesc