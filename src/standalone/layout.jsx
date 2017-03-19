import React, { PropTypes } from 'react'

export default class StandaloneLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired
  }

  render() {
    let { specSelectors, specActions, getComponent, errSelectors, errActions, spec, readOnly } = this.props

    let info = specSelectors.info()
    let url = specSelectors.url()
    let basePath = specSelectors.basePath()
    let host = specSelectors.host()
    let securityDefinitions = specSelectors.securityDefinitions()
    let externalDocs = specSelectors.externalDocs()
    let schemes = specSelectors.schemes()

    let Info = getComponent("info")
    let Operations = getComponent("operations", true)
    let Models = getComponent("models", true)
    let AuthorizeBtn = getComponent("authorizeBtn", true)
    let Container = getComponent("Container")
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Button = getComponent("Button")
    let Errors = getComponent("errors", true)
    const SplitPaneMode = getComponent("SplitPaneMode", true)
    const Schemes = getComponent("schemes")

    const Topbar = getComponent("Topbar", true)
    const OnlineValidatorBadge = getComponent("onlineValidatorBadge", true)
    const loadingStatus = specSelectors.loadingStatus()

    return (

      <Container className='swagger-ui'>
        { Topbar ? <Topbar/> : null }
        { loadingStatus === "loading" &&
          <div className="info">
            <h4 className="title">Loading...</h4>
          </div>
        }
        { loadingStatus === "failed" &&
          <div className="info">
            <h4 className="title">Failed to load spec.</h4>
          </div>
        }
        { loadingStatus === "failedConfig" &&
          <div className="info" style={{ maxWidth: "880px", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            <h4 className="title">Failed to load config.</h4>
          </div>
        }
        { loadingStatus === "success" &&
          <div>
              <Errors/>
              <Row className="information-container">
                <Col mobile={12}>
                  { info.count() ? (
                    <Info info={ info } url={ url } host={ host } basePath={ basePath } externalDocs={externalDocs} getComponent={getComponent}/>
                  ) : null }
                </Col>
              </Row>
              <div className="scheme-container">
                <Col className="schemes wrapper" mobile={12}>
                  { schemes && schemes.size ? (
                    <Schemes schemes={ schemes } specActions={ specActions } /> 
                  ) : null }
                  { securityDefinitions ? (
                    <AuthorizeBtn />
                  ) : null }
                </Col>
              </div>
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
          </div> }

          <Row>
            <Col>
              <OnlineValidatorBadge />
            </Col>
          </Row>
      </Container>
    )
  }

}
