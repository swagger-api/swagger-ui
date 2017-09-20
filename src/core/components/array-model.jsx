import React, { Component } from "react"
import PropTypes from "prop-types"

const propStyle = { color: "#999", fontStyle: "italic" }

export default class ArrayModel extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    required: PropTypes.bool,
    expandDepth: PropTypes.number,
    depth: PropTypes.number
  }

  render(){
    let { getComponent, schema, depth, expandDepth, name } = this.props
    let items = schema.get("items")
    let title = schema.get("title") || name
    let properties = schema.filter( ( v, key) => ["type", "items", "$$ref"].indexOf(key) === -1 )

    const ModelCollapse = getComponent("ModelCollapse")
    const Model = getComponent("Model")

    const titleEl = title &&
      <span className="model-title">
        <span className="model-title__text">{ title }</span>
      </span>

    /* 
    Note: we set `name={null}` in <Model> below because we don't want
    the name of the current Model passed (and displayed) as the name of the array element Model
    */ 

    return <span className="model">
      <ModelCollapse title={titleEl} collapsed={ depth > expandDepth } collapsedContent="[...]">
        [
          <span><Model { ...this.props } name={null} schema={ items } required={ false } depth={ depth + 1 } /></span>
        ]
        {
          properties.size ? <span>
              { properties.entrySeq().map( ( [ key, v ] ) => <span key={`${key}-${v}`} style={propStyle}>
                <br />{ key }: { String(v) }</span>)
              }<br /></span>
            : null
        }
      </ModelCollapse>
    </span>
  }
}
