import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { sanitizeUrl } from "core/utils"

const propClass = "property"

export default class ArrayModel extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    required: PropTypes.bool,
    expandDepth: PropTypes.number,
    specPath: ImPropTypes.list.isRequired,
    depth: PropTypes.number,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
  }

  render(){
    let { getComponent, getConfigs, schema, depth, expandDepth, name, displayName, specPath } = this.props
    let description = schema.get("description")
    let items = schema.get("items")
    let title = schema.get("title") || displayName || name
    let properties = schema.filter( ( v, key) => ["type", "items", "description", "$$ref", "externalDocs"].indexOf(key) === -1 )
    let externalDocsUrl = schema.getIn(["externalDocs", "url"])
    let externalDocsDescription = schema.getIn(["externalDocs", "description"])


    const Markdown = getComponent("Markdown", true)
    const ModelCollapse = getComponent("ModelCollapse")
    const Model = getComponent("Model")
    const Property = getComponent("Property")
    const Link = getComponent("Link")

    const titleEl = title &&
      <span className="model-title">
        <span className="model-title__text">{ title }</span>
      </span>

    /*
    Note: we set `name={null}` in <Model> below because we don't want
    the name of the current Model passed (and displayed) as the name of the array element Model
    */

    return <span className="model">
      <ModelCollapse title={titleEl} expanded={ depth <= expandDepth } collapsedContent="[...]">
        [
          {
            properties.size ? properties.entrySeq().map( ( [ key, v ] ) => <Property key={`${key}-${v}`} propKey={ key } propVal={ v } propClass={ propClass } />) : null
          }
          {
            !description ? (properties.size ? <div className="markdown"></div> : null) :
              <Markdown source={ description } />
          }
          { externalDocsUrl &&
            <div className="external-docs">
               <Link target="_blank" href={sanitizeUrl(externalDocsUrl)}>{externalDocsDescription || externalDocsUrl}</Link>
             </div>
          }
          <span>
            <Model
              { ...this.props }
              getConfigs={ getConfigs }
              specPath={specPath.push("items")}
              name={null}
              schema={ items }
              required={ false }
              depth={ depth + 1 }
            />
          </span>
        ]
      </ModelCollapse>
    </span>
  }
}
