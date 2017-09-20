import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { helpers } from "swagger-client"
import { Iterable, fromJS } from "immutable"

const { opId } = helpers

export default class OperationContainer extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tryItOutEnabled: false,
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
    isShownKey: PropTypes.instanceOf(Iterable).isRequired,
    jumpToKey: PropTypes.string.isRequired,
    allowTryItOut: PropTypes.bool,
    displayOperationId: PropTypes.bool,
    displayRequestDuration: PropTypes.bool,
    response: PropTypes.instanceOf(Iterable),
    request: PropTypes.instanceOf(Iterable),
    isDeepLinkingEnabled: PropTypes.bool.isRequired,

    getComponent: PropTypes.func.isRequired,
    authActions: PropTypes.object,
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
    const { docExpansion, deepLinking, displayOperationId, displayRequestDuration } = getConfigs()
    const showSummary = layoutSelectors.showSummary()
    const operationId = op.getIn(["operation", "operationId"]) || op.getIn(["operation", "__originalOperationId"]) || opId(op.get("operation"), props.path, props.method) || op.get("id")
    const isShownKey = fromJS(["operations", props.tag, operationId])
    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    return {
      operationId,
      isDeepLinkingEnabled,
      isShownKey,
      showSummary,
      displayOperationId,
      displayRequestDuration,
      isShown: layoutSelectors.isShown(isShownKey, docExpansion === "full" ),
      jumpToKey: `paths.${props.path}.${props.method}`,
      allowTryItOut: props.specSelectors.allowTryItOutFor(props.path, props.method),
      response: props.specSelectors.responseFor(props.path, props.method),
      request: props.specSelectors.requestFor(props.path, props.method)
    }
  }

  componentWillReceiveProps(nextProps) {
    const defaultContentType = "application/json"
    let { specActions, path, method, op } = nextProps
    let operation = op.get("operation")
    let producesValue = operation.get("produces_value")
    let produces = operation.get("produces")
    let consumes = operation.get("consumes")
    let consumesValue = operation.get("consumes_value")

    if(nextProps.response !== this.props.response) {
      this.setState({ executeInProgress: false })
    }

    if (producesValue === undefined) {
      producesValue = produces && produces.size ? produces.first() : defaultContentType
      specActions.changeProducesValue([path, method], producesValue)
    }

    if (consumesValue === undefined) {
      consumesValue = consumes && consumes.size ? consumes.first() : defaultContentType
      specActions.changeConsumesValue([path, method], consumesValue)
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.tryItOutEnabled !== nextState.tryItOutEnabled
      || this.state.executeInProgress !== nextState.executeInProgress
      || this.props.op !== nextProps.op
      || this.props.tag !== nextProps.tag
      || this.props.path !== nextProps.path
      || this.props.method !== nextProps.method
      || this.props.operationId !== nextProps.operationId
      || this.props.showSummary !== nextProps.showSummary
      || this.props.isShown !== nextProps.isShown
      || this.props.isShownKey !== nextProps.isShownKey
      || this.props.jumpToKey !== nextProps.jumpToKey
      || this.props.allowTryItOut !== nextProps.allowTryItOut
      || this.props.displayOperationId !== nextProps.displayOperationId
      || this.props.displayRequestDuration !== nextProps.displayRequestDuration
      || this.props.response !== nextProps.response
      || this.props.request !== nextProps.request
      || this.props.isDeepLinkingEnabled !== nextProps.isDeepLinkingEnabled
  }

  toggleShown =() => {
    let { layoutActions, isShownKey, isShown } = this.props
    layoutActions.show(isShownKey, !isShown)
  }

  onTryoutClick =() => {
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
  }

  onCancelClick =() => {
    let { specActions, path, method } = this.props
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
    specActions.clearValidateParams([path, method])
  }

  onExecute = () => {
    this.setState({ executeInProgress: true })
  }

  render() {
    let {
      op,
      tag,
      path,
      method,
      operationId,
      showSummary,
      isShown,
      isShownKey,
      jumpToKey,
      allowTryItOut,
      response,
      request,
      displayOperationId,
      displayRequestDuration,
      isDeepLinkingEnabled,
      specSelectors,
      specActions,
      getComponent,
      getConfigs,
      layoutSelectors,
      layoutActions,
      authActions,
      authSelectors,
      fn 
    } = this.props

    const Operation = getComponent( "operation" )

    const operationProps = fromJS({
      op,
      tag,
      path,
      method,
      operationId,
      showSummary,
      isShown,
      isShownKey,
      jumpToKey,
      allowTryItOut,
      response,
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

        toggleShown={this.toggleShown}
        onTryoutClick={this.onTryoutClick}
        onCancelClick={this.onCancelClick}
        onExecute={this.onExecute}

        specActions={ specActions }
        specSelectors={ specSelectors }
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
