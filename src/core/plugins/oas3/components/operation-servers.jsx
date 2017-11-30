import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class OperationServers extends React.PureComponent {
  static propTypes = {
    operationServers: ImPropTypes.list,
    pathServers: ImPropTypes.list,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    const { getComponent, pathServers, operationServers } = this.props
    const Servers = getComponent("Servers")

    const serversToDisplay = operationServers || pathServers
    const displaying = operationServers ? "operation" : "path"

    return <div className="opblock-section">
      <div className="opblock-section-header">
        <div className="tab-header">
          <h4 className="opblock-title">Servers ({displaying})</h4>
        </div>
      </div>
      <div className="opblock-description-wrapper">
        <h4>These options override the global server settings.</h4>
        <Servers
          servers={serversToDisplay}
          />
      </div>
    </div>
  }
}
