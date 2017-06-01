import React, { Component, PropTypes } from "react"
import Im, { OrderedMap } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import { OAS3ComponentWrapFactory } from "../helpers"

const mapRequestBody = (iterable, fn) => iterable.entries().filter(Im.Map.isMap).map((val) => {
  return fn(val.get(0), val.get(1))
})

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

    changeParam( onChangeKey, param.get("name"), value, isXml)
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
      pathMethod,
      operation
    } = this.props

    const ParameterRow = getComponent("parameterRow")
    const TryItOutButton = getComponent("TryItOutButton")
    const Model = getComponent("model")

    const isExecute = tryItOutEnabled && allowTryItOut

    const requestBody = operation.get("requestBody")
    const requestBodyDescription = (requestBody && requestBody.get("description")) || null
    const requestBodyContent = (requestBody && requestBody.get("content")) || new OrderedMap()

    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <div className="tab-header">
            <div onClick={() => this.toggleTab("parameters")} className={this.state.parametersVisible ? "tab-item active" : "tab-item"}>
              <h4 className="opblock-title"><span>Parameters</span></h4>
            </div>
            <div onClick={() => this.toggleTab("callbacks")} className="tab-item">
              <h4 className="opblock-title"><span>Callbacks</span></h4>
            </div>
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

        {this.state.callbackVisible ? <div className="callbacks-container">
          covfefe
        </div> : "" }
        {
          requestBody &&
          <div className="opblock-section">
            <div className="opblock-section-header">
              <h4 className="opblock-title">Request body</h4>
            </div>
            <div className="opblock-description-wrapper">
              { requestBodyDescription &&
                <p>{requestBodyDescription}</p>
              }
              { !requestBodyContent.count() ? <p>No content</p> :
                requestBodyContent.map((mediaTypeValue, key) => (
                  <div>
                    <h4>{key}</h4>
                    <Model
                      getComponent={ getComponent }
                      specSelectors={ specSelectors }
                      expandDepth={1}
                      schema={mediaTypeValue.get("schema")} />
                  </div>
                )).toArray()
              }
            </div>
          </div>
        }
      </div>
    )
  }
}


export default OAS3ComponentWrapFactory(Parameters)
