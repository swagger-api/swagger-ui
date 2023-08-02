/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const Close = ({ className, width, height, ...rest }) => (
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
    <path d="M14.348 14.849c-.469.469-1.229.469-1.697 0L10 11.819l-2.651 3.029c-.469.469-1.229.469-1.697 0-.469-.469-.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-.469-.469-.469-1.228 0-1.697.469-.469 1.228-.469 1.697 0L10 8.183l2.651-3.031c.469-.469 1.228-.469 1.697 0 .469.469.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c.469.469.469 1.229 0 1.698z" />
  </svg>
)

Close.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
}

Close.defaultProps = {
  className: null,
  width: 20,
  height: 20,
}

export default Close
