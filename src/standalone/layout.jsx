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
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.handleFilterChange = this.handleFilterChange.bind(this)

    let { getConfigs } = this.props
    let { filter } = getConfigs()

    this.state = { filter: filter }
  }

  handleFilterChange(filter) {
    this.setState({ filter: filter })
  }

  render() {
    let { getComponent, specSelectors } = this.props

    let Container = getComponent("Container")
    let Row = getComponent("Row")
    let Col = getComponent("Col")

    const Topbar = getComponent("Topbar", true)
    const BaseLayout = getComponent("BaseLayout", true)
    const OnlineValidatorBadge = getComponent("onlineValidatorBadge", true)

    const filter = this.state.filter

    const loadingStatus = specSelectors.loadingStatus()

    return (

      <Container className='swagger-ui'>
        { Topbar ? <Topbar onFilterChange={this.handleFilterChange} filter={ filter } /> : null }
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
        { !loadingStatus || loadingStatus === "success" && <BaseLayout filter={filter} /> }
        <Row>
          <Col>
            <OnlineValidatorBadge />
          </Col>
        </Row>
      </Container>
    )
  }

}
