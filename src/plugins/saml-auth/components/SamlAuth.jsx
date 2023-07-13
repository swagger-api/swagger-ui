import PropTypes from "prop-types"
import React from "react"

export class SamlAuth extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    samlAuthActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = { isLoading: false }
  }

  componentDidMount() {
    const { authorized, samlAuthActions } = this.props

    if (authorized.size === 0) {
      samlAuthActions.loginSaml()
      this.setState({ isLoading: true })
    }
  }

  handleLogoutClick = () => {
    const { samlAuthActions, name } = this.props
    this.setState({ isLoading: true })
    samlAuthActions.logoutSaml(name)
  };

  render() {
    const { name, getComponent, authorized } = this.props
    const { isLoading } = this.state

    const Row = getComponent("Row")
    const Button = getComponent("Button")

    const isAuthenticated = authorized && authorized.get(name)
    const showLogoutButton = isAuthenticated && !isLoading

    return (
      <Row className="saml-auth">
        {isLoading && (
          <div className="loading-container saml-auth-info">
            <div className="loading"></div>
          </div>
        )}
        {showLogoutButton && (
          <Button
            className="btn modal-btn auth authorize"
            onClick={this.handleLogoutClick}
          >
            Logout
          </Button>
        )}
      </Row>
    )
  }
}

export default SamlAuth
