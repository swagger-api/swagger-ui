import React, { Component } from "react"
import Im from "immutable"
import PropTypes from "prop-types"

export default class Models extends Component {
  static propTypes = {
    getComponent: PropTypes.func,
    specSelectors: PropTypes.object,
    layoutSelectors: PropTypes.object,
    layoutActions: PropTypes.object,
    getConfigs: PropTypes.func.isRequired
  }

  render(){
    let { specSelectors, getComponent, layoutSelectors, layoutActions, getConfigs } = this.props
    let definitions = specSelectors.definitions()
    let { docExpansion, defaultModelsExpandDepth } = getConfigs()
    if (!definitions.size || defaultModelsExpandDepth < 0) return null

    let showModels = layoutSelectors.isShown("models", defaultModelsExpandDepth > 0 && docExpansion !== "none")
    const specPathBase = specSelectors.isOAS3() ? ["components", "schemas"] : ["definitions"]

    const ModelWrapper = getComponent("ModelWrapper")
    const Collapse = getComponent("Collapse")

    return <section className={ showModels ? "models is-open" : "models"}>
      <h4 onClick={() => layoutActions.show("models", !showModels)}>
        <span>Models</span>
        <svg height="20"
          width="20">
          <use xlinkHref={showModels ? "#large-arrow-down" : "#large-arrow"} />
        </svg>
      </h4>
      <Collapse isOpened={showModels}>
        {
          definitions.entrySeq().map( ( [ name, model ])=>{

            return <div key={ `models-section-${name}` }
              className="model-container"
              id={ `model-${name}` }>
              <ModelWrapper expandDepth={ defaultModelsExpandDepth }
                getComponent={ getComponent }
                getConfigs = {getConfigs}
                layoutActions = {layoutActions}
                layoutSelectors = {layoutSelectors}
                name={ name }
                schema={ model }
                specPath={Im.List([...specPathBase, name])}
                specSelectors={ specSelectors }/>
            </div>
          }).toArray()
        }
      </Collapse>
    </section>
  }
}
