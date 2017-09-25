import React, { Component } from "react"
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
    let { docExpansion } = getConfigs()
    let showModels = layoutSelectors.isShown("models", docExpansion === "full" || docExpansion === "list" )

    const ModelWrapper = getComponent("ModelWrapper")
    const Collapse = getComponent("Collapse")

    if (!definitions.size) return null

    return <section className={ showModels ? "models is-open" : "models"}>
      <h4 onClick={() => layoutActions.show("models", !showModels)}>
        <span>Models</span>
        <svg width="20" height="20">
          <use xlinkHref={showModels ? "#large-arrow-down" : "#large-arrow"} />
        </svg>
      </h4>
      <Collapse isOpened={showModels}>
        {
          definitions.entrySeq().map( ( [ name, model ])=>{
            return <div className="model-container" key={ `models-section-${name}` }>
              <ModelWrapper name={ name }
                     schema={ model }
                     getComponent={ getComponent }
                     specSelectors={ specSelectors }/>
              </div>
          }).toArray()
        }
      </Collapse>
    </section>
  }
}
