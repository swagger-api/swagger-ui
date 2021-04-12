import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"

export default class ModelCollapse extends Component {
  static propTypes = {
    collapsedContent: PropTypes.any,
    expanded: PropTypes.bool,
    children: PropTypes.any,
    title: PropTypes.element,
    modelName: PropTypes.string,
    classes: PropTypes.string,
    onToggle: PropTypes.func,
    hideSelfOnExpand: PropTypes.bool,
    layoutActions: PropTypes.object,
    layoutSelectors: PropTypes.object.isRequired,
    specPath: ImPropTypes.list.isRequired,
  }

  static defaultProps = {
    collapsedContent: "{...}",
    expanded: false,
    title: null,
    onToggle: () => {},
    hideSelfOnExpand: false,
    specPath: Im.List([]),
  }

  constructor(props, context) {
    super(props, context)

    let { expanded, collapsedContent } = this.props

    this.state = {
      expanded : expanded,
      collapsedContent: collapsedContent || ModelCollapse.defaultProps.collapsedContent
    }
  }

  componentDidMount() {
    const { hideSelfOnExpand, expanded, modelName } = this.props
    if(hideSelfOnExpand && expanded) {
      // We just mounted pre-expanded, and we won't be going back..
      // So let's give our parent an `onToggle` call..
      // Since otherwise it will never be called.
      this.props.onToggle(modelName, expanded)
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.expanded !== nextProps.expanded){
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

  onLoad = (ref) => {
    if (ref && this.props.layoutSelectors) {
      const scrollToKey = this.props.layoutSelectors.getScrollToKey()

      if( Im.is(scrollToKey, this.props.specPath) ) this.toggleCollapsed()
      this.props.layoutActions.readyToScroll(this.props.specPath, ref.parentElement)
    }
  }

  render () {
    const { title, classes } = this.props

    if(this.state.expanded ) {
      if(this.props.hideSelfOnExpand) {
        return <span className={classes || ""}>
          {this.props.children}
        </span>
      }
    }

    return (
      <span className={classes || ""} ref={this.onLoad}>
        <button aria-expanded={this.state.expanded} className="model-box-control" onClick={this.toggleCollapsed}>
          { title && <span className="pointer">{title}</span> }
          <span className={ "model-toggle" + ( this.state.expanded ? "" : " collapsed" ) }></span>
          { !this.state.expanded && <span>{this.state.collapsedContent}</span> }
        </button>

        { this.state.expanded && this.props.children }
      </span>
    )
  }
}
