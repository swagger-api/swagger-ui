import React, { Component, PropTypes } from "react"
import { highlight } from "core/utils"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  componentDidMount() {
    highlight(this.refs.el)
  }

  componentDidUpdate() {
    highlight(this.refs.el)
  }

  render () {
    let { value, className } = this.props
    className = className || ""

    return <pre ref="el" className={className + " microlight"}>{ value }</pre>
  }
}
