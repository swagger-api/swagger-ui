import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    example: PropTypes.any.isRequired,
    isExecute: PropTypes.bool,
    getConfigs: PropTypes.func.isRequired,
    specPath: ImPropTypes.list.isRequired,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
    //OutSystems change: receive two new properties: param and pathMethod to pass to the Model-wrapper component
    param: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired
  }

  constructor(props, context) {
    super(props, context)
    let { getConfigs, isExecute } = this.props
    let { defaultModelRendering } = getConfigs()

    let activeTab = defaultModelRendering

    if (defaultModelRendering !== "example" && defaultModelRendering !== "model") {
      activeTab = "example"
    }

    if(isExecute) {
      activeTab = "example"
    }

    this.state = {
      activeTab: activeTab
    }
  }

  activeTab =( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isExecute &&
      !this.props.isExecute &&
      this.props.example
    ) {
      this.setState({ activeTab: "example" })
    }
  }

  render() {
    // OutSystems change: passing the 2 new properties
    const { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath, includeReadOnly, includeWriteOnly, param, pathMethod } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")

    //OutSystems change: get the type and the itemType properties
    const type = schema?.get("type");
    const itemType = schema?.getIn(["items", "type"]);
    let isOAS3 = specSelectors.isOAS3()

    return (
      <div className="model-example">
        {/*OutSystems change: perform the following logic only when we have type=object or an array[object]. Otherwise we won't display the model with this component(return null) */}
        { (type == 'object' || (type == 'array' && itemType == 'object')) ?
          <div>
            <ul className="tab">
              <li className={"tabitem" + (this.state.activeTab === "example" ? " active" : "")}>
                <a className="tablinks" data-name="example" onClick={this.activeTab}>{isExecute ? "Edit Value" : "Example Value"}</a>
              </li>
              {schema ? <li className={"tabitem" + (this.state.activeTab === "model" ? " active" : "")}>
                <a className={"tablinks" + (isExecute ? " inactive" : "")} data-name="model" onClick={this.activeTab}>
                  {isOAS3 ? "Schema" : "Model"}
                </a>
              </li> : null}
            </ul>
          </div> : null}
          <div>
            {
              this.state.activeTab === "example" ? (
                example ? example : (
                  <HighlightCode value="(no example available)" getConfigs={ getConfigs } />
                )
              ) : null
            }
            { //OutSystems change: Pass the properties param and pathMethod to the ModelWrapper component
              this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                         getComponent={ getComponent }
                                                         getConfigs={ getConfigs }
                                                         specSelectors={ specSelectors }
                                                         expandDepth={ defaultModelExpandDepth }
                                                         specPath={specPath}
                                                         includeReadOnly = {includeReadOnly}
                                                         includeWriteOnly={includeWriteOnly}
                                                         param={param}
                                                         pathMethod={pathMethod}/>
             }
            </div>
      </div>)
  }

}
