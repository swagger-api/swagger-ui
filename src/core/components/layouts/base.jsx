import React from "react"
import PropTypes from "prop-types"

export default class BaseLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let {
      specSelectors,
      getComponent,
      oas3Selectors,
      oas3Actions
    } = this.props

    let servers = specSelectors.servers()

    let SvgAssets = getComponent("SvgAssets")
    let InfoWrapper = getComponent("InfoWrapper", true)
    let Operations = getComponent("operations", true)
    let Models = getComponent("Models", true)
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Servers = getComponent("Servers")
    let Errors = getComponent("errors", true)

    const SchemesWrapper = getComponent("SchemesWrapper", true)
    const Filter = getComponent("Filter", true)

    const isSpecEmpty = !specSelectors.specStr()

    if(isSpecEmpty) {
      let loadingMessage
      let isLoading = specSelectors.loadingStatus() === "loading"
      if(isLoading) {
        loadingMessage = <div className="loading"></div>
      } else {
        loadingMessage = <h4>No API definition provided.</h4>
      }

      return <div className="swagger-ui">
        <div className="loading-container">
          {loadingMessage}
        </div>
      </div>
    }

    return (

      <div className='swagger-ui'>
          <SvgAssets />
          <div>
            <Errors/>
            <Row className="information-container">
              <Col mobile={12}>
                <InfoWrapper/>
              </Col>
            </Row>
            <SchemesWrapper/>

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

            <Filter/>

            <Row>
              <Col mobile={12} desktop={12} >
                <Operations/>
              </Col>
            </Row>
            <Row>
              <Col mobile={12} desktop={12} >
                <Models/>
              </Col>
            </Row>
          </div>
        </div>
      )
  }
}
