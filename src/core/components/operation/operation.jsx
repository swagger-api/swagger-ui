import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { getList } from "core/utils"
import { getExtensions, escapeDeepLinkPath } from "core/utils"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"


export default class Operation extends PureComponent {
  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operation: PropTypes.instanceOf(Iterable).isRequired,
    summary: PropTypes.string,
    response: PropTypes.instanceOf(Iterable),
    request: PropTypes.instanceOf(Iterable),

    toggleShown: PropTypes.func.isRequired,
    onTryoutClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onExecute: PropTypes.func.isRequired,

    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired
  }

  static defaultProps = {
    operation: null,
    response: null,
    request: null,
    specPath: List(),
    summary: ""
  }

  render() {
    const {
      specPath,
      request,
      toggleShown,
      onTryoutClick,
      onCancelClick,
      onExecute,
      fn,
      getComponent,
      getConfigs,
      specActions,
      specSelectors,
      authActions,
      authSelectors,
      oas3Actions,
      oas3Selectors
    } = this.props

    let { response } = this.props
    const operationProps = this.props.operation

    const {
      deprecated,
      isShown,
      path,
      method,
      op,
      tag,
      operationId,
      allowTryItOut,
      displayRequestDuration,
      tryItOutEnabled,
      executeInProgress
    } = operationProps.toJS()

    const {
      description,
      externalDocs,
      schemes
    } = op

    const operation = operationProps.getIn(["op"])
    const responses = operation.get("responses")
    const parameters = getList(operation, ["parameters"])
    const operationScheme = specSelectors.operationScheme(path, method)
    const isShownKey = ["operations", tag, operationId]
    const extensions = getExtensions(operation)

    const Responses = getComponent("responses")
    const Parameters = getComponent( "parameters" )
    const Collapse = getComponent( "Collapse" )
    const Schemes = getComponent( "schemes" )
    const OperationServers = getComponent( "OperationServers" )
    const OperationExt = getComponent( "OperationExt" )
    const OperationSummary = getComponent( "OperationSummary" )
    const OperationHeader = getComponent( "OperationHeader" )
    const OperationActions = getComponent("OperationActions")
    
    const { showExtensions } = getConfigs()
    
    // Merge in Live Response
    if(responses && response && response.size > 0) {
      const notDocumented = !responses.get(String(response.get("status"))) && !responses.get("default")
      response = response.set("notDocumented", notDocumented)
    }

    const onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )

    const operationType = deprecated ? "deprecated" : method

    const showParams = !!operation && !!operation.size
    const showOpServers = !!tryItOutEnabled
    const showSchemes = !!tryItOutEnabled && !!allowTryItOut && !!schemes && !!schemes.size
    const showResponses = !!responses
    const showOpExtensions = !!showExtensions && !!extensions.size

    return (
      <div 
        className={cx(`opblock opblock-${operationType}`, { 
          "is-open": isShown 
        })} 
        id={escapeDeepLinkPath(isShownKey.join("-"))} 
      >
        <OperationSummary
          operationProps={operationProps}
          toggleShown={toggleShown}
          getComponent={getComponent}
          authActions={authActions}
          authSelectors={authSelectors}
          specPath={specPath}
        />
        <Collapse isOpened={isShown}>
          <div className="opblock-body">
            <OperationHeader
              description={description}
              getComponent={getComponent}
              externalDocs={externalDocs}
              deprecated={!!deprecated}
              isLoading={!operation && !operation.size}
            />
            { 
              showParams &&
                <Parameters
                  parameters={parameters}
                  specPath={specPath.push("parameters")}
                  operation={operation}
                  onChangeKey={onChangeKey}
                  onTryoutClick = { onTryoutClick }
                  onCancelClick = { onCancelClick }
                  tryItOutEnabled = { tryItOutEnabled }
                  allowTryItOut={allowTryItOut}
                  fn={fn}
                  getComponent={ getComponent }
                  specActions={ specActions }
                  specSelectors={ specSelectors }
                  pathMethod={ [path, method] }
                  getConfigs={ getConfigs }
                />                  
            }

            { 
              showOpServers &&
                <OperationServers
                  getComponent={getComponent}
                  path={path}
                  method={method}
                  operationServers={operation.get("servers")}
                  pathServers={specSelectors.paths().getIn([path, "servers"])}
                  getSelectedServer={oas3Selectors.selectedServer}
                  setSelectedServer={oas3Actions.setSelectedServer}
                  setServerVariableValue={oas3Actions.setServerVariableValue}
                  getServerVariable={oas3Selectors.serverVariableValue}
                  getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
                />
            }

            {
              showSchemes && 
                <div className="opblock-schemes">
                  <Schemes 
                    schemes={ schemes }
                    path={ path }
                    method={ method }
                    specActions={ specActions }
                    currentScheme={ operationScheme }
                  />
                </div>
            }

            <OperationActions 
              operation={ operation }
              specActions={ specActions }
              specSelectors={ specSelectors }
              getComponent={ getComponent }
              path={ path }
              method={ method }
              onExecute={ onExecute }
              showExecuteBtn={ !!tryItOutEnabled && !!allowTryItOut }
              showClearBtn={ !!tryItOutEnabled && !!allowTryItOut && !!response }
            />

            { !!executeInProgress && <div className="loading-container"><div className="loading"></div></div> }

            { 
              showResponses &&
                <Responses
                  responses={ responses }
                  request={ request }
                  tryItOutResponse={ response }
                  getComponent={ getComponent }
                  getConfigs={ getConfigs }
                  specSelectors={ specSelectors }
                  oas3Actions={oas3Actions}
                  specActions={ specActions }
                  produces={specSelectors.producesOptionsFor([path, method]) }
                  producesValue={ specSelectors.currentProducesFor([path, method]) }
                  specPath={specPath.push("responses")}
                  path={ path }
                  method={ method }
                  displayRequestDuration={ displayRequestDuration }
                  fn={fn}
                />
            }

            { 
              showOpExtensions &&
                <OperationExt
                  extensions={ extensions }
                  getComponent={ getComponent }
                />
            }
          </div>
        </Collapse>
      </div>
    )
  }

}
