import React, { Component } from "react"
import PropTypes from "prop-types"
import { fallbackT } from "core/plugins/i18n/fn"

export default class Clear extends Component {

  onClick =() => {
    let { specActions, path, method } = this.props
    specActions.clearResponse( path, method )
    specActions.clearRequest( path, method )
  }

  render(){
    const { t } = this.props
    return (
      <button className="btn btn-clear opblock-control__btn" onClick={ this.onClick }>
        {t("button.clear")}
      </button>
    )
  }

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    t: PropTypes.func,
  }

  static defaultProps = {
    t: fallbackT,
  }
}
