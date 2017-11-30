import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class OperationServers extends React.PureComponent {
  static propTypes = {
    // for self
    operationServers: ImPropTypes.list,
    pathServers: ImPropTypes.list,

    // for Servers
    currentServer: PropTypes.string.isRequired,
    setSelectedServer: PropTypes.func.isRequired,
    setServerVariableValue: PropTypes.func.isRequired,
    getServerVariable: PropTypes.func.isRequired,
    getEffectiveServerValue: PropTypes.func.isRequired,

    // utils
    getComponent: PropTypes.func.isRequired
  }

  render() {
    const {
      // for self
      operationServers,
      pathServers,

      // for Servers
      currentServer,
      setSelectedServer,
      setServerVariableValue,
      getServerVariable,
      getEffectiveServerValue,

      // util
      getComponent
    } = this.props

    const serverPassthroughProps = { currentServer, setSelectedServer, setServerVariableValue, getServerVariable, getEffectiveServerValue }

    const Servers = getComponent("Servers")

    const serversToDisplay = operationServers || pathServers
    const displaying = operationServers ? "operation" : "path"

    return <div className="opblock-section">
      <div className="opblock-section-header">
        <div className="tab-header">
          <h4 className="opblock-title">Servers</h4>
        </div>
      </div>
      <div className="opblock-description-wrapper">
        <h4>These {displaying}-level options override the global server options.</h4>
        <Servers
          {...serverPassthroughProps}
          servers={serversToDisplay}
          />
      </div>
    </div>
  }
}
