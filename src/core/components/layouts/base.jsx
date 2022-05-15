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
    let {errSelectors, specSelectors, getComponent} = this.props

    let SvgAssets = getComponent("SvgAssets")
    let InfoContainer = getComponent("InfoContainer", true)
    let VersionPragmaFilter = getComponent("VersionPragmaFilter")
    let Operations = getComponent("operations", true)
    let Models = getComponent("Models", true)
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Errors = getComponent("errors", true)

    const ServersContainer = getComponent("ServersContainer", true)
    const SchemesContainer = getComponent("SchemesContainer", true)
    const AuthorizeBtnContainer = getComponent("AuthorizeBtnContainer", true)
    const FilterContainer = getComponent("FilterContainer", true)
    let isSwagger2 = specSelectors.isSwagger2()
    let isOAS3 = specSelectors.isOAS3()

    const isSpecEmpty = !specSelectors.specStr()

    const loadingStatus = specSelectors.loadingStatus()

    let loadingMessage = null

    if(loadingStatus === "loading") {
      loadingMessage = <div className="info">
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      </div>
    }

    if(loadingStatus === "failed") {
      loadingMessage = <div className="info">
        <div className="loading-container">
          <h4 className="title">Failed to load API definition.</h4>
          <Errors />
        </div>
      </div>
    }

    if (loadingStatus === "failedConfig") {
      const lastErr = errSelectors.lastError()
      const lastErrMsg = lastErr ? lastErr.get("message") : ""
      loadingMessage = <div className="info failed-config">
        <div className="loading-container">
          <h4 className="title">Failed to load remote configuration.</h4>
          <p>{lastErrMsg}</p>
        </div>
      </div>
    }

    if(!loadingMessage && isSpecEmpty) {
      loadingMessage = <h4>No API definition provided.</h4>
    }

    if(loadingMessage) {
      return <div className="swagger-ui">
        <div className="loading-container">
          {loadingMessage}
        </div>
      </div>
    }

    const servers = specSelectors.servers()
    const schemes = specSelectors.schemes()

    const hasServers = servers && servers.size
    const hasSchemes = schemes && schemes.size
    const hasSecurityDefinitions = !!specSelectors.securityDefinitions()

    return (
      <div className='swagger-ui'>
        <SvgAssets />
        <VersionPragmaFilter isSwagger2={isSwagger2} isOAS3={isOAS3} alsoShow={<Errors/>}>
          <Errors/>
          <Row className="information-container">
            <Col mobile={12}>
              <InfoContainer/>
            </Col>
          </Row>

          {hasServers || hasSchemes || hasSecurityDefinitions ? (
            <div className="scheme-container">
              <Col className="schemes wrapper" mobile={12}>
                {hasServers ? (<ServersContainer />) : null}
                {hasSchemes ? (<SchemesContainer />) : null}
                {hasSecurityDefinitions ? (<AuthorizeBtnContainer />) : null}
              </Col>
            </div>
          ) : null}

          <FilterContainer/>

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
        </VersionPragmaFilter>
      </div>
    )
  }
}
