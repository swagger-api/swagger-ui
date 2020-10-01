import React, { Component } from "react"
import { Map, List } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import win from "core/window"
import { getSampleSchema, getExtensions, getCommonExtensions, numberToString, stringify, isEmptyValue } from "core/utils"
import getParameterSchema from "../../helpers/get-parameter-schema.js"

export default class ParameterRow extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    param: PropTypes.object.isRequired,
    rawParam: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    fn: PropTypes.object.isRequired,
    isExecute: PropTypes.bool,
    onChangeConsumes: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specPath: ImPropTypes.list.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    this.setDefaultValue()
  }

  componentWillReceiveProps(props) {
    let { specSelectors, pathMethod, rawParam } = props
    let isOAS3 = specSelectors.isOAS3()

    let parameterWithMeta = specSelectors.parameterWithMetaByIdentity(pathMethod, rawParam) || new Map()
    // fallback, if the meta lookup fails
    parameterWithMeta = parameterWithMeta.isEmpty() ? rawParam : parameterWithMeta

    let enumValue

    if(isOAS3) {
      let { schema } = getParameterSchema(parameterWithMeta, { isOAS3 })
      enumValue = schema ? schema.get("enum") : undefined
    } else {
      enumValue = parameterWithMeta ? parameterWithMeta.get("enum") : undefined
    }
    let paramValue = parameterWithMeta ? parameterWithMeta.get("value") : undefined

    let value

    if ( paramValue !== undefined ) {
      value = paramValue
    } else if ( rawParam.get("required") && enumValue && enumValue.size ) {
      value = enumValue.first()
    }

    if ( value !== undefined && value !== paramValue ) {
      this.onChangeWrapper(numberToString(value))
    }
    // todo: could check if schema here; if not, do not call. impact?
    this.setDefaultValue()
  }

  onChangeWrapper = (value, isXml = false) => {
    let { onChange, rawParam } = this.props
    let valueForUpstream

    // Coerce empty strings and empty Immutable objects to null
    if(value === "" || (value && value.size === 0)) {
      valueForUpstream = null
    } else {
      valueForUpstream = value
    }

    return onChange(rawParam, valueForUpstream, isXml)
  }

  _onExampleSelect = (key, /* { isSyntheticChange } = {} */) => {
    this.props.oas3Actions.setActiveExamplesMember({
      name: key,
      pathMethod: this.props.pathMethod,
      contextType: "parameters",
      contextName: this.getParamKey()
    })
  }

  onChangeIncludeEmpty = (newValue) => {
    let { specActions, param, pathMethod } = this.props
    const paramName = param.get("name")
    const paramIn = param.get("in")
    return specActions.updateEmptyParamInclusion(pathMethod, paramName, paramIn, newValue)
  }

  setDefaultValue = () => {
    let { specSelectors, pathMethod, rawParam, oas3Selectors } = this.props

    const paramWithMeta = specSelectors.parameterWithMetaByIdentity(pathMethod, rawParam) || Map()
    const { schema } = getParameterSchema(paramWithMeta, { isOAS3: specSelectors.isOAS3() })
    const parameterMediaType = paramWithMeta
      .get("content", Map())
      .keySeq()
      .first()

    // getSampleSchema could return null
    const generatedSampleValue = schema ? getSampleSchema(schema.toJS(), parameterMediaType, {

      includeWriteOnly: true
    }) : null

    if (!paramWithMeta || paramWithMeta.get("value") !== undefined) {
      return
    }

    if( paramWithMeta.get("in") !== "body" ) {
      let initialValue

      //// Find an initial value

      if (specSelectors.isSwagger2()) {
        initialValue =
          paramWithMeta.get("x-example") !== undefined
          ? paramWithMeta.get("x-example")
          : paramWithMeta.getIn(["schema", "example"]) !== undefined
          ? paramWithMeta.getIn(["schema", "example"])
          : (schema && schema.getIn(["default"]))
      } else if (specSelectors.isOAS3()) {
        const currentExampleKey = oas3Selectors.activeExamplesMember(...pathMethod, "parameters", this.getParamKey())
        initialValue = 
          paramWithMeta.getIn(["examples", currentExampleKey, "value"]) !== undefined
          ? paramWithMeta.getIn(["examples", currentExampleKey, "value"])
          : paramWithMeta.getIn(["content", parameterMediaType, "example"]) !== undefined
          ? paramWithMeta.getIn(["content", parameterMediaType, "example"])
          : paramWithMeta.get("example") !== undefined
          ? paramWithMeta.get("example")
          : (schema && schema.get("example")) !== undefined
          ? (schema && schema.get("example"))
          : (schema && schema.get("default")) !== undefined
          ? (schema && schema.get("default"))
          : paramWithMeta.get("default") // ensures support for `parameterMacro`
      }

      //// Process the initial value

      if(initialValue !== undefined && !List.isList(initialValue)) {
        // Stringify if it isn't a List
        initialValue = stringify(initialValue)
      }

      //// Dispatch the initial value

      if(initialValue !== undefined) {
        this.onChangeWrapper(initialValue)
      } else if(
        schema && schema.get("type") === "object"
        && generatedSampleValue
        && !paramWithMeta.get("examples")
      ) {
        // Object parameters get special treatment.. if the user doesn't set any
        // default or example values, we'll provide initial values generated from
        // the schema.
        // However, if `examples` exist for the parameter, we won't do anything,
        // so that the appropriate `examples` logic can take over.
        this.onChangeWrapper(
          List.isList(generatedSampleValue) ? (
            generatedSampleValue
          ) : (
            stringify(generatedSampleValue)
          )
        )
      }
    }
  }

  getParamKey() {
    const { param } = this.props

    if(!param) return null

    return `${param.get("name")}-${param.get("in")}`
  }

  render() {
    let {param, rawParam, getComponent, getConfigs, isExecute, fn, onChangeConsumes, specSelectors, pathMethod, specPath, oas3Selectors} = this.props

    let isOAS3 = specSelectors.isOAS3()

    const { showExtensions, showCommonExtensions } = getConfigs()

    if(!param) {
      param = rawParam
    }

    if(!rawParam) return null

    // const onChangeWrapper = (value) => onChange(param, value)
    const JsonSchemaForm = getComponent("JsonSchemaForm")
    const ParamBody = getComponent("ParamBody")
    let inType = param.get("in")
    let bodyParam = inType !== "body" ? null
      : <ParamBody getComponent={getComponent}
                   getConfigs={ getConfigs }
                   fn={fn}
                   param={param}
                   consumes={ specSelectors.consumesOptionsFor(pathMethod) }
                   consumesValue={ specSelectors.contentTypeValues(pathMethod).get("requestContentType") }
                   onChange={this.onChangeWrapper}
                   onChangeConsumes={onChangeConsumes}
                   isExecute={ isExecute }
                   specSelectors={ specSelectors }
                   pathMethod={ pathMethod }
      />

    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent("Markdown", true)
    const ParameterExt = getComponent("ParameterExt")
    const ParameterIncludeEmpty = getComponent("ParameterIncludeEmpty")
    const ExamplesSelectValueRetainer = getComponent("ExamplesSelectValueRetainer")
    const Example = getComponent("Example")

    let { schema } = getParameterSchema(param, { isOAS3 })
    let paramWithMeta = specSelectors.parameterWithMetaByIdentity(pathMethod, rawParam) || Map()

    let format = schema ? schema.get("format") : null
    let type = schema ? schema.get("type") : null
    let itemType = schema ? schema.getIn(["items", "type"]) : null
    let isFormData = inType === "formData"
    let isFormDataSupported = "FormData" in win
    let required = param.get("required")

    let value = paramWithMeta ? paramWithMeta.get("value") : ""
    let commonExt = showCommonExtensions ? getCommonExtensions(schema) : null
    let extensions = showExtensions ? getExtensions(param) : null

    let paramItems // undefined
    let paramEnum // undefined
    let paramDefaultValue // undefined
    let paramExample // undefined
    let isDisplayParamEnum = false

    if ( param !== undefined && schema ) {
      paramItems = schema.get("items")
    }

    if (paramItems !== undefined) {
      paramEnum = paramItems.get("enum")
      paramDefaultValue = paramItems.get("default")
    } else if (schema) {
      paramEnum = schema.get("enum")
    }

    if ( paramEnum && paramEnum.size && paramEnum.size > 0) {
      isDisplayParamEnum = true
    }

    // Default and Example Value for readonly doc
    if ( param !== undefined ) {
      if (schema) {
        paramDefaultValue = schema.get("default")
      }
      if (paramDefaultValue === undefined) {
        paramDefaultValue = param.get("default")
      }
      paramExample = param.get("example")
      if (paramExample === undefined) {
        paramExample = param.get("x-example")
      }
    }

    return (
      <tr data-param-name={param.get("name")} data-param-in={param.get("in")}>
        <td className="parameters-col_name">
          <div className={required ? "parameter__name required" : "parameter__name"}>
            { param.get("name") }
            { !required ? null : <span>&nbsp;*</span> }
          </div>
          <div className="parameter__type">
            { type }
            { itemType && `[${itemType}]` }
            { format && <span className="prop-format">(${format})</span>}
          </div>
          <div className="parameter__deprecated">
            { isOAS3 && param.get("deprecated") ? "deprecated": null }
          </div>
          <div className="parameter__in">({ param.get("in") })</div>
          { !showCommonExtensions || !commonExt.size ? null : commonExt.entrySeq().map(([key, v]) => <ParameterExt key={`${key}-${v}`} xKey={key} xVal={v} /> )}
          { !showExtensions || !extensions.size ? null : extensions.map((v, key) => <ParameterExt key={`${key}-${v}`} xKey={key} xVal={v} /> )}
        </td>

        <td className="parameters-col_description">
          { param.get("description") ? <Markdown source={ param.get("description") }/> : null }

          { (bodyParam || !isExecute) && isDisplayParamEnum ?
            <Markdown className="parameter__enum" source={
                "<i>Available values</i> : " + paramEnum.map(function(item) {
                    return item
                  }).toArray().join(", ")}/>
            : null
          }

          { (bodyParam || !isExecute) && paramDefaultValue !== undefined ?
            <Markdown className="parameter__default" source={"<i>Default value</i> : " + paramDefaultValue}/>
            : null
          }

          { (bodyParam || !isExecute) && paramExample !== undefined ?
            <Markdown source={"<i>Example</i> : " + paramExample}/>
            : null
          }

          {(isFormData && !isFormDataSupported) && <div>Error: your browser does not support FormData</div>}

          {
            isOAS3 && param.get("examples") ? (
              <section className="parameter-controls">
                <ExamplesSelectValueRetainer
                  examples={param.get("examples")}
                  onSelect={this._onExampleSelect}
                  updateValue={this.onChangeWrapper}
                  getComponent={getComponent}
                  defaultToFirstExample={true}
                  currentKey={oas3Selectors.activeExamplesMember(...pathMethod, "parameters", this.getParamKey())}
                  currentUserInputValue={value}
                />
              </section>
            ) : null
          }

          { bodyParam ? null
            : <JsonSchemaForm fn={fn}
                              getComponent={getComponent}
                              value={ value }
                              required={ required }
                              disabled={!isExecute}
                              description={param.get("description") ? `${param.get("name")} - ${param.get("description")}` : `${param.get("name")}`}
                              onChange={ this.onChangeWrapper }
                              errors={ paramWithMeta.get("errors") }
                              schema={ schema }/>
          }


          {
            bodyParam && schema ? <ModelExample getComponent={ getComponent }
                                                specPath={specPath.push("schema")}
                                                getConfigs={ getConfigs }
                                                isExecute={ isExecute }
                                                specSelectors={ specSelectors }
                                                schema={ schema }
                                                example={ bodyParam }
                                                includeWriteOnly={ true }/>
              : null
          }

          {
            !bodyParam && isExecute && param.get("allowEmptyValue") ?
            <ParameterIncludeEmpty
              onChange={this.onChangeIncludeEmpty}
              isIncluded={specSelectors.parameterInclusionSettingFor(pathMethod, param.get("name"), param.get("in"))}
              isDisabled={!isEmptyValue(value)} />
            : null
          }

          {
            isOAS3 && param.get("examples") ? (
              <Example
                example={param.getIn([
                  "examples",
                  oas3Selectors.activeExamplesMember(...pathMethod, "parameters", this.getParamKey())
                ])}
                getComponent={getComponent}
                getConfigs={getConfigs}
              />
            ) : null
          }

        </td>

      </tr>
    )

  }

}
