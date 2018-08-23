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
      <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" } >
              <DeepLink
                  enabled={isDeepLinkingEnabled}
                  isShown={isShown}
                  path={createDeepLinkPath(`${tag}/${operationId}`)}
                  text={path} />
              </span>

    )
  }
}
