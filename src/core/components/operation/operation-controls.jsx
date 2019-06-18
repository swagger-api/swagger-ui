import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { getList } from "core/utils"
import { Iterable } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

export default class OperationControls extends PureComponent {
  static propTypes = {
    response: PropTypes.instanceOf(Iterable),
    op: PropTypes.object,
    allowTryItOut: PropTypes.bool.isRequired,
    tryItOutEnabled: PropTypes.bool.isRequired,
    path: PropTypes.object,
    method: PropTypes.object,
    schemes: PropTypes.object,
    oas3Actions: PropTypes.object.isRequired,
    onTryoutClick: PropTypes.func.isRequired,
    fn: PropTypes.object.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onExecute: PropTypes.func.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func,
    operation: PropTypes.instanceOf(Iterable).isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specPath: ImPropTypes.list.isRequired,
    getConfigs: PropTypes.func.isRequired,
  }

  render() {
    const {
      onTryoutClick,
      onCancelClick,
      onExecute,
      oas3Selectors,
      getComponent,
      operation,
      fn,
      specActions,
      oas3Actions,
      specSelectors,
      specPath,
      getConfigs,
      allowTryItOut,
      tryItOutEnabled,
      path,
      method,
      response,
      schemes
    } = this.props

    const parameters = getList(operation, ["parameters"])
    const operationScheme = specSelectors.operationScheme(path, method)

    const Parameters = getComponent( "parameters" )
    const Schemes = getComponent( "schemes" )
    const OperationServers = getComponent( "OperationServers" )
    const OperationActions = getComponent( "OperationActions" )

    const onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )

    const showParams = !!(operation && operation.size)
    const showOpServers = !!(tryItOutEnabled)
    const showSchemes = !!(tryItOutEnabled && allowTryItOut && schemes && schemes.size)

    return (
      <div className="opblock-body__controls">
        { 
          showParams &&
            <Parameters
              parameters={parameters}
              specPath={specPath.push("parameters")}
              operation={operation}
              onChangeKey={onChangeKey}
              onTryoutClick={onTryoutClick}
              onCancelClick={onCancelClick}
              tryItOutEnabled={tryItOutEnabled}
              allowTryItOut={allowTryItOut}
              fn={fn}
              getComponent={getComponent}
              specActions={specActions}
              specSelectors={specSelectors}
              pathMethod={[path, method]}
              getConfigs={getConfigs}
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
                schemes={schemes}
                path={path}
                method={method}
                specActions={specActions}
                currentScheme={operationScheme}
              />
            </div>
        }

        <OperationActions 
          operation={operation}
          specActions={specActions}
          specSelectors={specSelectors}
          getComponent={getComponent}
          path={path}
          method={method}
          onExecute={onExecute}
          showExecuteBtn={!!tryItOutEnabled && !!allowTryItOut}
          showClearBtn={!!tryItOutEnabled && !!allowTryItOut && !!response}
        />
      </div>
    )
  }
}