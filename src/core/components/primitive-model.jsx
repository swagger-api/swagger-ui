import React, { Component } from "react"
import PropTypes from "prop-types"
import { getExtensions } from "core/utils"

const propStyle = { color: "#6b6b6b", fontStyle: "italic" }

export default class Primitive extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    depth: PropTypes.number,
    translate: PropTypes.func.isRequired
  }

  render(){
    let { schema, getComponent, getConfigs, name, displayName, depth, translate } = this.props

    const { showExtensions } = getConfigs()

    if(!schema || !schema.get) {
      // don't render if schema isn't correctly formed
      return <div></div>
    }

    let type = schema.get("type")
    let format = schema.get("format")
    let example = schema.get("example")
    let xml = schema.get("xml")
    let enumArray = schema.get("enum")
    let title = schema.get("title") || displayName || name
    let description = schema.get("description")
    let extensions = getExtensions(schema)
    let properties = schema
      .filter( ( v, key) => ["enum", "type", "format", "example", "description", "$$ref"].indexOf(key) === -1 )
      .filterNot( (v, key) => extensions.has(key) )
    const Markdown = getComponent("Markdown")
    const EnumModel = getComponent("EnumModel")
    const Property = getComponent("Property")

    return <span className="model">
      <span className="prop">
        { name && <span className={`${depth === 1 && "model-title"} prop-name`}>{ title }</span> }
        <span className="prop-type">{ type }</span>
        { format && <span className="prop-format">{"($"}{format}{")"}</span>}
        { example && <span className="prop-example" style={propStyle}><br />{translate("properties.example")} {example}</span>}
        {
          properties.size ? properties.entrySeq().map( ( [ key, v ] ) => <Property key={`${key}-${v}`} propKey={ key } propVal={ v } propStyle={ propStyle } />) : null
        }
        {
          showExtensions && extensions.size ? extensions.entrySeq().map( ( [ key, v ] ) => <Property key={`${key}-${v}`} propKey={ key } propVal={ v } propStyle={ propStyle } />) : null
        }
        {
          !description ? null :
            <Markdown source={ description } />
        }
        {
          xml && xml.size ? (<span><br /><span style={ propStyle }>{translate("properties.xml")}</span>
            {
              xml.entrySeq().map( ( [ key, v ] ) => <span key={`${key}-${v}`} style={ propStyle }><br/>&nbsp;&nbsp;&nbsp;{key}{":"} { String(v) }</span>).toArray()
            }
          </span>): null
        }
        {
          enumArray && <EnumModel value={ enumArray } getComponent={ getComponent } translate={ translate } />
        }
      </span>
    </span>
  }
}
