import React from "react"
import ImmutablePureComponent from "react-immutable-pure-component"
import ImPropTypes from "react-immutable-proptypes"
import PropTypes from "prop-types"
import { Map } from "immutable"

import RollingLoadSVG from "core/assets/rolling-load.svg"

const decodeRefName = uri => {
  const unescaped = uri.replace(/~1/g, "/").replace(/~0/g, "~")

  try {
    return decodeURIComponent(unescaped)
  } catch {
    return unescaped
  }
}

export default class Model extends ImmutablePureComponent {
  static propTypes = {
    schema: ImPropTypes.map.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRef: PropTypes.bool,
    required: PropTypes.bool,
    expandDepth: PropTypes.number,
    depth: PropTypes.number,
    specPath: ImPropTypes.list.isRequired,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
  }

  getModelName =( ref )=> {
    if ( ref.indexOf("#/definitions/") !== -1 ) {
      return decodeRefName(ref.replace(/^.*#\/definitions\//, ""))
    }
    if ( ref.indexOf("#/components/schemas/") !== -1 ) {
      return decodeRefName(ref.replace(/^.*#\/components\/schemas\//, ""))
    }
  }

  getRefSchema =( model )=> {
    let { specSelectors } = this.props

    return specSelectors.findDefinition(model)
  }

  render () {
    let { getComponent, getConfigs, specSelectors, schema, required, name, isRef, specPath, displayName,
      includeReadOnly, includeWriteOnly} = this.props
    const ObjectModel = getComponent("ObjectModel")
    const ArrayModel = getComponent("ArrayModel")
    const PrimitiveModel = getComponent("PrimitiveModel")
    let type = "object"
    let $$ref = schema && schema.get("$$ref")
    let $ref = schema && schema.get("$ref")

    // If we weren't passed a `name` but have a resolved ref, grab the name from the ref
    if (!name && $$ref) {
      name = this.getModelName($$ref)
    }

    /*
     * If we have an unresolved ref, get the schema and name from the ref.
     * If the ref is external, we can't resolve it, so we just display the ref location.
     * This is for situations where the ref was not resolved by Swagger Client
     * because we reached the traversal depth limit.
     */
    if ($ref) {
      name = this.getModelName($ref)
      const refSchema = this.getRefSchema(name)
      if (Map.isMap(refSchema)) {
        schema = refSchema.set("$$ref", $ref)
        $$ref = $ref
      } else {
        schema = null
        name = $ref
      }
    }

    if(!schema) {
      return <span className="model model-title">
              <span className="model-title__text">{ displayName || name }</span>
              {!$ref && <RollingLoadSVG height="20px" width="20px" />}
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
          isRef={ isRef }
          includeReadOnly = {includeReadOnly}
          includeWriteOnly = {includeWriteOnly}/>
      case "array":
        return <ArrayModel
          className="array" { ...this.props }
          getConfigs={ getConfigs }
          schema={ schema }
          name={ name }
          deprecated={deprecated}
          required={ required }
          includeReadOnly = {includeReadOnly}
          includeWriteOnly = {includeWriteOnly}/>
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
