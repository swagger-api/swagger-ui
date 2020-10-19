import React from "react"
import PropTypes from "prop-types"

export const ResponseExt = ({ xKey, xVal }) => {
    return <div className="response__extension">{ xKey }: { String(xVal) }</div>
}
ResponseExt.propTypes = {
  xKey: PropTypes.string,
  xVal: PropTypes.any
}

export default ResponseExt
