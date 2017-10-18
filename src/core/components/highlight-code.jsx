import React, { Component } from "react"
import PropTypes from "prop-types"
import { highlight } from "core/utils"
import Theme from "syntux/style/androidstudio"

const XML = require("syntux/xml")
const JS = require("syntux/json")

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

    try {
      JSON.parse(value)
      return <div>
        {Theme}
        <JS ref={this.initializeComponent} className={className + " microlight"}>{value}</JS>
      </div>

    } catch (e) {
      return <div>
        {Theme}
        <XML ref={this.initializeComponent} className={className + " microlight"}>{value}</XML>
      </div>
    }
  }
}
