/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const ArrowUp = ({ className, width, height, ...rest }) => (
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
    <path d="M 17.418 14.908 C 17.69 15.176 18.127 15.176 18.397 14.908 C 18.667 14.64 18.668 14.207 18.397 13.939 L 10.489 6.109 C 10.219 5.841 9.782 5.841 9.51 6.109 L 1.602 13.939 C 1.332 14.207 1.332 14.64 1.602 14.908 C 1.873 15.176 2.311 15.176 2.581 14.908 L 10 7.767 L 17.418 14.908 Z" />
  </svg>
)

ArrowUp.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
}

ArrowUp.defaultProps = {
  className: null,
  width: 20,
  height: 20,
}

export default ArrowUp
