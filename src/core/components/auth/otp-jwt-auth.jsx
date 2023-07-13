import React, { PropTypes } from "react"

export default class OtpJwtAuth extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    authorized: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    schema: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context)

    let { name, schema, authorized } = this.props
    let auth = authorized && authorized.get(name)
    let email = auth && auth.get("email") || ""
    let otp = auth && auth.get("otp") || ""

    this.state = {
      name,
      schema,
      email,
      otp
    }
  }

  sendOtp = () => {
    let { authActions, errActions, name } = this.props

    this.setState({ otp: ""})
    errActions.clear({ authId: name })
    authActions.sendOtp(this.state)
  }

  authorize = () => {
    let { authActions, errActions, name } = this.props

    errActions.clear({ authId: name })
    authActions.authorizeOtpToken(this.state)
  }

  onChange =(e) => {
    let { target : { dataset : { name }, value } } = e
    let state = {
      [name]: value
    }

    this.setState(state)
  }

  logout =(e) => {
    e.preventDefault()
    let { authActions, errActions, name } = this.props

    this.setState({ email: "", otp: ""})
    errActions.clear({ authId: name })
    authActions.logout([ name ])
    authActions.showDefinitions(false)
  }

  render() {
    let { getComponent, authSelectors, errSelectors, name } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const Button = getComponent("Button")

    let authorizedAuth = authSelectors.authorized()
    let isAuthorized = !!authorizedAuth.get(name)
    let isOtpSent = !!authSelectors.otpSent()
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div className="otp-form">
        {!isAuthorized &&
          <div>
            <Row className="field">
              <label htmlFor="jwt_email">Email</label>
              <Col className="input-group">
                <Input id="jwt_email"
                      type="email"
                      value={this.state.email}
                      required="required"
                      data-name="email"
                      onChange={ this.onChange }
                      disabled={ isAuthorized } />
              </Col>
            </Row>
            <Row className="field">
              <label htmlFor="jwt_otp">OTP</label>
              <Col className="input-group">
                <Input id="jwt_otp"
                      type="text"
                      value={this.state.otp}
                      required="required"
                      data-name="otp"
                      onChange={ this.onChange }
                      disabled={ isAuthorized } />
              </Col>
            </Row>
          </div>
        }
        <div className="auth-btn-wrapper">
        { isAuthorized ? <Button className="btn modal-btn auth authorize" onClick={ this.logout }>Logout</Button>
                       : <div>
                           <Button className="btn modal-btn auth send-otp" onClick={ this.sendOtp } disabled={ !this.state.email }>Send OTP</Button>
                           <Button className="btn modal-btn auth authorize" onClick={ this.authorize } disabled={ !this.state.email || !this.state.otp }>Authorize</Button>
                         </div>
        }
        </div>
        <div className="auth-msg-wrapper">
          {
            errors.valueSeq().map( (error, key) => {
              return (<div key={key} className="login-error">
                {error.get("message")}
              </div>)
            } )

          }
          {
            isOtpSent ? <div className="login-info">
                          OTP sent. Please check your email inbox.
                        </div>
                      : null
          }
        </div>

      </div>
    )
  }
}
