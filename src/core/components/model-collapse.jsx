import React, { Component, PropTypes } from "react"

export default class ModelCollapse extends Component {
  static propTypes = {
    collapsedContent: PropTypes.any,
    collapsed: PropTypes.bool,
    children: PropTypes.any
  }

  static defaultProps = {
    collapsedContent: "{...}",
    collapsed: true,
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
    return (<span>
      <span onClick={ this.toggleCollapsed } style={{ "cursor": "pointer" }}>
        <span className={ "model-toggle" + ( this.state.collapsed ? " collapsed" : "" ) }></span>
      </span>
      { this.state.collapsed ? this.state.collapsedContent : this.props.children }
    </span>)
  }
}