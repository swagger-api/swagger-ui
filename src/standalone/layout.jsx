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
    const { getComponent } = this.props
    const Container = getComponent("Container")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const Topbar = getComponent("Topbar", true)
    const BaseLayout = getComponent("BaseLayout", true)
    const OnlineValidatorBadge = getComponent("onlineValidatorBadge", true)
    const ErrorBoundary = getComponent("ErrorBoundary", true)


    return (
      <Container className='swagger-ui'>
        <ErrorBoundary targetName="Topbar">
          {Topbar ? <Topbar /> : null}
        </ErrorBoundary>
        <BaseLayout />
        <ErrorBoundary targetName="OnlineValidatorBadge">
          <Row>
            <Col>
              <OnlineValidatorBadge />
            </Col>
          </Row>
        </ErrorBoundary>
      </Container>
    )
  }

}
