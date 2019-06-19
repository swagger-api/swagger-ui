import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { fromJS, List } from "immutable"
import { getSampleSchema, stringify } from "core/utils"

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

    this.state = {
      value: ""
    }
  }

  componentDidMount() {
    this.setValueToSample.call(this)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.mediaType !== nextProps.mediaType) {
      // media type was changed
      this.setValueToSample(nextProps.mediaType)
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.requestBody !== prevProps.requestBody) {
      // force recalc of value if the request body definition has changed
      this.setValueToSample(this.props.mediaType)
    }
  }

  setValueToSample = (explicitMediaType) => {
    this.onChange(this.getSample(explicitMediaType))
  }

  resetValueToSample = (explicitMediaType) => {
    this.setValueToSample(explicitMediaType)
  }

  getSample = (explicitMediaType) => {
    let { requestBody, mediaType, activeExamplesKey } = this.props
    let mediaTypeValue = requestBody.getIn(["content", explicitMediaType || mediaType])
    let schema = mediaTypeValue.get("schema").toJS()
    let mediaTypeExample = mediaTypeValue.get("example") !== undefined ? stringify(mediaTypeValue.get("example")) : null
    let activeExamplesValue = mediaTypeValue.getIn(
      ["examples", activeExamplesKey, "value"]
    )

    activeExamplesValue = List.isList(activeExamplesValue) ? activeExamplesValue : stringify(activeExamplesValue)

    return activeExamplesValue || mediaTypeExample || getSampleSchema(schema, explicitMediaType || mediaType, {
      includeWriteOnly: true
    })
  }

  onChange = (value) => {
    this.setState({value})
    this.props.onChange(value)
  }

  handleOnChange = e => {
    const { mediaType } = this.props
    const isJson = /json/i.test(mediaType)
    const inputValue = isJson ? e.target.value.trim() : e.target.value

    this.onChange(inputValue)
  }

  render() {
    let {
      getComponent,
      mediaType,
    } = this.props

    const Button = getComponent("Button")
    const TextArea = getComponent("TextArea")

    let { value } = this.state

    return (
      <div className="body-param">
        <TextArea
          className={"body-param__text"}
          value={value}
          onChange={ this.handleOnChange }
        />
        <div className="body-param-options">
          <div className="body-param-edit">
            <Button
              className="btn"
              disabled={value === this.getSample()}
              onClick={() => { this.resetValueToSample(mediaType) }}
            >
              Set value to example
            </Button>
          </div>
        </div>

      </div>
    )

  }
}
