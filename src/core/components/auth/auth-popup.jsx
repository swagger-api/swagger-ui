import React from "react"
import PropTypes from "prop-types"

export default class AuthorizationPopup extends React.Component {

  close = () => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  authorize = (name, formData, schema) => {
    const { authActions } = this.props
    const data = { 
      name,
      ...formData,
      // schema,
    }

    authActions.authorize(data)
  }

  logout = (name) => {

    let { authActions } = this.props

    authActions.logout(name)
  }

  render() {
    const { authSelectors, getComponent, errSelectors } = this.props
    const Auths = getComponent("auths")
    const Oauth2 = getComponent("oauth2", true)
    const Modal = getComponent("Modal")

    const authSchemas = authSelectors.shownDefinitions()
    const authorizedData = authSelectors.authorized()
    const errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

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

          return (
            <div className="auth-container" key={ key }>
              { 
                isOauth2Definition
                  ? <Oauth2 
                      schema={ schema }
                      name={ name }
                      authorizedData={ authorizedData }
                      errors={ errors }
                    />
                  : <Auths
                      name={ name }
                      schema={ schema }
                      getComponent={ getComponent }
                      errors={ errors }
                      authSelectors={ authSelectors }
                      authorize={this.authorize}
                      logout={this.logout}
                      closeModal={this.close}
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
  }
}
