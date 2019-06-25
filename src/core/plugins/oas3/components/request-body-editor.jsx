import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"

const NOOP = Function.prototype

export default class RequestBodyEditor extends PureComponent {

  static propTypes = {
    mediaType: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    getComponent: PropTypes.func.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    mediaType: "application/json",
    onChange: NOOP,
  };

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: props.value
    }

    // this is the glue that makes sure our initial value gets set as the
    // current request body value
    // TODO: achieve this in a selector instead
    props.onChange(props.value)
  }

  onChange = (value) => {
    this.props.onChange(value)
  }

  onDomChange = e => {
    const { mediaType } = this.props
    const isJson = /json/i.test(mediaType)
    const inputValue = isJson ? e.target.value.trim() : e.target.value

    this.onChange(inputValue)
  }

  componentWillReceiveProps(nextProps) {
    if(
      this.props.value !== nextProps.value &&
      nextProps.value !== this.state.value
    ) {

      this.setState({
        value: nextProps.value
      })
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
