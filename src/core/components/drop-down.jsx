import React, { PureComponent } from "react"
import PropTypes from "prop-types"

export default class DropDown extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  
  render() {
    const isOpen = true
    const isDisabled = false

    return (
			<div className="dropdown">
        <button
          className="dropdown__button"
          role="button"
          aria-haspopup={true}
          aria-expanded={isOpen}
          aria-disabled={isDisabled}
        >
          I am a dropdown
        </button>
        <div
          className="dropdown__menu"
          role="menu"
        >
        {this.props.children}
        </div>
      </div>
			)
  }
}