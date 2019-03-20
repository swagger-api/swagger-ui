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

    this.state = {
      name,
      schema,
      email,
      otp: ""
    }
  }

  sendOtp = () => {
    let { authActions, errActions, name } = this.props

    this.setState({ otp: ""})
    errActions.clear({ authId: name, type: "auth", source: "auth" })
    authActions.sendOtp(this.state)
  }

  authorize = () => {
    let { authActions, errActions, name } = this.props

    errActions.clear({ authId: name, type: "auth", source: "auth" })
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

    errActions.clear({ authId: name, type: "auth", source: "auth" })
    authActions.logout([ name ])
  }

  render() {
    let { getComponent, authSelectors, errSelectors, name } = this.props
    const Input = getComponent("Input")
    const Row = getComponent("Row")
    const Col = getComponent("Col")
    const Button = getComponent("Button")
    const AuthError = getComponent("authError")

    let authorizedAuth = authSelectors.authorized()
    let isAuthorized = !!authorizedAuth.get(name)
    let isOtpSent = !!authorizedAuth.get("otpSent")
    let errors = errSelectors.allErrors().filter( err => err.get("authId") === name)

    return (
      <div>
        <Row>
          <label htmlFor="jwt_email">Email:</label>
          {
            isAuthorized ? <code> { this.state.email } </code>
                         : <Col><Input id="jwt_email"
                                       type="email"
                                       value={this.state.email}
                                       required="required"
                                       data-name="email"
                                       onChange={ this.onChange }/></Col>
          }
        </Row>
        <Row>
          <label htmlFor="jwt_otp">OTP:</label>
          {
            isAuthorized ? <code> ****** </code>
                         : <Col><Input id="jwt_otp"
                                       type="text"
                                       value={this.state.otp}
                                       required="required"
                                       data-name="otp"
                                       onChange={ this.onChange }/></Col>
          }
        </Row>
        {
          errors.valueSeq().map( (error, key) => {
            return <AuthError error={ error }
                              key={ key }/>
          } )
        }
        {
          isOtpSent ? <div className="info" style={{ backgroundColor: "#eeffee", color: "green", margin: "1em" }}>
                        <b style={{ textTransform: "capitalize", marginRight: "1em"}} >Auth Info: </b>
                        <span>OTP sent. Please check your email inbox.</span>
                      </div>
                    : null
        }
        <div className="auth-btn-wrapper">
        { isAuthorized ? <Button className="btn modal-btn auth authorize" onClick={ this.logout }>Logout</Button>
                       : <div>
                           <Button className="btn modal-btn auth send-otp" onClick={ this.sendOtp } disabled={ !this.state.email }>Send OTP</Button>
                           <Button className="btn modal-btn auth authorize" onClick={ this.authorize } disabled={ !this.state.email || !this.state.otp }>Authorize</Button>
                         </div>
        }
        </div>

      </div>
    )
  }
}
