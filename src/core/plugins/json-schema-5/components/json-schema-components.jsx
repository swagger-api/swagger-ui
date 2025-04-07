import React, { PureComponent, Component } from "react"
import PropTypes from "prop-types"
import { List, fromJS } from "immutable"
import cx from "classnames"
import ImPropTypes from "react-immutable-proptypes"
import DebounceInput from "react-debounce-input"
import { stringify, isImmutable, immutableToJS } from "core/utils"

/* eslint-disable  react/jsx-no-bind */

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
  description: PropTypes.any,
  disabled: PropTypes.bool,
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
    } else if(dispatchInitialValue === false) {
      onChange("")
    }
  }

  render() {
    let { schema, errors, value, onChange, getComponent, fn, disabled } = this.props
    const format = schema && schema.get ? schema.get("format") : null
    const type = schema && schema.get ? schema.get("type") : null
    const foldedType = fn.jsonSchema202012.foldType(immutableToJS(type))

    let getComponentSilently = (name) => getComponent(name, false, { failSilently: true })
    let Comp = type ? format ?
      getComponentSilently(`JsonSchema_${type}_${format}`) :
      getComponentSilently(`JsonSchema_${type}`) :
      getComponent("JsonSchema_string")

    if (List.isList(type) && (foldedType === "array" || foldedType === "object")) {
      Comp = getComponent("JsonSchema_object")
    }

    if (!Comp) {
      Comp = getComponent("JsonSchema_string")
    }

    return <Comp { ...this.props } errors={errors} fn={fn} getComponent={getComponent} value={value} onChange={onChange} schema={schema} disabled={disabled}/>
  }
}

export class JsonSchema_string extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps
  onChange = (e) => {
    const value = this.props.schema && this.props.schema.get("type") === "file" ? e.target.files[0] : e.target.value
    this.props.onChange(value, this.props.keyName)
  }
  onEnumChange = (val) => this.props.onChange(val)
  render() {
    let { getComponent, value, schema, errors, required, description, disabled } = this.props
    const enumValue = schema && schema.get ? schema.get("enum") : null
    const format = schema && schema.get ? schema.get("format") : null
    const type = schema && schema.get ? schema.get("type") : null
    const schemaIn = schema && schema.get ? schema.get("in") : null
    if (!value) {
      value = "" // value should not be null; this fixes a Debounce error
    } else if (isImmutable(value) || typeof value === "object") {
      value = stringify(value)
    }

    errors = errors.toJS ? errors.toJS() : []

    if ( enumValue ) {
      const Select = getComponent("Select")
      return (<Select className={ errors.length ? "invalid" : ""}
                      title={ errors.length ? errors : ""}
                      allowedValues={ [...enumValue] }
                      value={ value }
                      allowEmptyValue={ !required }
                      disabled={disabled}
                      onChange={ this.onEnumChange }/>)
    }

    const isDisabled = disabled || (schemaIn && schemaIn === "formData" && !("FormData" in window))
    const Input = getComponent("Input")
    if (type && type === "file") {
      return (
        <Input type="file"
          className={errors.length ? "invalid" : ""}
          title={errors.length ? errors : ""}
          onChange={this.onChange}
          disabled={isDisabled} />
      )
    }
    else {
      return (
        <DebounceInput
          type={format && format === "password" ? "password" : "text"}
          className={errors.length ? "invalid" : ""}
          title={errors.length ? errors : ""}
          value={value}
          minLength={0}
          debounceTimeout={350}
          placeholder={description}
          onChange={this.onChange}
          disabled={isDisabled} />
      )
    }
  }
}

export class JsonSchema_array extends PureComponent {

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  constructor(props, context) {
    super(props, context)
    this.state = { value: valueOrEmptyList(props.value), schema: props.schema}
  }

  UNSAFE_componentWillReceiveProps(props) {
    const value = valueOrEmptyList(props.value)
    if(value !== this.state.value)
      this.setState({ value })

    if(props.schema !== this.state.schema)
      this.setState({ schema: props.schema })
  }

  onChange = () => {
    this.props.onChange(this.state.value)
  }

  onItemChange = (itemVal, i) => {
    this.setState(({ value }) => ({
      value: value.set(i, itemVal)
    }), this.onChange)
  }

  removeItem = (i) => {
    this.setState(({ value }) => ({
      value: value.delete(i)
    }), this.onChange)
  }

  addItem = () => {
    const { fn } = this.props
    let newValue = valueOrEmptyList(this.state.value)
    this.setState(() => ({
      value: newValue.push(fn.getSampleSchema(this.state.schema.get("items"), false, {
        includeWriteOnly: true
      }))
    }), this.onChange)
  }

  onEnumChange = (value) => {
    this.setState(() => ({
      value: value
    }), this.onChange)
  }

  render() {
    let { getComponent, required, schema, errors, fn, disabled } = this.props

    errors = errors.toJS ? errors.toJS() : Array.isArray(errors) ? errors : []
    const arrayErrors = errors.filter(e => typeof e === "string")
    const needsRemoveError = errors.filter(e => e.needRemove !== undefined)
      .map(e => e.error)
    const value = this.state.value // expect Im List
    const shouldRenderValue =
      value && value.count && value.count() > 0 ? true : false
    const schemaItemsEnum = schema.getIn(["items", "enum"])
    const schemaItemsType = schema.getIn(["items", "type"])
    const foldedSchemaItemsType = fn.jsonSchema202012.foldType(immutableToJS(schemaItemsType))
    const schemaItemsTypeLabel = fn.jsonSchema202012.getType(immutableToJS(schema.get("items")))
    const schemaItemsFormat = schema.getIn(["items", "format"])
    const schemaItemsSchema = schema.get("items")
    let ArrayItemsComponent
    let isArrayItemText = false
    let isArrayItemFile = (schemaItemsType === "file" || (schemaItemsType === "string" && schemaItemsFormat === "binary")) ? true : false
    if (schemaItemsType && schemaItemsFormat) {
      ArrayItemsComponent = getComponent(`JsonSchema_${schemaItemsType}_${schemaItemsFormat}`)
    } else if (schemaItemsType === "boolean" || schemaItemsType === "array" || schemaItemsType === "object") {
      ArrayItemsComponent = getComponent(`JsonSchema_${schemaItemsType}`)
    }

    if (List.isList(schemaItemsType) && (foldedSchemaItemsType === "array" || foldedSchemaItemsType === "object")) {
      ArrayItemsComponent = getComponent(`JsonSchema_object`)
    }

    // if ArrayItemsComponent not assigned or does not exist,
    // use default schemaItemsType === "string" & JsonSchemaArrayItemText component
    if (!ArrayItemsComponent && !isArrayItemFile) {
      isArrayItemText = true
    }

    if ( schemaItemsEnum ) {
      const Select = getComponent("Select")
      return (<Select className={ errors.length ? "invalid" : ""}
                      title={ errors.length ? errors : ""}
                      multiple={ true }
                      value={ value }
                      disabled={disabled}
                      allowedValues={ schemaItemsEnum }
                      allowEmptyValue={ !required }
                      onChange={ this.onEnumChange }/>)
    }

    const Button = getComponent("Button")
    return (
      <div className="json-schema-array">
        {shouldRenderValue ?
          (value.map((item, i) => {
            const itemErrors = fromJS([
              ...errors.filter((err) => err.index === i)
              .map(e => e.error)
            ])
            return (
              <div key={i} className="json-schema-form-item">
                {
                  isArrayItemFile ?
                    <JsonSchemaArrayItemFile
                    value={item}
                    onChange={(val)=> this.onItemChange(val, i)}
                    disabled={disabled}
                    errors={itemErrors}
                    getComponent={getComponent}
                    />
                    : isArrayItemText ?
                      <JsonSchemaArrayItemText
                        value={item}
                        onChange={(val) => this.onItemChange(val, i)}
                        disabled={disabled}
                        errors={itemErrors}
                      />
                      : <ArrayItemsComponent {...this.props}
                        value={item}
                        onChange={(val) => this.onItemChange(val, i)}
                        disabled={disabled}
                        errors={itemErrors}
                        schema={schemaItemsSchema}
                        getComponent={getComponent}
                        fn={fn}
                      />
                }
                {!disabled ? (
                  <Button
                    className={`btn btn-sm json-schema-form-item-remove ${needsRemoveError.length ? "invalid" : null}`}
                    title={needsRemoveError.length ? needsRemoveError : ""}

                    onClick={() => this.removeItem(i)}
                  > - </Button>
                ) : null}
              </div>
            )
          })
          ) : null
        }
        {!disabled ? (
          <Button
            className={`btn btn-sm json-schema-form-item-add ${arrayErrors.length ? "invalid" : null}`}
            title={arrayErrors.length ? arrayErrors : ""}
            onClick={this.addItem}
          >
            Add {schemaItemsTypeLabel} item
          </Button>
        ) : null}
      </div>
    )
  }
}

export class JsonSchemaArrayItemText extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  onChange = (e) => {
    const value = e.target.value
    this.props.onChange(value, this.props.keyName)
  }

  render() {
    let { value, errors, description, disabled } = this.props
    if (!value) {
      value = "" // value should not be null
    } else if (isImmutable(value) || typeof value === "object") {
      value = stringify(value)
    }

    errors = errors.toJS ? errors.toJS() : []

    return (<DebounceInput
      type={"text"}
      className={errors.length ? "invalid" : ""}
      title={errors.length ? errors : ""}
      value={value}
      minLength={0}
      debounceTimeout={350}
      placeholder={description}
      onChange={this.onChange}
      disabled={disabled} />)
  }
}

export class JsonSchemaArrayItemFile extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  onFileChange = (e) => {
    const value = e.target.files[0]
    this.props.onChange(value, this.props.keyName)
  }

  render() {
    let { getComponent, errors, disabled } = this.props
    const Input = getComponent("Input")
    const isDisabled = disabled || !("FormData" in window)

    return (<Input type="file"
      className={errors.length ? "invalid" : ""}
      title={errors.length ? errors : ""}
      onChange={this.onFileChange}
      disabled={isDisabled} />)
  }
}

export class JsonSchema_boolean extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  onEnumChange = (val) => this.props.onChange(val)
  render() {
    let { getComponent, value, errors, schema, required, disabled } = this.props
    errors = errors.toJS ? errors.toJS() : []
    let enumValue = schema && schema.get ? schema.get("enum") : null
    let allowEmptyValue = !enumValue || !required
    let booleanValue = !enumValue && ["true", "false"]
    const Select = getComponent("Select")

    return (<Select className={ errors.length ? "invalid" : ""}
                    title={ errors.length ? errors : ""}
                    value={ String(value) }
                    disabled={ disabled }
                    allowedValues={ enumValue ? [...enumValue] : booleanValue }
                    allowEmptyValue={ allowEmptyValue }
                    onChange={ this.onEnumChange }/>)
  }
}

const stringifyObjectErrors = (errors) => {
  return errors.map(err => {
    const meta = err.propKey !== undefined ? err.propKey : err.index
    let stringError = typeof err === "string" ? err : typeof err.error === "string" ? err.error : null

    if(!meta && stringError) {
      return stringError
    }
    let currentError = err.error
    let path = `/${err.propKey}`
    while(typeof currentError === "object") {
      const part = currentError.propKey !== undefined ? currentError.propKey : currentError.index
      if(part === undefined) {
        break
      }
      path += `/${part}`
      if (!currentError.error) {
        break
      }
      currentError = currentError.error
    }
    return `${path}: ${currentError}`
  })
}

export class JsonSchema_object extends PureComponent {
  constructor() {
    super()
  }

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

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
      errors,
      disabled
    } = this.props

    const TextArea = getComponent("TextArea")
    errors = errors.toJS ? errors.toJS() : Array.isArray(errors) ? errors : []

    return (
      <div>
        <TextArea
          className={cx({ invalid: errors.length })}
          title={ errors.length ? stringifyObjectErrors(errors).join(", ") : ""}
          value={stringify(value)}
          disabled={disabled}
          onChange={ this.handleOnChange }/>
      </div>
    )
  }
}

function valueOrEmptyList(value) {
  return List.isList(value) ? value : Array.isArray(value) ? fromJS(value) : List()
}
