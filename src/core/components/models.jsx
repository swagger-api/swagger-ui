import React, { Component } from "react"
import PropTypes from "prop-types"

export default class Models extends Component {
  static propTypes = {
    getComponent: PropTypes.func,
    specSelectors: PropTypes.object,
    specActions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object,
    layoutActions: PropTypes.object,
    getConfigs: PropTypes.func.isRequired
  }

  render(){
    let { specSelectors, getComponent, layoutSelectors, specActions, layoutActions, getConfigs } = this.props
    let definitions = specSelectors.definitions()
    let { docExpansion, defaultModelsExpandDepth } = getConfigs()
    if (!definitions.size || defaultModelsExpandDepth < 0) return null

    let showModels = layoutSelectors.isShown("models", defaultModelsExpandDepth > 0 && docExpansion !== "none")
    const isOAS3 = specSelectors.isOAS3()

    const Collapse = getComponent("Collapse")
    const ModelContainer = getComponent("ModelContainer")

    return <section className={ showModels ? "models is-open" : "models"}>
      <h4 onClick={() => layoutActions.show("models", !showModels)}>
        <span>{isOAS3 ? "Schemas" : "Models" }</span>
        <svg width="20" height="20">
          <use xlinkHref={showModels ? "#large-arrow-down" : "#large-arrow"} />
        </svg>
      </h4>
      <Collapse isOpened={showModels}>
        {
          definitions.entrySeq()
            .map(([name])=> {
              return (
                <ModelContainer key={ `models-section-${name}`}
                  name={name}
                  specSelectors={specSelectors}
                  layoutSelectors={layoutSelectors}
                  specActions={specActions}
                  getComponent={getComponent}
                  getConfigs={getConfigs}
                  layoutActions={layoutActions}
                />
              )
          })
            .toArray()
        }
      </Collapse>
    </section>
  }
}
