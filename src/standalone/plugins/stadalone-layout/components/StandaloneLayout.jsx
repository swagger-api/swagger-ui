import React from "react"
import PropTypes from "prop-types"

class StandaloneLayout extends React.Component {

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

    return (
      <Container className='swagger-ui'>
        <a
          href="#operations"
          className="swagger-ui__skip-link"
          onClick={(e) => {
            e.preventDefault()
            // Scope the lookup to this swagger-ui instance so the link
            // works correctly when multiple instances are mounted.
            const target = e.currentTarget
              .closest(".swagger-ui")
              ?.querySelector("#operations")
            if (target) {
              target.focus()
              target.scrollIntoView()
            }
          }}
        >
          Skip to operations
        </a>
        {Topbar ? <header role="banner"><Topbar /></header> : null}
        <BaseLayout />
        <Row>
          <Col>
            <OnlineValidatorBadge />
          </Col>
        </Row>
      </Container>
    )
  }

}

export default StandaloneLayout
