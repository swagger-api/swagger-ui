import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import randomBytes from "randombytes"

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
      activeTab,
    }
  }

  activeTab = ( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
    const exampleTabId = randomBytes(5).toString("base64")
    const examplePanelId = randomBytes(5).toString("base64")
    const modelTabId = randomBytes(5).toString("base64")
    const modelPanelId = randomBytes(5).toString("base64")

    //OutSystems change: get the type and the itemType properties
    const type = schema?.get("type");
    const itemType = schema?.getIn(["items", "type"]);
    let isOAS3 = specSelectors.isOAS3()

    return (
      <div className="model-example">
        {/*OutSystems change: perform the following logic only when we have type=object or an array[object]. Otherwise we won't display the model with this component(return null) */}
        { (type == 'object' || (type == 'array' && itemType == 'object')) ?
        <ul className="tab" role="tablist">
          <li className={cx("tabitem", { active: this.state.activeTab === "example" })} role="presentation">
            <button
              aria-controls={examplePanelId}
              aria-selected={this.state.activeTab === "example"}
              className="tablinks"
              data-name="example"
              id={exampleTabId}
              onClick={ this.activeTab }
              role="tab"
            >
              {isExecute ? "Edit Value" : "Example Value"}
            </button>
          </li>
          { schema && (
            <li className={cx("tabitem", { active: this.state.activeTab === "model" })} role="presentation">
              <button
                aria-controls={modelPanelId}
                aria-selected={this.state.activeTab === "model"}
                className={cx("tablinks", { inactive: isExecute })}
                data-name="model"
                id={modelTabId}
                onClick={ this.activeTab }
                role="tab"
              >
                {isOAS3 ? "Schema" : "Model" }
              </button>
            </li>
          )}
        </ul> : null}
        {this.state.activeTab === "example" && (
          <div
            aria-hidden={this.state.activeTab !== "example"}
            aria-labelledby={exampleTabId}
            data-name="examplePanel"
            id={examplePanelId}
            role="tabpanel"
            tabIndex="0"
          >
            {example ? example : (
              <HighlightCode value="(no example available)" getConfigs={ getConfigs } />
            )}
          </div>
        )}

        {//OutSystems change: Pass the properties param and pathMethod to the ModelWrapper component
        this.state.activeTab === "model" && (
          <div
            aria-hidden={this.state.activeTab === "example"}
            aria-labelledby={modelTabId}
            data-name="modelPanel"
            id={modelPanelId}
            role="tabpanel"
            tabIndex="0"
          >
            <ModelWrapper
              schema={ schema }
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              expandDepth={ defaultModelExpandDepth }
              specPath={specPath}
              includeReadOnly = {includeReadOnly}
              includeWriteOnly = {includeWriteOnly}
              param={param}
              pathMethod={pathMethod}
            />
          </div>
        )}
      </div>
    )
  }

}
