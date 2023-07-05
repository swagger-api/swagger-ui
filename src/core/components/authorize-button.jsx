/**
 * @prettier
 */
import React  from "react"
import PropTypes from "prop-types"

/**
 * AuthorizeButton will provide a label and button. Type is 'submit' by default and can be used within <form /> elements.
 */
export default class AuthorizeButton extends React.Component {

  static propTypes = {
    // unique authorization ID
    authKey: PropTypes.string,

    // label visible on the authorization button
    caption: PropTypes.string,

    // description available in the hidden (but good for screenreader) attached label
    description: PropTypes.string,

    // The function to call to apply authorization (instead of form submit)
    applyAuthorization: PropTypes.func,

    // If the authorization capability with applying and removing options should be displayed (used for oauth currently)
    validAuthorizationData: PropTypes.bool,

    // state of the authorization (true for authorization data set, false for not set),
    // determines if authorization or logout button is shown
    authorizationDataProvided: PropTypes.bool,

    // action to be called to remove authorization
    removeAuthorization: PropTypes.func.isRequired,

    // action to be called to close dialog
    close: PropTypes.func.isRequired,

    getComponent: PropTypes.func.isRequired
  }

  static defaultProps = {
    caption: "Authorize"
  }

  render() {
    const { authKey, caption, description} = this.props
    const Button = this.props.getComponent("Button")

    let authButtonId = authKey + "-submit"
    let removeAuthButtonId = authKey + "-remove-auth"
    let closeAuthButtonId = authKey + "-close"

    return (
      <div className="auth-btn-wrapper">
        { this.props.validAuthorizationData && !this.props.authorizationDataProvided && (
          <>
            <label htmlFor={authButtonId} className="hidden">{description}</label>
            { this.props.applyAuthorization ?
              <Button id={authButtonId} className="btn modal-btn auth authorize" onClick={ this.props.applyAuthorization }>{caption}</Button>
            :
              <Button id={authButtonId} type="submit" className="btn modal-btn auth authorize">{caption}</Button>
            }
          </>
        )
        }

        { this.props.validAuthorizationData && this.props.authorizationDataProvided && (
            <>
              <label htmlFor={removeAuthButtonId} className="hidden">Remove authorization</label>
              <Button id={removeAuthButtonId} className="btn modal-btn auth authorize" onClick={ this.props.removeAuthorization }>Logout</Button>
            </>
          )
        }

        <Button id={closeAuthButtonId} className="btn modal-btn auth btn-done" onClick={ this.props.close }>Close</Button>
      </div>
    )
  }
}
