import React from "react"
import PropTypes from "prop-types"

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object,
    example: PropTypes.any,
    examples: PropTypes.object,
    isExecute: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    // select first example by default
    let { examples } = props
    let defaultTab = "example"
    if(examples && examples.size > 0) {
      defaultTab = "example_" + examples.keySeq().first()
    }

    this.state = {
      activeTab: defaultTab
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
    let { getComponent, specSelectors, schema, examples, isExecute } = this.props
    const ModelWrapper = getComponent("ModelWrapper")
    const HighlightCode = getComponent("highlightCode")
    const Markdown = getComponent("Markdown")
    const ExternalValue = getComponent("ExternalValue")

    // TODO fetch externalValue and display it on demand
    return <div>
      <ul className="tab">
        { (examples && examples.size > 0) ? examples.map( (item, key) => {
          return <li key={"examples_key_" + key} className={"tabitem" + ( isExecute || this.state.activeTab === "example_" + key ? " active" : "") }>
            <a className="tablinks" data-name={"example_" + key} onClick={ this.activeTab }>Example: {key}</a>
          </li>
        } ) :
          <li className={ "tabitem" + ( isExecute || this.state.activeTab === "example" ? " active" : "") }>
            <a className="tablinks" data-name="example" onClick={ this.activeTab }>Example Value</a>
          </li>
        }

        { schema ? <li className={ "tabitem" + ( !isExecute && this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>Model</a>
        </li> : null }
      </ul>
      <div>
        {
          examples && examples.map( (item, key) => {
            return ((isExecute || this.state.activeTab === "example_" + key) && (
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
          } )
        }
        {
          !isExecute && this.state.activeTab === "model" && <ModelWrapper schema={ schema }
                                                                          getComponent={ getComponent }
                                                                          specSelectors={ specSelectors }
                                                                          expandDepth={ 1 } />
        }
      </div>
    </div>
  }

}
