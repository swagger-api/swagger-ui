import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import { getSampleSchema, stringify } from "core/utils"

const NOOP = Function.prototype

export default class RequestBodyEditor extends PureComponent {

  static propTypes = {
    requestBody: PropTypes.object.isRequired,
    mediaType: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    getComponent: PropTypes.func.isRequired,
    isExecute: PropTypes.bool,
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
      isEditBox: false,
      userDidModify: false,
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

    if(!this.props.isExecute && nextProps.isExecute) {
      // we just entered execute mode,
      // so enable editing for convenience
      this.setState({ isEditBox: true })
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.requestBody !== prevProps.requestBody) {
      // force recalc of value if the request body definition has changed
      this.setValueToSample(this.props.mediaType)
    }
  }

  setValueToSample = (explicitMediaType) => {
    this.onChange(this.sample(explicitMediaType))
  }

  resetValueToSample = (explicitMediaType) => {
    this.setState({ userDidModify: false })
    this.setValueToSample(explicitMediaType)
  }

  sample = (explicitMediaType) => {
    let { requestBody, mediaType } = this.props
    let mediaTypeValue = requestBody.getIn(["content", explicitMediaType || mediaType])
    let schema = mediaTypeValue.get("schema").toJS()
    let mediaTypeExample = mediaTypeValue.get("example") !== undefined ? stringify(mediaTypeValue.get("example")) : null

    return mediaTypeExample || getSampleSchema(schema, explicitMediaType || mediaType, {
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

    this.setState({ userDidModify: true })
    this.onChange(inputValue)
  }

  toggleIsEditBox = () => this.setState( state => ({isEditBox: !state.isEditBox}))

  render() {
    let {
      isExecute,
      getComponent,
      mediaType,
    } = this.props

    const Button = getComponent("Button")
    const TextArea = getComponent("TextArea")
    const HighlightCode = getComponent("highlightCode")

    let { value, isEditBox, userDidModify } = this.state

    return (
      <div className="body-param">
        {
          isEditBox && isExecute
            ? <TextArea className={"body-param__text"} value={value} onChange={ this.handleOnChange }/>
            : (value && <HighlightCode className="body-param__example"
                               value={ value }/>)
        }
        <div className="body-param-options">
          <div className="body-param-edit">
            {
              !isExecute ? null
                         : <Button className={isEditBox ? "btn cancel body-param__example-edit" : "btn edit body-param__example-edit"}
                                   onClick={this.toggleIsEditBox}>{ isEditBox ? "Cancel" : "Edit"}
                           </Button>

            }
            { userDidModify &&
              <Button className="btn ml3" onClick={() => { this.resetValueToSample(mediaType) }}>Reset</Button>
            }
          </div>
        </div>

      </div>
    )

  }
}
