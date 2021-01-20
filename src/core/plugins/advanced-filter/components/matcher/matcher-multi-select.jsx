import React from "react"
import PropTypes from "prop-types"

export class MatcherMultiSelect extends React.Component {
  static propTypes = {
    advancedFilterSelectors: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      showSelect: false
    }
  }
  onClick = () => {
    this.setState({ showSelect: !this.state.showSelect })
  }

  render() {
    const matcherSelectOptionComponents = this.props.advancedFilterSelectors.getMatchersAsComponents()

    const classNames = ["matcher-multi-select"]
    const btnClassNames = ["matcher-multi-select-btn"]
    if(this.state.showSelect) {
      classNames.push("active")
      btnClassNames.push("active")
    }
    return (
      <div className="matcher-multi-select-wrapper">
        <button
          className={btnClassNames.join(" ")}
          title={this.state.showSelect ? "Collapse matchers": "Expand matchers"}
          onClick={this.onClick}>

          <svg className="arrow" width="20" height="20">
            <use href={this.state.showSelect ? "#large-arrow" : "#large-arrow-down"} xlinkHref={this.state.showSelect ? "#large-arrow" : "#large-arrow-down"} />
          </svg>
        </button>
        <div className={classNames.join(" ")}>
          {matcherSelectOptionComponents}
        </div>
      </div>
    )
  }
}

