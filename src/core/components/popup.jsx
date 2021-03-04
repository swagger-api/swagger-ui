import React from "react"
import PropTypes from "prop-types"


export default class Popup extends React.Component {

  render() {
    let { title, children, onClose } = this.props

    return (
      <div className="dialog-ux">
        <div className="backdrop-ux"></div>
        <div className="modal-ux">
          <div className="modal-dialog-ux">
            <div className="modal-ux-inner">
              <div className="modal-ux-header">
                <h3>{title}</h3>
                <button type="button" className="close-modal" onClick={ () => onClose() }>
                  <svg width="20" height="20">
                    <use href="#close" xlinkHref="#close" />
                  </svg>
                </button>
              </div>
              <div className="modal-ux-content">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  static propTypes = {
    children: PropTypes.element,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authSelectors: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    errSelectors: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
  }
}
