import React from "react"
import PropTypes from "prop-types"

export default class ModelExample extends React.Component {
  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    example: PropTypes.any.isRequired,
    examples: PropTypes.array,
    isExecute: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      activeTab: "example"
    }
  }

  activeTab =( e ) => {
    let { target : { dataset : { name } } } = e

    this.setState({
      activeTab: name
    })
  }

  render() {
    let { getComponent, specSelectors, schema, example, isExecute, examples } = this.props
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

        {examples && examples.map( (item, key) => {
          return <li key={"examples_key_" + key} className={"tabitem" + ( isExecute || this.state.activeTab === "example_" + item.name ? " active" : "") }>
            <a className="tablinks" data-name={"example_" + item.name} onClick={ this.activeTab }>Example: {item.name}</a>
          </li>
        } )}

        { schema ? <li className={ "tabitem" + ( !isExecute && this.state.activeTab === "model" ? " active" : "") }>
          <a className={ "tablinks" + ( isExecute ? " inactive" : "" )} data-name="model" onClick={ this.activeTab }>Model</a>
        </li> : null }
      </ul>
      <div>
        {
          (isExecute || this.state.activeTab === "example") && example
        }
        {
          examples && examples.map( (item) => {
            return ((isExecute || this.state.activeTab === "example_" + item.name) && (
              <div key={"example_div_key_" + item.name} className="example-wrapper">
                <h4 className="example-summary">{item.summary}</h4>
                {item.description && <div className="example-description">
                  <Markdown source={item.description} />
                </div>
                }
                {item.value && <HighlightCode value={item.value} />}
                {item.externalValue && <ExternalValue location={item.externalValue} getComponent={ getComponent } />}
              </div>
            ));
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
