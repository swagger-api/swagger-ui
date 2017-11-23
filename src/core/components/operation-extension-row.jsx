import React from "react"
import PropTypes from "prop-types"

export const OperationExtRow = ({ xKey, xVal }) => {
    return (<tr>
        <td>{ xKey }</td>
        <td>{ String(xVal) }</td>
    </tr>)
}
OperationExtRow.propTypes = {
  xKey: PropTypes.string,
  xVal: PropTypes.any
}

export default OperationExtRow
