import React, { PropTypes } from "react"

export default class TryItOutButton extends React.Component {

  static propTypes = {
    onTryoutClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    enabled: PropTypes.bool, // Try it out is enabled, ie: the user has access to the form
  };

  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    enabled: false,
  };

  render() {
    const { onTryoutClick, onCancelClick, enabled } = this.props

    return (
      <div className="try-out">
        {
          enabled ? <button className="btn try-out__btn cancel" onClick={ onTryoutClick }>Cancel</button>
                  : <button className="btn try-out__btn" onClick={ onCancelClick }>Try it out </button>
        }
      </div>
    )
  }
}
