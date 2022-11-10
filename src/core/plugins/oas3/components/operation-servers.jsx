import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class OperationServers extends React.Component {
  static propTypes = {
    // for self
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    operationServers: ImPropTypes.list,
    pathServers: ImPropTypes.list,
    setSelectedServer: PropTypes.func.isRequired,
    setServerVariableValue: PropTypes.func.isRequired,
    getSelectedServer: PropTypes.func.isRequired,
    getServerVariable: PropTypes.func.isRequired,
    getEffectiveServerValue: PropTypes.func.isRequired,

    // utils
    getComponent: PropTypes.func.isRequired
  }

  setSelectedServer = (server) => {
    const { path, method } = this.props
    // FIXME: we should be keeping up with this in props/state upstream of us
    // instead of cheating™ with `forceUpdate`
    this.forceUpdate()
    return this.props.setSelectedServer(server, `${path}:${method}`)
  }

  setServerVariableValue = (obj) => {
    const { path, method } = this.props
    // FIXME: we should be keeping up with this in props/state upstream of us
    // instead of cheating™ with `forceUpdate`
    this.forceUpdate()
    return this.props.setServerVariableValue({
      ...obj,
      namespace: `${path}:${method}`
    })
  }

  getSelectedServer = () => {
    const { path, method } = this.props
    return this.props.getSelectedServer(`${path}:${method}`)
  }

  getServerVariable = (server, key) => {
    const { path, method } = this.props
    return this.props.getServerVariable({
      namespace: `${path}:${method}`,
      server
    }, key)
  }

  getEffectiveServerValue = (server) => {
    const { path, method } = this.props
    return this.props.getEffectiveServerValue({
      server,
      namespace: `${path}:${method}`
    })
  }

  render() {
    const {
      // for self
      operationServers,
      pathServers,

      // util
      getComponent
    } = this.props

    if(!operationServers && !pathServers) {
      return null
    }

    const Servers = getComponent("Servers")

    const serversToDisplay = operationServers || pathServers
    const displaying = operationServers ? "operation" : "path"

    return <div className="opblock-section operation-servers">
      <div className="opblock-section-header">
        <div className="tab-header">
          <h4 className="opblock-title">Servers</h4>
        </div>
      </div>
      <div className="opblock-description-wrapper">
        <h4 className="message">
          These {displaying}-level options override the global server options.
        </h4>
        <Servers
          servers={serversToDisplay}
          currentServer={this.getSelectedServer()}
          setSelectedServer={this.setSelectedServer}
          setServerVariableValue={this.setServerVariableValue}
          getServerVariable={this.getServerVariable}
          getEffectiveServerValue={this.getEffectiveServerValue}
          />
      </div>
    </div>
  }
}
