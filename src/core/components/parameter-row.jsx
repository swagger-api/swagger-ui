import React, { Component } from "react"
import { Map } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import win from "core/window"
import { getExtensions, getCommonExtensions } from "core/utils"

export default class ParameterRow extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    param: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    fn: PropTypes.object.isRequired,
    isExecute: PropTypes.bool,
    onChangeConsumes: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specPath: ImPropTypes.list.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.setDefaultValue()
  }

  componentWillReceiveProps(props) {
    let { specSelectors, pathMethod, param } = props
    let { isOAS3 } = specSelectors

    let example = param.get("example")
    let parameter = specSelectors.parameterWithMeta(pathMethod, param.get("name"), param.get("in")) || param
    let enumValue

    if(isOAS3()) {
      let schema = param.get("schema") || Map()
      enumValue = schema.get("enum")
    } else {
      enumValue = parameter ? parameter.get("enum") : undefined
    }
    let paramValue = parameter ? parameter.get("value") : undefined

    let value

    if ( paramValue !== undefined ) {
      value = paramValue
    } else if ( example !== undefined ) {
      value = example
    } else if ( param.get("required") && enumValue && enumValue.size ) {
      value = enumValue.first()
    }

    if ( value !== undefined ) {
      this.onChangeWrapper(value)
    }
  }

  onChangeWrapper = (value) => {
    let { onChange, param } = this.props
    return onChange(param, value)
  }

  setDefaultValue = () => {
    let { specSelectors, pathMethod, param } = this.props

    if (param.get("value") !== undefined) {
      return
    }

    let schema = specSelectors.isOAS3() ? param.get("schema", Map({})) : param

    let defaultValue = schema.get("default")
    let xExampleValue = param.get("x-example") // Swagger 2 only
    let parameter = specSelectors.parameterWithMeta(pathMethod, param.get("name"), param.get("in"))
    let value = parameter ? parameter.get("value") : ""

    if( param.get("in") !== "body" ) {
      if ( xExampleValue !== undefined && value === undefined && specSelectors.isSwagger2() ) {
        this.onChangeWrapper(xExampleValue)
      } else if ( defaultValue !== undefined && value === undefined ) {
        this.onChangeWrapper(defaultValue)
      }
    }
  }

  render() {
    let {param, onChange, getComponent, getConfigs, isExecute, fn, onChangeConsumes, specSelectors, pathMethod, specPath} = this.props

    let { isOAS3 } = specSelectors

    const { showExtensions, showCommonExtensions } = getConfigs()

    // const onChangeWrapper = (value) => onChange(param, value)
    const JsonSchemaForm = getComponent("JsonSchemaForm")
    const ParamBody = getComponent("ParamBody")
    let inType = param.get("in")
    let bodyParam = inType !== "body" ? null
      : <ParamBody getComponent={getComponent}
                   fn={fn}
                   param={param}
                   consumes={ specSelectors.operationConsumes(pathMethod) }
                   consumesValue={ specSelectors.contentTypeValues(pathMethod).get("requestContentType") }
                   onChange={onChange}
                   onChangeConsumes={onChangeConsumes}
                   isExecute={ isExecute }
                   specSelectors={ specSelectors }
                   pathMethod={ pathMethod }
      />

    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent("Markdown")
    const ParameterExt = getComponent("ParameterExt")

    let paramWithMeta = specSelectors.parameterWithMeta(pathMethod, param.get("name"), param.get("in"))
    let format = param.get("format")
    let schema = isOAS3 && isOAS3() ? param.get("schema") : param
    let type = schema.get("type")
    let isFormData = inType === "formData"
    let isFormDataSupported = "FormData" in win
    let required = param.get("required")
    let itemType = schema.getIn(["items", "type"])

    let value = paramWithMeta ? paramWithMeta.get("value") : ""
    let commonExt = showCommonExtensions ? getCommonExtensions(param) : null
    let extensions = showExtensions ? getExtensions(param) : null

    let paramItems // undefined
    let paramEnum // undefined
    let paramDefaultValue // undefined
    let paramExample // undefined
    let isDisplayParamEnum = false

    if ( param !== undefined ) {
      paramItems = schema.get("items")
    }

    if (paramItems !== undefined) {
      paramEnum = paramItems.get("enum")
      paramDefaultValue = paramItems.get("default")
    } else {
      paramEnum = schema.get("enum")
    }

    if ( paramEnum !== undefined && paramEnum.size > 0) {
      isDisplayParamEnum = true
    }

    // Default and Example Value for readonly doc
    if ( param !== undefined ) {
      paramDefaultValue = schema.get("default")
      paramExample = param.get("example")
      if (paramExample === undefined) {
        paramExample = param.get("x-example")
      }
    }

    return (
      <tr className="parameters">
        <td className="col parameters-col_name">
          <div className={required ? "parameter__name required" : "parameter__name"}>
            { param.get("name") }
            { !required ? null : <span style={{color: "red"}}>&nbsp;*</span> }
          </div>
          <div className="parameter__type">
            { type }
            { itemType && `[${itemType}]` }
            { format && <span className="prop-format">(${format})</span>}
          </div>
          <div className="parameter__deprecated">
            { isOAS3 && isOAS3() && param.get("deprecated") ? "deprecated": null }
          </div>
          <div className="parameter__in">({ param.get("in") })</div>
          { !showCommonExtensions || !commonExt.size ? null : commonExt.map((v, key) => <ParameterExt key={`${key}-${v}`} xKey={key} xVal={v} /> )}
          { !showExtensions || !extensions.size ? null : extensions.map((v, key) => <ParameterExt key={`${key}-${v}`} xKey={key} xVal={v} /> )}
        </td>

        <td className="col parameters-col_description">
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

          {(isFormData && !isFormDataSupported) && <div>Error: your browser does not support FormData</div>}

          { bodyParam || !isExecute ? null
            : <JsonSchemaForm fn={fn}
                              getComponent={getComponent}
                              value={ value }
                              required={ required }
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
                                                schema={ param.get("schema") }
                                                example={ bodyParam }/>
              : null
          }

        </td>

      </tr>
    )

  }

}
