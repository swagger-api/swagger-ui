import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"

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
    let { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath, includeReadOnly, includeWriteOnly } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")

    let isOAS3 = specSelectors.isOAS3()

    return (
      <div className="model-example">
        <ul className="tab" role="tablist">
          <li className={cx("tabitem", { "active": this.state.activeTab === "example" })} role="presentation">
            <button
              aria-controls="examplePanel"
              aria-selected={this.state.activeTab === "example"}
              className="tablinks"
              data-name="example"
              id="exampleTab"
              onClick={ this.activeTab }
              role="tab"
            >
              {isExecute ? "Edit Value" : "Example Value"}
            </button>
          </li>
          { schema && (
            <li className={cx("tabitem", { "active": this.state.activeTab === "model" })} role="presentation">
              <button
                aria-controls={isOAS3 ? "schemaPanel" : "modelPanel" }
                aria-selected={this.state.activeTab === "model"}
                className={ "tablinks" + ( isExecute ? " inactive" : "" )}
                data-name="model"
                id={isOAS3 ? "schemaTab" : "modelTab" }
                onClick={ this.activeTab }
                role="tab"
              >
                {isOAS3 ? "Schema" : "Model" }
              </button>
            </li>
          )}
        </ul>
        {this.state.activeTab === "example" && (
          <div id="examplePanel" role="tabpanel" aria-labelledby="exampleTab" aria-hidden={this.state.activeTab === "model"} tabIndex="0">
            {example ? example : (
              <HighlightCode value="(no example available)" getConfigs={ getConfigs } />
            )}
          </div>
        )}

        {this.state.activeTab === "model" && (
          <div id={isOAS3 ? "schemaPanel" : "modelPanel" } role="tabpanel" aria-labelledby={isOAS3 ? "schemaTab" : "modelTab" } aria-hidden={this.state.activeTab === "example"} tabIndex="0">
            <ModelWrapper
              schema={ schema }
              getComponent={ getComponent }
              getConfigs={ getConfigs }
              specSelectors={ specSelectors }
              expandDepth={ defaultModelExpandDepth }
              specPath={specPath}
              includeReadOnly = {includeReadOnly}
              includeWriteOnly = {includeWriteOnly}
            />
          </div>
        )}
      </div>
    )
  }

}
