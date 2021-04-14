import React from "react"
import PropTypes from "prop-types"

export default class FilterContainer extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    featuresSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  onFilterChange = (e) => {
    const {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render () {
    const {specSelectors, layoutSelectors, getComponent, featuresSelectors} = this.props
    const Col = getComponent("Col")

    const isLoading = specSelectors.loadingStatus() === "loading"
    const isFailed = specSelectors.loadingStatus() === "failed"
    const filter = layoutSelectors.currentFilter()

    const classNames = ["operation-filter-input"]
    if (isFailed) classNames.push("failed")
    if (isLoading) classNames.push("loading")

    return (
      <div>
        {
          featuresSelectors.isFeatureEnabled("filter")
            ? <div className="filter-container">
                <Col className="filter wrapper" mobile={12}>
                  <input className={classNames.join(" ")} placeholder="Filter by tag" type="text"
                         onChange={this.onFilterChange} value={filter}
                         disabled={isLoading}/>
                </Col>
              </div>
            : null
        }
      </div>
    )
  }
}
