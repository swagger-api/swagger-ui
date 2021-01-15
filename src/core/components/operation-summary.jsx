import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import toString from "lodash/toString"


export default class OperationSummary extends PureComponent {

  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    toggleShown: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
  }

  static defaultProps = {
    operationProps: null,
    specPath: List(),
    summary: ""
  }

  render() {

    let {
      toggleShown,
      getComponent,
      authActions,
      authSelectors,
      operationProps,
      specPath,
    } = this.props

    let {
      summary,
      isAuthorized,
      method,
      op,
      showSummary,
      operationId,
      originalOperationId,
      displayOperationId,
    } = operationProps.toJS()

    let {
      summary: resolvedSummary,
    } = op

    let security = operationProps.get("security")

    const AuthorizeOperationBtn = getComponent("authorizeOperationBtn")
    const OperationSummaryMethod = getComponent("OperationSummaryMethod")
    const OperationSummaryPath = getComponent("OperationSummaryPath")
    const JumpToPath = getComponent("JumpToPath", true)

    const hasSecurity = security && !!security.count()
    const securityIsOptional = hasSecurity && security.size === 1 && security.first().isEmpty()
    const allowAnonymous = !hasSecurity || securityIsOptional
    return (
      <div className={`opblock-summary opblock-summary-${method}`} onClick={toggleShown} >
        <OperationSummaryMethod method={method} />
        <OperationSummaryPath getComponent={getComponent} operationProps={operationProps} specPath={specPath} />

        {!showSummary ? null :
          <div className="opblock-summary-description">
            {toString(resolvedSummary || summary)}
          </div>
        }

        {displayOperationId && (originalOperationId || operationId) ? <span className="opblock-summary-operation-id">{originalOperationId || operationId}</span> : null}

        {
          allowAnonymous ? null :
            <AuthorizeOperationBtn
              isAuthorized={isAuthorized}
              onClick={() => {
                const applicableDefinitions = authSelectors.definitionsForRequirements(security)
                authActions.showDefinitions(applicableDefinitions)
              }}
            />
        }
        <JumpToPath path={specPath} />{/* TODO: use wrapComponents here, swagger-ui doesn't care about jumpToPath */}
      </div>
    )

  }
}
