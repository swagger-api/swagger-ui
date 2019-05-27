import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class DropDown extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  classHandler = (className) => cx(className, {[`${className}--${this.props.className}`] : this.props.className})
  
  render() {
    const { id, children } = this.props
    const isOpen = true
    const isDisabled = false

    return (
			<div id={id} className={this.classHandler("dropdown")}>
        <button
          className={this.classHandler("dropdown__button")}
          role="button"
          aria-haspopup={true}
          aria-expanded={isOpen}
          aria-disabled={isDisabled}
        >
          I am a dropdown
        </button>
        <div
          className={this.classHandler("dropdown__menu")}
          role="menu"
        >
          {children}
        </div>
      </div>
			)
  }
}