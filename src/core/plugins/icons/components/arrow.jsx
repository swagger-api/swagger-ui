/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const Arrow = ({ className = null, width = 20, height = 20, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className={className}
    width={width}
    height={height}
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    <path d="M13.25 10L6.109 2.58c-.268-.27-.268-.707 0-.979.268-.27.701-.27.969 0l7.83 7.908c.268.271.268.709 0 .979l-7.83 7.908c-.268.271-.701.27-.969 0-.268-.269-.268-.707 0-.979L13.25 10z" />
  </svg>
)

Arrow.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
}

export default Arrow
