import React from "react"
import PropTypes from "prop-types"

const AuthError = ({ error }) => {
  const className = "auth__error"

  let level = error.get("level")
  let message = error.get("message")
  let source = error.get("source")

  return (
    <div className={className}>
      <span className={`${className}__title`}>
        <b>{ source } { level }</b>
      </span>
      <span className={`${className}__message`}>
        <span>{ message }</span>
      </span>
    </div>
  )
}

AuthError.propTypes = {
  error: PropTypes.object.isRequired
}


export default AuthError
