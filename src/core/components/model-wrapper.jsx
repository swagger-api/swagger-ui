import React, { Component, } from "react"
import PropTypes from "prop-types"
//import layoutActions from "actions/layout"


export default class ModelWrapper extends Component {


  static propTypes = {
    schema: PropTypes.object.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    fullPath: PropTypes.object,
    specPath: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    expandDepth: PropTypes.number,
    layoutActions: PropTypes.object,
    layoutSelectors: PropTypes.object.isRequired,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
  }

  onToggle = (name,isShown) => {
    // If this prop is present, we'll have deepLinking for it
    if(this.props.layoutActions) {
      this.props.layoutActions.show(this.props.fullPath, isShown)
    }
  }

  render(){
    let { getComponent, getConfigs } = this.props
    const Model = getComponent("Model")
    const LazyResolver = getComponent("LazyResolver", true)

    let expanded
    if(this.props.layoutSelectors) {
      // If this is prop is present, we'll have deepLinking for it
      expanded = this.props.layoutSelectors.isShown(this.props.fullPath)
    }

    return <div className="model-box">
      <LazyResolver
        specPath={this.props.specPath}
        shouldResolve={expanded}
        Comp={({ resolvedObj }) => (
          <Model {...this.props} schema={resolvedObj ||this.props.schema} getConfigs={getConfigs} expanded={expanded} depth={1} onToggle={this.onToggle} expandDepth={this.props.expandDepth || 0} />)} />
    </div>
  }
}
