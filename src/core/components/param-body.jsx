import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { fromJS, List } from "immutable"
import { getSampleSchema } from "core/utils"

const NOOP = Function.prototype

export default class ParamBody extends PureComponent {

  static propTypes = {
    param: PropTypes.object,
    onChange: PropTypes.func,
    onChangeConsumes: PropTypes.func,
    consumes: PropTypes.object,
    consumesValue: PropTypes.string,
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    isExecute: PropTypes.bool,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired
  };

  static defaultProp = {
    consumes: fromJS(["application/json"]),
    param: fromJS({}),
    onChange: NOOP,
    onChangeConsumes: NOOP,
  };

  constructor(props, context) {
    super(props, context)

    this.state = {
      isEditBox: false,
      value: ""
    }

  }

  componentDidMount() {
    this.updateValues.call(this, this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateValues.call(this, nextProps)
  }

  updateValues = (props) => {
    let { specSelectors, pathMethod, param, isExecute, consumesValue="" } = props
    let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name"), param.get("in")) : {}
    let isXml = /xml/i.test(consumesValue)
    let isJson = /json/i.test(consumesValue)
    let paramValue = isXml ? parameter.get("value_xml") : parameter.get("value")

    if ( paramValue !== undefined ) {
      let val = !paramValue && isJson ? "{}" : paramValue
      this.setState({ value: val })
      this.onChange(val, {isXml: isXml, isEditBox: isExecute})
    } else {
      if (isXml) {
        this.onChange(this.sample("xml"), {isXml: isXml, isEditBox: isExecute})
      } else {
        this.onChange(this.sample(), {isEditBox: isExecute})
      }
    }
  }

  sample = (xml) => {
    let { param, fn:{inferSchema} } = this.props
    let schema = inferSchema(param.toJS())

    return getSampleSchema(schema, xml, {
      includeWriteOnly: true
    })
  }

  onChange = (value, { isEditBox, isXml }) => {
    this.setState({value, isEditBox})
    this._onChange(value, isXml)
  }

  _onChange = (val, isXml) => { (this.props.onChange || NOOP)(this.props.param, val, isXml) }

  handleOnChange = e => {
    const {consumesValue} = this.props
    const isJson = /json/i.test(consumesValue)
    const isXml = /xml/i.test(consumesValue)
    const inputValue = isJson ? e.target.value.trim() : e.target.value
    this.onChange(inputValue, {isXml})
  }

  toggleIsEditBox = () => this.setState( state => ({isEditBox: !state.isEditBox}))

  render() {
    let {
      onChangeConsumes,
      param,
      isExecute,
      specSelectors,
      pathMethod,

      getComponent,
    } = this.props

    const Button = getComponent("Button")
    const TextArea = getComponent("TextArea")
    const HighlightCode = getComponent("highlightCode")
    const ContentType = getComponent("contentType")
    // for domains where specSelectors not passed
    let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name"), param.get("in")) : param
    let errors = parameter.get("errors", List())
    let consumesValue = specSelectors.contentTypeValues(pathMethod).get("requestContentType")
    let consumes = this.props.consumes && this.props.consumes.size ? this.props.consumes : ParamBody.defaultProp.consumes

    let { value, isEditBox } = this.state

    return (
      <div className="body-param">
        {
          isEditBox && isExecute
            ? <TextArea className={ "body-param__text" + ( errors.count() ? " invalid" : "")} value={value} onChange={ this.handleOnChange }/>
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
          <label htmlFor="">
            <span>Parameter content type</span>
            <ContentType value={ consumesValue } contentTypes={ consumes } onChange={onChangeConsumes} className="body-param-content-type" />
          </label>
        </div>

      </div>
    )

  }
}
