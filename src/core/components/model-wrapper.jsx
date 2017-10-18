import React, { Component, } from "react"
import PropTypes from "prop-types"
//import layoutActions from "actions/layout"


export default class ModelWrapper extends Component {


  static propTypes = {
    schema: PropTypes.object.isRequired,
    name: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    expandDepth: PropTypes.number,
    layoutActions: PropTypes.object,
    layoutSelectors: PropTypes.object.isRequired
  }

  onToggle = (name,isShown) => {
      this.props.layoutActions.show(["models", name],isShown)
  }

  render(){
    let { getComponent } = this.props
    const Model = getComponent("Model")
    const expanded = this.props.layoutSelectors.isShown(["models",this.props.name])
    return <div className="model-box">
      <Model { ...this.props } expanded={expanded} depth={ 1 } onToggle={ this.onToggle} expandDepth={ this.props.expandDepth || 0 }/>
    </div>
  }
}


