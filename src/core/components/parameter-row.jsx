import React, { Component } from "react"
import { Map } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import win from "core/window"
import { getExtensions, getCommonExtensions, numberToString } from "core/utils"

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
    specPath: ImPropTypes.list.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.setDefaultValue()
  }

  componentWillReceiveProps(props) {
    let { specSelectors, pathMethod, rawParam } = props
    let { isOAS3 } = specSelectors

    let parameterWithMeta = specSelectors.parameterWithMetaByIdentity(pathMethod, rawParam)
    // fallback, if the meta lookup fails
    parameterWithMeta = parameterWithMeta.isEmpty() ? rawParam : parameterWithMeta

    let enumValue

    if(isOAS3()) {
      let schema = parameterWithMeta.get("schema") || Map()
      enumValue = schema.get("enum")
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

  onChangeIncludeEmpty = (newValue) => {
    let { specActions, param, pathMethod } = this.props
    const paramName = param.get("name")
    const paramIn = param.get("in")
    return specActions.updateEmptyParamInclusion(pathMethod, paramName, paramIn, newValue)
  }

  setDefaultValue = () => {
    let { specSelectors, pathMethod, rawParam } = this.props

    let paramWithMeta = specSelectors.parameterWithMetaByIdentity(pathMethod, rawParam)


    if (paramWithMeta.get("value") !== undefined) {
      return
    }

    if( paramWithMeta.get("in") !== "body" ) {
      let newValue

      if (specSelectors.isSwagger2()) {
        newValue = paramWithMeta.get("x-example")
          || paramWithMeta.getIn(["default"])
          || paramWithMeta.getIn(["schema", "example"])
          || paramWithMeta.getIn(["schema", "default"])
      } else if (specSelectors.isOAS3()) {
        newValue = paramWithMeta.get("example")
          || paramWithMeta.getIn(["schema", "example"])
          || paramWithMeta.getIn(["schema", "default"])
      }
      if(newValue !== undefined) {
        this.onChangeWrapper(numberToString(newValue))
      }
    }
  }

  render() {
    let {param, rawParam, getComponent, getConfigs, isExecute, fn, onChangeConsumes, specSelectors, pathMethod, specPath} = this.props

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
                   onChange={this.onChangeWrapper}
                   onChangeConsumes={onChangeConsumes}
                   isExecute={ isExecute }
                   specSelectors={ specSelectors }
                   pathMethod={ pathMethod }
      />

    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent("Markdown")
    const ParameterExt = getComponent("ParameterExt")
    const ParameterIncludeEmpty = getComponent("ParameterIncludeEmpty")

    let paramWithMeta = specSelectors.parameterWithMetaByIdentity(pathMethod, rawParam)
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
      <tr data-param-name={param.get("name")} data-param-in={param.get("in")}>
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

          {
            !bodyParam && isExecute ? 
            <ParameterIncludeEmpty
              onChange={this.onChangeIncludeEmpty}
              isIncluded={specSelectors.parameterInclusionSettingFor(pathMethod, param.get("name"), param.get("in"))}
              isDisabled={value && value.size !== 0}
              param={param} /> 
            : null
          }

        </td>

      </tr>
    )

  }

}
