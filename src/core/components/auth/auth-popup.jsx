import React from "react"
import PropTypes from "prop-types"
import oauth2Authorize from "core/oauth2-authorize"

export default class AuthorizationPopup extends React.Component {

  close = () => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  authorize = (name, value, schema) => {
    const { authActions } = this.props

    if(value) {   
      authActions.authorize({ 
        name,
        value,
        schema,
      })
    }
  }

  oauth2Authorize = (name, value, schema) => {
    const { authActions, errActions, getConfigs, authSelectors } = this.props
    const configs = getConfigs()
    const authConfigs = authSelectors.getConfigs()

    this.clearAuthErrors(name)

    oauth2Authorize({
      auth: {
        name,
        value,
        schema
      },
      authActions,
      errActions,
      configs,
      authConfigs
    })
  }

  clearAuthErrors = (name) => {
    const { errActions } = this.props

    errActions.clear({
      authId: name,
      type: "auth", 
      source: "auth"
    })
  } 

  logout = (name) => {
    let { authActions } = this.props

    authActions.logout(name)
  }

  render() {
    const { authSelectors, getComponent, errSelectors, specSelectors } = this.props
    const Auths = getComponent("auths")
    const Oauth2 = getComponent("oauth2")
    const Modal = getComponent("Modal")

    const authSchemas = authSelectors.shownDefinitions()
    const configs = authSelectors.getConfigs() || {}
    const isOAS3 = specSelectors.isOAS3()

    return (
      <Modal
        onDismiss={this.close}
        title="Available authorizations"
      >

      {
        authSchemas.map(( schema, key ) => {
          const name = schema.keySeq().first()
          schema = schema.first()
          const isOauth2Definition = schema.get("type") === "oauth2"
          const errors = errSelectors.allErrors().filter( err => err.get("authId") === name)
          const authorizedData = authSelectors.authorized().get(name)

          return (
            <div className="auth-container" key={ key }>
              { 
                isOauth2Definition
                  ? <Oauth2 
                      name={ name }
                      schema={ schema }
                      authorizedData={ authorizedData }
                      configs={ configs }
                      errors={ errors }
                      getComponent={ getComponent }
                      authorize={ this.oauth2Authorize }
                      logout={ this.logout }
                      clearErrors={ this.clearAuthErrors }
                      closeModal={ this.close }
                      isOAS3={ isOAS3 }
                    />
                  : <Auths
                      name={ name }
                      schema={ schema }
                      getComponent={ getComponent }
                      errors={ errors }
                      authorizedData={ authorizedData }
                      authorize={ this.authorize }
                      logout={ this.logout }
                      closeModal={ this.close }
                      isOAS3={ isOAS3 }
                    />
              }
            </div>
          )
        })
      }
      </Modal>
    )
  }

  static propTypes = {
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errActions: PropTypes.objects.isRequired,
    getConfigs: PropTypes.objects.isRequired
  }
}
