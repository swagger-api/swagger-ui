import React from "react"
import { fromJS, Iterable } from "immutable"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { defaultStatusCode, getAcceptControllingResponse } from "core/utils"
import createHtmlReadyId from "../../helpers/create-html-ready-id"

export default class Responses extends React.Component {
  static propTypes = {
    tryItOutResponse: PropTypes.instanceOf(Iterable),
    responses: PropTypes.instanceOf(Iterable).isRequired,
    produces: PropTypes.instanceOf(Iterable),
    producesValue: PropTypes.any,
    displayRequestDuration: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    specPath: ImPropTypes.list.isRequired,
    fn: PropTypes.object.isRequired
  }

  static defaultProps = {
    tryItOutResponse: null,
    produces: fromJS(["application/json"]),
    displayRequestDuration: false
  }

  // These performance-enhancing checks were disabled as part of Multiple Examples
  // because they were causing data-consistency issues
  //
  // shouldComponentUpdate(nextProps) {
  //   // BUG: props.tryItOutResponse is always coming back as a new Immutable instance
  //   let render = this.props.tryItOutResponse !== nextProps.tryItOutResponse
  //   || this.props.responses !== nextProps.responses
  //   || this.props.produces !== nextProps.produces
  //   || this.props.producesValue !== nextProps.producesValue
  //   || this.props.displayRequestDuration !== nextProps.displayRequestDuration
  //   || this.props.path !== nextProps.path
  //   || this.props.method !== nextProps.method
  //   return render
  // }

	onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  onResponseContentTypeChange = ({ controlsAcceptHeader, value }) => {
    const { oas3Actions, path, method } = this.props
    if(controlsAcceptHeader) {
      oas3Actions.setResponseContentType({
        value,
        path,
        method
      })
    }
  }

  render() {
    let {
      responses,
      tryItOutResponse,
      getComponent,
      getConfigs,
      specSelectors,
      fn,
      producesValue,
      displayRequestDuration,
      specPath,
      path,
      method,
      oas3Selectors,
      oas3Actions,
    } = this.props
    let defaultCode = defaultStatusCode( responses )

    const ContentType = getComponent( "contentType" )
    const LiveResponse = getComponent( "liveResponse" )
    const Response = getComponent( "response" )

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : Responses.defaultProps.produces

    const isSpecOAS3 = specSelectors.isOAS3()

    const acceptControllingResponse = isSpecOAS3 ?
      getAcceptControllingResponse(responses) : null

    const regionId = createHtmlReadyId(`${method}${path}_responses`)
    const controlId = `${regionId}_select`

    return (
      <div className="responses-wrapper">
        <div className="opblock-section-header">
          <h4>Responses</h4>
            { specSelectors.isOAS3() ? null : <label htmlFor={controlId}>
              <span>Response content type</span>
              <ContentType value={producesValue}
                         ariaControls={regionId}
                         ariaLabel="Response content type"
                         className="execute-content-type"
                         contentTypes={produces}
                         controlId={controlId}
                         onChange={this.onChangeProducesWrapper} />
                     </label> }
        </div>
        <div className="responses-inner">
          {
            !tryItOutResponse ? null
                              : <div>
                                  <LiveResponse response={ tryItOutResponse }
                                                getComponent={ getComponent }
                                                getConfigs={ getConfigs }
                                                specSelectors={ specSelectors }
                                                path={ this.props.path }
                                                method={ this.props.method }
                                                displayRequestDuration={ displayRequestDuration } />
                                  <h4>Responses</h4>
                                </div>

          }

          <table aria-live="polite" className="responses-table" id={regionId} role="region">
            <thead>
              <tr className="responses-header">
                <td className="col_header response-col_status">Code</td>
                <td className="col_header response-col_description">Description</td>
                { specSelectors.isOAS3() ? <td className="col col_header response-col_links">Links</td> : null }
              </tr>
            </thead>
            <tbody>
              {
                responses.entrySeq().map( ([code, response]) => {

                  let className = tryItOutResponse && tryItOutResponse.get("status") == code ? "response_current" : ""
                  return (
                    <Response key={ code }
                              path={path}
                              method={method}
                              specPath={specPath.push(code)}
                              isDefault={defaultCode === code}
                              fn={fn}
                              className={ className }
                              code={ code }
                              response={ response }
                              specSelectors={ specSelectors }
                              controlsAcceptHeader={response === acceptControllingResponse}
                              onContentTypeChange={this.onResponseContentTypeChange}
                              contentType={ producesValue }
                              getConfigs={ getConfigs }
                              activeExamplesKey={oas3Selectors.activeExamplesMember(
                                path,
                                method,
                                "responses",
                                code
                              )}
                              oas3Actions={oas3Actions}
                              getComponent={ getComponent }/>
                    )
                }).toArray()
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
