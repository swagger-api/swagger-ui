import React, { Component } from "react"
import PropTypes from "prop-types"
import { highlight } from "core/utils"

export default class HighlightCode extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  componentDidMount() {
    highlight(this.el)
  }

  componentDidUpdate() {
    highlight(this.el)
  }

  initializeComponent = (c) => {
    this.el = c
  }

  render () {
    let { value, className } = this.props
    className = className || ""

    return <pre ref={this.initializeComponent} className={className + " microlight"}>{ value }</pre>
  }
}
