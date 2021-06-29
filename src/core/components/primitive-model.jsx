import React, { Component } from "react"
import PropTypes from "prop-types"
import { getExtensions } from "core/utils"
//OutSystems change: import a component created by OutSystems in order to get the data type to be displayed
import DataTypesOutSystems from "./dataTypesOutSystems"

const propClass = "property primitive"

export default class Primitive extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    depth: PropTypes.number,
    //OutSystems change: receive 3 new properties, which are needed in the DataTypeOutSystems component
    specSelectors: PropTypes.object.isRequired,
    param: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired
  }

  render() {
    //OutSystems change: passing 3 new properties, which are needed in the DataTypeOutSystems component
    let { schema, getComponent, getConfigs, name, displayName, depth, specSelectors, param, pathMethod } = this.props

    const { showExtensions } = getConfigs()

    if(!schema || !schema.get) {
      // don't render if schema isn't correctly formed
      return <div></div>
    }

    let type = schema.get("type")
    let format = schema.get("format")
    let xml = schema.get("xml")
    let enumArray = schema.get("enum")
    let title = schema.get("title") || displayName || name
    let description = schema.get("description")
    let extensions = getExtensions(schema)
    let properties = schema
      .filter( ( v, key) => ["enum", "type", "format", "description", "$$ref"].indexOf(key) === -1 )
      .filterNot( (v, key) => extensions.has(key) )
    const Markdown = getComponent("Markdown", true)
    const EnumModel = getComponent("EnumModel")
    const Property = getComponent("Property")

    return <span className="model">
      <span className="prop">
        {name && <span className={`${depth === 1 && "model-title"} prop-name`}>{title}</span>}
        {/* OutSystems change: don't use the Format as Model. Instead, use the returned value of the DataTypesOutSystems component
        <span className="prop-type">{type}</span>
        {format && <span className="prop-format">(${format})</span>}
        format && <span className="prop-format">(${format})</span> */}
        <DataTypesOutSystems
          param={param}
          specSelectors={specSelectors}
          schema={schema}
          pathMethod={pathMethod} />
        {
          properties.size ? properties.entrySeq().map( ( [ key, v ] ) => <Property key={`${key}-${v}`} propKey={ key } propVal={ v } propClass={ propClass } />) : null
        }
        {
          showExtensions && extensions.size ? extensions.entrySeq().map( ( [ key, v ] ) => <Property key={`${key}-${v}`} propKey={ key } propVal={ v } propClass={ propClass } />) : null
        }
        {
          !description ? null :
            <Markdown source={ description } />
        }
        {
          xml && xml.size ? (<span><br /><span className={ propClass }>xml:</span>
            {
              xml.entrySeq().map( ( [ key, v ] ) => <span key={`${key}-${v}`} className={ propClass }><br/>&nbsp;&nbsp;&nbsp;{key}: { String(v) }</span>).toArray()
            }
          </span>): null
        }
        {
          enumArray && <EnumModel value={ enumArray } getComponent={ getComponent } />
        }
      </span>
    </span>
  }
}
