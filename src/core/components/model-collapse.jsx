import React, { Component } from "react"
import PropTypes from "prop-types"

export default class ModelCollapse extends Component {
  static propTypes = {
    collapsedContent: PropTypes.any,
    expanded: PropTypes.bool,
    children: PropTypes.any,
    title: PropTypes.element,
    modelName: PropTypes.string,
    onToggle: PropTypes.func
  }

  static defaultProps = {
    collapsedContent: "{...}",
    expanded: false,
    title: null,
    onToggle: () => {}
  }

  constructor(props, context) {
    super(props, context)

    let { expanded, collapsedContent } = this.props

    this.state = {
      expanded : expanded,
      collapsedContent: collapsedContent || ModelCollapse.defaultProps.collapsedContent
    }
  }

  componentWillReceiveProps(nextProps){

    if(this.props.expanded!= nextProps.expanded){
        this.setState({expanded: nextProps.expanded})
    }

  }

  toggleCollapsed=()=>{


    if(this.props.onToggle){
      this.props.onToggle(this.props.modelName,!this.state.expanded)
    }

    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const {title} = this.props
    return (
      <span>
        { title && <span onClick={this.toggleCollapsed} style={{ "cursor": "pointer" }}>{title}</span> }
        <span onClick={ this.toggleCollapsed } style={{ "cursor": "pointer" }}>
          <span className={ "model-toggle" + ( this.state.expanded ? "" : " collapsed" ) }></span>
        </span>
        { this.state.expanded ? this.props.children :this.state.collapsedContent }
      </span>
    )
  }
}
