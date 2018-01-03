import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { getList } from "core/utils"
import { getExtensions, sanitizeUrl } from "core/utils"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

export default class Operation extends PureComponent {
  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operation: PropTypes.instanceOf(Iterable).isRequired,
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
    specPath: List()
  }

  render() {
    let {
      specPath,
      response,
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
    let operationProps = this.props.operation

    let {
      isShown,
      isAuthorized,
      path,
      method,
      op,
      tag,
      showSummary,
      operationId,
      allowTryItOut,
      displayOperationId,
      displayRequestDuration,
      isDeepLinkingEnabled,
      tryItOutEnabled,
      executeInProgress
    } = operationProps.toJS()

    let {
      summary,
      description,
      deprecated,
      externalDocs,
      schemes
    } = op.operation

    let operation = operationProps.getIn(["op", "operation"])
    let security = operationProps.get("security")
    let responses = operation.get("responses")
    let produces = operation.get("produces")
    let parameters = getList(operation, ["parameters"])
    let operationScheme = specSelectors.operationScheme(path, method)
    let isShownKey = ["operations", tag, operationId]
    let extensions = getExtensions(operation)

    const Responses = getComponent("responses")
    const Parameters = getComponent( "parameters" )
    const Execute = getComponent( "execute" )
    const Clear = getComponent( "clear" )
    const AuthorizeOperationBtn = getComponent( "authorizeOperationBtn" )
    const JumpToPath = getComponent("JumpToPath", true)
    const Collapse = getComponent( "Collapse" )
    const Markdown = getComponent( "Markdown" )
    const Schemes = getComponent( "schemes" )
    const OperationServers = getComponent( "OperationServers" )
    const OperationExt = getComponent( "OperationExt" )
    const DeepLink = getComponent( "DeepLink" )

    const { showExtensions } = getConfigs()

    // Merge in Live Response
    if(responses && response && response.size > 0) {
      let notDocumented = !responses.get(String(response.get("status"))) && !responses.get("default")
      response = response.set("notDocumented", notDocumented)
    }

    let onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )

    return (
        <div className={deprecated ? "opblock opblock-deprecated" : isShown ? `opblock opblock-${method} is-open` : `opblock opblock-${method}`} id={isShownKey.join("-")} >
          <div className={`opblock-summary opblock-summary-${method}`} onClick={toggleShown} >
            {/*TODO: convert this into a component, that can be wrapped
              and pulled in with getComponent */}
              <span className="opblock-summary-method">{method.toUpperCase()}</span>
              <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" } >
              <DeepLink
                  enabled={isDeepLinkingEnabled}
                  isShown={isShown}
                  path={`${isShownKey.join("/")}`}
                  text={path} />
                <JumpToPath path={specPath} /> {/*TODO: use wrapComponents here, swagger-ui doesn't care about jumpToPath */}
              </span>

            { !showSummary ? null :
                <div className="opblock-summary-description">
                  { summary }
                </div>
            }

            { displayOperationId && operationId ? <span className="opblock-summary-operation-id">{operationId}</span> : null }

            {
              (!security || !security.count()) ? null :
                <AuthorizeOperationBtn
                  isAuthorized={ isAuthorized }
                  onClick={() => {
                    const applicableDefinitions = authSelectors.definitionsForRequirements(security)
                    authActions.showDefinitions(applicableDefinitions)
                  }}
                />
            }
          </div>

          <Collapse isOpened={isShown}>
            <div className="opblock-body">
              { deprecated && <h4 className="opblock-title_normal"> Warning: Deprecated</h4>}
              { description &&
                <div className="opblock-description-wrapper">
                  <div className="opblock-description">
                    <Markdown source={ description } />
                  </div>
                </div>
              }
              {
                externalDocs && externalDocs.url ?
                <div className="opblock-external-docs-wrapper">
                  <h4 className="opblock-title_normal">Find more details</h4>
                  <div className="opblock-external-docs">
                    <span className="opblock-external-docs__description">
                      <Markdown source={ externalDocs.description } />
                    </span>
                    <a className="opblock-external-docs__link" href={ sanitizeUrl(externalDocs.url) } target="_blank">{ externalDocs.url }</a>
                  </div>
                </div> : null
              }

              <Parameters
                allowTryItOut={allowTryItOut}
                fn={fn}
                getComponent={ getComponent }
                getConfigs={ getConfigs }
                onCancelClick = { onCancelClick }
                onChangeKey={onChangeKey}
                onTryoutClick = { onTryoutClick }
                operation={operation}

                parameters={parameters}
                pathMethod={ [path, method] }
                specActions={ specActions }
                specPath={specPath.push("parameters")}
                specSelectors={ specSelectors }
                tryItOutEnabled = { tryItOutEnabled }
              />

              { !tryItOutEnabled ? null :
                <OperationServers
                  getComponent={getComponent}
                  getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
                  getSelectedServer={oas3Selectors.selectedServer}
                  getServerVariable={oas3Selectors.serverVariableValue}
                  method={method}
                  operationServers={operation.get("servers")}
                  path={path}
                  pathServers={specSelectors.paths().getIn([path, "servers"])}
                  setSelectedServer={oas3Actions.setSelectedServer}
                  setServerVariableValue={oas3Actions.setServerVariableValue}
                />
              }

              {!tryItOutEnabled || !allowTryItOut ? null : schemes && schemes.size ? <div className="opblock-schemes">
                    <Schemes currentScheme={ operationScheme }
                             method={ method }
                             path={ path }
                             schemes={ schemes }
                             specActions={ specActions } />
                  </div> : null
              }

            <div className={(!tryItOutEnabled || !response || !allowTryItOut) ? "execute-wrapper" : "btn-group"}>
              { !tryItOutEnabled || !allowTryItOut ? null :

                  <Execute
                    method={ method }
                    onExecute={ onExecute }
                    operation={ operation }
                    path={ path }
                    specActions={ specActions }
                    specSelectors={ specSelectors } />
              }

              { (!tryItOutEnabled || !response || !allowTryItOut) ? null :
                  <Clear
                    method={ method }
                    path={ path }
                    specActions={ specActions }/>
              }
            </div>

            {executeInProgress ? <div className="loading-container"><div className="loading"></div></div> : null}

              { !responses ? null :
                  <Responses
                    displayRequestDuration={ displayRequestDuration }
                    fn={fn}
                    getComponent={ getComponent }
                    getConfigs={ getConfigs }
                    method={ method }
                    oas3Actions={oas3Actions}
                    path={ path }
                    produces={ produces }
                    producesValue={ operation.get("produces_value") }
                    request={ request }
                    responses={ responses }
                    specActions={ specActions }
                    specPath={specPath.push("responses")}
                    specSelectors={ specSelectors }
                    tryItOutResponse={ response } />
              }

              { !showExtensions || !extensions.size ? null :
                <OperationExt extensions={ extensions } getComponent={ getComponent } />
              }
            </div>
          </Collapse>
        </div>
    )
  }

}
