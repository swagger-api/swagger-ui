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

  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  onClick = () => {
    this.setState((state) => ({ expanded: !state.expanded }))
  }

  openDropdown = () => {
    this.setState(() => ({ expanded: true }))
    // set focus to first item/selected item
  }

  closeDropdown = () => {
    this.setState(() => ({ expanded: false }))
    // set focus to button
  }

  onKeyPress = (e) => {
    e.preventDefault()
    switch (e.key)
    {
      case "ArrowUp":
      case "ArrowDown":
      case "Enter":
        this.openDropdown()
        break
      case "Escape":
        this.closeDropdown()
    }
  }

  render() {
    const { id, disbaled } = this.props
    const { expanded } = this.state

    const children = React.Children.map(this.props.children, (child, index) => {
      // get active value here
      return React.cloneElement(child, {
        // pass down props here
      })
    })

    return (
      <div
        id={id}
        className={cx("sui-dropdown", { [`sui-dropdown--expanded`] : expanded }, { [`sui-dropdown--${this.props.mod}`] : this.props.mod })}
      >
        <button
          className="sui-dropdown__button"
          aria-haspopup={"listbox"}
          aria-expanded={expanded}
          aria-disabled={disbaled}
          onClick={this.onClick}
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyPress}
        >
          I am a dropdown [arrow]
        </button>
        <ul
          className="sui-dropdown__menu"
          role="listbox"
          tabIndex="-1"
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
      <div role="option">I am a dropdown item</div>
    </li>
  )
}