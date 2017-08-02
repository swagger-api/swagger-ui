import React, { Component } from "react"
import PropTypes from "prop-types"

export default class ModelCollapse extends Component {
  static propTypes = {
    collapsedContent: PropTypes.any,
    collapsed: PropTypes.bool,
    children: PropTypes.any,
    title: PropTypes.element
  }

  static defaultProps = {
    collapsedContent: "{...}",
    collapsed: true,
    title: null
  }

  constructor(props, context) {
    super(props, context)

    let { collapsed, collapsedContent } = this.props

    this.state = {
      collapsed: collapsed !== undefined ? collapsed : ModelCollapse.defaultProps.collapsed,
      collapsedContent: collapsedContent || ModelCollapse.defaultProps.collapsedContent
    }
  }

  toggleCollapsed=()=>{
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render () {
    const {title} = this.props
    return (
      <span>
        { title && <span onClick={this.toggleCollapsed} style={{ "cursor": "pointer" }}>{title}</span> }
        <span onClick={ this.toggleCollapsed } style={{ "cursor": "pointer" }}>
          <span className={ "model-toggle" + ( this.state.collapsed ? " collapsed" : "" ) }></span>
        </span>
        { this.state.collapsed ? this.state.collapsedContent : this.props.children }
      </span>
    )
  }
}