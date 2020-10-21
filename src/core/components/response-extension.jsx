import React from "react"
import PropTypes from "prop-types"

export const ResponseExtension = ({ xKey, xVal }) => {
    return <div className="response__extension">{ xKey }: { String(xVal) }</div>
}
ResponseExtension.propTypes = {
  xKey: PropTypes.string,
  xVal: PropTypes.any
}

export default ResponseExtension
