import React from "react"
import ImmutablePureComponent from "react-immutable-pure-component"
import ImPropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import { getModelNameFromRef } from "core/utils"

export default class Model extends ImmutablePureComponent {
  static propTypes = {
    schema: ImPropTypes.orderedMap.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    isRef: PropTypes.bool,
    required: PropTypes.bool,
    expandDepth: PropTypes.number,
    depth: PropTypes.number,
    specPath: ImPropTypes.list.isRequired,
  }  

  getRefSchema =( model )=> {
    let { specSelectors } = this.props

    return specSelectors.findDefinition(model)
  }

  render () {
    let { getComponent, getConfigs, specSelectors, schema, required, name, isRef, specPath } = this.props
    const ObjectModel = getComponent("ObjectModel")
    const ArrayModel = getComponent("ArrayModel")
    const PrimitiveModel = getComponent("PrimitiveModel")
    let type = "object"
    let $$ref = schema && schema.get("$$ref")

    // If we weren't passed a `name` but have a ref, grab the name from the ref
    if ( !name && $$ref ) {
      name = getModelNameFromRef($$ref)
    }
    // If we weren't passed a `schema` but have a ref, grab the schema from the ref
    if ( !schema && $$ref ) {
      schema = this.getRefSchema( name )
    }

    if(!schema) {
      return <span className="model model-title">
              <span className="model-title__text">{ name }</span>
              <img src={require("core/../img/rolling-load.svg")} height={"20px"} width={"20px"} style={{
                  marginLeft: "1em",
                  position: "relative",
                  bottom: "0px"
                }} />
            </span>
    }

    const deprecated = specSelectors.isOAS3() && schema.get("deprecated")
    isRef = isRef !== undefined ? isRef : !!$$ref
    type = schema && schema.get("type") || type

    switch(type) {
      case "object":
        return <ObjectModel
          className="object" { ...this.props }
          specPath={specPath}
          getConfigs={ getConfigs }
          schema={ schema }
          name={ name }
          deprecated={deprecated}
          isRef={ isRef } />
      case "array":
        return <ArrayModel
          className="array" { ...this.props }
          getConfigs={ getConfigs }
          schema={ schema }
          name={ name }
          deprecated={deprecated}
          required={ required } />
      case "string":
      case "number":
      case "integer":
      case "boolean":
      default:
        return <PrimitiveModel
          { ...this.props }
          getComponent={ getComponent }
          getConfigs={ getConfigs }
          schema={ schema }
          name={ name }
          deprecated={deprecated}
          required={ required }/>
    }
  }
}
