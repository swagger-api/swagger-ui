import React, { PureComponent, Component } from "react"
import PropTypes from "prop-types"
import { List, fromJS } from "immutable"
//import "less/json-schema-form"

const noop = ()=> {}
const JsonSchemaPropShape = {
  getComponent: PropTypes.func.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  keyName: PropTypes.any,
  fn: PropTypes.object.isRequired,
  schema: PropTypes.object,
  required: PropTypes.bool,
  description: PropTypes.any
}

const JsonSchemaDefaultProps = {
  value: "",
  onChange: noop,
  schema: {},
  keyName: "",
  required: false
}

export class JsonSchemaForm extends Component {

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  render() {
    let { schema, value, onChange, getComponent, fn } = this.props

    if(schema.toJS)
      schema = schema.toJS()

    let { type, format="" } = schema

    let Comp = getComponent(`JsonSchema_${type}_${format}`) || getComponent(`JsonSchema_${type}`) || getComponent("JsonSchema_string")
    return <Comp { ...this.props } fn={fn} getComponent={getComponent} value={value} onChange={onChange} schema={schema}/>
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
    let { getComponent, value, schema, required, description } = this.props
    let enumValue = schema["enum"]
    let errors = schema.errors || []

    if ( enumValue ) {
      const Select = getComponent("Select")
      return (<Select className={ errors.length ? "invalid" : ""}
                      allowedValues={ enumValue }
                      value={ value }
                      allowEmptyValue={ !required }
                      onChange={ this.onEnumChange }/>)
    }

    const isDisabled = schema["in"] === "formData" && !("FormData" in window)
    const Input = getComponent("Input")
    if (schema["type"] === "file") {
      return <Input type="file" className={ errors.length ? "invalid" : ""} onChange={ this.onChange } disabled={isDisabled}/>
    }
    else {
      return <Input type={ schema.format === "password" ? "password" : "text" } className={ errors.length ? "invalid" : ""} value={value} placeholder={description} onChange={ this.onChange } disabled={isDisabled}/>
    }
  }
}

export class JsonSchema_array extends PureComponent {

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  constructor(props, context) {
    super(props, context)
    this.state = {value: props.value}
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
      state.value = state.value || List()
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
    let { getComponent, required, schema, fn } = this.props

    let errors = schema.errors || []
    let itemSchema = fn.inferSchema(schema.items)

    const JsonSchemaForm = getComponent("JsonSchemaForm")
    const Button = getComponent("Button")

    let enumValue = itemSchema["enum"]
    let value = this.state.value

    if ( enumValue ) {
      const Select = getComponent("Select")
      return (<Select className={ errors.length ? "invalid" : ""}
                     multiple={ true }
                     value={ value }
                     allowedValues={ enumValue }
                     allowEmptyValue={ !required }
                     onChange={ this.onEnumChange }/>)
    }

    return (
      <div>
        { !value || value.count() < 1 ? null :
          value.map( (item,i) => {
            let schema = Object.assign({}, itemSchema)
            if ( errors.length ) {
              let err = errors.filter((err) => err.index === i)
              if (err.length) schema.errors = [ err[0].error + i ]
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
    let { getComponent, value, schema } = this.props
    let errors = schema.errors || []
    const Select = getComponent("Select")

    return (<Select className={ errors.length ? "invalid" : ""}
                    value={ String(value) }
                    allowedValues={ fromJS(["true", "false"]) }
                    allowEmptyValue={ true }
                    onChange={ this.onEnumChange }/>)
  }
}
