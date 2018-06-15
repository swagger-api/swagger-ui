import React from "react"
import PropTypes from "prop-types"

export default class ServersContainer extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  render () {
    const {specSelectors, oas3Selectors, oas3Actions, getComponent} = this.props

    const servers = specSelectors.servers()

    const Col = getComponent("Col")
    const Servers = getComponent("Servers")

    return (
      <div>
        {servers && servers.size ? (
          <div className="global-server-container">
            <Col className="servers wrapper" mobile={12}>
              <span className="servers-title">Server</span>
              <Servers
                servers={servers}
                currentServer={oas3Selectors.selectedServer()}
                setSelectedServer={oas3Actions.setSelectedServer}
                setServerVariableValue={oas3Actions.setServerVariableValue}
                getServerVariable={oas3Selectors.serverVariableValue}
                getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
              />
            </Col>
          </div>

        ) : null}
      </div>
    )
  }
}
