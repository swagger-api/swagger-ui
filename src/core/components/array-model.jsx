import React, { Component, PropTypes } from "react"

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
    let { getComponent, required, schema, depth, expandDepth } = this.props
    let items = schema.get("items")
    let properties = schema.filter( ( v, key) => ["type", "items", "$$ref"].indexOf(key) === -1 )

    const ModelCollapse = getComponent("ModelCollapse")
    const Model = getComponent("Model")

    return <span className="model">
      <span className="model-title">
        <span className="model-title__text">{ schema.get("title") }</span>
      </span>
      <ModelCollapse collapsed={ depth > expandDepth } collapsedContent="[...]">
        [
          <span><Model { ...this.props } schema={ items } required={ false }/></span>
        ]
        {
          properties.size ? <span>
              { properties.entrySeq().map( ( [ key, v ] ) => <span key={`${key}-${v}`} style={propStyle}>
                <br />{ `${key}:`}{ String(v) }</span>)
              }<br /></span>
            : null
        }
      </ModelCollapse>
      { required && <span style={{ color: "red" }}>*</span>}
    </span>
  }
}