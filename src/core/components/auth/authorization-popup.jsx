import React from "react"
import PropTypes from "prop-types"

export default class AuthorizationPopup extends React.Component {
  close =() => {
    let { authActions } = this.props

    authActions.showDefinitions(false)
  }

  onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation()
      this.close()
    }
  }

  render() {
    let { authSelectors, authActions, getComponent, errSelectors, specSelectors, fn: { AST = {} } } = this.props
    let definitions = authSelectors.shownDefinitions()
    const Auths = getComponent("auths")

    return (
      <div className="dialog-ux">
        <div className="backdrop-ux"></div>
        <div className="modal-ux"
          aria-labelledby="modal-ux-title"
          aria-modal="true"
          role="dialog"
          onKeyDown={ this.onKeyDown }>
          <div className="modal-dialog-ux">
            <div className="modal-ux-inner">
              <div className="modal-ux-header">
                <h3 id="modal-ux-title">Available authorizations</h3>
                <button type="button" className="close-modal" onClick={ this.close }>
                  <svg width="20" height="20" aria-labelledby="modal-ux-close" role="img">
                    <title id="modal-ux-close">close</title>
                    <use href="#close" xlinkHref="#close" />
                  </svg>
                </button>
              </div>
              <div className="modal-ux-content">

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
