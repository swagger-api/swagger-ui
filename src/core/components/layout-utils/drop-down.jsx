import React, { Component, PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class DropDown extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
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
    document.addEventListener("click", this.onClickDoc, true)
  }

  componentDidUpdate() {
    const { activeKey, expanded } = this.state

    if(expanded) {
      this.setFocusChild(activeKey)
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onClickDoc, true)
  }

  setChildRef = (key, originalRef) => {
    return ((...args) => {
      this.setChildRefCollection[key](args[0])

      if (originalRef) {
        originalRef.apply(null, args)
      }
    })
  }

  setFocus = () => this.buttonRef.focus()

  setFocusChild = (key) => this.childRefCollection[key].setFocus()

  getSelectedChildContext = () => { 
    const { selectedKey } = this.state
    const { placeholder } = this.props

    return this.childRefCollection[selectedKey]
      ? this.childRefCollection[selectedKey].getChildren()
      : placeholder
  }

  openDropdown = () => this.setState((state) => {
    const activeKey = state.selectedKey || 0

    return { 
      expanded: true,
      activeKey 
    }  
  })

  closeDropdown = (key) => {
    this.setState((state) => { 
      const selectedKey = key || key === 0
        ? key
        : state.selectedKey

      return { 
        expanded: false,
        selectedKey
      }
    })
    this.setFocus()
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

  onClickDoc = (e) => {
    const clickedChild = Object.values(this.childRefCollection).find((ref) => 
      ref.anchorRef.contains(e.target)
    )

    if (!this.buttonRef.contains(e.target) && !clickedChild) {
        this.setState({
          expanded: false
        })
    }
  }

  onClick = () => {
    const { expanded } = this.state

    if(expanded) {
      return this.closeDropdown()
    }
    this.openDropdown()
  }

  onClickChild = (key) => {
    this.closeDropdown(key)
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

  onKeyPressChild = (e, key) => {
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
        this.closeDropdown(key)
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
  
  render() {
    const { id, disbaled } = this.props
    const { expanded } = this.state

    const children = React.Children.map(this.props.children, (child, i) => {
      const ref = this.setChildRef(i, child.ref)

      return React.cloneElement(child, {
        ref,
        optionKey: i,
        onKeyPress: this.onKeyPressChild,
        onSelect: () => this.onClickChild(i)
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
          {this.getSelectedChildContext()}
          <svg width="10" height="10">
          <use xlinkHref={"#large-arrow-down"} />
        </svg>
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
    optionKey: PropTypes.any,
    onSelect: PropTypes.func,
    onKeyPress: PropTypes.func,
    children: PropTypes.node.isRequired
  }

  constructor() {
    super()
    this.setRef = (instance) => this.anchorRef = instance
  }

  setFocus = () => this.anchorRef.focus()

  getChildren = () => this.props.children

  onClick = (e) => this.props.onSelect(e, this.props.optionKey)

  onKeyPress = (e) => this.props.onKeyPress(e, this.props.optionKey)
    
  render () {
    const { children } = this.props
    
    return (
      <li
        role="option"
        className="sui-dropdown__menu__item"
        onClick={this.onClick}
      >
        <a 
          tabIndex="0"
          ref={this.setRef}
          onKeyPress={this.onKeyPress}
          onKeyDown={this.onKeyPress}
        >
          {children}
        </a>
      </li>
    )
  }
}