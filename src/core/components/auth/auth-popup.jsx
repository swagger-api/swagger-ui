import React from "react"
import PropTypes from "prop-types"

export default class AuthorizationPopup extends React.Component {

  close = () => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  onAuthChange =(auth) => {
    let { name } = auth

    this.setState({ [name]: auth })
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
    let { authSelectors, getComponent, errSelectors } = this.props
    let definitions = authSelectors.shownDefinitions()
    const Auths = getComponent("auths")
    const Modal = getComponent("Modal")

    return (
      <Modal
        onDismiss={this.close}
        title="Available authorizations"
      >
      {
        definitions.valueSeq().map(( definition, key ) => {
          return <Auths key={ key }
                    name={ definition.keySeq().first() }
                    definition={ definition.first() }
                    getComponent={ getComponent }
                    errSelectors={ errSelectors }
                    authSelectors={ authSelectors }
                    authorize={this.authorize}
                    logout={this.logout}
                    closeModal={this.close}
                  />
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
