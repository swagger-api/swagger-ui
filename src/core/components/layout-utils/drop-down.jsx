import React, { Component, PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class DropDown extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    displayLabel: PropTypes.string,
    mod: PropTypes.string,
    disbaled: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
    this.optionRef = (el) => this.child = el
  }

  componentDidUpdate() {
    if(this.state.expanded) {
      console.log(this.child)
      this.child.setFocus()
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
        // if closed - open
        // else - move focus to prev item
        break
      case "ArrowDown":
        // if closed - open
        // else - move focus to next item
        break
      case "Enter":
      case " ":
        this.openDropdown()
        // if closed - open
        // else - select item and close
        break
      case "Escape":
        this.closeDropdown()
        break
      case "Home":
        // if open - move to start of list
        break
      case "End":
        // if open - move to end of list
        break
    }
  }

  displayLabel = () => (this.props.label && this.props.displayLabel)
    ? <lable>{this.props.label}</lable>
    : null

  labelAttr = (el) => this.props.label
    ? this.props.label + " " + el
    : null

  render() {
    const { id, disbaled } = this.props
    const { expanded } = this.state

    const children = React.Children.map(this.props.children, (child, index) => {
      // get active value here
      return React.cloneElement(child, {
        ref: this.optionRef,
        // pass down props here
      })
    })

    // console.log(this.refsCollection)

    return (
      <div
        id={id}
        className={cx("sui-dropdown", { [`sui-dropdown--expanded`] : expanded }, { [`sui-dropdown--${this.props.mod}`] : this.props.mod })}
      >
        {this.displayLabel()}
        <button
          className="sui-dropdown__button"
          aria-label={this.labelAttr("Select")}
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
          aria-label={this.labelAttr("Options")}
        >
        {children}
        {/* <DropDownItem ref={(instance) => this.child = instance}></DropDownItem> */}
        </ul>
      </div>
			)
  }
}


export class DropDownItem extends Component {

  constructor(){
    super()

    this.setRef = (instance) => this.item = instance
  }

  setFocus=()=>{
    this.item.focus()
  }

  onFocus = () => {
    console.log("Bingo")
  }
    
  render () {
    return (
      <li onFocus={this.onFocus} role="option" className="sui-dropdown__menu__item">
        <button ref={(instance) => this.item = instance}>TEST</button>
      </li>
    )
  }
}