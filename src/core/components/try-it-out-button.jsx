import React from "react"
import PropTypes from "prop-types"

import { Button } from "components/layout-utils"

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
          enabled 
            ? <Button
                className="sui-btn sui-btn--secondary try-out__btn cancel"
                onClick={ onCancelClick }
              >
                Cancel
              </Button>
            : <Button
                className="sui-btn sui-btn--primary try-out__btn"
                onClick={ onTryoutClick }
              >
                Try it out
              </Button>
        }
      </div>
    )
  }
}
