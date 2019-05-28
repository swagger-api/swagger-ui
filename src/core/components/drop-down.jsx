import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class DropDown extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    mod: PropTypes.string,
    disbaled: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  render() {
    const { id, disbaled } = this.props
    const isOpen = true

    const children = React.Children.map(this.props.children, (child, index) => {
      // get active value here
      return React.cloneElement(child, {
        // pass down props here
      })
    })

    return (
			<div id={id} className={cx("sui-dropdown", {[`sui-dropdown--${this.props.mod}`] : this.props.mod})}>
        <button
          className="sui-dropdown__button"
          role="button"
          aria-haspopup={true}
          aria-expanded={isOpen}
          aria-disabled={disbaled}
        >
          I am a dropdown [arrow]
        </button>
        <ul
          className="sui-dropdown__menu"
          role="menu"
        >
        {children}
        </ul>
      </div>
			)
  }
}


export const DropDownItem = () => {
    
  return (
    <li className="sui-dropdown__menu__item">
      <div role="menuitem">I am a dropdown item</div>
    </li>
  )
}