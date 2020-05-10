import React, { Component } from "react"
import Im, { Map } from "immutable"
import PropTypes from "prop-types"

export default class ModelContainer extends Component {
  static propTypes = {
    name: PropTypes.string,
    specSelectors: PropTypes.object,
    layoutSelectors: PropTypes.object,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func,
    getConfigs: PropTypes.func.isRequired,
    layoutActions: PropTypes.object
  }

  getSingleModelForRender(name, specSelectors, layoutSelectors, specActions,
                          getComponent, getConfigs, layoutActions) {

    const getSchemaBasePath = () => {
      const isOAS3 = specSelectors.isOAS3()
      return isOAS3 ? ["components", "schemas"] : ["definitions"]
    }

    const getCollapsedContent = () => {
      return " "
    }

    const handleToggle = (name, isExpanded) => {
      layoutActions.show(["models", name], isExpanded)
      if(isExpanded) {
        specActions.requestResolvedSubtree([...getSchemaBasePath(), name])
      }
    }

    const ModelWrapper = getComponent("ModelWrapper")
    const ModelCollapse = getComponent("ModelCollapse")
    const JumpToPath = getComponent("JumpToPath")
    let { defaultModelsExpandDepth } = getConfigs()
    const fullPath = [...getSchemaBasePath(), name]

    const schemaValue = specSelectors.specResolvedSubtree(fullPath)
    const rawSchemaValue = specSelectors.specJson().getIn(fullPath)

    const schema = Map.isMap(schemaValue) ? schemaValue : Im.Map()
    const rawSchema = Map.isMap(rawSchemaValue) ? rawSchemaValue : Im.Map()

    const displayName = schema.get("title") || rawSchema.get("title") || name
    const isShown = layoutSelectors.isShown( ["models", name], false )

    if( isShown && (schema.size === 0 && rawSchema.size > 0) ) {
      // Firing an action in a container render is not great,
      // but it works for now.
      specActions.requestResolvedSubtree([...getSchemaBasePath(), name])
    }

    const expanded = defaultModelsExpandDepth > 0 && isShown

    const specPath = Im.List([...getSchemaBasePath(), name])

    const content = <ModelWrapper name={ name }
                                  expandDepth={ defaultModelsExpandDepth }
                                  schema={ schema || Im.Map() }
                                  displayName={displayName}
                                  specPath={specPath}
                                  getComponent={ getComponent }
                                  specSelectors={ specSelectors }
                                  getConfigs = {getConfigs}
                                  layoutSelectors = {layoutSelectors}
                                  layoutActions = {layoutActions}/>

    const title = <span className="model-box">
              <span className="model model-title">
                {displayName}
              </span>
            </span>

    return <div id={ `model-${name}` } className="model-container" data-name={name} data-is-open={ expanded }>
      <span className="models-jump-to-path"><JumpToPath specPath={specPath} /></span>
      <ModelCollapse
        classes="model-box"
        collapsedContent={getCollapsedContent(name)}
        onToggle={handleToggle}
        title={title}
        displayName={displayName}
        modelName={name}
        hideSelfOnExpand={true}
        expanded={ expanded }
      >{content}</ModelCollapse>
    </div>
  }

  render(){
    let {name, specSelectors, layoutSelectors, specActions,
      getComponent, getConfigs, layoutActions} = this.props

    return this.getSingleModelForRender(name, specSelectors, layoutSelectors, specActions,
      getComponent, getConfigs, layoutActions
    )
  }
}
