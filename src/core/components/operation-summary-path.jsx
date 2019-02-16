import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable } from "immutable"
import { createDeepLinkPath } from "core/utils"
import ImPropTypes from "react-immutable-proptypes"

export default class OperationSummaryPath extends PureComponent{

  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  onCopyCapture = (e) => {
    // strips injected zero-width spaces (`\u200b`) from copied content
    e.clipboardData.setData("text/plain", this.props.operationProps.get("path"))
    e.preventDefault()
  }

  render(){
    let {
      getComponent,
      operationProps,
    } = this.props


    let {
      deprecated,
      isShown,
      path,
      tag,
      operationId,
      isDeepLinkingEnabled,
    } = operationProps.toJS()

    const DeepLink = getComponent( "DeepLink" )

    return(
      <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" } 
        onCopyCapture={this.onCopyCapture}
        data-path={path}>
        <DeepLink
            enabled={isDeepLinkingEnabled}
            isShown={isShown}
            path={createDeepLinkPath(`${tag}/${operationId}`)}
            text={path.replace(/\//g, "\u200b/")} />
      </span>

    )
  }
}
