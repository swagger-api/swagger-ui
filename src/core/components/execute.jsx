import React, { Component } from "react"
import PropTypes from "prop-types"

export default class Execute extends Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    operation: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
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
    } else {
      // deferred by 40ms, to give element class change time to settle.
      specActions.clearValidateParams( [path, method] )
      setTimeout(() => {
        specActions.validateParams([path, method])
      }, 40)
    }
  }

  onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  render(){
    return (
        <button className="btn execute opblock-control__btn" onClick={ this.onClick }>
          Execute
        </button>
    )
  }
}
