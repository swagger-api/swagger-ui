import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { opId } from "swagger-client/es/helpers"
import { Iterable, fromJS, Map } from "immutable"

export default class OperationContainer extends PureComponent {
  constructor(props, context) {
    super(props, context)

    const { tryItOutEnabled } = props.getConfigs()

    this.state = {
      tryItOutEnabled: tryItOutEnabled === true || tryItOutEnabled === "true",
      executeInProgress: false
    }
  }

  static propTypes = {
    op: PropTypes.instanceOf(Iterable).isRequired,
    tag: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    operationId: PropTypes.string.isRequired,
    showSummary: PropTypes.bool.isRequired,
    isShown: PropTypes.bool.isRequired,
    jumpToKey: PropTypes.string.isRequired,
    allowTryItOut: PropTypes.bool,
    displayOperationId: PropTypes.bool,
    isAuthorized: PropTypes.bool,
    displayRequestDuration: PropTypes.bool,
    response: PropTypes.instanceOf(Iterable),
    request: PropTypes.instanceOf(Iterable),
    security: PropTypes.instanceOf(Iterable),
    isDeepLinkingEnabled: PropTypes.bool.isRequired,
    specPath: ImPropTypes.list.isRequired,
    getComponent: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    oas3Actions: PropTypes.object,
    oas3Selectors: PropTypes.object,
    authSelectors: PropTypes.object,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  static defaultProps = {
    showSummary: true,
    response: null,
    allowTryItOut: true,
    displayOperationId: false,
    displayRequestDuration: false
  }

  mapStateToProps(nextState, props) {
    const { op, layoutSelectors, getConfigs } = props
    const { docExpansion, deepLinking, displayOperationId, displayRequestDuration, supportedSubmitMethods } = getConfigs()
    const showSummary = layoutSelectors.showSummary()
    const operationId = op.getIn(["operation", "__originalOperationId"]) || op.getIn(["operation", "operationId"]) || opId(op.get("operation"), props.path, props.method) || op.get("id")
    const isShownKey = ["operations", props.tag, operationId]
    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"
    const allowTryItOut = supportedSubmitMethods.indexOf(props.method) >= 0 && (typeof props.allowTryItOut === "undefined" ?
      props.specSelectors.allowTryItOutFor(props.path, props.method) : props.allowTryItOut)
    const security = op.getIn(["operation", "security"]) || props.specSelectors.security()

    return {
      operationId,
      isDeepLinkingEnabled,
      showSummary,
      displayOperationId,
      displayRequestDuration,
      allowTryItOut,
      security,
      isAuthorized: props.authSelectors.isAuthorized(security),
      isShown: layoutSelectors.isShown(isShownKey, docExpansion === "full" ),
      jumpToKey: `paths.${props.path}.${props.method}`,
      response: props.specSelectors.responseFor(props.path, props.method),
      request: props.specSelectors.requestFor(props.path, props.method)
    }
  }

  componentDidMount() {
    const { isShown } = this.props
    const resolvedSubtree = this.getResolvedSubtree()

    if(isShown && resolvedSubtree === undefined) {
      this.requestResolvedSubtree()
    }
  }

  componentWillReceiveProps(nextProps) {
    const { response, isShown } = nextProps
    const resolvedSubtree = this.getResolvedSubtree()

    if(response !== this.props.response) {
      this.setState({ executeInProgress: false })
    }

    if(isShown && resolvedSubtree === undefined) {
      this.requestResolvedSubtree()
    }
  }

  toggleShown =() => {
    let { layoutActions, tag, operationId, isShown } = this.props
    const resolvedSubtree = this.getResolvedSubtree()
    if(!isShown && resolvedSubtree === undefined) {
      // transitioning from collapsed to expanded
      this.requestResolvedSubtree()
    }
    layoutActions.show(["operations", tag, operationId], !isShown)
  }

  onCancelClick=() => {
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
  }

  onTryoutClick =() => {
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
  }

  onExecute = () => {
    this.setState({ executeInProgress: true })
  }

  getResolvedSubtree = () => {
    const {
      specSelectors,
      path,
      method,
      specPath
    } = this.props

    if(specPath) {
      return specSelectors.specResolvedSubtree(specPath.toJS())
    }

    return specSelectors.specResolvedSubtree(["paths", path, method])
  }

  requestResolvedSubtree = () => {
    const {
      specActions,
      path,
      method,
      specPath
    } = this.props


    if(specPath) {
      return specActions.requestResolvedSubtree(specPath.toJS())
    }

    return specActions.requestResolvedSubtree(["paths", path, method])
  }

  render() {
    let {
      op: unresolvedOp,
      tag,
      path,
      method,
      security,
      isAuthorized,
      operationId,
      showSummary,
      isShown,
      jumpToKey,
      allowTryItOut,
      response,
      request,
      displayOperationId,
      displayRequestDuration,
      isDeepLinkingEnabled,
      specPath,
      specSelectors,
      specActions,
      getComponent,
      getConfigs,
      layoutSelectors,
      layoutActions,
      authActions,
      authSelectors,
      oas3Actions,
      oas3Selectors,
      fn
    } = this.props

    const Operation = getComponent( "operation" )

    const resolvedSubtree = this.getResolvedSubtree() || Map()

    const operationProps = fromJS({
      op: resolvedSubtree,
      tag,
      path,
      summary: unresolvedOp.getIn(["operation", "summary"]) || "",
      deprecated: resolvedSubtree.get("deprecated") || unresolvedOp.getIn(["operation", "deprecated"]) || false,
      method,
      security,
      isAuthorized,
      operationId,
      originalOperationId: resolvedSubtree.getIn(["operation", "__originalOperationId"]),
      showSummary,
      isShown,
      jumpToKey,
      allowTryItOut,
      request,
      displayOperationId,
      displayRequestDuration,
      isDeepLinkingEnabled,
      executeInProgress: this.state.executeInProgress,
      tryItOutEnabled: this.state.tryItOutEnabled
    })

    return (
      <Operation
        operation={operationProps}
        response={response}
        request={request}
        isShown={isShown}

        toggleShown={this.toggleShown}
        onTryoutClick={this.onTryoutClick}
        onCancelClick={this.onCancelClick}
        onExecute={this.onExecute}
        specPath={specPath}

        specActions={ specActions }
        specSelectors={ specSelectors }
        oas3Actions={oas3Actions}
        oas3Selectors={oas3Selectors}
        layoutActions={ layoutActions }
        layoutSelectors={ layoutSelectors }
        authActions={ authActions }
        authSelectors={ authSelectors }
        getComponent={ getComponent }
        getConfigs={ getConfigs }
        fn={fn}
      />
    )
  }

}
