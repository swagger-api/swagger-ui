import React from "react"
import PropTypes from "prop-types"

export default class TryItOutButton extends React.Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
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
    const { translate, onTryoutClick, onCancelClick, enabled } = this.props

    return (
      <div className="try-out">
        {
          enabled ? <button className="btn try-out__btn cancel" onClick={ onCancelClick }>{translate("cancel")}</button>
                  : <button className="btn try-out__btn" onClick={ onTryoutClick }>{translate("tryItOut")}</button>
        }
      </div>
    )
  }
}
