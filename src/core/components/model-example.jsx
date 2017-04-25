import React, { PropTypes } from "react"


export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    example: PropTypes.any.isRequired,
    isExecute: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      activeTab: "example"
    }
  }

  activeTab =( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name
    })
  }

  render() {
    let { getComponent, specSelectors, schema, example, isExecute } = this.props
    const Model = getComponent("model")

    return <div>
      <ul className="tab">
        <li className={ "tabitem" + ( isExecute || this.state.activeTab === "example" ? " active" : "") }>
          <a className="tablinks" data-name="example" onClick={ this.activeTab }>Example Value</a>
        </li>
        <li className={ "tabitem" + ( !isExecute && this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>Model</a>
        </li>
      </ul>
      <div>
        {
          (isExecute || this.state.activeTab === "example") && example
        }
        {
          !isExecute && this.state.activeTab === "model" && <Model schema={ schema }
                                                     getComponent={ getComponent }
                                                     specSelectors={ specSelectors }
                                                     expandDepth={ 1 } />


        }
      </div>
    </div>
  }

}
