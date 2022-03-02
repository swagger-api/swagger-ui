import React from "react"
import PropTypes from "prop-types"

const Fallback = ({ name }) => (
  <div className="fallback">
    😱 <i>Could not render { name === "t" ? "this component" : name }, see the console.</i>
  </div>
)
Fallback.propTypes = {
  name: PropTypes.string.isRequired,
}

export default Fallback
