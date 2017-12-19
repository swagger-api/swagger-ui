import React from "react"
import PropTypes from "prop-types"

export default class KongLayout extends React.Component {

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

  onFilterChange = (e) => {
    let { target: { value } } = e
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
    let AuthorizeBtn = getComponent("authorizeBtn", true)
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Servers = getComponent("Servers")
    let Errors = getComponent("errors", true)

    let KongOperations = getComponent("KongOperations", true)

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"
    let filter = layoutSelectors.currentFilter()

    let inputStyle = {}
    if (isFailed) inputStyle.color = "red"
    if (isLoading) inputStyle.color = "#aaa"

    const isSpecEmpty = !specSelectors.specStr()

    if (isSpecEmpty) {
      return <h4>No spec provided.</h4>
    }

    return (

      <div className='swagger-ui'>
        <div className="side-panel"></div>
        <div className="wrapper">
          <div className="col">
            <Errors />
            <div className="information-container">

              {schemes && schemes.size || securityDefinitions ? (
                <div>
                  {securityDefinitions ? (
                    <AuthorizeBtn />
                  ) : null}
                </div>
              ) : null}

              {info.count() ? (
                <Info info={info} url={url} host={host} basePath={basePath} externalDocs={externalDocs} getComponent={getComponent} />
              ) : null}
            </div>

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

            {
              filter === null || filter === false ? null :
                <div className="filter-container">
                  <Col className="filter wrapper" mobile={12}>
                    <input className="operation-filter-input" placeholder="Filter by tag" type="text" onChange={this.onFilterChange} value={filter === true || filter === "true" ? "" : filter} disabled={isLoading} style={inputStyle} />
                  </Col>
                </div>
            }
          </div>
        </div>
        <KongOperations />
      </div>
    )
  }
}
