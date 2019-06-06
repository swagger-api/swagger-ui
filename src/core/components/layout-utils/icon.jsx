import React from "react"
import PropTypes from "prop-types"

const Icon = ({ icon, className, ...props }) => (
  <span {...props} className={`${className} icon icon-${icon}`}/>
)

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default Icon