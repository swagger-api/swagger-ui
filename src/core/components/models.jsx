import React, { Component, PropTypes } from "react"


export default class Models extends Component {
  static propTypes = {
    getComponent: PropTypes.func,
    specSelectors: PropTypes.object,
    layoutSelectors: PropTypes.object,
    layoutActions: PropTypes.object
  }

  render(){
    let { specSelectors, getComponent, layoutSelectors, layoutActions } = this.props
    let definitions = specSelectors.definitions()
    let showModels = layoutSelectors.isShown("models", true)

    const Model = getComponent("model")
    const Collapse = getComponent("Collapse")

    if (!definitions.size) return null

    return <section className={ showModels ? "models is-open" : "models"}>
      <h4 onClick={() => layoutActions.show("models", !showModels)}>
        <span>Models</span>
        <svg width="20" height="20">
          <use xlinkHref="#large-arrow" />
        </svg>
      </h4>
      <Collapse isOpened={showModels} animated>
        {
          definitions.entrySeq().map( ( [ name, model ])=>{
            return <div className="model-container" key={ `models-section-${name}` }>
              <Model name={ name }
                     schema={ model }
                     isRef={ true }
                     getComponent={ getComponent }
                     specSelectors={ specSelectors }/>
              </div>
          }).toArray()
        }
      </Collapse>
    </section>
  }
}
