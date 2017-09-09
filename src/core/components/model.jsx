import React, { Component } from "react"
import PropTypes from "prop-types"

export default class Model extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    isRef: PropTypes.bool,
    required: PropTypes.bool,
    expandDepth: PropTypes.number,
    depth: PropTypes.number
  }

  getModelName =( ref )=> {
    if ( ref.indexOf("#/definitions/") !== -1 ) {
      return ref.replace(/^.*#\/definitions\//, "")
    }
    if ( ref.indexOf("#/components/schemas/") !== -1 ) {
      return ref.replace("#/components/schemas/", "")
    }
  }

  getRefSchema =( model )=> {
    let { specSelectors } = this.props

    return specSelectors.findDefinition(model)
  }

  render () {
    let { getComponent, specSelectors, schema, required, name, isRef } = this.props
    const ObjectModel = getComponent("ObjectModel")
    const ArrayModel = getComponent("ArrayModel")
    const PrimitiveModel = getComponent("PrimitiveModel")
    let type = "object"
    let $$ref = schema && schema.get("$$ref")
    
    // If we weren't passed a `name` but have a ref, grab the name from the ref
    if ( !name && $$ref ) {
      name = this.getModelName( $$ref )
    }
    // If we weren't passed a `schema` but have a ref, grab the schema from the ref
    if ( !schema && $$ref ) {
      schema = this.getRefSchema( name )
    }
    
    const deprecated = specSelectors.isOAS3() && schema.get("deprecated")
    isRef = isRef !== undefined ? isRef : !!$$ref
    type = schema && schema.get("type") || type
    
    switch(type) {
      case "object":
        return <ObjectModel
          className="object" { ...this.props }
          schema={ schema }
          name={ name }
          deprecated={deprecated}
          isRef={ isRef } />
      case "array":
        return <ArrayModel
          className="array" { ...this.props }
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
          schema={ schema }
          name={ name }
          deprecated={deprecated}
          required={ required }/>
    }
  }
}
