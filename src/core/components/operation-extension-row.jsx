import React from "react"
import PropTypes from "prop-types"

export const OperationExtRow = ({ xKey, xVal }) => {
  const xNormalizedValue = !xVal ? null : xVal.toJS ? xVal.toJS() : xVal

    return (<tr>
        <td>{ xKey }</td>
        <td>{ JSON.stringify(xNormalizedValue) }</td>
    </tr>)
}
OperationExtRow.propTypes = {
  xKey: PropTypes.string,
  xVal: PropTypes.any
}

export default OperationExtRow
