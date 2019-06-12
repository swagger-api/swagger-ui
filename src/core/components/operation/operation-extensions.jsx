import React from "react"
import PropTypes from "prop-types"

export const OperationExt = ({ extensions, getComponent }) => {
    let OperationExtRow = getComponent("OperationExtRow")
    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <h4>Extensions</h4>
        </div>
        <div className="table-container">

          <table>
            <thead>
              <tr>
                <td className="col col_header">Field</td>
                <td className="col col_header">Value</td>
              </tr>
            </thead>
            <tbody>
                {
                    extensions.entrySeq().map(([k, v]) => <OperationExtRow key={`${k}-${v}`} xKey={k} xVal={v} />)
                }
            </tbody>
          </table>
        </div>
      </div>
    )
}
OperationExt.propTypes = {
  extensions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}

export default OperationExt
