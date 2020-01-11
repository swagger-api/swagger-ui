import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { stringify } from "core/utils"

const NOOP = Function.prototype

export default class RequestBodyEditor extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func,
    getComponent: PropTypes.func.isRequired,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
  };

  static defaultProps = {
    onChange: NOOP,
  };

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: stringify(props.value) || props.defaultValue
    }

    // this is the glue that makes sure our initial value gets set as the
    // current request body value
    // TODO: achieve this in a selector instead
    props.onChange(props.value)
  }

  applyDefaultValue = (nextProps) => {
    const { onChange, defaultValue } = (nextProps ? nextProps : this.props)

    this.setState({
      value: defaultValue
    })

    return onChange(defaultValue)
  }

  onChange = (value) => {
    this.props.onChange(stringify(value))
  }

  onDomChange = e => {
    const inputValue = e.target.value

    this.setState({
      value: inputValue,
    }, () => this.onChange(inputValue))
  }

  componentWillReceiveProps(nextProps) {
    if(
      this.props.value !== nextProps.value &&
      nextProps.value !== this.state.value
    ) {

      this.setState({
        value: stringify(nextProps.value)
      })
    }

    

    if(!nextProps.value && nextProps.defaultValue && !!this.state.value) {
      // if new value is falsy, we have a default, AND the falsy value didn't
      // come from us originally
      this.applyDefaultValue(nextProps)
    }
  }

  render() {
    let {
      getComponent
    } = this.props

    let {
      value
    } = this.state

    const TextArea = getComponent("TextArea")

    return (
      <div className="body-param">
        <TextArea
          className={"body-param__text"}
          value={value}
          onChange={ this.onDomChange }
        />
      </div>
    )

  }
}
