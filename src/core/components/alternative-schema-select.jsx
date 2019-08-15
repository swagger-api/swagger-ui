import React, { Component } from "react"
import PropTypes from "prop-types"

export default class AlternativeSchemaSelect extends Component {
  
  static propTypes = {
    alternativeSchemaSelections: PropTypes.object.isRequired,
    onSelectionChanged: PropTypes.func.isRequired,
    isManualMode: PropTypes.bool.isRequired, 
    alternativeSchemas: PropTypes.object.isRequired    
  }

  constructor(props) {
    super(props)
    this.onModeChange = this.onModeChange.bind(this)
    this.oneOfChange = this.oneOfChange.bind(this)
    this.selectOneOfComponent = this.selectOneOfComponent.bind(this)
    this.state = {
      isManualMode: false,
      alternativeSchemaSelections: {}
    }
  }

  onModeChange(e) {
    var { onSelectionChanged } = this.props
    var { alternativeSchemaSelections } = this.state

    onSelectionChanged( (e.target.dataset.name === "MANUAL" ? alternativeSchemaSelections :{}))
    this.setState({isManualMode: e.target.dataset.name === "MANUAL"})
  }

  oneOfChange(e, id) {
    var { onSelectionChanged } = this.props
    var { alternativeSchemaSelections } = this.state

    alternativeSchemaSelections[id] = parseInt(e.target.value)

    onSelectionChanged( alternativeSchemaSelections )
  }

  selectOneOfComponent(attributePath, options, defaultOption, type) {
    if (options) {
      return (
        <div key={"OneOf" + attributePath} style={{ padding: "0 0 10px 0" }} className={"content-type-wrapper "}>
          <div>
            <small htmlFor={attributePath} className={"response-control-alternative-examples__title"}>Choose {type} {attributePath}:</small>
          </div>
          <select
            className="content-type"
            name={attributePath}
            value={defaultOption}
            onChange={(e) => this.oneOfChange(e, attributePath)}
          >
          <option key={"empty"} value={"-1"}>{"<empty>"}</option>
            {Object.keys(options).map((key, index) => {
              return <option key={index + key} value={index}>{options[key]}</option>
            })}
          </select>
        </div>
      )
    }
    return null
  }

  render() {

    const { alternativeSchemas } = this.props
    const { isManualMode } = this.state

    var oneOfComponents = []
    if (isManualMode && alternativeSchemas) {
      alternativeSchemas.map((attribute) => {
        oneOfComponents.push(this.selectOneOfComponent(attribute.key, attribute.options, attribute.selectedIndex, attribute.type))
        return true
      })
    }
    return (
      <div>
        <ul className="response-control-alternative-examples tab">Example Value with:
              <li className={"tabitem" + (isManualMode ? "" : " active")}>
            <a className="tablinks" data-name="FIRST" onClick={this.onModeChange} >first `oneOf` item</a>
          </li>
          <li className={"tabitem" + (isManualMode ? " active" : "")}>
            <a className="tablinks" data-name="MANUAL" onClick={this.onModeChange} >manually selected `oneOf` item</a>
          </li>
        </ul>
        {oneOfComponents}
      </div>
    )
  }
}