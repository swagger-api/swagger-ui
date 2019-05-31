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

    let selectedKey = null
    this.setButtonRef = (instance) => this.buttonRef = instance
    this.childCount = React.Children.count(this.props.children) - 1
    this.childRefCollection = {}
    this.setChildRefCollection = {}

    React.Children.forEach(this.props.children, (child, i) => {
      if(child.props.selected)
        selectedKey = i
      this.setChildRefCollection[i] = (instance) => { 
        return this.childRefCollection[i] = instance
      }
    })

    this.state = {
      expanded: false,
      activeKey: null,
      selectedKey
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside, true)
  }

  componentWillUnmount() {
      document.removeEventListener("click", this.handleClickOutside, true)
  }

  handleClickOutside = (e) => {

    if (!this.buttonRef.contains(e.target)) {
        this.setState({
          expanded: false
        })
    }
}

  componentDidUpdate() {
    const { activeKey, expanded } = this.state

    if(expanded) {
      this.setFocusChild(activeKey)
    }
  }

  setfocus = () => this.buttonRef.focus()

  setFocusChild = (key) => this.childRefCollection[key].setFocus()

  openDropdown = () => this.setState((state) => {
    const activeKey = state.selectedKey || 0

    return { 
      expanded: true,
      activeKey 
    }  
  })

  closeDropdown = () => {
    this.setState(() => ({ expanded: false }))
    this.setfocus()
  }

  moveUp = () => this.setState((state) => {
    const activeKey = state.activeKey === 0
      ? state.activeKey
      : state.activeKey - 1

    return { activeKey }
  })

  moveDown = () => this.setState((state) => {
    const activeKey = state.activeKey === this.childCount
      ? state.activeKey
      : state.activeKey + 1

    return { activeKey }
  })
  moveStart = () => this.setState({ activeKey: 0 })

  moveEnd = () => this.setState({ activeKey: this.childCount })

  onClick = () => {
    const { expanded } = this.state

    if(expanded) {
      return this.closeDropdown()
    }
    this.openDropdown()
  }

  onKeyPress = (e) => {
    e.preventDefault()

    switch (e.key)
    {
      case "ArrowUp":
        this.openDropdown()
        break
      case "ArrowDown":
        this.openDropdown()
        break
      case "Enter":
      case " ":
        this.openDropdown()
        break
    }
  }

  onKeyPressChild = (e) => {
    e.preventDefault()

    switch (e.key)
    {
      case "ArrowUp":
        this.moveUp()
        break
      case "ArrowDown":
        this.moveDown()
        break
      case "Enter":
      case " ":
        // select and close
        break
      case "Escape":
        this.closeDropdown()
        break
      case "Home":
        this.moveStart()
        break
      case "End":
        this.moveEnd()
        break
    }
  }

  displayLabel = () => (this.props.label && this.props.displayLabel)
    ? <lable>{this.props.label}</lable>
    : null

  labelAttr = (el) => this.props.label
    ? this.props.label + " " + el
    : null

  setChildRef = (key, originalRef) => {
    return ((...args) => {
      this.setChildRefCollection[key](args[0])

      if (originalRef) {
        originalRef.apply(null, args)
      }
    })
  }
  
  render() {
    const { id, disbaled } = this.props
    const { expanded } = this.state

    const children = React.Children.map(this.props.children, (child, i) => {
      const ref = this.setChildRef(i, child.ref)
      const selected = i === this.state.selectedKey

      return React.cloneElement(child, {
        ref,
        onKeyPress: this.onKeyPressChild,
        selected
      })
    })

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
          ref={this.setButtonRef}
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
        </ul>
      </div>
			)
  }
}


export class DropDownItem extends Component {

  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onKeyPress: PropTypes.func,
    selected: PropTypes.bool,
    children: PropTypes.node.isRequired
  }

  constructor() {
    super()
    this.setRef = (instance) => this.anchorRef = instance
  }

  setFocus = () => this.anchorRef.focus()
    
  render () {
    const { onKeyPress, children } = this.props
    
    return (
      <li
        role="option"
        className="sui-dropdown__menu__item"
      >
        <a 
          tabIndex="0"
          ref={this.setRef}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyPress}
        >
          {children}
        </a>
      </li>
    )
  }
}