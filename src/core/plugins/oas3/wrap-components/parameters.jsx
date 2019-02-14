import React, { Component } from "react"
import PropTypes from "prop-types"
import Im, { Map, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import { OAS3ComponentWrapFactory } from "../helpers"

// More readable, just iterate over maps, only
const eachMap = (iterable, fn) => iterable.valueSeq().filter(Im.Map.isMap).map(fn)

class Parameters extends Component {

  constructor(props) {
   super(props)
   this.state = {
     callbackVisible: false,
     parametersVisible: true
   }
 }

  static propTypes = {
    parameters: ImPropTypes.list.isRequired,
    specActions: PropTypes.object.isRequired,
    operation: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    tryItOutEnabled: PropTypes.bool,
    allowTryItOut: PropTypes.bool,
    specPath: ImPropTypes.list.isRequired,
    onTryoutClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    onChangeKey: PropTypes.array,
    pathMethod: PropTypes.array.isRequired
  }


  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    tryItOutEnabled: false,
    allowTryItOut: true,
    onChangeKey: [],
  }

  onChange = ( param, value, isXml ) => {
    let {
      specActions: { changeParamByIdentity },
      onChangeKey,
    } = this.props

    changeParamByIdentity( onChangeKey, param, value, isXml)
  }

  onChangeConsumesWrapper = ( val ) => {
    let {
      specActions: { changeConsumesValue },
      onChangeKey
    } = this.props

    changeConsumesValue(onChangeKey, val)
  }

  toggleTab = (tab) => {
    if(tab === "parameters"){
      return this.setState({
        parametersVisible: true,
        callbackVisible: false
      })
    }else if(tab === "callbacks"){
      return this.setState({
        callbackVisible: true,
        parametersVisible: false
      })
    }
  }

  render(){

    let {
      onTryoutClick,
      onCancelClick,
      parameters,
      allowTryItOut,
      tryItOutEnabled,

      fn,
      getComponent,
      getConfigs,
      specSelectors,
      specActions,
      oas3Actions,
      oas3Selectors,
      pathMethod,
      specPath,
      operation
    } = this.props

    const ParameterRow = getComponent("parameterRow")
    const TryItOutButton = getComponent("TryItOutButton")
    const ContentType = getComponent("contentType")
    const Callbacks = getComponent("Callbacks", true)
    const RequestBody = getComponent("RequestBody", true)

    const isExecute = tryItOutEnabled && allowTryItOut
    const { isOAS3 } = specSelectors

    const requestBody = operation.get("requestBody")
    const requestBodySpecPath = specPath.slice(0, -1).push("requestBody") // remove the "parameters" part

    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <div className="tab-header">
            <div onClick={() => this.toggleTab("parameters")} className={`tab-item ${this.state.parametersVisible && "active"}`}>
              <h4 className="opblock-title"><span>Parameters</span></h4>
            </div>
            { operation.get("callbacks") ?
              (
                <div onClick={() => this.toggleTab("callbacks")} className={`tab-item ${this.state.callbackVisible && "active"}`}>
                  <h4 className="opblock-title"><span>Callbacks</span></h4>
                </div>
              ) : null
            }
          </div>
            { allowTryItOut ? (
              <TryItOutButton enabled={ tryItOutEnabled } onCancelClick={ onCancelClick } onTryoutClick={ onTryoutClick } />
            ) : null }
        </div>
        {this.state.parametersVisible ? <div className="parameters-container">
          { !parameters.count() ? <div className="opblock-description-wrapper"><p>No parameters</p></div> :
            <div className="table-container">
              <table className="parameters">
                <thead>
                  <tr>
                    <th className="col col_header parameters-col_name">Name</th>
                    <th className="col col_header parameters-col_description">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    eachMap(parameters, (parameter, i) => (
                      <ParameterRow fn={ fn }
                        getComponent={ getComponent }
                        specPath={specPath.push(i)}
                        getConfigs={ getConfigs }
                        rawParam={ parameter }
                        param={ specSelectors.parameterWithMetaByIdentity(pathMethod, parameter) }
                        key={ parameter.get( "name" ) }
                        onChange={ this.onChange }
                        onChangeConsumes={this.onChangeConsumesWrapper}
                        specSelectors={ specSelectors }
                        specActions={ specActions }
                        pathMethod={ pathMethod }
                        isExecute={ isExecute }/>
                    )).toArray()
                  }
                </tbody>
              </table>
            </div>
          }
        </div> : "" }

        {this.state.callbackVisible ? <div className="callbacks-container opblock-description-wrapper">
          <Callbacks
            callbacks={Map(operation.get("callbacks"))}
            specPath={specPath.slice(0, -1).push("callbacks")}
          />
        </div> : "" }
        {
          isOAS3() && requestBody && this.state.parametersVisible &&
          <div className="opblock-section opblock-section-request-body">
            <div className="opblock-section-header">
              <h4 className={`opblock-title parameter__name ${requestBody.get("required") && "required"}`}>Request body</h4>
              <label>
                <ContentType
                  value={oas3Selectors.requestContentType(...pathMethod)}
                  contentTypes={ requestBody.get("content", List()).keySeq() }
                  onChange={(value) => {
                    oas3Actions.setRequestContentType({ value, pathMethod })
                  }}
                  className="body-param-content-type" />
              </label>
            </div>
            <div className="opblock-description-wrapper">
              <RequestBody
                specPath={requestBodySpecPath}
                requestBody={requestBody}
                requestBodyValue={oas3Selectors.requestBodyValue(...pathMethod) || Map()}
                isExecute={isExecute}
                onChange={(value, path) => {
                  if(path) {
                    const lastValue = oas3Selectors.requestBodyValue(...pathMethod)
                    const usableValue = Map.isMap(lastValue) ? lastValue : Map()
                    return oas3Actions.setRequestBodyValue({
                      pathMethod,
                      value: usableValue.setIn(path, value)
                    })
                  }
                  oas3Actions.setRequestBodyValue({ value, pathMethod })
                }}
                contentType={oas3Selectors.requestContentType(...pathMethod)}/>
            </div>
          </div>
        }
      </div>
    )
  }
}


export default OAS3ComponentWrapFactory(Parameters)
