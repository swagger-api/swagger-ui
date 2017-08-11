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
    let ObjectModel = getComponent("ObjectModel")
    let ArrayModel = getComponent("ArrayModel")
    let PrimitiveModel = getComponent("PrimitiveModel")
    let $$ref = schema && schema.get("$$ref")
    let modelName = $$ref && this.getModelName( $$ref )
    let modelSchema, type

    const deprecated = specSelectors.isOAS3() && schema.get("deprecated")

    if ( schema && (schema.get("type") || schema.get("properties")) ) {
      modelSchema = schema
    } else if ( $$ref ) {
      modelSchema = this.getRefSchema( modelName )
    }

    type = modelSchema && modelSchema.get("type")
    if ( !type && modelSchema && modelSchema.get("properties") ) {
      type = "object"
    }

    switch(type) {
      case "object":
        return <ObjectModel
          className="object" { ...this.props }
          schema={ modelSchema }
          name={ modelName || name }
          deprecated={deprecated}
          isRef={ isRef!== undefined ? isRef : !!$$ref } />
      case "array":
        return <ArrayModel
          className="array" { ...this.props }
          schema={ modelSchema }
          name={ modelName || name }
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
          schema={ modelSchema }
          name={ modelName || name }
          deprecated={deprecated}
          required={ required }/> }
  }
}
