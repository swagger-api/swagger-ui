import React from "react"
import PropTypes from "prop-types"

function xclass(...args) {
  return args.filter(a => !!a).join(" ").trim()
}

export class Container extends React.Component {
  render() {
    let { fullscreen, full, ...rest } = this.props
    // Normal element

    if(fullscreen)
      return <section {...rest}/>

    let containerClass = "swagger-container" + (full ? "-full" : "")
    return (
      <section {...rest} className={xclass(rest.className, containerClass)}/>
    )
  }
}

Container.propTypes = {
  fullscreen: PropTypes.bool,
  full: PropTypes.bool,
  className: PropTypes.string
}

const DEVICES = {
  "mobile": "",
  "tablet": "-tablet",
  "desktop": "-desktop",
  "large": "-hd"
}

export class Col extends React.Component {

  render() {
    const {
      hide,
      keepContents,
      /* we don't want these in the `rest` object that passes to the final component,
         since React now complains. So we extract them */
      /* eslint-disable no-unused-vars */
      mobile,
      tablet,
      desktop,
      large,
      /* eslint-enable no-unused-vars */
      ...rest
    } = this.props

    if(hide && !keepContents)
      return <span/>

    let classesAr = []

    for (let device in DEVICES) {
      if (!DEVICES.hasOwnProperty(device)) {
        continue
      }
      let deviceClass = DEVICES[device]
      if(device in this.props) {
        let val = this.props[device]

        if(val < 1) {
          classesAr.push("none" + deviceClass)
          continue
        }

        classesAr.push("block" + deviceClass)
        classesAr.push("col-" + val + deviceClass)
      }
    }

    if (hide) {
      classesAr.push("hidden")
    }

    let classes = xclass(rest.className, ...classesAr)

    return (
      <section {...rest} className={classes}/>
    )
  }

}

Col.propTypes = {
  hide: PropTypes.bool,
  keepContents: PropTypes.bool,
  mobile: PropTypes.number,
  tablet: PropTypes.number,
  desktop: PropTypes.number,
  large: PropTypes.number,
  className: PropTypes.string
}

export class Row extends React.Component {

  render() {
    return <div {...this.props} className={xclass(this.props.className, "wrapper")} />
  }

}

Row.propTypes = {
  className: PropTypes.string
}

export class Button extends React.Component {

  static propTypes = {
    className: PropTypes.string
  }

  static defaultProps = {
    className: ""
  }

  render() {
    return <button {...this.props} className={xclass(this.props.className, "button")} />
  }

}


export const TextArea = (props) => <textarea {...props} />

export const Input = (props) => <input {...props} />

export class Select extends React.Component {
  static propTypes = {
    allowedValues: PropTypes.array,
    value: PropTypes.any,
    onChange: PropTypes.func,
    multiple: PropTypes.bool,
    allowEmptyValue: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    multiple: false,
    allowEmptyValue: true
  }

  constructor(props, context) {
    super(props, context)

    let value

    if (props.value) {
      value = props.value
    } else {
      value = props.multiple ? [""] : ""
    }

    this.state = { value: value }
  }

  onChange = (e) => {
    let { onChange, multiple } = this.props
    let options = [].slice.call(e.target.options)
    let value


    if (multiple) {
      value = options.filter(function (option) {
          return option.selected
        })
        .map(function (option){
          return option.value
        })
    } else {
      value = e.target.value
    }

    this.setState({value: value})

    onChange && onChange(value)
  }

  componentWillReceiveProps(nextProps) {
    // TODO: this puts us in a weird area btwn un/controlled selection... review
    if(nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value })
    }
  }

  render(){
    let { allowedValues, multiple, allowEmptyValue, disabled } = this.props
    let value = this.state.value?.toJS?.() || this.state.value

    return (
      <select className={this.props.className} multiple={ multiple } value={value} onChange={ this.onChange } disabled={disabled} >
        { allowEmptyValue ? <option value="">--</option> : null }
        {
          allowedValues.map(function (item, key) {
            return <option key={ key } value={ String(item) }>{ String(item) }</option>
          })
        }
      </select>
    )
  }
}

export class Link extends React.Component {

  render() {
    return <a {...this.props} rel="noopener noreferrer" className={xclass(this.props.className, "link")}/>
  }

}

Link.propTypes = {
  className: PropTypes.string
}

const NoMargin = ({children}) => <div className="no-margin"> {children} </div>

NoMargin.propTypes = {
  children: PropTypes.node
}

export class Collapse extends React.Component {

  static propTypes = {
    isOpened: PropTypes.bool,
    children: PropTypes.node.isRequired,
    animated: PropTypes.bool
  }

  static defaultProps = {
    isOpened: false,
    animated: false
  }

  renderNotAnimated() {
    if(!this.props.isOpened)
      return <noscript/>
    return (
      <NoMargin>
        {this.props.children}
      </NoMargin>
    )
  }

  render() {
    let { animated, isOpened, children } = this.props

    if(!animated)
      return this.renderNotAnimated()

    children = isOpened ? children : null
    return (
      <NoMargin>
        {children}
      </NoMargin>
    )
  }

}
