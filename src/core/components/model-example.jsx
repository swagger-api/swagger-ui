import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object,
    example: PropTypes.any,
    examples: ImPropTypes.orderedMap,
    isExecute: PropTypes.bool,
    getConfigs: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)

    let { getConfigs } = this.props
    let { defaultModelRendering } = getConfigs()
    if (defaultModelRendering !== "example" && defaultModelRendering !== "model") {
      defaultModelRendering = "example"
    }
    this.state = {
      activeTab: defaultModelRendering
    }
  }

  activeTab =( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name
    })
  }

  formatValue = (value) => {
    if(typeof(value) === "string") {
      return value
    } else {
      return JSON.stringify(value, null, 2)
    }
  }

  render() {
    let { getComponent, specSelectors, schema, example, examples, isExecute, getConfigs } = this.props
    let { defaultModelExpandDepth } = getConfigs()
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")
    const Markdown = getComponent("Markdown")
    const ExternalValue = getComponent("ExternalValue")

    // TODO fetch externalValue and display it on demand
    return <div>
      <ul className="tab">
        <li className={ "tabitem" + ( isExecute || this.state.activeTab === "example" ? " active" : "") }>
          <a className="tablinks" data-name="example" onClick={ this.activeTab }>Example Value</a>
        </li>

        { examples && examples.map( (item, key) => {
          return ( !isExecute && <li key={"examples_key_" + key} className={"tabitem" + ( isExecute || this.state.activeTab === "example_" + key ? " active" : "") }>
            <a className="tablinks" data-name={"example_" + key} onClick={ this.activeTab }>Example: {key}</a>
          </li> )
        } ).toArray()
        }

        { schema ? <li className={ "tabitem" + ( !isExecute && this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>Model</a>
        </li> : null }
      </ul>
      <div>
        {
          (isExecute || this.state.activeTab === "example") && example
        }
        {
          examples && examples.map( (item, key) => {
            return ((!isExecute && this.state.activeTab === "example_" + key) && (
              <div key={"example_div_key_" + key} className="example-wrapper">
                {item.summary && <h6 className="example-summary">{ item.summary }</h6>}
                {item.description && <div className="example-description">
                  <Markdown source={item.description} />
                </div>
                }
                {item.value && <HighlightCode value={ this.formatValue(item.value) } />}
                {item.externalValue && <ExternalValue location={item.externalValue} getComponent={ getComponent } />}
              </div>
            ))
          } ).toArray()
        }
        {
          !isExecute && this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                                          getComponent={ getComponent }
                                                                          specSelectors={ specSelectors }
                                                                          expandDepth={ defaultModelExpandDepth } />
        }
      </div>
    </div>
  }

}
