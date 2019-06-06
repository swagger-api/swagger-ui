import React from "react"
import PropTypes from "prop-types"

export default class Select extends React.Component {
  static propTypes = {
    allowedValues: PropTypes.array,
    value: PropTypes.any,
    onChange: PropTypes.func,
    multiple: PropTypes.bool,
    allowEmptyValue: PropTypes.bool,
    className: PropTypes.string
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

  render(){
    let { allowedValues, multiple, allowEmptyValue } = this.props
    let value = this.state.value.toJS ? this.state.value.toJS() : this.state.value

    return (
      <select className={this.props.className} multiple={ multiple } value={ value } onChange={ this.onChange } >
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