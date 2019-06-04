import React, { Component, PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export default class DropDown extends PureComponent {

  static propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    mod: PropTypes.string,
    disbaled: PropTypes.bool,
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
    this.childCount = React.Children.count(this.props.children) - 1
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

  openDropdown = () => this.setState((state) => {
    const activeKey = state.selectedKey || 0

    return { 
      expanded: true,
      activeKey 
    }  
  })

  closeDropdown = (key) => {
    const hasSelected = key || key === 0 

    if(hasSelected && this.props.onChange) {
      this.props.onChange(this.childRefCollection[key].getValue())
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
  
  render() {
    const { id, disbaled, mod } = this.props
    const { expanded } = this.state
    const className = "sui-dropdown"

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
          aria-disabled={disbaled}
          onClick={this.onClick}
          onKeyDown={this.onKeyPress}
          ref={this.setButtonRef}
        >
          <span>{this.buttonContent()}</span>
          <svg width="10" height="10">
            <use xlinkHref={"#large-arrow-down"} />
          </svg>
        </button>
        <ul
          className={`${className}__menu`}
          role="listbox"
          tabIndex="-1"
        >
        {this.children()} 
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

  onClick = () => this.props.onSelect(this.props.optionKey)

  onKeyPress = (e) => this.props.onKeyPress(e, this.props.optionKey)
    
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