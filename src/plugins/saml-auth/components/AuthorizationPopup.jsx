import React from "react"
import PropTypes from "prop-types"
import DefinitionSelect from "./DefinitionSelect"

export default class AuthorizationPopup extends React.Component {
  static propTypes = {
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    samlAuthActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedDefinitionOption: null,
    }
  }

  close = () => {
    const { authActions, errActions } = this.props

    errActions.clear({ type: "auth" })
    authActions.showDefinitions(false)
  };

  onSelectDefinition = (definition) => {
    const { errActions } = this.props

    errActions.clear({ type: "auth" })
    this.setState({ selectedDefinitionOption: definition })
  };

  render() {
    let {
      samlAuthActions,
      authSelectors,
      authActions,
      getComponent,
      errSelectors,
      specSelectors,
      fn: { AST = {} },
    } = this.props
    let definitions = authSelectors.shownDefinitions()
    let authorized = authSelectors.authorized()

    let Auths = getComponent("auths")

    let { selectedDefinitionOption } = this.state
    let [samlAuthId] = specSelectors.samlSchemaEntry()
    let errors = errSelectors
      .allErrors()
      .filter((err) => err.get("authId") === samlAuthId)
    let hasErrors = errors.size > 0
    let isAuthenticated = authorized.size > 0
    let authenticatedKey = authorized.keySeq().first()
    let selectedDefinitionKey = isAuthenticated ? authenticatedKey : selectedDefinitionOption

    let showLoginOptions = !selectedDefinitionKey
    let showLoginAuth = definitions && !!selectedDefinitionKey

    return (
      <div className="dialog-ux">
        <div className="backdrop-ux"></div>
        <div className="modal-ux">
          <div className="modal-dialog-ux">
            <div className="modal-ux-inner">
              <div className="modal-ux-header">
                <div className="logo"></div>
                <button
                  type="button"
                  className="close-modal"
                  onClick={this.close}
                >
                  <svg width="20" height="20">
                    <use href="#close" xlinkHref="#close" />
                  </svg>
                </button>
              </div>
              <div className="modal-ux-content">
                {showLoginOptions && (
                  <DefinitionSelect
                    definitions={definitions}
                    onSelect={this.onSelectDefinition}
                    getComponent={getComponent}
                  />
                )}
                {hasErrors &&
                  errors.map((error, index) => (
                    <div key={index} className="login-error">
                      {error.get("message")}
                    </div>
                  ))}
                {showLoginAuth &&
                  definitions
                    .filter((definition) => {
                      const [authId] = definition.keys()
                      return authId === selectedDefinitionKey
                    })
                    .map((definition, key) => {
                      return (
                        <Auths
                          key={key}
                          AST={AST}
                          definitions={definition}
                          getComponent={getComponent}
                          errSelectors={errSelectors}
                          authSelectors={authSelectors}
                          authActions={authActions}
                          specSelectors={specSelectors}
                          samlAuthActions={samlAuthActions}
                        />
                      )
                    })}
                <p className="login-disclaimer">
                  This is a Government of Singapore internal system. Unauthorised use is strictly prohibited.
                  If you are not authorised, please exit from the system immediately. The use of this system
                  is subject to the Computer Misuse Act.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
