import React from "react"
import PropTypes from "prop-types"
import ObjectInspector from "react-inspector"

export default class Debug extends React.Component {

  constructor() {
    super()
    this.state = {
      jsonDumpOpen: false
    }
    this.toggleJsonDump = (e) => {
      e.preventDefault()
      this.setState({jsonDumpOpen: !this.state.jsonDumpOpen})
    }
  }

  plusOrMinus(bool) {
    return bool ? "-" : "+"
  }

  render() {

    let { getState, getComponent } = this.props

    window.props = this.props

    const Collapse = getComponent("Collapse")

    return (
      <div className="info">
        <h3><a onClick={this.toggleJsonDump}> {this.plusOrMinus(this.state.jsonDumpOpen)} App </a></h3>

        <Collapse isOpened={this.state.jsonDumpOpen} springConfig={{ stiffness: 170, damping: 26 }}>

           <ObjectInspector data={getState().toJS() || {}} name="state" expandPaths={["state"]}/>

        </Collapse>


      </div>
    )
  }

}

Debug.propTypes = {
  getState: PropTypes.func.isRequired,
  getComponent: PropTypes.func.isRequired,
}
