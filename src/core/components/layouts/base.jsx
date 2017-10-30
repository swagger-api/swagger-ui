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
      return <h4>No spec provided.</h4>
    }

    return (

      <div className='swagger-ui'>
          <div>
            <Errors/>
            <Row className="information-container">
              <Col mobile={12}>
                { info.count() ? (
                  <Info info={ info } url={ url } host={ host } basePath={ basePath } externalDocs={externalDocs} getComponent={getComponent}/>
                ) : null }
              </Col>
            </Row>
            <Row>
              <Col mobile={12} desktop={12} >
                <Operations/>
              </Col>
            </Row>
          </div>
        </div>
      )
  }
}
