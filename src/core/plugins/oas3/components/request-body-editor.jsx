import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"

const NOOP = Function.prototype

export default class RequestBodyEditor extends PureComponent {

  static propTypes = {
    requestBody: PropTypes.object.isRequired,
    mediaType: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
  };

  static defaultProps = {
    mediaType: "application/json",
    requestBody: fromJS({}),
    onChange: NOOP,
  };

  constructor(props, context) {
    super(props, context)
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

  render() {
    let {
      getComponent,
      value,
    } = this.props

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
