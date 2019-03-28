import React from "react"
import PropTypes from "prop-types"

export default class AuthError extends React.Component {

  static propTypes = {
    error: PropTypes.object.isRequired
  }

  render() {
    let { error } = this.props

    let level = error.get("level")
    let message = error.get("message")
    let source = error.get("source")

    return (
      <div className="errors" style={{ backgroundColor: "#ffeeee", color: "red" }}>
        <b style={{ textTransform: "capitalize" }} >{ source } { level } </b>
        <span>{ message }</span>
      </div>
    )
  }
}
