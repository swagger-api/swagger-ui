/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const PlainTextViewer = ({ className = "", children }) => (
  <pre className={classNames("microlight", className)}>{children}</pre>
)

PlainTextViewer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string.isRequired,
}

export default PlainTextViewer
