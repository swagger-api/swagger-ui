import React from "react"
import PropTypes from "prop-types"

export default class ServersContainer extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
  }

  render () {
    const {specSelectors, oas3Selectors, oas3Actions, getComponent, translate} = this.props

    const servers = specSelectors.servers()

    const Servers = getComponent("Servers")

    return servers && servers.size ? (
      <div>
        <span className="servers-title">{translate("servers.title")}</span>
        <Servers
          servers={servers}
          currentServer={oas3Selectors.selectedServer()}
          setSelectedServer={oas3Actions.setSelectedServer}
          setServerVariableValue={oas3Actions.setServerVariableValue}
          getServerVariable={oas3Selectors.serverVariableValue}
          getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
          translate={translate}
        />
      </div> ) : null
  }
}
