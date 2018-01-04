import React from "react"
import PropTypes from "prop-types"

export default class BaseLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {
    let {
      specSelectors,
      specActions,
      getComponent,
      layoutSelectors,
      oas3Selectors,
      oas3Actions
    } = this.props

    let info = specSelectors.info()
    let url = specSelectors.url()
    let basePath = specSelectors.basePath()
    let host = specSelectors.host()
    let securityDefinitions = specSelectors.securityDefinitions()
    let externalDocs = specSelectors.externalDocs()
    let schemes = specSelectors.schemes()
    let servers = specSelectors.servers()

    let Info = getComponent("info")
    let Operations = getComponent("operations", true)
    let Models = getComponent("Models", true)
    let AuthorizeBtn = getComponent("authorizeBtn", true)
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Servers = getComponent("Servers")
    let Errors = getComponent("errors", true)

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"
    let filter = layoutSelectors.currentFilter()

    let inputStyle = {}
    if(isFailed) inputStyle.color = "red"
    if(isLoading) inputStyle.color = "#aaa"

    const Schemes = getComponent("schemes")

    const isSpecEmpty = !specSelectors.specStr()

    if(isSpecEmpty) {
      let loadingMessage

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
        <div>
          <Errors/>
          <Row className="information-container">
            <Col mobile={12}>
              { info.count() ? (
                <Info basePath={ basePath }
                  externalDocs={externalDocs}
                  getComponent={getComponent}
                  host={ host }
                  info={ info }
                  url={ url }/>
              ) : null }
            </Col>
          </Row>
          { schemes && schemes.size || securityDefinitions ? (
            <div className="scheme-container">
              <Col className="schemes wrapper"
                mobile={12}>
                { schemes && schemes.size ? (
                  <Schemes
                    currentScheme={specSelectors.operationScheme()}
                    schemes={ schemes }
                    specActions={ specActions } />
                ) : null }

                { securityDefinitions ? (
                  <AuthorizeBtn />
                ) : null }
              </Col>
            </div>
          ) : null }

          { servers && servers.size ? (
            <div className="global-server-container">
              <Col className="servers wrapper"
                mobile={12}>
                <span className="servers-title">Server</span>
                <Servers
                  currentServer={oas3Selectors.selectedServer()}
                  getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
                  getServerVariable={oas3Selectors.serverVariableValue}
                  servers={servers}
                  setSelectedServer={oas3Actions.setSelectedServer}
                  setServerVariableValue={oas3Actions.setServerVariableValue}
                />
              </Col>
            </div>

          ) : null}

          {
            filter === null || filter === false ? null :
              <div className="filter-container">
                <Col className="filter wrapper"
                  mobile={12}>
                  <input className="operation-filter-input"
                    disabled={isLoading}
                    onChange={this.onFilterChange}
                    placeholder="Filter by tag"
                    style={inputStyle}
                    type="text"
                    value={filter === true || filter === "true" ? "" : filter} />
                </Col>
              </div>
          }

          <Row>
            <Col desktop={12}
              mobile={12} >
              <Operations/>
            </Col>
          </Row>
          <Row>
            <Col desktop={12}
              mobile={12} >
              <Models/>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}
