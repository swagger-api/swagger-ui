import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable } from "immutable"
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
      specPath,
    } = this.props


    let {
      deprecated,
      isShown,
      path,
      tag,
      operationId,
      isDeepLinkingEnabled,
    } = operationProps.toJS()

    let isShownKey = ["operations", tag, operationId]

    const JumpToPath = getComponent("JumpToPath", true)
    const DeepLink = getComponent( "DeepLink" )

    return(
      <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" } >
              <DeepLink
                  enabled={isDeepLinkingEnabled}
                  isShown={isShown}
                  path={`${isShownKey.join("/")}`}
                  text={path} />
                <JumpToPath path={specPath} />{/* TODO: use wrapComponents here, swagger-ui doesn't care about jumpToPath */}
              </span>

    )
  }
}
