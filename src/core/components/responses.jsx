import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import { defaultStatusCode } from "core/utils"
import * as CustomPropTypes from "core/proptypes"

export default class Responses extends React.Component {

  static propTypes = {
    request: PropTypes.object,
    tryItOutResponse: PropTypes.object,
    responses: PropTypes.object.isRequired,
    produces: PropTypes.object,
    producesValue: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired,
    displayRequestDuration: PropTypes.bool.isRequired,
    fn: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired,
    isShownKey: CustomPropTypes.arrayOrString.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
  }

  static defaultProps = {
    request: null,
    tryItOutResponse: null,
    produces: fromJS(["application/json"]),
    displayRequestDuration: false
  }

  onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue(this.props.pathMethod, val)

  render() {
    let { responses, request, tryItOutResponse, getComponent, getConfigs, specSelectors, fn, producesValue, displayRequestDuration, isShownKey } = this.props
    let defaultCode = defaultStatusCode( responses )

    let shown = this.isShown()
    let { responseExpansion } = getConfigs()

    const ContentType = getComponent( "contentType" )
    const LiveResponse = getComponent( "liveResponse" )
    const Response = getComponent( "response" )
    const Collapse = getComponent( "Collapse" )

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : Responses.defaultProps.produces

    return (
      <div className={ shown ? `responses-wrapper is-open` : `responses-wrapper`} id={isShownKey.join("-")} >
        <div { ... responseExpansion != null ? {onClick:this.toggleShown, className:"opblock-section-header opblock-section-header-clickable"} : {className:"opblock-section-header"}} >
          <h4>Responses</h4>
            { specSelectors.isOAS3() ? null : <label onClick={this.stopPropigation} >
              <span>Response content type</span>
              <ContentType value={producesValue}
                         onChange={this.onChangeProducesWrapper}
                         contentTypes={produces}
                         className="execute-content-type"/>
                     </label> }
        </div>
        <Collapse isOpened={shown}>
          <div className="responses-inner">
            {
              !tryItOutResponse ? null
                                : <div>
                                    <LiveResponse request={ request }
                                                  response={ tryItOutResponse }
                                                  getComponent={ getComponent }
                                                  getConfigs={ getConfigs }
                                                  specSelectors={ specSelectors }
                                                  pathMethod={ this.props.pathMethod }
                                                  displayRequestDuration={ displayRequestDuration } />
                                    <h4>Responses</h4>
                                  </div>

            }

            <table className="responses-table">
              <thead>
                <tr className="responses-header">
                  <td className="col col_header response-col_status">Code</td>
                  <td className="col col_header response-col_description">Description</td>
                  { specSelectors.isOAS3() ? <td className="col col_header response-col_links">Links</td> : null }
                </tr>
              </thead>
              <tbody>
                {
                  responses.entrySeq().map( ([code, response]) => {

                    let className = tryItOutResponse && tryItOutResponse.get("status") == code ? "response_current" : ""
                    return (
                      <Response key={ code }
                                isDefault={defaultCode === code}
                                fn={fn}
                                className={ className }
                                code={ code }
                                response={ response }
                                specSelectors={ specSelectors }
                                contentType={ producesValue }
                                getComponent={ getComponent }/>
                      )
                  }).toArray()
                }
              </tbody>
            </table>
          </div>
        </Collapse>
      </div>
    )
  }

  stopPropigation =(e) => {
    e.stopPropagation()
  }

  toggleShown =() => {
    let { layoutActions, isShownKey } = this.props
    layoutActions.show(isShownKey, !this.isShown())
  }

  isShown =() => {
    let { layoutSelectors, isShownKey, getConfigs } = this.props
    let { responseExpansion } = getConfigs()

    return layoutSelectors.isShown(isShownKey, responseExpansion === "full" || responseExpansion === null ) // Here is where we set the default
  }

}
