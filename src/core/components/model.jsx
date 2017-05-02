import React, { Component, PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"
import { List } from "immutable"
const braceOpen = "{"
const braceClose = "}"

const propStyle = { color: "#999", fontStyle: "italic" }

const EnumModel = ({ value }) => {
  let collapsedContent = <span>Array [ { value.count() } ]</span>
  return <span className="prop-enum">
    Enum:<br />
    <Collapse collapsedContent={ collapsedContent }>
      [ { value.join(", ") } ]
    </Collapse>
  </span>
}

EnumModel.propTypes = {
  value: ImPropTypes.iterable
}

class ObjectModel extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    name: PropTypes.string,
    isRef: PropTypes.bool,
    expandDepth: PropTypes.number,
    depth: PropTypes.number
  }

  render(){
    let { schema, name, isRef, getComponent, depth, ...props } = this.props
    let { expandDepth } = this.props
    const JumpToPath = getComponent("JumpToPath", true)
    let description = schema.get("description")
    let properties = schema.get("properties")
    let additionalProperties = schema.get("additionalProperties")
    let title = schema.get("title") || name
    let required = schema.get("required")
    const JumpToPathSection = ({ name }) => <span className="model-jump-to-path"><JumpToPath path={`definitions.${name}`} /></span>
  let collapsedContent = (<span>
      <span>{ braceOpen }</span>...<span>{ braceClose }</span>
      {
        isRef ? <JumpToPathSection name={ name }/> : ""
      }
    </span>)

    return <span className="model">
      {
        title && <span className="model-title">
          { isRef && schema.get("$$ref") && <span className="model-hint">{ schema.get("$$ref") }</span> }
          <span className="model-title__text">{ title }</span>
        </span>
      }
      <Collapse collapsed={ depth > expandDepth } collapsedContent={ collapsedContent }>
         <span className="brace-open object">{ braceOpen }</span>
          {
            !isRef ? null : <JumpToPathSection name={ name }/>
          }
          <span className="inner-object">
            {
              <table className="model" style={{ marginLeft: "2em" }}><tbody>
              {
                !description ? null : <tr style={{ color: "#999", fontStyle: "italic" }}>
                    <td>description:</td>
                    <td>{ description }</td>
                  </tr>
              }
              {
                !(properties && properties.size) ? null : properties.entrySeq().map(
                    ([key, value]) => {
                      let isRequired = List.isList(required) && required.contains(key)
                      let propertyStyle = { verticalAlign: "top", paddingRight: "0.2em" }
                      if ( isRequired ) {
                        propertyStyle.fontWeight = "bold"
                      }

                      return (<tr key={key}>
                        <td style={ propertyStyle }>{ key }:</td>
                        <td style={{ verticalAlign: "top" }}>
                          <Model key={ `object-${name}-${key}_${value}` } { ...props }
                                 required={ isRequired }
                                 getComponent={ getComponent }
                                 schema={ value }
                                 depth={ depth + 1 } />
                        </td>
                      </tr>)
                    }).toArray()
              }
              {
                !additionalProperties || !additionalProperties.size ? null
                  : <tr>
                    <td>{ "< * >:" }</td>
                    <td>
                      <Model { ...props } required={ false }
                             getComponent={ getComponent }
                             schema={ additionalProperties }
                             depth={ depth + 1 } />
                    </td>
                  </tr>
              }
              </tbody></table>
          }
        </span>
        <span className="brace-close">{ braceClose }</span>
      </Collapse>
    </span>
  }
}

class Primitive extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    required: PropTypes.bool
  }

  render(){
    let { schema, required } = this.props

    if(!schema || !schema.get) {
      // don't render if schema isn't correctly formed
      return <div></div>
    }

    let type = schema.get("type")
    let format = schema.get("format")
    let xml = schema.get("xml")
    let enumArray = schema.get("enum")
    let properties = schema.filter( ( v, key) => ["enum", "type", "format", "$$ref"].indexOf(key) === -1 )
    let style = required ? { fontWeight: "bold" } : {}

    return <span className="prop">
      <span className="prop-type" style={ style }>{ type }</span> { required && <span style={{ color: "red" }}>*</span>}
      { format && <span className="prop-format">(${format})</span>}
      {
        properties.size ? properties.entrySeq().map( ( [ key, v ] ) => <span key={`${key}-${v}`} style={ propStyle }>
          <br />{ key !== "description" && key + ": " }{ String(v) }</span>)
          : null
      }
      {
        xml && xml.size ? (<span><br /><span style={ propStyle }>xml:</span>
          {
            xml.entrySeq().map( ( [ key, v ] ) => <span key={`${key}-${v}`} style={ propStyle }><br/>&nbsp;&nbsp;&nbsp;{key}: { String(v) }</span>).toArray()
          }
        </span>): null
      }
      {
        enumArray && <EnumModel value={ enumArray } />
      }
    </span>
  }
}

class ArrayModel extends Component {
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
    let { required, schema, depth, expandDepth } = this.props
    let items = schema.get("items")
    let properties = schema.filter( ( v, key) => ["type", "items", "$$ref"].indexOf(key) === -1 )

    return <span className="model">
      <span className="model-title">
        <span className="model-title__text">{ schema.get("title") }</span>
      </span>
      <Collapse collapsed={ depth > expandDepth } collapsedContent="[...]">
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
      </Collapse>
      { required && <span style={{ color: "red" }}>*</span>}
    </span>
  }
}


class Model extends Component {
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
  }

  getRefSchema =( model )=> {
    let { specSelectors } = this.props

    return specSelectors.findDefinition(model)
  }

  render () {
    let { schema, required, name, isRef } = this.props
    let $$ref = schema && schema.get("$$ref")
    let modelName = $$ref && this.getModelName( $$ref )
    let modelSchema, type

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
        return <ObjectModel className="object" { ...this.props } schema={ modelSchema }
                                              name={ modelName || name }
                                              isRef={ isRef!== undefined ? isRef : !!$$ref }/>
      case "array":
        return <ArrayModel className="array" { ...this.props } schema={ modelSchema } required={ required } />
      case "string":
      case "number":
      case "integer":
      case "boolean":
      default:
        return <Primitive schema={ modelSchema } required={ required }/>
    }
  }
}


export default class ModelComponent extends Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    name: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    expandDepth: PropTypes.number
  }

  render(){
    return <div className="model-box">
      <Model { ...this.props } depth={ 1 } expandDepth={ this.props.expandDepth || 0 }/>
    </div>
  }
}

class Collapse extends Component {
  static propTypes = {
    collapsedContent: PropTypes.any,
    collapsed: PropTypes.bool,
    children: PropTypes.any
  }

  static defaultProps = {
    collapsedContent: "{...}",
    collapsed: true,
  }

  constructor(props, context) {
    super(props, context)

    let { collapsed, collapsedContent } = this.props

    this.state = {
      collapsed: collapsed !== undefined ? collapsed : Collapse.defaultProps.collapsed,
      collapsedContent: collapsedContent || Collapse.defaultProps.collapsedContent
    }
  }

  toggleCollapsed=()=>{
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render () {
    return (<span>
      <span onClick={ this.toggleCollapsed } style={{ "cursor": "pointer" }}>
        <span className={ "model-toggle" + ( this.state.collapsed ? " collapsed" : "" ) }></span>
      </span>
      { this.state.collapsed ? this.state.collapsedContent : this.props.children }
    </span>)
  }
}
