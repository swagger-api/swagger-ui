import React, { Component, } from "react"
import PropTypes from "prop-types"
import { List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

const braceOpen = "{"
const braceClose = "}"

export default class ObjectModel extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    isRef: PropTypes.bool,
    expandDepth: PropTypes.number,
    depth: PropTypes.number,
    specPath: ImPropTypes.list.isRequired
  }

  render(){
    let { schema, name, isRef, getComponent, getConfigs, depth, onToggle, expanded, specPath, ...otherProps } = this.props
    let { specSelectors,expandDepth } = otherProps
    const { isOAS3 } = specSelectors

    if(!schema) {
      return null
    }

    const { showExtensions } = getConfigs()

    let description = schema.get("description")
    let properties = schema.get("properties")
    let additionalProperties = schema.get("additionalProperties")
    let title = schema.get("title") || name
    let requiredProperties = schema.get("required")

    const JumpToPath = getComponent("JumpToPath", true)
    const Markdown = getComponent("Markdown")
    const Model = getComponent("Model")
    const ModelCollapse = getComponent("ModelCollapse")

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

    return <span className="model">
      <ModelCollapse
        collapsedContent={ collapsedContent }
        expanded={ expanded ? true : depth <= expandDepth }
        modelName={name}
        onToggle = {onToggle}
        title={titleEl}>

        <span className="brace-open object">{ braceOpen }</span>
        {
          !isRef ? null : <JumpToPathSection />
        }
        <span className="inner-object">
          {
            <table className="model"><tbody>
              {
                !description ? null : <tr style={{ color: "#999", fontStyle: "italic" }}>
                  <td>description:</td>
                  <td>
                    <Markdown source={ description } />
                  </td>
                </tr>
              }
              {
                !(properties && properties.size) ? null : properties.entrySeq().map(
                  ([key, value]) => {
                    let isDeprecated = isOAS3() && value.get("deprecated")
                    let isRequired = List.isList(requiredProperties) && requiredProperties.contains(key)
                    let propertyStyle = { verticalAlign: "top", paddingRight: "0.2em" }

                    if ( isRequired ) {
                      propertyStyle.fontWeight = "bold"
                    }

                    return (<tr key={key}
                      className={isDeprecated && "deprecated"}>
                      <td style={ propertyStyle }>
                        { key }{ isRequired && <span style={{ color: "red" }}>*</span> }
                      </td>
                      <td style={{ verticalAlign: "top" }}>
                        <Model key={ `object-${name}-${key}_${value}` }
                          { ...otherProps }
                          depth={ depth + 1 }
                          getComponent={ getComponent }
                          getConfigs={ getConfigs }
                          required={ isRequired }
                          schema={ value }
                          specPath={specPath.push("properties", key)} />
                      </td>
                    </tr>)
                  }).toArray()
              }
              {
                // empty row befor extensions...
                !showExtensions ? null : <tr>&nbsp;</tr>
              }
              {
                !showExtensions ? null :
                  schema.entrySeq().map(
                    ([key, value]) => {
                      if(key.slice(0,2) !== "x-") {
                        return
                      }

                      const normalizedValue = !value ? null : value.toJS ? value.toJS() : value

                      return (<tr key={key}
                        style={{ color: "#777" }}>
                        <td>
                          { key }
                        </td>
                        <td style={{ verticalAlign: "top" }}>
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
                      <Model { ...otherProps }
                        depth={ depth + 1 }
                        getComponent={ getComponent }
                        getConfigs={ getConfigs }
                        required={ false }
                        schema={ additionalProperties }
                        specPath={specPath.push("additionalProperties")} />
                    </td>
                  </tr>
              }
              {
                !anyOf ? null
                  : <tr>
                    <td>{ "anyOf ->" }</td>
                    <td>
                      {anyOf.map((schema, k) => {
                        return <div key={k}><Model { ...otherProps }
                          depth={ depth + 1 }
                          getComponent={ getComponent }
                          getConfigs={ getConfigs }
                          required={ false }
                          schema={ schema }
                          specPath={specPath.push("anyOf", k)} /></div>
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
                        return <div key={k}><Model { ...otherProps }
                          depth={ depth + 1 }
                          getComponent={ getComponent }
                          getConfigs={ getConfigs }
                          required={ false }
                          schema={ schema }
                          specPath={specPath.push("oneOf", k)} /></div>
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
                          depth={ depth + 1 }
                          getComponent={ getComponent }
                          getConfigs={ getConfigs }
                          required={ false }
                          schema={ not }
                          specPath={specPath.push("not")} />
                      </div>
                    </td>
                  </tr>
              }
            </tbody></table>
          }
        </span>
        <span className="brace-close">{ braceClose }</span>
      </ModelCollapse>
    </span>
  }
}
