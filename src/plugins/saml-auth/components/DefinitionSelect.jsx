import React from "react"
import PropTypes from "prop-types"

export default class DefinitionSelect extends React.Component {
  static propTypes = {
    definitions: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    onSelect: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props)
  }

  handleSelect(key) {
    return () => this.props.onSelect(key)
  }

  render() {
    const { definitions, getComponent } = this.props
    const Button = getComponent("Button")
    const samlAuthDefinition = definitions.find(definition => definition.first().get("saml"))
    const otpAuthDefinition = definitions.find(definition => definition.first().get("otp"))
    const [samlAuthId] = samlAuthDefinition.keys()
    const [otpAuthId] = otpAuthDefinition.keys()

    return (
      <div className="definition-select">
        <Button
          className="btn definition-option-btn"
          role="button"
          key={samlAuthId}
          onClick={this.handleSelect(samlAuthId)}
        >
          <strong>WOG Login</strong>
          <p>
            You have a Whole-of-Government Active Directory (WOG AD) registered
            email address. Log in using your WOG credentials
          </p>
        </Button>
        <Button
          className="btn definition-option-btn"
          role="button"
          key={otpAuthId}
          onClick={this.handleSelect(otpAuthId)}
        >
          <strong>OTP Login</strong>
          <p>
            No WOG AD registered email address. Log in using your email and OTP
          </p>
        </Button>
      </div>
    )
  }
}
