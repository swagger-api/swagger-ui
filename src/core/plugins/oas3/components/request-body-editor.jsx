import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import { getSampleSchema } from "core/utils"

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

  setValueToSample = (explicitMediaType) => {
    this.onChange(this.sample(explicitMediaType))
  }

  sample = (explicitMediaType) => {
    let { requestBody, mediaType } = this.props
    let schema = requestBody.getIn(["content", explicitMediaType || mediaType, "schema"]).toJS()

    return getSampleSchema(schema, explicitMediaType || mediaType, {
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

  toggleIsEditBox = () => this.setState( state => ({isEditBox: !state.isEditBox}))

  render() {
    let {
      isExecute,
      getComponent,
    } = this.props

    const Button = getComponent("Button")
    const TextArea = getComponent("TextArea")
    const HighlightCode = getComponent("highlightCode")

    let { value, isEditBox } = this.state

    return (
      <div className="body-param">
        {
          isEditBox && isExecute
            ? <TextArea className={"body-param__text"} value={value} onChange={ this.handleOnChange }/>
            : (value && <HighlightCode className="body-param__example"
                               value={ value }/>)
        }
        <div className="body-param-options">
          {
            !isExecute ? null
                       : <div className="body-param-edit">
                        <Button className={isEditBox ? "btn cancel body-param__example-edit" : "btn edit body-param__example-edit"}
                                 onClick={this.toggleIsEditBox}>{ isEditBox ? "Cancel" : "Edit"}
                         </Button>
                         </div>
          }
        </div>

      </div>
    )

  }
}
