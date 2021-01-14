import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { getList } from "core/utils"
import { getExtensions, sanitizeUrl, escapeDeepLinkPath } from "core/utils"
import { buildUrl } from "core/utils/url"
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

    let {
      description,
      externalDocs,
      schemes
    } = op

    const externalDocsUrl = externalDocs ? buildUrl(externalDocs.url, specSelectors.url(), { selectedServer: oas3Selectors.selectedServer() }) : ""
    let operation = operationProps.getIn(["op"])
    let responses = operation.get("responses")
    let parameters = getList(operation, ["parameters"])
    let operationScheme = specSelectors.operationScheme(path, method)
    let isShownKey = ["operations", tag, operationId]
    let extensions = getExtensions(operation)

    const Responses = getComponent("responses")
    const Parameters = getComponent( "parameters" )
    const Execute = getComponent( "execute" )
    const Clear = getComponent( "clear" )
    const Collapse = getComponent( "Collapse" )
    const Markdown = getComponent("Markdown", true)
    const Schemes = getComponent( "schemes" )
    const OperationServers = getComponent( "OperationServers" )
    const OperationExt = getComponent( "OperationExt" )
    const OperationSummary = getComponent( "OperationSummary" )
    const Link = getComponent( "Link" )

    const { showExtensions } = getConfigs()

    // Merge in Live Response
    if(responses && response && response.size > 0) {
      let notDocumented = !responses.get(String(response.get("status"))) && !responses.get("default")
      response = response.set("notDocumented", notDocumented)
    }

    let onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )

    return (
        <div className={deprecated ? "opblock opblock-deprecated" : isShown ? `opblock opblock-${method} is-open` : `opblock opblock-${method}`} id={escapeDeepLinkPath(isShownKey.join("-"))} >
        <OperationSummary operationProps={operationProps} toggleShown={toggleShown} getComponent={getComponent} authActions={authActions} authSelectors={authSelectors} specPath={specPath} />
          <Collapse isOpened={isShown}>
            <div className="opblock-body">
              { (operation && operation.size) || operation === null ? null :
                <img height={"32px"} width={"32px"} src={require("core/../img/rolling-load.svg")} className="opblock-loading-animation" />
              }
              { deprecated && <h4 className="opblock-title_normal"> Warning: Deprecated</h4>}
              { description &&
                <div className="opblock-description-wrapper">
                  <div className="opblock-description">
                    <Markdown source={ description } />
                  </div>
                </div>
              }
              {
                externalDocsUrl ?
                <div className="opblock-external-docs-wrapper">
                  <h4 className="opblock-title_normal">Find more details</h4>
                  <div className="opblock-external-docs">
                    <span className="opblock-external-docs__description">
                      <Markdown source={ externalDocs.description } />
                    </span>
                    <Link target="_blank" className="opblock-external-docs__link" href={sanitizeUrl(externalDocsUrl)}>{externalDocsUrl}</Link>
                  </div>
                </div> : null
              }

              { !operation || !operation.size ? null :
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
                  oas3Actions={ oas3Actions }
                  oas3Selectors={ oas3Selectors }
                />
              }

              { !tryItOutEnabled ? null :
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

              {!tryItOutEnabled || !allowTryItOut ? null : schemes && schemes.size ? <div className="opblock-schemes">
                    <Schemes schemes={ schemes }
                             path={ path }
                             method={ method }
                             specActions={ specActions }
                             currentScheme={ operationScheme } />
                  </div> : null
              }

            <div className={(!tryItOutEnabled || !response || !allowTryItOut) ? "execute-wrapper" : "btn-group"}>
              { !tryItOutEnabled || !allowTryItOut ? null :

                  <Execute
                    operation={ operation }
                    specActions={ specActions }
                    specSelectors={ specSelectors }
                    oas3Selectors={ oas3Selectors }
                    oas3Actions={ oas3Actions }
                    path={ path }
                    method={ method }
                    onExecute={ onExecute }
                    disabled={executeInProgress}/>
              }

              { (!tryItOutEnabled || !response || !allowTryItOut) ? null :
                  <Clear
                    specActions={ specActions }
                    path={ path }
                    method={ method }/>
              }
            </div>

            {executeInProgress ? <div className="loading-container"><div className="loading"></div></div> : null}

              { !responses ? null :
                  <Responses
                    responses={ responses }
                    request={ request }
                    tryItOutResponse={ response }
                    getComponent={ getComponent }
                    getConfigs={ getConfigs }
                    specSelectors={ specSelectors }
                    oas3Actions={oas3Actions}
                    oas3Selectors={oas3Selectors}
                    specActions={ specActions }
                    produces={specSelectors.producesOptionsFor([path, method]) }
                    producesValue={ specSelectors.currentProducesFor([path, method]) }
                    specPath={specPath.push("responses")}
                    path={ path }
                    method={ method }
                    displayRequestDuration={ displayRequestDuration }
                    fn={fn} />
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
