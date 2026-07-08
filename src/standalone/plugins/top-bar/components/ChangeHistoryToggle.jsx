import React, { Component } from "react"
import PropTypes from "prop-types"

import HistoryIcon from "../assets/history-icon.svg"

class ChangeHistoryToggle extends Component {
  static propTypes = {
    changeHistoryActions: PropTypes.object.isRequired,
    changeHistorySelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
  }

  onClick = () => {
    this.props.changeHistoryActions.togglePanel()
  }

  render() {
    const { changeHistorySelectors, specSelectors, getConfigs } = this.props
    const configs = getConfigs()

    if (configs.changeHistory === false) {
      return null
    }

    if (specSelectors.loadingStatus() === "loading") {
      return null
    }

    const hasUnseenChanges = changeHistorySelectors.hasUnseenChanges()

    return (
      <div className="change-history-toggle">
        <button
          type="button"
          onClick={this.onClick}
          aria-label="API change history"
          title="API change history"
        >
          <HistoryIcon height="24" />
          {hasUnseenChanges ? (
            <span className="change-history-badge" aria-label="New changes" />
          ) : null}
        </button>
      </div>
    )
  }
}

export default ChangeHistoryToggle
