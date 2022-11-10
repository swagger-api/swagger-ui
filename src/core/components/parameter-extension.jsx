import React from "react"
import PropTypes from "prop-types"

export const ParameterExt = ({ xKey, xVal }) => {
    return <div className="parameter__extension">{ xKey }: { String(xVal) }</div>
}
ParameterExt.propTypes = {
  xKey: PropTypes.string,
  xVal: PropTypes.any
}

export default ParameterExt
