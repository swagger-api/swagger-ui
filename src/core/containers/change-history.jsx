import React from "react"
import PropTypes from "prop-types"

import ChangeHistorySidebar from "core/plugins/change-history/components/ChangeHistorySidebar"

export default class ChangeHistoryContainer extends React.Component {
  static propTypes = {
    changeHistorySelectors: PropTypes.object.isRequired,
    changeHistoryActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
  }

  onClose = () => {
    this.props.changeHistoryActions.setPanelOpen(false)
  }

  onClear = () => {
    this.props.changeHistoryActions.clearHistory()
  }

  render() {
    const { changeHistorySelectors, specSelectors, getComponent, getConfigs } =
      this.props
    const configs = getConfigs()

    if (configs.changeHistory === false) {
      return null
    }

    const isLoading = specSelectors.loadingStatus() === "loading"
    const isPanelOpen = changeHistorySelectors.isPanelOpen()
    const history = changeHistorySelectors.history()

    if (isLoading || !isPanelOpen) {
      return null
    }

    return (
      <>
        <div
          className="change-history-backdrop"
          onClick={this.onClose}
          role="presentation"
        />
        <ChangeHistorySidebar
          history={history}
          onClose={this.onClose}
          onClear={this.onClear}
          getComponent={getComponent}
        />
      </>
    )
  }
}
