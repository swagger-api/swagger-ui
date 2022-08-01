import React from "react"
import PropTypes from "prop-types"

export default class TryItOutButton extends React.Component {

  static propTypes = {
    onTryoutClick: PropTypes.func,
    onResetClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    enabled: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
    hasUserEditedBody: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
    isOAS3: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
  }

  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    onResetClick: Function.prototype,
    enabled: false,
    hasUserEditedBody: false,
    isOAS3: false,
  }

  render() {
    const { onTryoutClick, onCancelClick, onResetClick, enabled, hasUserEditedBody, isOAS3 } = this.props

    const showReset = isOAS3 && hasUserEditedBody
    return (
      <div className={showReset ? "try-out btn-group" : "try-out"}>
        {
          enabled ? <button className="btn try-out__btn cancel" onClick={ onCancelClick }>Cancel</button>
                  : <button className="btn try-out__btn" onClick={ onTryoutClick }>Try it out </button>

        }
        {
          showReset && <button className="btn try-out__btn reset" onClick={ onResetClick }>Reset</button>
        }
      </div>
    )
  }
}
