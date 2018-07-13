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
  }

  constructor(props, context) {
    super(props, context)
    let { getConfigs, isExecute } = this.props
    let { defaultModelRendering } = getConfigs()
    if (defaultModelRendering !== "example" && defaultModelRendering !== "model") {
      defaultModelRendering = "example"
    }
    this.state = {
      activeTab: isExecute ? "example" : defaultModelRendering
    }
  }

  activeTab =( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name
    })
  }

  componentWillReceiveProps(props) {
    if (props.isExecute && props.isExecute !== this.props.isExecute) {
      this.setState({ activeTab: "example" })
    }
  }

  render() {
    let { getComponent, specSelectors, schema, example, isExecute, getConfigs, specPath } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")

    return <div>
      <ul className="tab">
        <li className={ "tabitem" + ( this.state.activeTab === "example" ? " active" : "") }>
          <a className="tablinks" data-name="example" onClick={ this.activeTab }>{isExecute ? "Edit Value" : "Example Value"}</a>
        </li>
        { schema ? <li className={ "tabitem" + ( this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>Model</a>
        </li> : null }
      </ul>
      <div>
        {
          this.state.activeTab === "example" && example
        }
        {
          this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                     getComponent={ getComponent }
                                                     getConfigs={ getConfigs }
                                                     specSelectors={ specSelectors }
                                                     expandDepth={ defaultModelExpandDepth }
                                                     specPath={specPath} />


        }
      </div>
    </div>
  }

}
