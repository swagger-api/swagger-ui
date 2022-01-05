import React, { Component, } from "react"
import PropTypes, { func } from "prop-types"
import { List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import jsonld from "jsonld"

const braceOpen = "{"
const braceClose = "}"
const propClass = "property"


const contestualizza = (key, ctx) => {
  if (!ctx) return "No semantics"

  let field = ctx.get(key)
  let vocabularyUri = null
  if (!field) return "No semantics"

  if (typeof field !== "string") {
    const fieldCtx = field.get("@context")
    field = field.get("@id")
    vocabularyUri = fieldCtx && fieldCtx.get("@base") || null
  }
  let vocab = ctx.get("@vocab") || ""
  return (
    <div>
      <a href={vocab + field}>
        {field}
      </a>&nbsp;
      <span>{
        vocabularyUri && 
          <a 
           href={vocabularyUri}
           title={ "This value is relative to the vocabulary " + vocabularyUri }>[vocabulary]</a>
          }
      </span>
    </div>
  )
}



export default class ObjectModel extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    displayName: PropTypes.string,
    isRef: PropTypes.bool,
    expandDepth: PropTypes.number,
    depth: PropTypes.number,
    specPath: ImPropTypes.list.isRequired,
    includeReadOnly: PropTypes.bool,
    includeWriteOnly: PropTypes.bool,
    jsonldContext: PropTypes.object,
    canonized: PropTypes.string,
  }


  async toRdf() {
    try {
      console.log(this)
      let doc = this.props.schema.get("example") && this.props.schema.get("example").toJS() || {}
      const ctx = this.props.schema.get("x-jsonld-context") && this.props.schema.get("x-jsonld-context").toJS() || {}
      doc["@context"] = ctx
      console.log("toRdf", doc)
      const canonized = await jsonld.toRDF(doc,
      { format: "application/n-quads" })

      if (!this.state) {
        this.setState({ canonized: canonized})
        console.log("canonized", canonized)
      }
    } catch (e) {
      console.error(e)
      return (
        <div>RDF example
          <pre>{e.message}</pre>
        </div>
      )
    }
  }


  render(){
    let { schema, name, displayName, isRef, getComponent, getConfigs, depth, onToggle, expanded, specPath, ...otherProps } = this.props
    let { specSelectors,expandDepth, includeReadOnly, includeWriteOnly, jsonldContext, canonized} = otherProps
    const { isOAS3 } = specSelectors

    if(!schema) {
      return null
    }

    const { showExtensions } = getConfigs()

    let semantics = schema.get("x-jsonld-context") || jsonldContext || {}
    let description = schema.get("description")
    let properties = schema.get("properties")
    let additionalProperties = schema.get("additionalProperties")
    let title = schema.get("title") || displayName || name
    let requiredProperties = schema.get("required")
    let infoProperties = schema
      .filter( ( v, key) => ["maxProperties", "minProperties", "nullable", "example"].indexOf(key) !== -1 )
    let deprecated = schema.get("deprecated")
    let example = schema.get("example") ? schema.get("example").toJS() : {}

    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent("Markdown", true)
    const Model = getComponent("Model")
    const ModelCollapse = getComponent("ModelCollapse")
    const Property = getComponent("Property")

    const JumpToPathSection = () => {
      return <span className="model-jump-to-path"><JumpToPath specPath={specPath} /></span>
    }
    const collapsedContent = (<span>
        <span>{ braceOpen }</span>...<span>{ braceClose }</span>
        {
          isRef ? <JumpToPathSection /> : ""
        }
    </span>)

    const anyOf = specSelectors.isOAS3() ? schema.get("anyOf") : null
    const oneOf = specSelectors.isOAS3() ? schema.get("oneOf") : null
    const not = specSelectors.isOAS3() ? schema.get("not") : null

    const titleEl = title && <span className="model-title">
      { isRef && schema.get("$$ref") && <span className="model-hint">{ schema.get("$$ref") }</span> }
      <span className="model-title__text">{ title }</span>
    </span>

    if (example) {
      this.toRdf()
    }
    return <span className="model">
      <ModelCollapse
        modelName={name}
        title={titleEl}
        onToggle = {onToggle}
        expanded={ expanded ? true : depth <= expandDepth }
        collapsedContent={ collapsedContent }>

         <span className="brace-open object">{ braceOpen }</span>
          {
            !isRef ? null : <JumpToPathSection />
          }
          <span className="inner-object">
            {
              <table className="model"><tbody>
              {
                !description ? null : <tr className="description">
                    <td>description:</td>
                    <td>
                      <Markdown source={ description } />
                    </td>
                  </tr>
              }
              {
                !deprecated ? null :
                  <tr className={"property"}>
                    <td>
                      deprecated:
                    </td>
                    <td>
                      true
                    </td>
                  </tr>
               
              }
              {
                !(properties && properties.size) ? null : properties.entrySeq().filter(
                    ([, value]) => {
                      return (!value.get("readOnly") || includeReadOnly) &&
                        (!value.get("writeOnly") || includeWriteOnly)
                    }
                ).map(
                    ([key, value]) => {
                      let isDeprecated = isOAS3() && value.get("deprecated")
                      let isRequired = List.isList(requiredProperties) && requiredProperties.contains(key)

                      let classNames = ["property-row"]

                      if (isDeprecated) {
                        classNames.push("deprecated")
                      }

                      if (isRequired) {
                        classNames.push("required")
                      }

                      return (<tr key={key} className={classNames.join(" ")}>
                        <td>
                          { key }{ isRequired && <span className="star">*</span> }
                        </td>
                        <td>
                          <Model key={ `object-${name}-${key}_${value}` } { ...otherProps }
                                 required={ isRequired }
                                 getComponent={ getComponent }
                                 specPath={specPath.push("properties", key)}
                                 getConfigs={ getConfigs }
                                 schema={ value }
                                 depth={ depth + 1 } />
                        </td>
                        <td>{semantics && contestualizza(key, semantics)}</td>
                      </tr>)
                    }).toArray()
              }
              {
                // empty row befor extensions...
                !showExtensions ? null : <tr><td>&nbsp;</td></tr>
              }
              {
                !showExtensions ? null :
                  schema.entrySeq().map(
                    ([key, value]) => {
                      if(key.slice(0,2) !== "x-") {
                        return
                      }

                      const normalizedValue = !value ? null : value.toJS ? value.toJS() : value

                      return (<tr key={key} className="extension">
                        <td>
                          { key }
                        </td>
                        <td>
                          { JSON.stringify(normalizedValue) }
                        </td>
                      </tr>)
                    }).toArray()
              }
              {
                !additionalProperties || !additionalProperties.size ? null
                  : <tr>
                    <td>{ "< * >:" }</td>
                    <td>
                      <Model { ...otherProps } required={ false }
                             getComponent={ getComponent }
                             specPath={specPath.push("additionalProperties")}
                             getConfigs={ getConfigs }
                             schema={ additionalProperties }
                             depth={ depth + 1 } />
                    </td>
                  </tr>
              }
              {
                !anyOf ? null
                  : <tr>
                    <td>{ "anyOf ->" }</td>
                    <td>
                      {anyOf.map((schema, k) => {
                        return <div key={k}><Model { ...otherProps } required={ false }
                                 getComponent={ getComponent }
                                 specPath={specPath.push("anyOf", k)}
                                 getConfigs={ getConfigs }
                                 schema={ schema }
                                 depth={ depth + 1 } /></div>
                      })}
                    </td>
                  </tr>
              }
              {
                !oneOf ? null
                  : <tr>
                    <td>{ "oneOf ->" }</td>
                    <td>
                      {oneOf.map((schema, k) => {
                        return <div key={k}><Model { ...otherProps } required={ false }
                                 getComponent={ getComponent }
                                 specPath={specPath.push("oneOf", k)}
                                 getConfigs={ getConfigs }
                                 schema={ schema }
                                 depth={ depth + 1 } /></div>
                      })}
                    </td>
                  </tr>
              }
              {
                !not ? null
                  : <tr>
                    <td>{ "not ->" }</td>
                    <td>
                      <div>
                        <Model { ...otherProps }
                               required={ false }
                               getComponent={ getComponent }
                               specPath={specPath.push("not")}
                               getConfigs={ getConfigs }
                               schema={ not }
                               depth={ depth + 1 } />
                      </div>
                    </td>
                  </tr>
              }
              </tbody></table>
          }
        </span>
        <span className="brace-close">{ braceClose }</span>
      </ModelCollapse>
      {
        infoProperties.size ? infoProperties.entrySeq().map( ( [ key, v ] ) => <Property key={`${key}-${v}`} propKey={ key } propVal={ v } propClass={ propClass } />) : null
      }
      {
        example &&
         <div>canonized: <pre>
           {this.state && this.state.canonized}
           </pre>
          </div>
      }
      <hr/>
          <div className="model">JSON-LD Context
    <pre>{ semantics && JSON.stringify(semantics, null, 2) || "{}"}</pre>
    </div>
    </span>
  }
}
