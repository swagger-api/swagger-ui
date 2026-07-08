import React from "react"
import PropTypes from "prop-types"

import { formatChangeSummary } from "core/plugins/change-history/fn"

class ChangeHistorySidebar extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString()
  }

  renderChange(change, index) {
    const isAddition = change.type.includes("added")
    const isRemoval = change.type.includes("removed")
    const className = [
      "change-history-item",
      isAddition ? "change-added" : "",
      isRemoval ? "change-removed" : "",
      !isAddition && !isRemoval ? "change-modified" : "",
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <li key={`${change.type}-${index}`} className={className}>
        {formatChangeSummary(change)}
      </li>
    )
  }

  renderEntry(entry, index) {
    const changes = entry.changes || []
    const isBaseline = entry.isBaseline
    const timestamp = entry.timestamp
    const version = entry.version
    const title = entry.title

    return (
      <div key={entry.id || index} className="change-history-entry">
        <div className="change-history-entry-header">
          <span className="change-history-entry-time">
            {this.formatTimestamp(timestamp)}
          </span>
          {version ? (
            <span className="change-history-entry-version">v{version}</span>
          ) : null}
          {title ? <span className="change-history-entry-title">{title}</span> : null}
        </div>

        {isBaseline ? (
          <p className="change-history-baseline">Initial snapshot saved</p>
        ) : changes.length ? (
          <ul className="change-history-changes">
            {changes.map((change, changeIndex) =>
              this.renderChange(change, changeIndex)
            )}
          </ul>
        ) : (
          <p className="change-history-no-changes">No structural changes detected</p>
        )}
      </div>
    )
  }

  render() {
    const { history, onClose, onClear, getComponent } = this.props
    const Button = getComponent("Button")
    const entries = history?.toJS?.() || history || []

    return (
      <aside className="change-history-sidebar" aria-label="API change history">
        <div className="change-history-sidebar-header">
          <h4>API Change History</h4>
          <div className="change-history-sidebar-actions">
            {entries.length ? (
              <Button className="btn change-history-clear-btn" onClick={onClear}>
                Clear history
              </Button>
            ) : null}
            <Button className="btn change-history-close-btn" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {!entries.length ? (
          <p className="change-history-empty">
            No history yet. Reload the spec after backend changes to capture diffs.
          </p>
        ) : (
          <div className="change-history-entries">
            {entries.map((entry, index) => this.renderEntry(entry, index))}
          </div>
        )}
      </aside>
    )
  }
}

export default ChangeHistorySidebar
