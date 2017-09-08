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

  renderModel( type, props, modelSchema, modelName, isRef, required, getComponent, specSelectors ) {
    const ObjectModel = getComponent("ObjectModel")
    const ArrayModel = getComponent("ArrayModel")
    const PrimitiveModel = getComponent("PrimitiveModel")
    const deprecated = specSelectors.isOAS3() && modelSchema.get("deprecated")

    switch(type) {
      case "object":
        return <ObjectModel
          className="object" { ...this.props }
          schema={ modelSchema }
          name={ modelName }
          deprecated={deprecated}
          isRef={ isRef } />
      case "array":
        return <ArrayModel
          className="array" { ...this.props }
          schema={ modelSchema }
          name={ modelName }
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
          name={ modelName }
          deprecated={deprecated}
          required={ required }/>
    }
  }

  render () {
    let { getComponent, specSelectors, schema, required, name, isRef } = this.props
    let modelName, modelSchema, type
    let $$ref = schema && schema.get("$$ref")

    console.log("Rendering model", this.getModelName( $$ref ), name, $$ref, schema.toJS())
    
    if ( schema && (schema.get("type") || schema.get("properties")) ) {
      // props.schema is a normal schema
      modelName = name
      modelSchema = schema
    } else if ( $$ref ) {
      // props.schema is not a normal schema, most likely a $ref
      modelName = this.getModelName( $$ref )
      modelSchema = this.getRefSchema( modelName )
    }
    
    if ( !modelSchema ) {
      // Don't bother rendering an invalid schema
      return null
    }
    
    // Default `type` to object
    type = modelSchema.get("type") || "object"
    isRef = isRef !== undefined ? isRef : !!$$ref
    
    // If the model is `oneOf` or `anyOf`, go through its available types
    // and render each type as part of an array
    // if ( this.props.schema.get("oneOf") || this.props.schema.get("anyOf") ) {
    //   const isOneOf = this.props.schema.get("oneOf")
    //   const options = this.props.schema.get("oneOf") || this.props.schema.get("anyOf")
    //   return (
    //     <span>
    //       { isOneOf ? "One of: " : "Any of: " }
    //       { options.map( (typeOption, i) => {
    //         const type = typeOption.get("type")
    //         const $$ref = typeOption.get("$$ref")

    //         // Override modelName if the typeOption is a $$ref to another Model
    //         if ( $$ref ) {
    //           console.log("reassigning model name from", typeOption.toJS(), modelName, this.getModelName( $$ref ))
    //           // modelName = $$ref && this.getModelName( $$ref )
    //         }

    //         let result = []
    //         // "join" together the options with " or "/" and "
    //         if ( i > 0 ) {
    //           result.push( <span>&nbsp;or&nbsp;</span> )
    //         }

    //         // Render the Model component, overriding the props.schema and modelSchema properties
    //         // with the proper type from the current iteration of the available types
    //         result.push( <span key={type}>
    //           { this.renderModel( type, {
    //             ...this.props,
    //             schema: typeOption
    //            }, typeOption, modelName, name, deprecated, isRef, $$ref, required, getComponent ) }
    //         </span> )
    //         return result
    //       } ).toJS() }
    //     </span>
    //   ) 
    // }

    return this.renderModel( type, this.props, modelSchema, modelName, isRef, required, getComponent, specSelectors )
  }
}
