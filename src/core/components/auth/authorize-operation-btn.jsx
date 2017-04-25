import React, { PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"

export default class AuthorizeOperationBtn extends React.Component {
  onClick =(e) => {
    e.stopPropagation()

    let { security, authActions, authSelectors } = this.props
    let definitions = authSelectors.getDefinitionsByNames(security)

    authActions.showDefinitions(definitions)
  }

  render() {
    let { security, authSelectors } = this.props

    let isAuthorized = authSelectors.isAuthorized(security)

    if(isAuthorized === null) {
      return null
    }

    return (
      <button className={isAuthorized ? "authorization__btn locked" : "authorization__btn unlocked"} onClick={ this.onClick }>
        <svg width="20" height="20">
          <use xlinkHref={ isAuthorized ? "#locked" : "#unlocked" } />
        </svg>
      </button>

    )
  }

  static propTypes = {
    authSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    security: ImPropTypes.iterable.isRequired
  }
}
