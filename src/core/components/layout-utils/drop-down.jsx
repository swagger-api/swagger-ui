import React, { Component, PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import { Icon } from "components/layout-utils"


export default class DropDown extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    mod: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired
  }

  static defaultProps = {
    placeholder: "Select"
  }

  constructor(props) {
    super(props)

    let selectedKey = null
    this.setButtonRef = (instance) => this.buttonRef = instance
    this.childCount = Math.max(0, React.Children.count(this.props.children) - 1)
    this.childRefCollection = {}
    this.setChildRefCollection = {}

    React.Children.forEach(this.props.children, (child, i) => {
      if(child.props.value === props.value) {
        selectedKey = i
      }
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

    if(this.props.value !== null){
      this.forceUpdate()
    }
  }

  componentDidUpdate() {
    const { activeKey, expanded } = this.state

    if(expanded && this.childCount) {
      return this.setFocusChild(activeKey)
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

  openDropdown = () => this.setState((state) => {
    const activeKey = state.selectedKey || 0

    return { 
      expanded: true,
      activeKey 
    }  
  })

  closeDropdown = (key) => {
    const { onChange } = this.props
    const hasSelected = key || key === 0 

    if(hasSelected && onChange) {
      onChange({
        ...this.props,
        value: this.childRefCollection[key].getValue()
      })
    }

    this.setState((state) => { 
      const selectedKey = hasSelected
        ? key
        : state.selectedKey

      return { 
        expanded: false,
        selectedKey
      }
    })
    this.setFocus()
  }

  moveItemFocus = (key) => this.setState({ activeKey: key })

  onClickDoc = (e) => {
    const clickedChild = Object.values(this.childRefCollection).find((ref) => 
      ref.listItemRef.contains(e.target)
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

  onClickChild = (key) => this.closeDropdown(key)

  onKeyPress = (e) => {
    e.preventDefault()

    switch (e.key)
    {
      case "Up":
      case "ArrowUp":
        this.openDropdown()
        break
      case "Down":
      case "ArrowDown":
        this.openDropdown()
        break
      case "Enter":
      case " ":
        this.openDropdown()
        break
      case "Esc":
      case "Escape":
        this.closeDropdown()
        break
    }
  }

  onKeyPressChild = (e, key) => {
    e.preventDefault()

    const { activeKey } = this.state

    switch (e.key)
    {
      case "Up":
      case "ArrowUp":
        this.moveItemFocus(activeKey === 0
          ? activeKey
          : activeKey - 1)
        break
      case "Down":
      case "ArrowDown":
        this.moveItemFocus(activeKey === this.childCount
          ? activeKey
          : activeKey + 1)
          break
      case "Enter":
      case " ":
        this.closeDropdown(key)
        break
      case "Esc":
      case "Escape":
        this.closeDropdown()
        break
      case "Home":
        this.moveItemFocus(0)
        break
      case "End":
        this.moveItemFocus(this.childCount)
        break
    }
  }

  buttonContent = () => { 
    const { selectedKey } = this.state
    const { placeholder } = this.props

    return this.childRefCollection[selectedKey]
      ? this.childRefCollection[selectedKey].getContent()
      : placeholder
  }

  children = () => React.Children.map(this.props.children, (child, i) => {
    const ref = this.setChildRef(i, child.ref)

    return React.cloneElement(child, {
      ref,
      optionKey: i,
      onKeyPress: this.onKeyPressChild,
      onSelect: this.onClickChild
    })
  })

  noChildrenItem = () => <DropDownItem mod="disabled">No options available</DropDownItem>
  
  render() {
    const { id, disabled, mod } = this.props
    const { expanded } = this.state
    const className = "sui-dropdown"
    const buttonIcon = expanded ? "angle-up-light" : "angle-down-light"

    return (
      <div
        id={id}
        className={cx(className, { 
          [`${className}--expanded`] : expanded,
          [`${className}--${mod}`] : mod 
        })}
      >
        <button
          className={`${className}__button`}
          aria-haspopup={"listbox"}
          aria-expanded={expanded}
          aria-disabled={disabled}
          onClick={this.onClick}
          onKeyDown={this.onKeyPress}
          ref={this.setButtonRef}
          disabled={disabled}
        >
          <span>{this.buttonContent()}</span>
          <Icon icon={buttonIcon}/>
        </button>
        <ul
          className={`${className}__menu`}
          role="listbox"
          tabIndex="-1"
        >
        {this.children() || this.noChildrenItem()} 
        </ul>
      </div>
			)
  }
}


export class DropDownItem extends Component {

  static propTypes = {
    id: PropTypes.string,
    mod: PropTypes.string,
    value: PropTypes.string,
    optionKey: PropTypes.any,
    onSelect: PropTypes.func,
    onKeyPress: PropTypes.func,
    children: PropTypes.node.isRequired
  }

  constructor() {
    super()
    this.setRef = (instance) => this.listItemRef = instance
  }

  setFocus = () => this.listItemRef.focus()

  getContent = () => this.props.children

  getValue = () => this.props.value

  onClick = () => {
    const { onSelect, optionKey } = this.props
    
    if(onSelect) { 
      onSelect(optionKey)
    }
  }

  onKeyPress = (e) => {
    const { onKeyPress, optionKey } = this.props
    
    if(onKeyPress) { 
      onKeyPress(e, optionKey)
    }
  }
    
  render () {
    const { children, id, mod } = this.props
    const className = "sui-dropdown__menu__item"
    
    return (
      <li
        id={id}
        role="option"
        className={cx(className, {
          [`${className}--${mod}`] : mod
        })}
        ref={this.setRef}
        tabIndex="0"
        onClick={this.onClick}
        onKeyDown={this.onKeyPress}
      >
        <div>
          {children}
        </div>
      </li>
    )
  }
}