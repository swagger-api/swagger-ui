import React, { Component } from "react"
import PropTypes from "prop-types"
import Im, { Map } from "immutable"
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
    specSelectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    tryItOutEnabled: PropTypes.bool,
    allowTryItOut: PropTypes.bool,
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
      specActions: { changeParam },
      onChangeKey,
    } = this.props

    changeParam( onChangeKey, param.get("name"), param.get("in"), value, isXml)
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
      specSelectors,
      oas3Actions,
      oas3Selectors,
      pathMethod,
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
                    eachMap(parameters, (parameter) => (
                      <ParameterRow fn={ fn }
                        getComponent={ getComponent }
                        param={ parameter }
                        key={ parameter.get( "name" ) }
                        onChange={ this.onChange }
                        onChangeConsumes={this.onChangeConsumesWrapper}
                        specSelectors={ specSelectors }
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
          <Callbacks callbacks={Map(operation.get("callbacks"))} />
        </div> : "" }
        {
          isOAS3() && requestBody && this.state.parametersVisible &&
          <div className="opblock-section">
            <div className="opblock-section-header">
              <h4 className={`opblock-title parameter__name ${requestBody.get("required") && "required"}`}>Request body</h4>
              <label>
                <ContentType
                  value={oas3Selectors.requestContentType(...pathMethod)}
                  contentTypes={ requestBody.get("content").keySeq() }
                  onChange={(value) => {
                    oas3Actions.setRequestContentType({ value, pathMethod })
                  }}
                  className="body-param-content-type" />
              </label>
            </div>
            <div className="opblock-description-wrapper">
              <RequestBody
                requestBody={requestBody}
                isExecute={isExecute}
                onChange={(value) => {
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
