import React, { Component, } from "react"
import PropTypes from "prop-types"

export default class ModelComponent extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    name: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    expandDepth: PropTypes.number
  }

  render(){
    let { getComponent } = this.props
    const Model = getComponent("Model")

    return <div className="model-box">
      <Model { ...this.props } depth={ 1 } expandDepth={ this.props.expandDepth || 0 }/>
    </div>
  }
}


