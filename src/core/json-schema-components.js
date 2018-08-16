import React, { PureComponent, Component } from "react"
import PropTypes from "prop-types"
import { List, fromJS } from "immutable"
import cx from "classnames"
import ImPropTypes from "react-immutable-proptypes"
import DebounceInput from "react-debounce-input"
import { getSampleSchema } from "core/utils"
//import "less/json-schema-form"

const noop = ()=> {}
const JsonSchemaPropShape = {
  getComponent: PropTypes.func.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  keyName: PropTypes.any,
  fn: PropTypes.object.isRequired,
  schema: PropTypes.object,
  errors: ImPropTypes.list,
  required: PropTypes.bool,
  dispatchInitialValue: PropTypes.bool,
  description: PropTypes.any
}

const JsonSchemaDefaultProps = {
  value: "",
  onChange: noop,
  schema: {},
  keyName: "",
  required: false,
  errors: List()
}

export class JsonSchemaForm extends Component {

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  componentDidMount() {
    const { dispatchInitialValue, value, onChange } = this.props
    if(dispatchInitialValue) {
      onChange(value)
    }
  }

  render() {
    let { schema, errors, value, onChange, getComponent, fn } = this.props

    if(schema.toJS)
      schema = schema.toJS()

    let { type, format="" } = schema

    let Comp = (format ? getComponent(`JsonSchema_${type}_${format}`) : getComponent(`JsonSchema_${type}`)) || getComponent("JsonSchema_string")
    return <Comp { ...this.props } errors={errors} fn={fn} getComponent={getComponent} value={value} onChange={onChange} schema={schema}/>
  }

}

export class JsonSchema_string extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps
  onChange = (e) => {
    const value = this.props.schema["type"] === "file" ? e.target.files[0] : e.target.value
    this.props.onChange(value, this.props.keyName)
  }
  onEnumChange = (val) => this.props.onChange(val)
  render() {
    let { getComponent, value, schema, errors, required, description } = this.props
    let enumValue = schema["enum"]

    errors = errors.toJS ? errors.toJS() : []

    if ( enumValue ) {
      const Select = getComponent("Select")
      return (<Select className={ errors.length ? "invalid" : ""}
                      title={ errors.length ? errors : ""}
                      allowedValues={ enumValue }
                      value={ value }
                      allowEmptyValue={ !required }
                      onChange={ this.onEnumChange }/>)
    }

    const isDisabled = schema["in"] === "formData" && !("FormData" in window)
    const Input = getComponent("Input")
    if (schema["type"] === "file") {
      return (<Input type="file"
                     className={ errors.length ? "invalid" : ""}
                     title={ errors.length ? errors : ""}
                     onChange={ this.onChange }
                     disabled={isDisabled}/>)
    }
    else {
      return (<DebounceInput
                     type={ schema.format === "password" ? "password" : "text" }
                     className={ errors.length ? "invalid" : ""}
                     title={ errors.length ? errors : ""}
                     value={value}
                     minLength={0}
                     debounceTimeout={350}
                     placeholder={description}
                     onChange={ this.onChange }
                     disabled={isDisabled}/>)
    }
  }
}

export class JsonSchema_array extends PureComponent {

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  constructor(props, context) {
    super(props, context)
    this.state = { value: valueOrEmptyList(props.value)}
  }

  componentWillReceiveProps(props) {
    if(props.value !== this.state.value)
      this.setState({value: props.value})
  }

  onChange = () => this.props.onChange(this.state.value)

  onItemChange = (itemVal, i) => {
    this.setState(state => ({
      value: state.value.set(i, itemVal)
    }), this.onChange)
  }

  removeItem = (i) => {
    this.setState(state => ({
      value: state.value.remove(i)
    }), this.onChange)
  }

  addItem = () => {
    this.setState(state => {
      state.value = valueOrEmptyList(state.value)
      return {
        value: state.value.push("")
      }
    }, this.onChange)
  }

  onEnumChange = (value) => {
    this.setState(() => ({
      value: value
    }), this.onChange)
  }

  render() {
    let { getComponent, required, schema, errors, fn } = this.props

    errors = errors.toJS ? errors.toJS() : []

    let itemSchema = fn.inferSchema(schema.items)

    const JsonSchemaForm = getComponent("JsonSchemaForm")
    const Button = getComponent("Button")

    let enumValue = itemSchema["enum"]
    let value = this.state.value

    if ( enumValue ) {
      const Select = getComponent("Select")
      return (<Select className={ errors.length ? "invalid" : ""}
                      title={ errors.length ? errors : ""}
                      multiple={ true }
                      value={ value }
                      allowedValues={ enumValue }
                      allowEmptyValue={ !required }
                      onChange={ this.onEnumChange }/>)
    }

    return (
      <div>
        { !value || !value.count || value.count() < 1 ? null :
          value.map( (item,i) => {
            let schema = Object.assign({}, itemSchema)
            if ( errors.length ) {
              let err = errors.filter((err) => err.index === i)
              if (err.length) errors = [ err[0].error + i ]
            }
          return (
            <div key={i} className="json-schema-form-item">
              <JsonSchemaForm fn={fn} getComponent={getComponent} value={item} onChange={(val) => this.onItemChange(val, i)} schema={schema} />
              <Button className="btn btn-sm json-schema-form-item-remove" onClick={()=> this.removeItem(i)} > - </Button>
            </div>
            )
          }).toArray()
        }
        <Button className={`btn btn-sm json-schema-form-item-add ${errors.length ? "invalid" : null}`} onClick={this.addItem}> Add item </Button>
      </div>
    )
  }
}

export class JsonSchema_boolean extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  onEnumChange = (val) => this.props.onChange(val)
  render() {
    let { getComponent, value, errors, schema, required } = this.props
    errors = errors.toJS ? errors.toJS() : []

    const Select = getComponent("Select")

    return (<Select className={ errors.length ? "invalid" : ""}
                    title={ errors.length ? errors : ""}
                    value={ String(value) }
                    allowedValues={ fromJS(schema.enum || ["true", "false"]) }
                    allowEmptyValue={ !schema.enum || !required }
                    onChange={ this.onEnumChange }/>)
  }
}

export class JsonSchema_object extends PureComponent {
  constructor() {
    super()
  }

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  componentDidMount() {
    if(!this.props.value && this.props.schema) {
      this.resetValueToSample()
    }
  }

  resetValueToSample = () => {
    this.onChange(getSampleSchema(this.props.schema) )
  }

  onChange = (value) => {
    this.props.onChange(value)
  }

  handleOnChange = e => {
    const inputValue = e.target.value

    this.onChange(inputValue)
  }

  render() {
    let {
      getComponent,
      value,
      errors
    } = this.props

    const TextArea = getComponent("TextArea")

    return (
      <div>
        <TextArea
          className={cx({ invalid: errors.size })}
          title={ errors.size ? errors.join(", ") : ""}
          value={value}
          onChange={ this.handleOnChange }/>
      </div>
    )

  }
}

function valueOrEmptyList(value) {
  return List.isList(value) ? value : List()
}