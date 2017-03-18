import React, { Component, PropTypes } from "react"
import { fromJS } from "immutable"

export default class Execute extends Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    operation: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    method: PropTypes.string.isRequired,
    onExecute: PropTypes.func
  }

  onClick=()=>{
    let { specSelectors, specActions, operation, path, method } = this.props

    specActions.validateParams( [path, method] )

    if ( specSelectors.validateBeforeExecute([path, method]) ) {
      if(this.props.onExecute) {
        this.props.onExecute()
      }
      specActions.execute( { operation, path, method } )
    }
  }

  onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  render(){
    let { getComponent, operation, specActions, path, method } = this.props
    const ContentType = getComponent( "contentType" )

    return (
        <button className="btn execute opblock-control__btn" onClick={ this.onClick }>
          Execute
        </button>
    )
  }
}
