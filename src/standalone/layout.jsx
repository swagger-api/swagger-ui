

import React from "react"
import PropTypes from "prop-types"

export default class StandaloneLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let { getComponent, specSelectors, errSelectors } = this.props

    let Container = getComponent("Container")
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Errors = getComponent("errors", true)

    const Topbar = getComponent("Topbar", true)
    const BaseLayout = getComponent("BaseLayout", true)
    const OnlineValidatorBadge = getComponent("onlineValidatorBadge", true)

    const loadingStatus = specSelectors.loadingStatus()
    const lastErr = errSelectors.lastError()
    const lastErrMsg = lastErr ? lastErr.get("message") : ""

    return (

      <Container className='swagger-ui'>
        { Topbar ? <Topbar /> : null }
        { loadingStatus === "loading" &&
          <div className="info">
            <div className="loading-container">
              <div className="loading"></div>
            </div>
          </div>
        }
        { loadingStatus === "failed" &&
          <div className="info">
            <div className="loading-container">
              <h4 className="title">Failed to load API definition.</h4>
              <Errors/>
            </div>
          </div>
        }
        { loadingStatus === "failedConfig" &&
          <div className="info" style={{ maxWidth: "880px", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            <div className="loading-container">
              <h4 className="title">Failed to load remote configuration.</h4>
              <p>{lastErrMsg}</p>
            </div>
          </div>
        }
        { !loadingStatus || loadingStatus === "success" && <BaseLayout /> }
        <Row>
          <Col>
            <OnlineValidatorBadge />
          </Col>
        </Row>
      </Container>
    )
  }

}
