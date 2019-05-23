import React, { Component } from "react"
import PropTypes from "prop-types"

import { Button } from "components/layout-utils"

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
    }
  }

  onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  render(){
    return (
        <Button
          className="sui-btn-group__btn execute opblock-control__btn"
          mod="primary"
          onClick={ this.onClick }
        >
          <span>Execute</span>
        </Button>
    )
  }
}
