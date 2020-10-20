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
    let { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath, includeReadOnly, includeWriteOnly } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")

    let isOAS3 = specSelectors.isOAS3()

    return <div className="model-example">
      <ul className="tab">
        <li className={ "tabitem" + ( this.state.activeTab === "example" ? " active" : "") }>
          <a className="tablinks" data-name="example" onClick={ this.activeTab }>{isExecute ? "Edit Value" : "Example Value"}</a>
        </li>
        { schema ? <li className={ "tabitem" + ( this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>
            {isOAS3 ? "Schema" : "Model" }
          </a>
        </li> : null }
      </ul>
      <div>
        {
          this.state.activeTab === "example" ? (
            example ? example : (
              <HighlightCode value="(no example available)" getConfigs={ getConfigs } />
            )
          ) : null
        }
        {
          this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                     getComponent={ getComponent }
                                                     getConfigs={ getConfigs }
                                                     specSelectors={ specSelectors }
                                                     expandDepth={ defaultModelExpandDepth }
                                                     specPath={specPath}
                                                     includeReadOnly = {includeReadOnly}
                                                     includeWriteOnly = {includeWriteOnly}/>


        }
      </div>
    </div>
  }

}
