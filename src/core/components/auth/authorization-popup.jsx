import React from "react"
import PropTypes from "prop-types"

export default class AuthorizationPopup extends React.Component {
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST = {} } } = this.props
    let definitions = authSelectors.shownDefinitions()
    const Auths = getComponent("auths")
    const Button = getComponent("Button")
    const Icon = getComponent("Icon")
    const className = "sui-modal"

    return (
      <div className={className}>
        <div className={`${className}__backdrop`}></div>
        <div className={`${className}__card`}>
          <div className={`${className}__header`}>
            <h3>Available authorizations</h3>
            <Button
              type="button"
              className={`sui-btn-transparent ${className}__close`}
              onClick={ this.close }
              unstyled
            >
              <Icon icon="cancel"/>
            </Button>
          </div>
          <div className={`${className}__content`}>

              {
                definitions.valueSeq().map(( definition, key ) => {
                  return <Auths key={ key }
                                AST={AST}
                                definitions={ definition }
                                getComponent={ getComponent }
                                errSelectors={ errSelectors }
                                authSelectors={ authSelectors }
                                authActions={ authActions }
                                specSelectors={ specSelectors }/>
                })
              }
            </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
